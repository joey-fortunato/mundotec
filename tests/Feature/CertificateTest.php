<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CertificateTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_certificate_is_issued_when_a_course_is_completed(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = Course::factory()->create(['status' => CourseStatus::Published, 'published_at' => now()]);
        $module = Module::factory()->for($course)->create();
        $lesson = Lesson::factory()->for($module)->create();
        Enrollment::factory()->for($student)->for($course)->create(['status' => EnrollmentStatus::Active]);

        $this->actingAs($student)->post("/aprender/{$course->slug}/aulas/{$lesson->id}/concluir");

        $certificate = Certificate::first();
        $this->assertNotNull($certificate);
        $this->assertSame($student->id, $certificate->user_id);
        $this->assertSame($course->id, $certificate->course_id);
    }

    public function test_verification_page_is_public(): void
    {
        $certificate = Certificate::factory()->create();

        $this->get("/verificar/{$certificate->serial}")->assertOk();
    }

    public function test_a_student_cannot_view_another_students_certificate(): void
    {
        $owner = User::factory()->create(['role' => UserRole::Student]);
        $intruder = User::factory()->create(['role' => UserRole::Student]);
        $certificate = Certificate::factory()->for($owner)->create();

        $this->actingAs($intruder)->get("/certificados/{$certificate->serial}")->assertForbidden();
    }
}
