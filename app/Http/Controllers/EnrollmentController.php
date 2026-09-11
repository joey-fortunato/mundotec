<?php

namespace App\Http\Controllers;

use App\Enums\CourseStatus;
use App\Models\Course;
use App\Services\EnrollmentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function __construct(private readonly EnrollmentService $service) {}

    public function create(Course $course): Response|RedirectResponse
    {
        abort_unless($course->status === CourseStatus::Published, 404);

        $existing = $course->enrollments()->where('user_id', request()->user()->id)->first();
        if ($existing) {
            return redirect()->route('payment.show', $existing);
        }

        return Inertia::render('enrollment/checkout', [
            'course' => [
                'title' => $course->title,
                'slug' => $course->slug,
                'price' => $course->price,
                'currency' => $course->currency,
                'max_installments' => $course->max_installments,
            ],
        ]);
    }

    public function store(Request $request, Course $course): RedirectResponse
    {
        abort_unless($course->status === CourseStatus::Published, 404);

        $validated = $request->validate([
            'installments' => ['required', 'integer', 'min:1', 'max:'.$course->max_installments],
        ]);

        $enrollment = $this->service->enroll($request->user(), $course, $validated['installments']);

        return redirect()
            ->route('payment.show', $enrollment)
            ->with('success', 'Inscrição criada. Conclui o pagamento para libertar o acesso.');
    }
}
