<?php

namespace App\Http\Controllers;

use App\Enums\CourseStatus;
use App\Models\Category;
use App\Models\Course;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featured = Course::query()
            ->published()
            ->with('category:id,name')
            ->latest('published_at')
            ->take(3)
            ->get()
            ->map(fn (Course $course) => [
                'title' => $course->title,
                'slug' => $course->slug,
                'price' => $course->price,
                'currency' => $course->currency,
                'category' => $course->category?->name,
            ]);

        $categories = Category::query()
            ->withCount(['courses' => fn ($q) => $q->where('status', CourseStatus::Published)])
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description'])
            ->map(fn (Category $c) => [
                'name' => $c->name,
                'slug' => $c->slug,
                'description' => $c->description,
                'courses_count' => $c->courses_count,
            ]);

        return Inertia::render('public/home', [
            'featured' => $featured,
            'categories' => $categories,
            'stats' => [
                'graduates' => 300,
                'internships' => 1000,
                'courses' => Course::published()->count(),
            ],
        ]);
    }
}
