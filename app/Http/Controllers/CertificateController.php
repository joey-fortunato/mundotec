<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function index(Request $request): Response
    {
        $certificates = Certificate::query()
            ->where('user_id', $request->user()->id)
            ->with('course:id,title,slug')
            ->latest('issued_at')
            ->get()
            ->map(fn (Certificate $c) => [
                'serial' => $c->serial,
                'course_title' => $c->course->title,
                'issued_at' => $c->issued_at->format('d/m/Y'),
            ]);

        return Inertia::render('certificate/index', [
            'certificates' => $certificates,
        ]);
    }

    public function show(Request $request, Certificate $certificate): Response
    {
        abort_unless($certificate->user_id === $request->user()->id, 403);

        return Inertia::render('certificate/show', [
            'certificate' => $this->payload($certificate),
        ]);
    }

    public function verify(Certificate $certificate): Response
    {
        return Inertia::render('certificate/verify', [
            'certificate' => $this->payload($certificate),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Certificate $certificate): array
    {
        $certificate->load('user:id,name', 'course:id,title,duration_minutes');

        return [
            'serial' => $certificate->serial,
            'student' => $certificate->user->name,
            'course' => $certificate->course->title,
            'hours' => $certificate->course->duration_minutes
                ? (int) round($certificate->course->duration_minutes / 60)
                : null,
            'issued_at' => $certificate->issued_at->translatedFormat('d \d\e F \d\e Y'),
        ];
    }
}
