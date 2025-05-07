<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voters extends Model
{
    protected $fillable = ['email'];
    use HasFactory;

    public function votes(){
        return $this->hasMany(Votes::class);
    }
}
