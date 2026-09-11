<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function store(Request $request, Course $course): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $course->modules()->create([
            ...$data,
            'position' => (int) $course->modules()->max('position') + 1,
        ]);

        return back()->with('success', 'Módulo adicionado.');
    }

    public function update(Request $request, Course $course, Module $module): RedirectResponse
    {
        abort_unless($module->course_id === $course->id, 404);

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $module->update($data);

        return back()->with('success', 'Módulo atualizado.');
    }

    public function destroy(Course $course, Module $module): RedirectResponse
    {
        abort_unless($module->course_id === $course->id, 404);

        $module->delete();

        return back()->with('success', 'Módulo removido.');
    }
}
