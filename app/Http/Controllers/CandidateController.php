<?php

namespace App\Http\Controllers;

use App\Models\Candidates;
use App\Http\Requests\StoreCandidatesRequest;
use App\Http\Requests\UpdateCandidatesRequest;
use App\Http\Resources\CandidateResource;
use DateTime;
use Illuminate\Support\Facades\Storage;

class CandidateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Candidates::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        $candidates = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia("Candidate/Index", [
            "candidates" => CandidateResource::collection($candidates),
            "queryParams" => request()->query() ?: null,
            "success" => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCandidatesRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        if ($image){
            $now = new DateTime();
            $formattedDateTime = $now->format('Y-m-d-H-i-s');
            $data['image_url'] = $image->store('candidate/'. $data['name'] . $formattedDateTime, 'public' );
        }
        Candidates::create($data);

        return to_route("candidate.index")->with('success', 'Candidate created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Candidates $candidates)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Candidates $candidates)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCandidatesRequest $request, Candidates $candidate)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        if ($image){
            if ($candidate->image_url){
                Storage::disk('public')->deleteDirectory(dirname($candidate->image_url));
            }
            $now = new DateTime();
            $formattedDateTime = $now->format('Y-m-d-H-i-s');
            $data['image_url'] = $image->store('candidate/'. $data['name'] . $formattedDateTime, 'public' );
        }
        $candidate->update($data);
        return to_route("candidate.index")->with('success', 'Candidate "' . $candidate->name . '" was updated ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Candidates $candidate)
    {
        $candidate->delete();
        if($candidate->image_url){
            Storage::disk('public')->deleteDirectory(dirname($candidate->image_url));
        }
        return to_route('candidate.index')->with('success','Candidate "' . $candidate->name . '" was deleted ');
    }

    public function getActiveCandidates(){
        $query = Candidates::whereHas('position.election', function ($query) {
            $query->where('is_active', true);
        })
        ->with('position')->get();
        $activeCandidates = CandidateResource::collection($query);
        return response()->json($activeCandidates);
    }
}
