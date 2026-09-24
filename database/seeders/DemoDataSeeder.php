<?php

namespace Database\Seeders;

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use App\Services\EnrollmentService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(EnrollmentService $service): void
    {
        $this->call(DemoCoursesSeeder::class);

        $admin = User::updateOrCreate(
            ['email' => 'admin@mundotec.ao'],
            ['name' => 'Admin MundoTec', 'password' => Hash::make('password'), 'role' => UserRole::Admin, 'email_verified_at' => now()],
        );

        User::updateOrCreate(
            ['email' => 'instrutor@mundotec.ao'],
            ['name' => 'Paulo Neves', 'password' => Hash::make('password'), 'role' => UserRole::Instructor, 'email_verified_at' => now()],
        );

        $student = User::updateOrCreate(
            ['email' => 'aluno@mundotec.ao'],
            ['name' => 'Michel Amorais', 'password' => Hash::make('password'), 'role' => UserRole::Student, 'email_verified_at' => now()],
        );

        // Active enrollment with partial progress on the first course.
        $active = Course::query()->published()->has('modules')->first();
        if ($active) {
            $enrollment = Enrollment::firstOrCreate(
                ['user_id' => $student->id, 'course_id' => $active->id],
                ['status' => EnrollmentStatus::Active, 'enrolled_at' => now(), 'price_paid' => $active->price],
            );
            $firstLesson = $active->lessons()->first();
            if ($firstLesson) {
                $service->markLessonComplete($enrollment, $firstLesson);
            }
        }

        // A completed course, so the student has a certificate to show.
        $completed = Course::query()->published()->has('modules')->where('id', '!=', $active?->id)->first();
        if ($completed) {
            $enrollment = Enrollment::firstOrCreate(
                ['user_id' => $student->id, 'course_id' => $completed->id],
                ['status' => EnrollmentStatus::Active, 'enrolled_at' => now(), 'price_paid' => $completed->price],
            );
            foreach ($completed->lessons as $lesson) {
                $service->markLessonComplete($enrollment, $lesson);
            }
        }
    }
}
