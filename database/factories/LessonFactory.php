<?php

namespace Database\Factories;

use App\Enums\LessonType;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Lesson>
 */
class LessonFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = rtrim(fake()->sentence(4), '.');

        return [
            'module_id' => Module::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'type' => LessonType::Video,
            'content' => null,
            'video_url' => fake()->url(),
            'attachment_path' => null,
            'duration_minutes' => fake()->numberBetween(3, 45),
            'position' => fake()->numberBetween(1, 20),
            'is_preview' => false,
        ];
    }
}
