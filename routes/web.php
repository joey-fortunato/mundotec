<?php

use App\Http\Controllers\CourseCatalogController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LearningController;
use App\Http\Controllers\MyCoursesController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('cursos', [CourseCatalogController::class, 'index'])->name('catalog.index');
Route::get('cursos/{course}', [CourseCatalogController::class, 'show'])->name('catalog.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('os-meus-cursos', [MyCoursesController::class, 'index'])->name('my-courses');

    Route::get('cursos/{course}/inscrever', [EnrollmentController::class, 'create'])->name('enroll.create');
    Route::post('cursos/{course}/inscrever', [EnrollmentController::class, 'store'])->name('enroll.store');

    Route::get('matriculas/{enrollment}/pagamento', [PaymentController::class, 'show'])->name('payment.show');
    Route::post('matriculas/{enrollment}/pagamento', [PaymentController::class, 'store'])->name('payment.store');

    Route::get('aprender/{course}', [LearningController::class, 'show'])->name('learn.show');
    Route::get('aprender/{course}/aulas/{lesson}', [LearningController::class, 'show'])->name('learn.lesson');
    Route::post('aprender/{course}/aulas/{lesson}/concluir', [LearningController::class, 'complete'])->name('learn.complete');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
