<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Department;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // CTE Department
        $cteDepartment = Department::where('name', 'CTE')->first();
        $cteCourses = ['ABEL', 'BEED', 'BSE', 'BSED', 'BSED-MATH'];
        foreach ($cteCourses as $course) {
            Course::create([
                'name' => $course,
                'department_id' => $cteDepartment->id,
            ]);
        }

        // CBE Department
        $cbeDepartment = Department::where('name', 'CBE')->first();
        $cbeCourses = ['BSA', 'BSAIS', 'BSBA-FM', 'BSBA-HRM', 'BSBA-MM', 'BSBA-OPMAN', 'BSIT', 'BSMA', 'BSOA'];
        foreach ($cbeCourses as $course) {
            Course::create([
                'name' => $course,
                'department_id' => $cbeDepartment->id,
            ]);
        }

        // CCJE Department
        $ccjeDepartment = Department::where('name', 'CCJE')->first();
        Course::create([
            'name' => 'BSCRIM',
            'department_id' => $ccjeDepartment->id,
        ]);
    }
}
