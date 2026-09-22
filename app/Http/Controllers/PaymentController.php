<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
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

        $pending = $order->payments->firstWhere('status', PaymentStatus::Pending);

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
                'paid_count' => $order->payments->where('status', PaymentStatus::Confirmed)->count(),
                'payments' => $order->payments->map(fn ($p) => [
                    'reference' => $p->reference,
                    'amount' => $p->amount,
                    'installment_number' => $p->installment_number,
                    'status' => $p->status->value,
                    'status_label' => $p->status->label(),
                    'created_at' => $p->created_at?->format('d/m/Y'),
                ]),
            ],
            'pendingPhone' => $pending?->gateway_payload['phone'] ?? null,
        ]);
    }

    public function store(Request $request, Enrollment $enrollment): RedirectResponse
    {
        abort_unless($enrollment->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'phone' => ['required', 'string', 'regex:/^9\d{2}\s?\d{3}\s?\d{3}$/'],
        ]);

        $order = $enrollment->orders()
            ->whereIn('status', [OrderStatus::Pending, OrderStatus::PartiallyPaid])
            ->latest()
            ->firstOrFail();

        $this->service->initiatePayment($order, preg_replace('/\s+/', '', $validated['phone']));

        return redirect()
            ->route('payment.show', $enrollment)
            ->with('success', 'Pedido enviado. Confirma o pagamento no app Multicaixa Express.');
    }
}
