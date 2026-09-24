<?php

namespace App\Http\Requests\Admin;

use App\Enums\CourseStatus;
use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->isAdmin();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'instructor_id' => [
                'nullable',
                Rule::exists('users', 'id')->where('role', UserRole::Instructor->value),
            ],
            'price' => ['required', 'numeric', 'min:0'],
            'max_installments' => ['required', 'integer', 'min:1', 'max:24'],
            'level' => ['nullable', 'string', 'max:100'],
            'duration_minutes' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', new Enum(CourseStatus::class)],
            'cover' => ['nullable', 'image', 'max:4096'],
        ];
    }
}
