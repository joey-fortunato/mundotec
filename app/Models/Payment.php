<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $order_id
 * @property string $reference
 * @property string $amount
 * @property int $installment_number
 * @property PaymentMethod $method
 * @property PaymentStatus $status
 * @property string|null $proof_path
 * @property array<string, mixed>|null $gateway_payload
 * @property \Illuminate\Support\Carbon|null $confirmed_at
 * @property int|null $confirmed_by
 */
class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'order_id', 'reference', 'amount', 'installment_number', 'method',
        'status', 'proof_path', 'gateway_payload', 'confirmed_at', 'confirmed_by',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'installment_number' => 'integer',
            'method' => PaymentMethod::class,
            'status' => PaymentStatus::class,
            'gateway_payload' => 'array',
            'confirmed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return BelongsTo<User, $this> */
    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }
}
