<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaintenanceController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::valueFor('maintenance', ['enabled' => false, 'message' => null]);

        return Inertia::render('admin/maintenance', [
            'enabled' => (bool) ($settings['enabled'] ?? false),
            'message' => $settings['message'] ?? null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'enabled' => ['required', 'boolean'],
            'message' => ['nullable', 'string', 'max:500'],
        ]);

        SiteSetting::put('maintenance', [
            'enabled' => $data['enabled'],
            'message' => $data['message'] ?? null,
        ]);

        return back()->with('success', $data['enabled']
            ? 'Modo de manutenção ativado. Só os administradores podem aceder ao site.'
            : 'Modo de manutenção desativado. O site está novamente disponível.');
    }
}
