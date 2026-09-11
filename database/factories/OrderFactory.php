<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Models\Course;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => 'ORD-'.strtoupper(Str::random(10)),
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'enrollment_id' => null,
            'total' => fake()->numberBetween(10, 200) * 1000,
            'currency' => 'AOA',
            'payment_method' => PaymentMethod::BankTransfer,
            'installments' => fake()->numberBetween(1, 6),
            'status' => OrderStatus::Pending,
        ];
    }
}
