<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ElectionResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "name" => $this->name,
            'image_url' => $this->image_url ? Storage::url($this->image_url) : '',
            "is_active" => $this->is_active,
            "start_date" => (new Carbon($this->start_date)) -> format('Y-m-d'),
            "end_date" => (new Carbon($this->end_date)) -> format('Y-m-d'),
            "created_at" => (new Carbon($this->created_at)) -> format('Y-m-d'),
            "updated_at" => (new Carbon($this->updated_at)) -> format('Y-m-d'),
        ];
    }
}
