<?php

namespace App\Http\Controllers;

use App\Enums\CourseStatus;
use App\Models\Category;
use App\Models\Course;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Admin\HomepageController;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featured = Course::query()
            ->published()
            ->with(['category:id,name,slug', 'instructor:id,name'])
            ->withCount('lessons')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->latest('published_at')
            ->take(6)
            ->get()
            ->map(fn (Course $course) => [
                'title' => $course->title,
                'slug' => $course->slug,
                'subtitle' => $course->subtitle,
                'price' => $course->price,
                'currency' => $course->currency,
                'level' => $course->level,
                'category' => $course->category?->name,
                'category_slug' => $course->category?->slug,
                'instructor' => $course->instructor?->name,
                'lessons_count' => $course->lessons_count,
                'duration_minutes' => $course->duration_minutes,
                'cover' => $course->thumbnailUrl(),
                'rating' => $course->reviews_avg_rating ? round((float) $course->reviews_avg_rating, 1) : null,
                'reviews_count' => $course->reviews_count,
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

        $categoryCourses = Category::query()
            ->whereHas('courses', fn ($query) => $query->published())
            ->with(['courses' => fn ($query) => $query->published()
                ->with(['category:id,name,slug', 'instructor:id,name'])
                ->withCount('lessons')
                ->withAvg('reviews', 'rating')
                ->withCount('reviews')
                ->latest('published_at')
                ->take(8)])
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description'])
            ->map(fn (Category $category) => [
                'name' => $category->name,
                'description' => $category->description,
                'courses' => $category->courses->map(fn (Course $course) => [
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'subtitle' => $course->subtitle,
                    'price' => $course->price,
                    'currency' => $course->currency,
                    'level' => $course->level,
                    'category' => $course->category?->name,
                    'category_slug' => $course->category?->slug,
                    'instructor' => $course->instructor?->name,
                    'lessons_count' => $course->lessons_count,
                    'duration_minutes' => $course->duration_minutes,
                    'cover' => $course->thumbnailUrl(),
                    'rating' => $course->reviews_avg_rating ? round((float) $course->reviews_avg_rating, 1) : null,
                    'reviews_count' => $course->reviews_count,
                ]),
            ]);

        return Inertia::render('public/home', [
            'featured' => $featured,
            'categories' => $categories,
            'categoryCourses' => $categoryCourses,
            'homepage' => SiteSetting::valueFor('homepage', HomepageController::defaults()),
            'partnerLogos' => collect(SiteSetting::valueFor('partner_logos'))->map(fn ($path) => Storage::url($path))->values(),
            'stats' => [
                'graduates' => 4000,
                'internships' => 2000,
                'courses' => Course::published()->count(),
            ],
        ]);
    }
}
