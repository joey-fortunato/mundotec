<?php

use App\Http\Controllers\CourseCatalogController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\MyCoursesController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('cursos', [CourseCatalogController::class, 'index'])->name('catalog.index');
Route::get('cursos/{course}', [CourseCatalogController::class, 'show'])->name('catalog.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('os-meus-cursos', [MyCoursesController::class, 'index'])->name('my-courses');

    Route::get('cursos/{course}/inscrever', [EnrollmentController::class, 'create'])->name('enroll.create');
    Route::post('cursos/{course}/inscrever', [EnrollmentController::class, 'store'])->name('enroll.store');

    Route::get('matriculas/{enrollment}/pagamento', [PaymentController::class, 'show'])->name('payment.show');
    Route::post('matriculas/{enrollment}/pagamento', [PaymentController::class, 'store'])->name('payment.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
