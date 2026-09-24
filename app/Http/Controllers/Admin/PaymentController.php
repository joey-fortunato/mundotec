<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\EnrollmentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(private readonly EnrollmentService $service) {}

    public function index(): Response
    {
        $payments = Payment::query()
            ->with(['order.user:id,name,email', 'order.course:id,title'])
            ->latest()
            ->get()
            ->map(fn (Payment $p) => [
                'id' => $p->id,
                'reference' => $p->reference,
                'amount' => $p->amount,
                'installment_number' => $p->installment_number,
                'installments' => $p->order->installments,
                'status' => $p->status->value,
                'status_label' => $p->status->label(),
                'student' => $p->order->user->name,
                'student_email' => $p->order->user->email,
                'phone' => $p->gateway_payload['phone'] ?? null,
                'course' => $p->order->course->title,
                'order_reference' => $p->order->reference,
                'created_at' => $p->created_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
        ]);
    }

    public function confirm(Payment $payment): RedirectResponse
    {
        if ($payment->status !== PaymentStatus::Confirmed) {
            $this->service->confirmPayment($payment, request()->user());
        }

        return back()->with('success', 'Pagamento liquidado e acesso libertado.');
    }

    public function reject(Payment $payment): RedirectResponse
    {
        $payment->update(['status' => PaymentStatus::Failed]);

        return back()->with('success', 'Pagamento marcado como falhado.');
    }
}
