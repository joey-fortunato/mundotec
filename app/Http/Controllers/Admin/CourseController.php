<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CourseStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCourseRequest;
use App\Http\Requests\Admin\UpdateCourseRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = Course::query()
            ->with('category:id,name')
            ->withCount(['modules', 'enrollments'])
            ->latest()
            ->get()
            ->map(fn (Course $course) => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'price' => $course->price,
                'currency' => $course->currency,
                'status' => $course->status->value,
                'status_label' => $course->status->label(),
                'category' => $course->category?->name,
                'modules_count' => $course->modules_count,
                'enrollments_count' => $course->enrollments_count,
            ]);

        return Inertia::render('admin/courses/index', [
            'courses' => $courses,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/courses/create', [
            'options' => $this->formOptions(),
        ]);
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->uniqueSlug($data['title']);
        $data['currency'] = 'AOA';
        $data['published_at'] = $data['status'] === CourseStatus::Published->value ? now() : null;

        $course = Course::create($data);

        return redirect()
            ->route('admin.courses.show', $course)
            ->with('success', 'Curso criado com sucesso.');
    }

    public function show(Course $course): Response
    {
        $course->load(['modules.lessons', 'category:id,name', 'instructor:id,name']);

        return Inertia::render('admin/courses/show', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'subtitle' => $course->subtitle,
                'status' => $course->status->value,
                'status_label' => $course->status->label(),
                'price' => $course->price,
                'currency' => $course->currency,
                'category' => $course->category?->name,
                'instructor' => $course->instructor?->name,
                'modules' => $course->modules->map(fn ($module) => [
                    'id' => $module->id,
                    'title' => $module->title,
                    'position' => $module->position,
                    'lessons' => $module->lessons->map(fn ($lesson) => [
                        'id' => $lesson->id,
                        'title' => $lesson->title,
                        'type' => $lesson->type->value,
                        'type_label' => $lesson->type->label(),
                        'position' => $lesson->position,
                        'is_preview' => $lesson->is_preview,
                    ]),
                ]),
            ],
        ]);
    }

    public function edit(Course $course): Response
    {
        return Inertia::render('admin/courses/edit', [
            'course' => [
                'id' => $course->id,
                'slug' => $course->slug,
                'title' => $course->title,
                'subtitle' => $course->subtitle,
                'description' => $course->description,
                'category_id' => $course->category_id,
                'instructor_id' => $course->instructor_id,
                'price' => $course->price,
                'max_installments' => $course->max_installments,
                'level' => $course->level,
                'duration_minutes' => $course->duration_minutes,
                'status' => $course->status->value,
            ],
            'options' => $this->formOptions(),
        ]);
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $data = $request->validated();

        if ($data['title'] !== $course->title) {
            $data['slug'] = $this->uniqueSlug($data['title'], $course->id);
        }

        // Stamp published_at the first time it moves to Published.
        if ($data['status'] === CourseStatus::Published->value && $course->published_at === null) {
            $data['published_at'] = now();
        }

        $course->update($data);

        return redirect()
            ->route('admin.courses.show', $course)
            ->with('success', 'Curso atualizado.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Curso removido.');
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(): array
    {
        return [
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'instructors' => User::where('role', UserRole::Instructor)->orderBy('name')->get(['id', 'name']),
            'statuses' => collect(CourseStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->label(),
            ]),
        ];
    }

    private function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (Course::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-".(++$i);
        }

        return $slug;
    }
}
