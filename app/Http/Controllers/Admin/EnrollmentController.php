<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
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
        ]);
    }
}
