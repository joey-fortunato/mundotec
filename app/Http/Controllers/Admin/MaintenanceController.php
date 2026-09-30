<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    /** Default background used when the admin has not uploaded one. */
    public const DEFAULT_BACKGROUND = '/images/maintence.jpg';

    public function edit(): Response
    {
        $settings = SiteSetting::valueFor('maintenance', ['enabled' => false, 'message' => null]);

        return Inertia::render('admin/maintenance', [
            'enabled' => (bool) ($settings['enabled'] ?? false),
            'message' => $settings['message'] ?? null,
            'background' => self::backgroundUrl($settings),
            'hasCustomBackground' => ! empty($settings['background_path']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
            'message' => ['nullable', 'string', 'max:500'],
            'background' => ['nullable', 'image', 'max:6144'],
            'remove_background' => ['nullable', 'boolean'],
        ]);

        $settings = SiteSetting::valueFor('maintenance', ['enabled' => false, 'message' => null]);
        $backgroundPath = $settings['background_path'] ?? null;

        if ($request->boolean('remove_background') && $backgroundPath) {
            Storage::disk('public')->delete($backgroundPath);
            $backgroundPath = null;
        }

        if ($request->hasFile('background')) {
            if ($backgroundPath) {
                Storage::disk('public')->delete($backgroundPath);
            }
            $backgroundPath = $request->file('background')->store('manutencao', 'public');
        }

        SiteSetting::put('maintenance', [
            'enabled' => $data['enabled'],
            'message' => $data['message'] ?? null,
            'background_path' => $backgroundPath,
        ]);

        return back()->with('success', $data['enabled']
            ? 'Modo de manutenção ativado. Só os administradores podem aceder ao site.'
            : 'Modo de manutenção desativado. O site está novamente disponível.');
    }

    /**
     * Resolve the public URL of the maintenance background image.
     *
     * @param  array<string, mixed>  $settings
     */
    public static function backgroundUrl(array $settings): string
    {
        return ! empty($settings['background_path'])
            ? Storage::url($settings['background_path'])
            : self::DEFAULT_BACKGROUND;
    }
}
