<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVotersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ["required", "string", "max:200"],
            "email" => ["required","string", "email", Rule::unique('voters', 'email')->ignore($this->voter->id)],
            "department" => ['required', 'string', 'max:100'],
            "program" => ['required', 'string', 'max:100'],
            "year" => ['required', 'integer'],
        ];
    }
}
