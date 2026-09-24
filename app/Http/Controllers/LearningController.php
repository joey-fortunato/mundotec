<?php

namespace App\Http\Controllers;

use App\Enums\EnrollmentStatus;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Services\EnrollmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LearningController extends Controller
{
    public function __construct(private readonly EnrollmentService $service) {}

    public function show(Request $request, Course $course, ?Lesson $lesson = null): Response
    {
        $enrollment = $this->enrollmentOrAbort($request, $course);

        $course->load(['modules.lessons']);
        $completedIds = $enrollment->lessonProgress()
            ->whereNotNull('completed_at')
            ->pluck('lesson_id')
            ->all();

        $allLessons = $course->modules->flatMap->lessons;

        // Default to the first not-yet-completed lesson, else the first one.
        if (! $lesson) {
            $lesson = $allLessons->firstWhere(fn ($l) => ! in_array($l->id, $completedIds, true))
                ?? $allLessons->first();
        }

        abort_if($lesson && $lesson->module->course_id !== $course->id, 404);

        $lessonIds = $allLessons->pluck('id')->all();
        $currentIndex = $lesson ? array_search($lesson->id, $lessonIds, true) : false;
        $nextLessonId = is_int($currentIndex) ? ($lessonIds[$currentIndex + 1] ?? null) : null;
        $prevLessonId = is_int($currentIndex) && $currentIndex > 0 ? $lessonIds[$currentIndex - 1] : null;

        return Inertia::render('learn/show', [
            'course' => [
                'title' => $course->title,
                'slug' => $course->slug,
            ],
            'progress' => [
                'percent' => $enrollment->progress_percent,
                'completed' => count($completedIds),
                'total' => $allLessons->count(),
            ],
            'modules' => $course->modules->map(fn ($module) => [
                'id' => $module->id,
                'title' => $module->title,
                'lessons' => $module->lessons->map(fn ($l) => [
                    'id' => $l->id,
                    'title' => $l->title,
                    'type' => $l->type->value,
                    'duration_minutes' => $l->duration_minutes,
                    'completed' => in_array($l->id, $completedIds, true),
                    'current' => $lesson && $l->id === $lesson->id,
                ]),
            ]),
            'lesson' => $lesson ? [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'type' => $lesson->type->value,
                'type_label' => $lesson->type->label(),
                'content' => $lesson->content,
                'video_url' => $lesson->video_url,
                'attachment_url' => $lesson->attachment_path ? \Illuminate\Support\Facades\Storage::url($lesson->attachment_path) : null,
                'completed' => in_array($lesson->id, $completedIds, true),
                'module_title' => $lesson->module->title,
            ] : null,
            'nextLessonId' => $nextLessonId,
            'prevLessonId' => $prevLessonId,
        ]);
    }

    public function complete(Request $request, Course $course, Lesson $lesson): RedirectResponse
    {
        $enrollment = $this->enrollmentOrAbort($request, $course);
        abort_if($lesson->module->course_id !== $course->id, 404);

        $this->service->markLessonComplete($enrollment, $lesson);

        $lessonIds = $course->modules()->with('lessons')->get()
            ->flatMap->lessons->pluck('id')->all();
        $index = array_search($lesson->id, $lessonIds, true);
        $next = is_int($index) ? ($lessonIds[$index + 1] ?? null) : null;

        return $next
            ? redirect()->route('learn.lesson', [$course, $next])
            : redirect()->route('learn.show', $course)->with('success', 'Curso concluído! O teu certificado está disponível.');
    }

    private function enrollmentOrAbort(Request $request, Course $course): Enrollment
    {
        $enrollment = Enrollment::where('user_id', $request->user()->id)
            ->where('course_id', $course->id)
            ->whereIn('status', [EnrollmentStatus::Active, EnrollmentStatus::Completed])
            ->first();

        abort_if($enrollment === null, 403, 'Precisas de uma inscrição ativa para aceder a este curso.');

        return $enrollment;
    }
}
