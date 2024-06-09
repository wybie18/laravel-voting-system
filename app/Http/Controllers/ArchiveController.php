<?php

namespace App\Http\Controllers;

use App\Models\Elections;

class ArchiveController extends Controller
{
    public function index(){
        $query = Elections::query();

        $elections = $query->orderBy('start_date', 'asc')->get();
        return inertia('Archive/Index', [
            "elections" => $elections,
        ]);
    }
    
    public function show($id){
        $election = Elections::with(['positions.candidates' => function($query) {
            $query->withCount('votes');
        }])->findOrFail($id);
        return inertia('Archive/Show', [
            'election' => $election,
        ]);
    }
}
