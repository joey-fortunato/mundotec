<?php

use App\Http\Controllers\CourseCatalogController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('cursos', [CourseCatalogController::class, 'index'])->name('catalog.index');
Route::get('cursos/{course}', [CourseCatalogController::class, 'show'])->name('catalog.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
