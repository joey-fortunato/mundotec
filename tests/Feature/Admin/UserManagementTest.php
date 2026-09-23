<?php

namespace Tests\Feature\Admin;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => UserRole::Admin]);
    }

    public function test_non_admin_cannot_access_users(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $this->actingAs($student)->get('/admin/users')->assertForbidden();
    }

    public function test_admin_can_create_an_instructor(): void
    {
        $this->actingAs($this->admin())
            ->post('/admin/users', [
                'name' => 'Paulo Neves',
                'email' => 'paulo@mundotec.ao',
                'phone' => '923 000 000',
                'role' => UserRole::Instructor->value,
                'password' => 'password123',
            ])
            ->assertRedirect(route('admin.users.index'));

        $user = User::where('email', 'paulo@mundotec.ao')->first();
        $this->assertNotNull($user);
        $this->assertSame(UserRole::Instructor, $user->role);
    }

    public function test_admin_cannot_delete_own_account(): void
    {
        $admin = $this->admin();
        $this->actingAs($admin)->delete("/admin/users/{$admin->id}");
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_can_manually_enroll_a_student(): void
    {
        $admin = $this->admin();
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = Course::factory()->create(['status' => CourseStatus::Published, 'published_at' => now()]);

        $this->actingAs($admin)
            ->post('/admin/inscricoes', ['user_id' => $student->id, 'course_id' => $course->id])
            ->assertRedirect();

        $enrollment = Enrollment::first();
        $this->assertNotNull($enrollment);
        $this->assertSame(EnrollmentStatus::Active, $enrollment->status);
    }
}
