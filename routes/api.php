<?php

use App\Http\Controllers\CandidateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ElectionController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\PositionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/active-elections', [ElectionController::class, 'getActiveElections']);
Route::get('/positions', [PositionController::class,'getPositions']);
Route::get('/active-positions', [PositionController::class,'getActivePositions']);
Route::get('/candidates', [CandidateController::class, 'getActiveCandidates']);
Route::get('/check-email', [EmailController::class, 'checkEmail']);
Route::get('/dashboard/data', [DashboardController::class,'data']);