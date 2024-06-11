<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::with('roles')->where('id', '!=', auth()->id());

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $voters = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        $roles = Role::all();
        return inertia("User/Index", [
            "users" => UserResource::collection($voters),
            "roles" => $roles,
            "queryParams" => request()->query() ?: null,
            "success" => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['email_verified_at'] = time();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        $user->assignRole($data['role']);

        return to_route('user.index')->with('success', 'User created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $password = $data['password'] ?? null;
        if ($password){
            $data['password'] = bcrypt($password);
        }else{
            unset($data['password']);
        }
        $user->update($data);
        return to_route("user.index")->with('success', 'User "' . $user->name . '" was updated ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return to_route('user.index')->with('success','User "' . $user->name . '" was deleted ');
    }
}
