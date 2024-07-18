<?php

namespace App\Exports;

use App\Http\Resources\VotersExportResource;
use App\Models\Voters;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class VotersExport implements FromCollection, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $voters = Voters::get();
        return VotersExportResource::collection($voters)->collection;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'name',
            'email',
            'course',
            'year',
        ];
    }
}
