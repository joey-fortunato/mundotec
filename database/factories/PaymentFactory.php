<?php

namespace Database\Factories;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'reference' => 'PAY-'.strtoupper(Str::random(10)),
            'amount' => fake()->numberBetween(10, 200) * 1000,
            'installment_number' => 1,
            'method' => PaymentMethod::BankTransfer,
            'status' => PaymentStatus::Pending,
            'proof_path' => null,
            'gateway_payload' => null,
            'confirmed_at' => null,
            'confirmed_by' => null,
        ];
    }
}
