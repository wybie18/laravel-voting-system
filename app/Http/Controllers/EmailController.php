<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Voters;

class EmailController extends Controller
{
    public function checkEmail(Request $request)
    {
        $email = $request->query('email');
        $exists = Voters::where('email', $email)->exists();
        
        return response()->json(['exists' => $exists]);
    }
}
