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
        $is_verified = fake()->boolean();
        return [
            'name'=>fake()->name(),
            'email'=>fake()->unique()->safeEmail(),
            'is_verified'=>$is_verified,
            'verified_date'=> $is_verified ? fake()->dateTimeThisYear() : null,
        ];
    }
}
