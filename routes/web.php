<?php

use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CourseCatalogController;
use App\Http\Controllers\CourseReviewController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LearningController;
use App\Http\Controllers\InstructorDashboardController;
use App\Http\Controllers\InstructorCourseController;
use App\Http\Controllers\MyCoursesController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentHistoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('cursos', [CourseCatalogController::class, 'index'])->name('catalog.index');

Route::inertia('estagios', 'public/estagios')->name('estagios');
Route::inertia('treinamentos', 'public/treinamentos')->name('treinamentos');
Route::inertia('sobre', 'public/sobre')->name('sobre');
Route::inertia('contactos', 'public/contactos')->name('contactos');

Route::get('cursos/{course}', [CourseCatalogController::class, 'show'])->name('catalog.show');

Route::get('verificar/{certificate}', [CertificateController::class, 'verify'])->name('certificates.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('instrutor', [InstructorDashboardController::class, 'index'])->middleware('instructor')->name('instructor.dashboard');
    Route::get('instrutor/cursos/{course}', [InstructorCourseController::class, 'show'])->middleware('instructor')->name('instructor.courses.show');

    Route::get('os-meus-cursos', [MyCoursesController::class, 'index'])->name('my-courses');
    Route::get('faturas', [PaymentHistoryController::class, 'index'])->name('faturas');

    Route::get('cursos/{course}/inscrever', [EnrollmentController::class, 'create'])->name('enroll.create');
    Route::post('cursos/{course}/inscrever', [EnrollmentController::class, 'store'])->name('enroll.store');
    Route::post('cursos/{course}/avaliacao', [CourseReviewController::class, 'store'])->name('courses.reviews.store');

    Route::get('matriculas/{enrollment}/pagamento', [PaymentController::class, 'show'])->name('payment.show');
    Route::post('matriculas/{enrollment}/pagamento', [PaymentController::class, 'store'])->name('payment.store');

    Route::get('aprender/{course}', [LearningController::class, 'show'])->name('learn.show');
    Route::get('aprender/{course}/aulas/{lesson}', [LearningController::class, 'show'])->name('learn.lesson');
    Route::post('aprender/{course}/aulas/{lesson}/concluir', [LearningController::class, 'complete'])->name('learn.complete');

    Route::get('certificados', [CertificateController::class, 'index'])->name('certificates.index');
    Route::get('certificados/{certificate}', [CertificateController::class, 'show'])->name('certificates.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
