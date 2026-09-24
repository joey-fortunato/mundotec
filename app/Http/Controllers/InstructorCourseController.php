<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstructorCourseController extends Controller
{
    public function show(Request $request, Course $course): Response
    {
        abort_unless($course->instructor_id === $request->user()->id, 403);
        $course->load('modules.lessons');

        return Inertia::render('instructor/course', [
            'course' => [
                'title' => $course->title,
                'modules' => $course->modules->map(fn ($module) => [
                    'title' => $module->title,
                    'lessons' => $module->lessons->map(fn ($lesson) => ['title' => $lesson->title, 'type' => $lesson->type->label()]),
                ]),
            ],
        ]);
    }
}
