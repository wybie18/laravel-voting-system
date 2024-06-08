<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CandidateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'image_url' => $this->image_url ? Storage::url($this->image_url) : '',
            "created_at" => (new Carbon($this->created_at)) -> format('Y-m-d'),
            "updated_at" => (new Carbon($this->updated_at)) -> format('Y-m-d'),
            "votes" => $this->votes,
            'position' => new PositionResource($this->position),
        ];
    }
}
