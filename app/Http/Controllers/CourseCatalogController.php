<?php

namespace App\Http\Controllers;

use App\Enums\CourseStatus;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseCatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $courses = Course::query()
            ->published()
            ->with(['category:id,name,slug', 'instructor:id,name'])
            ->withCount('lessons')
            ->when($request->string('categoria')->toString(), function ($query, string $slug) {
                $query->whereHas('category', fn ($q) => $q->where('slug', $slug));
            })
            ->latest('published_at')
            ->get()
            ->map(fn (Course $course) => $this->cardPayload($course));

        return Inertia::render('public/courses/index', [
            'courses' => $courses,
            'categories' => Category::whereHas('courses', fn ($q) => $q->where('status', CourseStatus::Published))
                ->orderBy('name')
                ->get(['name', 'slug']),
            'activeCategory' => $request->string('categoria')->toString() ?: null,
        ]);
    }

    public function show(Course $course): Response
    {
        abort_unless($course->status === CourseStatus::Published, 404);

        $course->load(['modules.lessons', 'category:id,name,slug', 'instructor:id,name']);

        $lessonsCount = $course->modules->sum(fn ($module) => $module->lessons->count());

        return Inertia::render('public/courses/show', [
            'course' => [
                'title' => $course->title,
                'slug' => $course->slug,
                'subtitle' => $course->subtitle,
                'description' => $course->description,
                'price' => $course->price,
                'currency' => $course->currency,
                'level' => $course->level,
                'duration_minutes' => $course->duration_minutes,
                'max_installments' => $course->max_installments,
                'category' => $course->category?->name,
                'category_slug' => $course->category?->slug,
                'instructor' => $course->instructor?->name,
                'lessons_count' => $lessonsCount,
                'modules' => $course->modules->map(fn ($module) => [
                    'title' => $module->title,
                    'lessons' => $module->lessons->map(fn ($lesson) => [
                        'title' => $lesson->title,
                        'type_label' => $lesson->type->label(),
                        'duration_minutes' => $lesson->duration_minutes,
                        'is_preview' => $lesson->is_preview,
                    ]),
                ]),
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function cardPayload(Course $course): array
    {
        return [
            'title' => $course->title,
            'slug' => $course->slug,
            'subtitle' => $course->subtitle,
            'price' => $course->price,
            'currency' => $course->currency,
            'level' => $course->level,
            'category' => $course->category?->name,
            'category_slug' => $course->category?->slug,
            'instructor' => $course->instructor?->name,
            'lessons_count' => $course->lessons_count,
            'duration_minutes' => $course->duration_minutes,
        ];
    }
}
