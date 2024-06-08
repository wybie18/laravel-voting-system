<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Votes extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = ['voter_id', 'candidate_id', 'election_id', 'created_at'];
    public function candidate()
    {
        return $this->belongsTo(Candidates::class, 'candidate_id');
    }
}
