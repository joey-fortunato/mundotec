<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $payments = Payment::query()
            ->whereHas('order', fn ($q) => $q->where('user_id', $request->user()->id))
            ->with('order.course:id,title')
            ->latest()
            ->get();

        $totalPaid = (float) $payments->where('status', PaymentStatus::Confirmed)->sum('amount');

        return Inertia::render('aluno/faturas', [
            'payments' => $payments->map(fn (Payment $p) => [
                'reference' => $p->reference,
                'course' => $p->order->course->title,
                'installment_number' => $p->installment_number,
                'installments' => $p->order->installments,
                'amount' => $p->amount,
                'status' => $p->status->value,
                'status_label' => $p->status->label(),
                'date' => $p->created_at?->format('d/m/Y'),
            ]),
            'totalPaid' => number_format($totalPaid, 2, '.', ''),
        ]);
    }
}
