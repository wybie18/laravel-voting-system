<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Elections extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'is_active', 'start_date', 'end_date'];

    public function positions(){
        return $this->hasMany(Positions::class, 'election_id');
    }
}
