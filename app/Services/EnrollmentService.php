<?php

namespace App\Services;

use App\Enums\EnrollmentStatus;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EnrollmentService
{
    /**
     * Start an enrollment for a course, creating a pending order.
     * Returns the existing enrollment if the user is already enrolled.
     */
    public function enroll(User $user, Course $course, int $installments): Enrollment
    {
        $installments = max(1, min($installments, $course->max_installments));

        return DB::transaction(function () use ($user, $course, $installments) {
            $enrollment = Enrollment::firstOrCreate(
                ['user_id' => $user->id, 'course_id' => $course->id],
                [
                    'status' => EnrollmentStatus::Pending,
                    'price_paid' => 0,
                    'enrolled_at' => now(),
                ],
            );

            // Only create an order while nothing has been paid yet.
            if (! $enrollment->orders()->whereIn('status', [OrderStatus::Pending, OrderStatus::PartiallyPaid, OrderStatus::Paid])->exists()) {
                Order::create([
                    'reference' => $this->reference('MT'),
                    'user_id' => $user->id,
                    'course_id' => $course->id,
                    'enrollment_id' => $enrollment->id,
                    'total' => $course->price,
                    'currency' => $course->currency,
                    'payment_method' => PaymentMethod::BankTransfer,
                    'installments' => $installments,
                    'status' => OrderStatus::Pending,
                ]);
            }

            return $enrollment;
        });
    }

    /**
     * Record a proof-of-payment upload as a pending payment on the order.
     */
    public function recordProof(Order $order, string $proofPath): Payment
    {
        $installmentNumber = $order->payments()->count() + 1;
        $amount = $order->installments > 1
            ? round((float) $order->total / $order->installments, 2)
            : (float) $order->total;

        return $order->payments()->create([
            'reference' => $this->reference('PG'),
            'amount' => $amount,
            'installment_number' => $installmentNumber,
            'method' => PaymentMethod::BankTransfer,
            'status' => PaymentStatus::Pending,
            'proof_path' => $proofPath,
        ]);
    }

    /**
     * Confirm a payment (admin), recompute the order and grant access.
     */
    public function confirmPayment(Payment $payment, User $admin): void
    {
        DB::transaction(function () use ($payment, $admin) {
            $payment->update([
                'status' => PaymentStatus::Confirmed,
                'confirmed_at' => now(),
                'confirmed_by' => $admin->id,
            ]);

            $order = $payment->order;
            $confirmedTotal = (float) $order->payments()
                ->where('status', PaymentStatus::Confirmed)
                ->sum('amount');

            $order->status = $confirmedTotal >= (float) $order->total
                ? OrderStatus::Paid
                : OrderStatus::PartiallyPaid;
            $order->save();

            if ($enrollment = $order->enrollment) {
                $grantsAccess = $order->status === OrderStatus::Paid
                    || config('mundotec.grant_access_on_first_installment');

                $enrollment->update([
                    'status' => $grantsAccess ? EnrollmentStatus::Active : EnrollmentStatus::Pending,
                    'price_paid' => $confirmedTotal,
                ]);
            }
        });
    }

    private function reference(string $prefix): string
    {
        return sprintf('%s-%s-%s', $prefix, now()->format('y'), strtoupper(Str::random(8)));
    }
}
