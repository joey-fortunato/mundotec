<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class InstructorController extends Controller
{
    public function index(): Response
    {
        $instructors = User::query()
            ->where('role', UserRole::Instructor)
            ->withCount('courses')
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $u) => [
                'name' => $u->name,
                'email' => $u->email,
                'courses' => $u->courses_count,
            ]);

        return Inertia::render('admin/instructors', [
            'instructors' => $instructors,
        ]);
    }
}
