<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $reference
 * @property int $user_id
 * @property int $course_id
 * @property int|null $enrollment_id
 * @property string $total
 * @property string $currency
 * @property PaymentMethod $payment_method
 * @property int $installments
 * @property OrderStatus $status
 */
class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'reference', 'user_id', 'course_id', 'enrollment_id', 'total',
        'currency', 'payment_method', 'installments', 'status',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'payment_method' => PaymentMethod::class,
            'installments' => 'integer',
            'status' => OrderStatus::class,
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Course, $this> */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /** @return BelongsTo<Enrollment, $this> */
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
