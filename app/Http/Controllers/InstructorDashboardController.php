<?php

namespace App\Http\Controllers;

use App\Enums\EnrollmentStatus;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstructorDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $courseIds = Course::query()->where('instructor_id', $request->user()->id)->pluck('id');

        return Inertia::render('instructor/dashboard', [
            'stats' => [
                'courses' => $courseIds->count(),
                'active_students' => Enrollment::whereIn('course_id', $courseIds)->where('status', EnrollmentStatus::Active)->count(),
                'completed_students' => Enrollment::whereIn('course_id', $courseIds)->where('status', EnrollmentStatus::Completed)->count(),
            ],
            'courses' => Course::query()
                ->whereIn('id', $courseIds)
                ->withCount(['enrollments', 'modules'])
                ->latest()
                ->get(['id', 'title', 'slug'])
                ->map(fn (Course $course) => ['title' => $course->title, 'slug' => $course->slug, 'enrollments' => $course->enrollments_count, 'modules' => $course->modules_count]),
        ]);
    }
}
