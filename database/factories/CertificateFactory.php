<?php

namespace Database\Factories;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Certificate>
 */
class CertificateFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'serial' => 'MT-CERT-'.strtoupper(Str::random(8)),
            'user_id' => User::factory(),
            'course_id' => Course::factory(),
            'enrollment_id' => null,
            'issued_at' => now(),
        ];
    }
}
