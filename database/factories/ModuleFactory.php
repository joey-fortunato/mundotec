<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Module>
 */
class ModuleFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'title' => rtrim(fake()->sentence(3), '.'),
            'description' => fake()->optional()->sentence(),
            'position' => fake()->numberBetween(1, 10),
        ];
    }
}
