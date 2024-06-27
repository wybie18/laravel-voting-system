<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Voters>
 */
class VotersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $departmentPrograms = [
            'College of Criminal Justice Education' => ['BSCrim'], 
            'College of Business Education' => ['BSIT', 'BSA', 'BSIA', 'BSAIS', 'BSBA'], 
            'College of Teacher Education' => ['BEED', 'BSED']
        ];
        $department = fake()->randomElement(array_keys($departmentPrograms));
        $program = fake()->randomElement($departmentPrograms[$department]);
        return [
            'name'=>fake()->name(),
            'email'=>fake()->unique()->safeEmail(),
            'department'=>$department,
            'program'=>$program,
            'year'=>fake()->randomElement([1, 2, 3, 4]),
        ];
    }
}
