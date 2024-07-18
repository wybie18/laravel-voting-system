<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Elections extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'image_url', 'is_active', 'start_date', 'end_date'];

    public function positions(){
        return $this->hasMany(Positions::class, 'election_id');
    }

    public function getPositionsWithCandidates(Elections $elections){
        return $elections->positions()->with('candidates')->get();
    }
}
