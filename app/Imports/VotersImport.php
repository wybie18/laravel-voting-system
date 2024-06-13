<?php

namespace App\Imports;

use App\Models\Voters;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class VotersImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $voter = Voters::where('email', $row['email'])->first();

        if ($voter) {
            $voter->update([
                'name' => $row['name'],
                'email' => $row['email'],
            ]);
        } else {
            $voter = new Voters([
                'name' => $row['name'],
                'email' => $row['email'],
            ]);
            $voter->save();
        }

        return $voter;
    }
    // public function headingRow(): int
    // {
    //     return 4;
    // }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            '*.name' => ['required', "string", "max:200"],
            '*.email' => ['required', 'string', 'email'],
        ];
    }
}