<?php

namespace App\Http\Controllers;

use App\Enums\EnrollmentStatus;
use App\Models\Course;
use App\Models\CourseReview;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CourseReviewController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        $data = $request->validate(['rating' => ['required', 'integer', 'between:1,5'], 'comment' => ['nullable', 'string', 'max:1000']]);
        $enrollment = Enrollment::query()->where('user_id', $request->user()->id)->where('course_id', $course->id)->where('status', EnrollmentStatus::Completed)->firstOrFail();

        CourseReview::updateOrCreate(['enrollment_id' => $enrollment->id], [...$data, 'course_id' => $course->id, 'user_id' => $request->user()->id]);

        return back()->with('success', 'Obrigado pela tua avaliação!');
    }
}
