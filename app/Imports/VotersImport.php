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
        // // Format the name and email
        // $voterName = $row['firstname'] . ' ' . $row['lastname'];

        // $nameExtensions = ['JR.', 'SR.', ' III', ' II'];
        // $lastname = str_ireplace(['ñ', 'Ñ'], 'n', $row['lastname']);
        // $firstname = str_ireplace(['ñ', 'Ñ'], 'n', $row['firstname']);

        // foreach ($nameExtensions as $extension) {
        //     $lastname = str_ireplace($extension, '', strtoupper($lastname));
        //     $firstname = str_ireplace($extension, '', strtoupper($firstname));
        // }

        // $lastname = preg_replace('/[^a-zA-Z0-9]/', '', $lastname);
        // $firstname = preg_replace('/[^a-zA-Z0-9]/', '', $firstname);

        // $email = strtolower($lastname . '.' . $firstname . '@sfxc.edu.ph');

        $voter = Voters::where('email', $row['email'])->first();

        if ($voter) {
            $voter->update([
                'email' => $row['email'],
            ]);
        } else {
            $voter = new Voters([
                'email' => $row['email'],
            ]);
            $voter->save();
        }

        return $voter;
    }
    public function headingRow(): int
    {
        return 1;
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            '*.email' => ['required', "email"],
        ];
    }
}
