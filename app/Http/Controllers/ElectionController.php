<?php

namespace App\Http\Controllers;

use App\Models\Elections;
use App\Http\Requests\StoreElectionsRequest;
use App\Http\Requests\UpdateElectionsRequest;
use App\Http\Resources\ElectionResource;

class ElectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Elections::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if(request("name")){
            $query->where("name", "like", "%".request("name")."%");
        }
        if(request() -> has("status")){
            $query->where("is_active", request("status"));
        }

        $elections = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia("Election/Index", [
            "elections" => ElectionResource::collection($elections),
            "queryParams" => request()->query() ?: null,
            "success" => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreElectionsRequest $request)
    {
        $data = $request->validated();
        Elections::create($data);
        return to_route("election.index")->with('success', 'Election created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateElectionsRequest $request, Elections $election)
    {
        $election->update($request->validated());
        return to_route("election.index")->with('success', 'Election for "' . $election->name . '" was updated ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Elections $election)
    {   
        $election->delete();
        return to_route('election.index')->with('success','Election for "' . $election->name . '" was deleted ');
    }
    public function getActiveElections()
    {
        $activeElections = Elections::where('is_active', 1)->get(['id', 'name']);

        return response()->json($activeElections);
    }
}
