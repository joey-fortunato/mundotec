<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Models\SiteSetting;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class MaintenanceMode
{
    /**
     * Paths that stay reachable while the site is in maintenance,
     * so an admin can still sign in and turn it back off.
     *
     * @var list<string>
     */
    private array $allowed = [
        'login',
        'logout',
        'two-factor-challenge',
        'forgot-password',
        'reset-password',
        'reset-password/*',
        'admin',
        'admin/*',
        'settings/*',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $settings = SiteSetting::valueFor('maintenance', ['enabled' => false]);

        if (empty($settings['enabled'])) {
            return $next($request);
        }

        if ($request->user()?->role === UserRole::Admin) {
            return $next($request);
        }

        if ($request->is(...$this->allowed)) {
            return $next($request);
        }

        return Inertia::render('public/maintenance', [
            'message' => $settings['message'] ?? null,
        ])->toResponse($request)->setStatusCode(503);
    }
}
