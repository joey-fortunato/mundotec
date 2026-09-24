<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    /** @return array<string, string> */
    public static function defaultDesign(): array
    {
        return ['title' => 'CERTIFICADO DE CONCLUSÃO', 'city' => 'Luanda', 'signatory' => 'Direção Pedagógica', 'trainer_label' => 'Formador(a)', 'accent_color' => '#2447c8', 'border_style' => 'double', 'shape' => 'seal', 'logo_path' => '', 'background_path' => '', 'seal_path' => ''];
    }

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

    public function builder(): Response
    {
        return Inertia::render('admin/certificate-builder', [
            'design' => self::presentationDesign(SiteSetting::valueFor('certificate_design', self::defaultDesign())),
        ]);
    }

    public function updateBuilder(Request $request): RedirectResponse
    {
        $design = $request->validate([
            'title' => ['required', 'string', 'max:80'],
            'city' => ['required', 'string', 'max:80'],
            'signatory' => ['required', 'string', 'max:80'],
            'trainer_label' => ['required', 'string', 'max:80'],
            'accent_color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'border_style' => ['required', 'in:single,double,modern'],
            'shape' => ['required', 'in:seal,circle,diamond'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'background' => ['nullable', 'image', 'max:4096'],
            'seal' => ['nullable', 'image', 'max:4096'],
        ]);

        $current = SiteSetting::valueFor('certificate_design', self::defaultDesign());
        foreach (['logo', 'background', 'seal'] as $asset) {
            if ($request->hasFile($asset)) {
                $pathKey = "{$asset}_path";
                if (! empty($current[$pathKey])) Storage::disk('public')->delete($current[$pathKey]);
                $design[$pathKey] = $request->file($asset)->store('certificados', 'public');
            } else {
                $design["{$asset}_path"] = $current["{$asset}_path"] ?? '';
            }
        }

        SiteSetting::put('certificate_design', $design);

        return back()->with('success', 'Modelo de certificado atualizado.');
    }

    /** @param array<string, string> $design @return array<string, string> */
    public static function presentationDesign(array $design): array
    {
        foreach (['logo', 'background', 'seal'] as $asset) $design["{$asset}_url"] = ! empty($design["{$asset}_path"]) ? Storage::url($design["{$asset}_path"]) : '';
        return $design;
    }
}
