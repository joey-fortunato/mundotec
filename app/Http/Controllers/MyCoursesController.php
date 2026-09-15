<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MyCoursesController extends Controller
{
    public function index(Request $request): Response
    {
        $enrollments = $request->user()
            ->enrollments()
            ->with('course:id,title,slug')
            ->latest()
            ->get()
            ->map(fn ($enrollment) => [
                'id' => $enrollment->id,
                'course_title' => $enrollment->course->title,
                'course_slug' => $enrollment->course->slug,
                'status' => $enrollment->status->value,
                'status_label' => $enrollment->status->label(),
                'progress_percent' => $enrollment->progress_percent,
            ]);

        return Inertia::render('aluno/meus-cursos', [
            'enrollments' => $enrollments,
        ]);
    }
}
