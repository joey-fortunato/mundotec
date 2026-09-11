<?php

namespace Database\Factories;

use App\Enums\CourseStatus;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Course>
 */
class CourseFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'category_id' => Category::factory(),
            'instructor_id' => null,
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title).'-'.fake()->unique()->numberBetween(1, 99999),
            'subtitle' => fake()->optional()->sentence(),
            'description' => fake()->paragraph(),
            'price' => fake()->numberBetween(10, 200) * 1000,
            'currency' => 'AOA',
            'max_installments' => fake()->numberBetween(1, 6),
            'level' => fake()->randomElement(['Iniciante', 'Intermédio', 'Avançado']),
            'duration_minutes' => fake()->numberBetween(60, 2400),
            'status' => CourseStatus::Draft,
            'published_at' => null,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => CourseStatus::Published,
            'published_at' => now(),
        ]);
    }
}
