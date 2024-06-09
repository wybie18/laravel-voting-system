<?php

use App\Http\Controllers\ArchiveController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\VoterController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [VoteController::class,'index'])->name('home');
Route::post('/', [VoteController::class,'store'])->name('vote.store');

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('admin/election', ElectionController::class);
    Route::resource('admin/position', PositionController::class);
    Route::resource('admin/candidate', CandidateController::class);
    Route::resource('admin/voter', VoterController::class);
    Route::post('admin/voter/upload', [VoterController::class,'upload'])->name('voter.upload');
    // Route::resource('admin/votes', VoteController::class);
    Route::get('admin/archive', [ArchiveController::class, 'index'])->name('archive.index');
    Route::get('admin/archive/{archive}', [ArchiveController::class, 'show'])->name('archive.show');
    Route::resource('admin/user', UserController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('admin/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('admin/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('admin/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
