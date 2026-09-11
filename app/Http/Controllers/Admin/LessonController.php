<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LessonType;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;

class LessonController extends Controller
{
    public function store(Request $request, Course $course, Module $module): RedirectResponse
    {
        abort_unless($module->course_id === $course->id, 404);

        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['title']);
        $data['position'] = (int) $module->lessons()->max('position') + 1;

        $module->lessons()->create($data);

        return back()->with('success', 'Aula adicionada.');
    }

    public function update(Request $request, Course $course, Module $module, Lesson $lesson): RedirectResponse
    {
        abort_unless($module->course_id === $course->id && $lesson->module_id === $module->id, 404);

        $data = $this->validated($request);
        $data['slug'] = Str::slug($data['title']);

        $lesson->update($data);

        return back()->with('success', 'Aula atualizada.');
    }

    public function destroy(Course $course, Module $module, Lesson $lesson): RedirectResponse
    {
        abort_unless($module->course_id === $course->id && $lesson->module_id === $module->id, 404);

        $lesson->delete();

        return back()->with('success', 'Aula removida.');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', new Enum(LessonType::class)],
            'content' => ['nullable', 'string'],
            'video_url' => ['nullable', 'url', 'max:2048'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['boolean'],
        ]);
    }
}
