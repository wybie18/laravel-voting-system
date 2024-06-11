<?php

namespace App\Http\Controllers;

use App\Models\Votes;
use App\Http\Requests\StoreVotesRequest;
use App\Http\Resources\CandidateResource;
use App\Models\Candidates;
use App\Models\Elections;
use App\Models\Positions;
use App\Models\Voters;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $activeElectionId = $request->get('election');
        
        if (!$activeElectionId) {
            $activeElection = Elections::where('is_active', true)->first();
            if ($activeElection) {
                $activeElectionId = $activeElection->id;
            } else {
                return inertia('Home', [
                    "positions" => collect(),
                    "candidates" => collect(),
                    "elections" => collect(),
                ]);
            }
        }
        $allActiveElection = Elections::where("is_active", true)->get();
        $candidates = Candidates::whereHas('position', function ($query) use ($activeElectionId) {
            $query->where('election_id', $activeElectionId);
        })
        ->with('position')
        ->get();
        $activeCandidates = CandidateResource::collection($candidates);

        $positions = Positions::with('election')
            ->whereHas('election', function ($query) use ($activeElectionId) {
                $query->where('id', $activeElectionId);
            })
            ->get();

        return inertia('Home', [
            "positions" => $positions,
            "candidates" => $activeCandidates,
            "elections" => $allActiveElection,
            "currectElectionId" => $activeElectionId,
            "success" => session('success')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVotesRequest $request)
    {
        $data = $request->validated();
        $voter = Voters::where('email', $data['email'])->first();

        if (!$voter) {
            return redirect()->back()->withErrors(['email' => 'Voter not found.']);
        }

        $data['voter_id'] = $voter->id;
        $electionId = $data['election_id'];
        $votes = $data['votes'];

        if (Votes::where('voter_id', $voter->id)->where('election_id', $electionId)->exists()) {
            return redirect()->back()->withErrors(['election_id' => 'You have already voted in this election.']);
        }

        foreach ($votes as $vote) {
            Votes::create([
                'voter_id' => $data['voter_id'],
                'candidate_id' => $vote['candidate_id'],
                'election_id' => $electionId,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
        return to_route('home', ['election' => $electionId])->with('success', 'Vote submitted successfully.');
    }

}
