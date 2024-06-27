<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Voters;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $adminUser = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => time()
        ]);

        Permission::create(['name' => 'can create']);
        Permission::create(['name' => 'can update']);
        Permission::create(['name' => 'can delete']);

        $role = Role::create(['name' => 'staff']);
        $role->givePermissionTo(['can create', 'can update']);
        
        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(['can create', 'can update', 'can delete']);

        $adminUser->assignRole('admin');
        Voters::factory()->count(1000)->create();
    }
}
