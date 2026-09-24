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
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Enum;

class LessonController extends Controller
{
    public function store(Request $request, Course $course, Module $module): RedirectResponse
    {
        abort_unless($module->course_id === $course->id, 404);

        $data = $this->validated($request);
        $data = $this->storeFiles($request, $data);
        $data['slug'] = Str::slug($data['title']);
        $data['position'] = (int) $module->lessons()->max('position') + 1;

        $module->lessons()->create($data);

        return back()->with('success', 'Aula adicionada.');
    }

    public function update(Request $request, Course $course, Module $module, Lesson $lesson): RedirectResponse
    {
        abort_unless($module->course_id === $course->id && $lesson->module_id === $module->id, 404);

        $data = $this->validated($request);
        $data = $this->storeFiles($request, $data, $lesson);
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
            'video_file' => ['nullable', 'file', 'mimetypes:video/mp4,video/webm,video/ogg', 'max:512000'],
            'attachment' => ['nullable', 'file', 'mimes:pdf', 'max:20480'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'is_preview' => ['boolean'],
        ]);
    }

    /** @param array<string, mixed> $data @return array<string, mixed> */
    private function storeFiles(Request $request, array $data, ?Lesson $lesson = null): array
    {
        unset($data['video_file'], $data['attachment']);
        if ($lesson && empty($data['video_url'])) $data['video_url'] = $lesson->video_url;
        if ($lesson && empty($data['content'])) $data['content'] = $lesson->content;
        if ($lesson && empty($data['duration_minutes'])) $data['duration_minutes'] = $lesson->duration_minutes;
        if ($request->hasFile('video_file')) {
            if ($lesson?->video_url && str_starts_with($lesson->video_url, '/storage/')) Storage::disk('public')->delete(ltrim(substr($lesson->video_url, 8), '/'));
            $data['video_url'] = Storage::url($request->file('video_file')->store('videos', 'public'));
        }
        if ($request->hasFile('attachment')) {
            if ($lesson?->attachment_path) Storage::disk('public')->delete($lesson->attachment_path);
            $data['attachment_path'] = $request->file('attachment')->store('materiais', 'public');
        }
        return $data;
    }
}
