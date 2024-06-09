<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidates extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'platform', 'image_url', 'position_id'];
    public function position(){
        return $this->belongsTo(Positions::class);
    }
    public function votes()
    {
        return $this->hasMany(Votes::class, 'candidate_id');
    }
}
