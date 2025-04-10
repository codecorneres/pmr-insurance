<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::orderBy('order')->get();
        return Inertia::render('questions/index', compact('questions'));
    }

    public function create()
    {
        return Inertia::render('questions/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string',
            'key' => 'required|string|unique:questions,key',
            'type' => 'required|in:text,number,textarea,select',
            'options' => 'nullable',
            'order' => 'nullable|integer',
            'is_required' => 'boolean',
        ]);

        if ($data['type'] === 'select' && !empty($data['options'])) {
            $data['options'] = array_map('trim', explode(',', $data['options']));
        } else {
            $data['options'] = null;
        }

        Question::create($data);

        return redirect()->route('questions.index')->with('success', 'Question created.');
    }

    public function edit(Question $question)
    {
        return Inertia::render('questions/edit', compact('question'));
    }

    public function update(Request $request, Question $question)
    {

        $data = $request->validate([
            'label' => 'required|string',
            'key' => 'required|string|unique:questions,key,' . $question->id,
            'type' => 'required|in:text,number,textarea,select',
            'options' => 'nullable',
            'order' => 'nullable|integer',
            'is_required' => 'boolean',
        ]);

        if ($data['type'] === 'select' && !empty($data['options'])) {
            $data['options'] = array_map('trim', explode(',', $data['options']));
        } else {
            $data['options'] = null;
        }

        $question->update($data);

        return redirect()->route('questions.index')->with('success', 'Question updated.');
    }

    public function destroy(Question $question)
    {
        $question->delete();
        return redirect()->route('questions.index')->with('success', 'Question deleted.');
    }
}
