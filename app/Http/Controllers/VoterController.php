<?php

namespace App\Http\Controllers;

use App\Models\Voters;
use App\Http\Requests\StoreVotersRequest;
use App\Http\Requests\UpdateVotersRequest;
use App\Http\Resources\VotersResource;
use App\Imports\VotersImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class VoterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Voters::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $voters = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return inertia("Voters/Index", [
            "voters" => VotersResource::collection($voters),
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
    public function store(StoreVotersRequest $request)
    {
        $data = $request->validated();
        Voters::create($data);

        return to_route('voter.index')->with('success', 'Voter created successfully');
    }
    public function upload(Request $request){
        try {
            $file = $request->file('file');
    
            if (!$file) {
                throw new FileException('No file was provided.');
            }
    
            $extension = $file->getClientOriginalExtension();
            $allowedExtensions = ['xlsx', 'xls', 'csv'];
    
            if (!in_array(strtolower($extension), $allowedExtensions)) {
                throw new AccessDeniedException('Invalid file type. Only Excel files (.xlsx, .xls, .csv) are allowed.');
            }
    
            Excel::import(new VotersImport, $file);
    
            return to_route('voter.index')->with('success', 'Voters imported successfully');
        } catch (ValidationException $e) {
            $failures = $e->failures();
            return back()->withErrors($failures);
        } catch (FileException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        } catch (AccessDeniedException $e) {
            return back()->withErrors(['file' => $e->getMessage()]);
        } catch (\Exception $e) {
            // Handle any other exceptions
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Voters $voters)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Voters $voters)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVotersRequest $request, Voters $voter)
    {
        $voter->update($request->validated());
        return to_route("voter.index")->with('success', 'Voter "' . $voter->name . '" was updated ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Voters $voter)
    {
        $voter->delete();
        return to_route('voter.index')->with('success','Voter "' . $voter->name . '" was deleted ');
    }
}
