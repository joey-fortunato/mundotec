<?php

namespace App\Http\Controllers;

use App\Enums\EnrollmentStatus;
use App\Enums\OrderStatus;
use App\Models\Certificate;
use App\Models\Enrollment;
use App\Models\LessonProgress;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $active = Enrollment::query()
            ->where('user_id', $user->id)
            ->where('status', EnrollmentStatus::Active)
            ->with('course:id,title,slug')
            ->orderByDesc('progress_percent')
            ->first();

        $pendingOrder = Order::query()
            ->where('user_id', $user->id)
            ->where('status', OrderStatus::Pending)
            ->with(['course:id,title', 'enrollment:id'])
            ->latest()
            ->first();

        return Inertia::render('dashboard', [
            'stats' => [
                'active_courses' => Enrollment::where('user_id', $user->id)->where('status', EnrollmentStatus::Active)->count(),
                'completed_lessons' => LessonProgress::whereHas('enrollment', fn ($q) => $q->where('user_id', $user->id))->whereNotNull('completed_at')->count(),
                'certificates' => Certificate::where('user_id', $user->id)->count(),
            ],
            'continue' => $active ? [
                'course_title' => $active->course->title,
                'course_slug' => $active->course->slug,
                'progress' => $active->progress_percent,
            ] : null,
            'pendingPayment' => $pendingOrder ? [
                'course_title' => $pendingOrder->course->title,
                'total' => $pendingOrder->total,
                'currency' => $pendingOrder->currency,
                'enrollment_id' => $pendingOrder->enrollment_id,
            ] : null,
        ]);
    }
}
