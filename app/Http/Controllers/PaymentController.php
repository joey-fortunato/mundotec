<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Enrollment;
use App\Services\EnrollmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(private readonly EnrollmentService $service) {}

    public function show(Request $request, Enrollment $enrollment): Response
    {
        abort_unless($enrollment->user_id === $request->user()->id, 403);

        $enrollment->load('course:id,title,slug,currency');
        $order = $enrollment->orders()
            ->whereIn('status', [OrderStatus::Pending, OrderStatus::PartiallyPaid, OrderStatus::Paid])
            ->with('payments')
            ->latest()
            ->firstOrFail();

        $installmentAmount = $order->installments > 1
            ? round((float) $order->total / $order->installments, 2)
            : (float) $order->total;

        return Inertia::render('payment/show', [
            'enrollment' => [
                'id' => $enrollment->id,
                'status' => $enrollment->status->value,
                'status_label' => $enrollment->status->label(),
                'course_title' => $enrollment->course->title,
            ],
            'order' => [
                'reference' => $order->reference,
                'total' => $order->total,
                'currency' => $order->currency,
                'installments' => $order->installments,
                'installment_amount' => number_format($installmentAmount, 2, '.', ''),
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'payments' => $order->payments->map(fn ($p) => [
                    'reference' => $p->reference,
                    'amount' => $p->amount,
                    'installment_number' => $p->installment_number,
                    'status' => $p->status->value,
                    'status_label' => $p->status->label(),
                    'created_at' => $p->created_at?->format('d/m/Y'),
                ]),
            ],
            'bank' => config('mundotec.bank'),
        ]);
    }

    public function store(Request $request, Enrollment $enrollment): RedirectResponse
    {
        abort_unless($enrollment->user_id === $request->user()->id, 403);

        $request->validate([
            'proof' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $order = $enrollment->orders()
            ->whereIn('status', [OrderStatus::Pending, OrderStatus::PartiallyPaid])
            ->latest()
            ->firstOrFail();

        $path = $request->file('proof')->store('comprovativos', 'public');

        $this->service->recordProof($order, $path);

        return redirect()
            ->route('payment.show', $enrollment)
            ->with('success', 'Comprovativo enviado. Vamos confirmar o pagamento em breve.');
    }
}
