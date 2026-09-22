<?php

namespace Tests\Feature;

use App\Enums\CourseStatus;
use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Module;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LearningTest extends TestCase
{
    use RefreshDatabase;

    private function courseWithLessons(int $lessons = 2): Course
    {
        $course = Course::factory()->create(['status' => CourseStatus::Published, 'published_at' => now()]);
        $module = Module::factory()->for($course)->create();
        Lesson::factory()->for($module)->count($lessons)->create();

        return $course;
    }

    public function test_non_enrolled_user_cannot_access_the_player(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->courseWithLessons();

        $this->actingAs($student)->get("/aprender/{$course->slug}")->assertForbidden();
    }

    public function test_active_student_can_access_the_player(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->courseWithLessons();
        Enrollment::factory()->for($student)->for($course)->create(['status' => EnrollmentStatus::Active]);

        $this->actingAs($student)->get("/aprender/{$course->slug}")->assertOk();
    }

    public function test_completing_lessons_updates_progress_and_completes_course(): void
    {
        $student = User::factory()->create(['role' => UserRole::Student]);
        $course = $this->courseWithLessons(2);
        $enrollment = Enrollment::factory()->for($student)->for($course)->create([
            'status' => EnrollmentStatus::Active,
            'progress_percent' => 0,
        ]);
        $lessons = Lesson::all();

        $this->actingAs($student)->post("/aprender/{$course->slug}/aulas/{$lessons[0]->id}/concluir");
        $enrollment->refresh();
        $this->assertSame(50, $enrollment->progress_percent);
        $this->assertSame(EnrollmentStatus::Active, $enrollment->status);

        $this->actingAs($student)->post("/aprender/{$course->slug}/aulas/{$lessons[1]->id}/concluir");
        $enrollment->refresh();
        $this->assertSame(100, $enrollment->progress_percent);
        $this->assertSame(EnrollmentStatus::Completed, $enrollment->status);
        $this->assertNotNull($enrollment->completed_at);
    }
}
