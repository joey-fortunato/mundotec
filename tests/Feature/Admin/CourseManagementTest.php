<?php

namespace Tests\Feature\Admin;

use App\Enums\CourseStatus;
use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => UserRole::Admin]);
    }

    public function test_non_admins_cannot_access_the_course_admin(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);

        $this->actingAs($student)
            ->get('/admin/courses')
            ->assertForbidden();
    }

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get('/admin/courses')->assertRedirect(route('login'));
    }

    public function test_admin_can_create_a_course(): void
    {
        $category = Category::create(['name' => 'Tecnologia', 'slug' => 'tecnologia']);

        $response = $this->actingAs($this->admin())->post('/admin/courses', [
            'title' => 'Cisco CCNA',
            'subtitle' => 'Redes',
            'description' => 'Curso de redes.',
            'category_id' => $category->id,
            'instructor_id' => null,
            'price' => 75000,
            'max_installments' => 3,
            'level' => 'Iniciante',
            'duration_minutes' => 1200,
            'status' => CourseStatus::Published->value,
        ]);

        $course = Course::first();

        $this->assertNotNull($course);
        $this->assertSame('cisco-ccna', $course->slug);
        $this->assertSame(CourseStatus::Published, $course->status);
        $this->assertNotNull($course->published_at);
        $response->assertRedirect(route('admin.courses.show', $course));
    }

    public function test_slugs_are_made_unique(): void
    {
        $admin = $this->admin();
        $payload = fn () => [
            'title' => 'Marketing Digital',
            'price' => 50000,
            'max_installments' => 1,
            'status' => CourseStatus::Draft->value,
        ];

        $this->actingAs($admin)->post('/admin/courses', $payload());
        $this->actingAs($admin)->post('/admin/courses', $payload());

        $this->assertEqualsCanonicalizing(
            ['marketing-digital', 'marketing-digital-2'],
            Course::pluck('slug')->all(),
        );
    }

    public function test_admin_can_add_modules_and_lessons(): void
    {
        $admin = $this->admin();
        $course = Course::create([
            'title' => 'Programação Web',
            'slug' => 'programacao-web',
            'price' => 60000,
            'status' => CourseStatus::Draft,
        ]);

        $this->actingAs($admin)
            ->post("/admin/courses/{$course->slug}/modules", ['title' => 'HTML e CSS'])
            ->assertRedirect();

        $module = $course->modules()->first();
        $this->assertSame('HTML e CSS', $module->title);
        $this->assertSame(1, $module->position);

        $this->actingAs($admin)->post("/admin/courses/{$course->slug}/modules/{$module->id}/lessons", [
            'title' => 'Introdução ao HTML',
            'type' => 'video',
            'video_url' => 'https://example.com/video',
            'is_preview' => true,
        ])->assertRedirect();

        $lesson = $module->lessons()->first();
        $this->assertSame('Introdução ao HTML', $lesson->title);
        $this->assertSame('introducao-ao-html', $lesson->slug);
        $this->assertTrue($lesson->is_preview);
    }

    public function test_course_validation_rejects_bad_input(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/courses', ['title' => '', 'price' => -5, 'max_installments' => 0, 'status' => 'invalid'])
            ->assertSessionHasErrors(['title', 'price', 'max_installments', 'status']);
    }
}
