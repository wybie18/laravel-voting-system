<?php

namespace App\Http\Controllers;

use App\Models\Candidates;
use App\Models\Elections;
use App\Models\Positions;
use App\Models\User;
use App\Models\Voters;
use App\Models\Votes;

class DashboardController extends Controller
{
    public function index()
    {
        $totalActiveElections = Elections::where('is_active', 1)->count();
        $totalActivePosition = Positions::with('election')
            ->whereHas('election', function ($query) {
                $query->where('is_active', true);
            })->count();
        $totalCandidates = Candidates::whereHas('position.election', function ($query) {
            $query->where('is_active', true);
        })->count();
        $totalVoters = Voters::count();
        $totalUsers = User::count();
        $totalMembers = $totalVoters + $totalUsers;
        $distinctVoterElectionCount = Votes::distinct('election_id')->distinct('voter_id')->count();
        $votersVote = [
            "voters" => $totalVoters,
            "voted" => $distinctVoterElectionCount
        ];
    
        $elections = Elections::with(['positions.candidates' => function($query) {
            $query->withCount('votes');
        }])->where('is_active', true)->get();
        
    
        return inertia('Dashboard', [
            'initialData' => [
                'totalActiveElections' => $totalActiveElections,
                'totalActivePosition' => $totalActivePosition,
                'totalCandidates' => $totalCandidates,
                'totalMembers' => $totalMembers,
                'elections' => $elections,
                "votersVote" => $votersVote,
            ]
        ]);
    }

    public function data()
    {
        $totalActiveElections = Elections::where('is_active', 1)->count();
        $totalActivePosition = Positions::with('election')
            ->whereHas('election', function ($query) {
                $query->where('is_active', true);
            })->count();
        $totalCandidates = Candidates::whereHas('position.election', function ($query) {
            $query->where('is_active', true);
        })->count();
        $totalVoters = Voters::count();
        $totalUsers = User::count();
        $totalMembers = $totalVoters + $totalUsers;
        $distinctVoterElectionCount = Votes::distinct('election_id')->distinct('voter_id')->count();
        $votersVote = [
            "voters" => $totalVoters,
            "voted" => $distinctVoterElectionCount
        ];
    
        $elections = Elections::with(['positions.candidates' => function($query) {
            $query->withCount('votes');
        }])->where('is_active', true)->get();

        return response()->json([
            'totalActiveElections' => $totalActiveElections,
            'totalActivePosition' => $totalActivePosition,
            'totalCandidates' => $totalCandidates,
            'totalMembers' => $totalMembers,
            'elections' => $elections,
            "votersVote" => $votersVote,
        ]);
    }

}
