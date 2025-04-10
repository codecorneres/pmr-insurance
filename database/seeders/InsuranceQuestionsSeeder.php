<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class InsuranceQuestionsSeeder extends Seeder
{
    public function run(): void
    {
        $insuranceQuestions = [
            ['key' => 'age', 'label' => 'What is your age?', 'type' => 'number', 'is_required' => true],
            ['key' => 'insuranceType', 'label' => 'Type of insurance interested in', 'type' => 'select', 'options' => ['Health', 'Life', 'Vehicle', 'Home'], 'is_required' => true],
            ['key' => 'existingConditions', 'label' => 'Do you have any existing medical conditions?', 'type' => 'textarea', 'is_required' => true],
            ['key' => 'currentInsuranceProvider', 'label' => 'Current Insurance Provider', 'type' => 'text', 'is_required' => false],
            ['key' => 'coverageAmount', 'label' => 'Desired Coverage Amount (in USD)', 'type' => 'number', 'is_required' => true],
            ['key' => 'isSmoker', 'label' => 'Are you a smoker?', 'type' => 'select', 'options' => ['Yes', 'No'], 'is_required' => true],
            ['key' => 'annualIncome', 'label' => 'Annual Income (in USD)', 'type' => 'number', 'is_required' => true],
            ['key' => 'numberOfDependents', 'label' => 'Number of Dependents', 'type' => 'number', 'is_required' => false],
            ['key' => 'vehicleOwnership', 'label' => 'Do you own a vehicle?', 'type' => 'select', 'options' => ['Yes', 'No'], 'is_required' => false],
            ['key' => 'employmentStatus', 'label' => 'Employment Status', 'type' => 'select', 'options' => ['Employed', 'Self-Employed', 'Unemployed', 'Student'], 'is_required' => true],
        ];

        foreach ($insuranceQuestions as $index => $question) {
            Question::create([
                'key' => $question['key'],
                'label' => $question['label'],
                'type' => $question['type'],
                'options' => $question['options'] ?? null,
                'order' => $index + 1,
                'is_required' => $question['is_required'],
            ]);
        }
    }
}
