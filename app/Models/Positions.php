<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Positions extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'election_id'];
    public function election(){
        return $this->belongsTo(Elections::class);
    }
    public function candidates()
    {
        return $this->hasMany(Candidates::class, 'position_id');
    }
}
