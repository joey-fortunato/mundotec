<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function index(): Response
    {
        $enrollments = Enrollment::query()
            ->with(['user:id,name,email', 'course:id,title'])
            ->latest()
            ->get()
            ->map(fn (Enrollment $e) => [
                'id' => $e->id,
                'student' => $e->user->name,
                'student_email' => $e->user->email,
                'course' => $e->course->title,
                'status' => $e->status->value,
                'status_label' => $e->status->label(),
                'progress_percent' => $e->progress_percent,
                'enrolled_at' => $e->enrolled_at?->format('d/m/Y'),
            ]);

        return Inertia::render('admin/enrollments', [
            'enrollments' => $enrollments,
            'students' => User::where('role', UserRole::Student)->orderBy('name')->get(['id', 'name']),
            'courses' => Course::orderBy('title')->get(['id', 'title']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'course_id' => ['required', 'exists:courses,id'],
        ]);

        $course = Course::findOrFail($data['course_id']);

        Enrollment::firstOrCreate(
            ['user_id' => $data['user_id'], 'course_id' => $data['course_id']],
            [
                'status' => EnrollmentStatus::Active,
                'enrolled_at' => now(),
                'price_paid' => $course->price,
            ],
        );

        return back()->with('success', 'Inscrição criada. O acesso ao curso foi libertado.');
    }
}
