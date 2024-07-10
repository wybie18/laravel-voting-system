<?php

namespace App\Imports;

use App\Models\Course;
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
        // Format the name and email
        $voterName = $row['firstname'] . ' ' . $row['lastname'];

        $nameExtensions = ['JR.', 'SR.', ' III', ' II'];
        $lastname = str_ireplace(['ñ', 'Ñ'], 'n', $row['lastname']);
        $firstname = str_ireplace(['ñ', 'Ñ'], 'n', $row['firstname']);

        foreach ($nameExtensions as $extension) {
            $lastname = str_ireplace($extension, '', strtoupper($lastname));
            $firstname = str_ireplace($extension, '', strtoupper($firstname));
        }

        $lastname = preg_replace('/[^a-zA-Z0-9]/', '', $lastname);
        $firstname = preg_replace('/[^a-zA-Z0-9]/', '', $firstname);

        $email = strtolower($lastname . '.' . $firstname . '@sfxc.edu.ph');

        $course = Course::where('name', $row['course'])->first();
        $voter = Voters::where('email', $email)->first();

        if (!$course) {
            throw new \Exception("Course '{$row['course']}' not found.");
        }

        if ($voter) {
            $voter->update([
                'name' => $voterName,
                'email' => $email,
                'course_id' => $course->id,
                'year' => $row['year'],
            ]);
        } else {
            $voter = new Voters([
                'name' => $voterName,
                'email' => $email,
                'course_id' => $course->id,
                'year' => $row['year'],
            ]);
            $voter->save();
        }

        return $voter;
    }
    public function headingRow(): int
    {
        return 6;
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            '*.firstname' => ['required', "string", "max:200"],
            '*.lastname' => ['required', "string", "max:200"],
            '*.course' => ['required', "string", "max:100"],
            '*.year' => ['required'],
        ];
    }
}
