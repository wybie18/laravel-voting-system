<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Elections>
 */
class ElectionsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(),
            'is_active' => fake()->boolean(),
            'start_date' => fake()->dateTime('now'),
            'end_date' => fake()->dateTime('now +1 year'),
        ];
    }
}
