<?php

namespace App\Http\Controllers;

use App\Models\Positions;
use App\Http\Requests\StorePositionsRequest;
use App\Http\Requests\UpdatePositionsRequest;
use App\Http\Resources\PositionResource;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Positions::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        $positions = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia("Position/Index", [
            "positions" => PositionResource::collection($positions),
            "queryParams" => request()->query() ?: null,
            "success" => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePositionsRequest $request)
    {
        $data = $request->validated();
        Positions::create($data);
        return to_route("position.index")->with('success', 'Position created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePositionsRequest $request, Positions $position)
    {
        $position->update($request->validated());
        return to_route("position.index")->with('success', 'Position "' . $position->name . '" was updated ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Positions $position)
    {
        $position->delete();
        return to_route('position.index')->with('success','Position "' . $position->name . '" was deleted ');
    }

    public function getPositions()
    {
        $positions = Positions::get(['id', 'name', 'election_id']);

        return response()->json($positions);
    }
    public function getActivePositions(){
        $positions = Positions::with('election')
        ->whereHas('election', function ($query) {
            $query->where('is_active', true);
        })
        ->get();

    return response()->json($positions);
    }
}
