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
use Illuminate\Support\Facades\Route;

Route::get('/', [VoteController::class,'index'])->name('home');
Route::post('/', [VoteController::class,'store'])->name('vote.store');

Route::middleware(['auth', 'verified'])->group(function (){
    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Route::resource('admin/election', ElectionController::class);
    Route::get('admin/election', [ElectionController::class, 'index'])->name('election.index');
    Route::post('admin/election', [ElectionController::class, 'store'])->name('election.store');
    Route::put('admin/election/{election}', [ElectionController::class, 'update'])->name('election.update');
    Route::delete('admin/election/{election}', [ElectionController::class, 'destroy'])->name('election.destroy');

    // Route::resource('admin/position', PositionController::class);
    Route::get('admin/position', [PositionController::class, 'index'])->name('position.index');
    Route::post('admin/position', [PositionController::class,'store'])->name('position.store');
    Route::put('admin/position/{position}', [PositionController::class, 'update'])->name('position.update');
    Route::delete('admin/position/{position}', [PositionController::class, 'destroy'])->name('position.destroy');

    // Route::resource('admin/candidate', CandidateController::class);
    Route::get('admin/candidate', [CandidateController::class, 'index'])->name('candidate.index');
    Route::post('admin/candidate', [CandidateController::class,'store'])->name('candidate.store');
    Route::put('admin/candidate/{candidate}', [CandidateController::class, 'update'])->name('candidate.update');
    Route::delete('admin/candidate/{candidate}', [CandidateController::class, 'destroy'])->name('candidate.destroy');

    // Route::resource('admin/voter', VoterController::class);
    Route::get('admin/voter', [VoterController::class, 'index'])->name('voter.index');
    Route::post('admin/voter', [VoterController::class,'store'])->name('voter.store');
    Route::put('admin/voter/{voter}', [VoterController::class, 'update'])->name('voter.update');
    Route::delete('admin/voter/{voter}', [VoterController::class, 'destroy'])->name('voter.destroy');
    Route::post('admin/voter/upload', [VoterController::class,'upload'])->name('voter.upload');
    // Route::resource('admin/votes', VoteController::class);
    
    Route::get('admin/archive', [ArchiveController::class, 'index'])->name('archive.index');
    Route::get('admin/archive/{archive}', [ArchiveController::class, 'show'])->name('archive.show');

    // Route::resource('admin/user', UserController::class);
    Route::get('admin/user', [UserController::class, 'index'])->name('user.index');
    Route::post('admin/user', [UserController::class,'store'])->name('user.store');
    Route::put('admin/user/{user}', [UserController::class, 'update'])->name('user.update');
    Route::delete('admin/user/{user}', [UserController::class, 'destroy'])->name('user.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('admin/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('admin/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('admin/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
