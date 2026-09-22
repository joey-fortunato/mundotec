<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(): Response
    {
        $certificates = Certificate::query()
            ->with(['user:id,name', 'course:id,title'])
            ->latest('issued_at')
            ->get()
            ->map(fn (Certificate $c) => [
                'serial' => $c->serial,
                'student' => $c->user->name,
                'course' => $c->course->title,
                'issued_at' => $c->issued_at->format('d/m/Y'),
            ]);

        return Inertia::render('admin/certificates', [
            'certificates' => $certificates,
        ]);
    }
}
