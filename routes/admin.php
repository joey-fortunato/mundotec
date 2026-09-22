<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CertificateController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EnrollmentController;
use App\Http\Controllers\Admin\InstructorController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\ModuleController;
use App\Http\Controllers\Admin\PaymentController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('home');
        Route::get('inscricoes', [EnrollmentController::class, 'index'])->name('enrollments.index');
        Route::get('instrutores', [InstructorController::class, 'index'])->name('instructors.index');
        Route::get('certificados', [CertificateController::class, 'index'])->name('certificates.index');

        Route::resource('courses', CourseController::class)
            ->parameters(['courses' => 'course']);

        Route::resource('categories', CategoryController::class)
            ->only(['index', 'store', 'update', 'destroy']);

        Route::get('pagamentos', [PaymentController::class, 'index'])->name('payments.index');
        Route::post('pagamentos/{payment}/confirmar', [PaymentController::class, 'confirm'])->name('payments.confirm');
        Route::post('pagamentos/{payment}/rejeitar', [PaymentController::class, 'reject'])->name('payments.reject');

        // Modules nested under a course.
        Route::post('courses/{course}/modules', [ModuleController::class, 'store'])->name('courses.modules.store');
        Route::put('courses/{course}/modules/{module}', [ModuleController::class, 'update'])->name('courses.modules.update');
        Route::delete('courses/{course}/modules/{module}', [ModuleController::class, 'destroy'])->name('courses.modules.destroy');

        // Lessons nested under a module.
        Route::post('courses/{course}/modules/{module}/lessons', [LessonController::class, 'store'])->name('courses.modules.lessons.store');
        Route::put('courses/{course}/modules/{module}/lessons/{lesson}', [LessonController::class, 'update'])->name('courses.modules.lessons.update');
        Route::delete('courses/{course}/modules/{module}/lessons/{lesson}', [LessonController::class, 'destroy'])->name('courses.modules.lessons.destroy');
    });
