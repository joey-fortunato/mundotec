<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $monthRevenue = Payment::where('status', PaymentStatus::Confirmed)
            ->whereMonth('confirmed_at', now()->month)
            ->whereYear('confirmed_at', now()->year)
            ->sum('amount');

        $topCourses = Course::query()
            ->withCount('enrollments')
            ->orderByDesc('enrollments_count')
            ->take(4)
            ->get(['id', 'title'])
            ->map(fn (Course $c) => ['title' => $c->title, 'enrollments' => $c->enrollments_count]);

        $months = collect(range(5, 0))->map(function (int $back) {
            $month = now()->subMonths($back);

            return [
                'label' => ucfirst($month->translatedFormat('M')),
                'revenue' => (float) Payment::where('status', PaymentStatus::Confirmed)
                    ->whereMonth('confirmed_at', $month->month)
                    ->whereYear('confirmed_at', $month->year)
                    ->sum('amount'),
                'enrollments' => Enrollment::whereMonth('created_at', $month->month)
                    ->whereYear('created_at', $month->year)
                    ->count(),
            ];
        });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'revenue' => $monthRevenue,
                'new_students' => User::where('role', UserRole::Student)->whereMonth('created_at', now()->month)->count(),
                'active_enrollments' => Enrollment::where('status', EnrollmentStatus::Active)->count(),
                'certificates' => Certificate::count(),
            ],
            'topCourses' => $topCourses,
            'monthlyActivity' => $months,
            'recent' => Enrollment::query()
                ->with(['user:id,name', 'course:id,title'])
                ->latest()
                ->take(6)
                ->get()
                ->map(fn (Enrollment $e) => [
                    'student' => $e->user->name,
                    'course' => $e->course->title,
                    'status' => $e->status->value,
                    'status_label' => $e->status->label(),
                    'date' => $e->created_at?->diffForHumans(),
                ]),
        ]);
    }
}
