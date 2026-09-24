<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomepageController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/homepage', [
            'homepage' => SiteSetting::valueFor('homepage', self::defaults()),
            'partnerLogos' => collect(SiteSetting::valueFor('partner_logos'))->map(fn ($path) => ['path' => $path, 'url' => Storage::url($path)])->values(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'metrics' => ['required', 'array', 'min:1', 'max:8'],
            'metrics.*.value' => ['required', 'string', 'max:30'],
            'metrics.*.label' => ['required', 'string', 'max:80'],
            'retain_logos' => ['nullable', 'array'],
            'retain_logos.*' => ['string'],
            'partner_logos' => ['nullable', 'array', 'max:20'],
            'partner_logos.*' => ['image', 'max:4096'],
        ]);

        SiteSetting::put('homepage', ['metrics' => $data['metrics'], 'partners' => []]);
        $old = SiteSetting::valueFor('partner_logos');
        $kept = collect($data['retain_logos'] ?? [])->filter(fn ($path) => in_array($path, $old, true))->values();
        collect($old)->reject(fn ($path) => $kept->contains($path))->each(fn ($path) => Storage::disk('public')->delete($path));
        $new = collect($request->file('partner_logos', []))->map(fn ($file) => $file->store('parceiros', 'public'));
        SiteSetting::put('partner_logos', $kept->merge($new)->all());

        return back()->with('success', 'Informações da página inicial atualizadas.');
    }

    /** @return array<string, array<mixed>> */
    public static function defaults(): array
    {
        return [
            'metrics' => [
                ['value' => '+4.000', 'label' => 'Formandos Formados'],
                ['value' => '+2.000', 'label' => 'Estagiários Capacitados'],
                ['value' => '+2.000', 'label' => 'Treinamentos corporativos'],
                ['value' => '+30', 'label' => 'Formadores'],
                ['value' => '+40', 'label' => 'Cursos Ministrados'],
                ['value' => '+20', 'label' => 'Empresas Parceiras'],
            ],
            'partners' => [],
        ];
    }
}
