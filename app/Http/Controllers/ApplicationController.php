<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Question;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get all applications if admin, otherwise only user's own
        $applications = $user->is_admin
            ? Application::latest()->get()
            : Application::where('user_id', $user->id)->latest()->get();

        return Inertia::render('applications/index', [
            'applications' => $applications,
            'auth' => ['user' => $user],
        ]);
    }

    public function create()
    {
        $questions = Question::orderBy('order')->get();

        return Inertia::render('applications/create', [
            'questions' => $questions,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $questions = Question::all();

        $validated = $this->validateApplication($request, $questions);

        $application = Application::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
            'user_id' => $user->id,
        ]);

        if (!$application) {
            return back()->withInput()->withErrors([
                'form' => 'Failed to submit application. Please try again.',
            ]);
        }

        $this->saveAnswers($application, $questions, $validated['answers']);

        return redirect()->route('applications.index')->with('success', 'Application submitted.');
    }

    public function edit($id)
    {
        $user = Auth::user();
        $application = Application::with('answers.question')->findOrFail($id);
        $questions = Question::orderBy('order')->get();

        if (!$user->is_admin && $user->id !== $application->user_id) {
            abort(403, 'Unauthorized access to this application.');
        }

        // Build answer map: key => value
        $answerMap = $application->answers->mapWithKeys(function ($answer) {
            return [$answer->question->key => $answer->answer];
        });

        return Inertia::render('applications/edit', [
            'application' => [
                'id' => $application->id,
                'name' => $application->name,
                'email' => $application->email,
                'status' => $application->status,
                'answers' => $answerMap,
            ],
            'questions' => $questions,
        ]);
    }

    public function update(Request $request, Application $application)
    {
        $user = Auth::user();
        $questions = Question::all();

        if (!$user->is_admin && $user->id !== $application->user_id) {
            abort(403, 'Unauthorized access.');
        }

        $validated = $this->validateApplication($request, $questions, $application->id);

        $application->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $user->is_user ? 'Submitted' : $validated['status'],
        ]);

        $this->saveAnswers($application, $questions, $validated['answers']);

        return redirect()->route('applications.index')->with('success', 'Application updated successfully.');
    }


    private function validateApplication(Request $request, $questions, $applicationId = null): array
    {
        $rules = [
            'name' => 'required|string',
            'email' => ['required', 'email'],
            'status' => 'required|string',
            'answers' => 'required|array',
        ];

        if ($applicationId) {
            $rules['email'][] = 'unique:applications,email,' . $applicationId;
        }

        $messages = [];

        foreach ($questions as $q) {
            $key = "answers.{$q->key}";

            $isReq = $q->is_required ? 'required' : 'nullable';
            $typeRule = match ($q->type) {
                'number' => 'numeric',
                'select' => $q->options ? 'in:' . implode(',', $q->options) : 'string',
                default  => 'string',
            };

            $rules[$key] = "{$isReq}|{$typeRule}";

            if ($q->is_required) {
                $messages["{$key}.required"] = 'This field is required.';
            }
            if ($q->type === 'number') {
                $messages["{$key}.numeric"] = 'Please enter a valid number.';
            }
            if ($q->type === 'select') {
                $messages["{$key}.in"] = 'Please select a valid option.';
            }
        }

        return $request->validate($rules, $messages);
    }

    private function saveAnswers(Application $application, $questions, $answers): void
    {
        foreach ($answers as $key => $value) {
            if ($question = $questions->firstWhere('key', $key)) {
                $application->answers()->updateOrCreate(
                    ['question_id' => $question->id],
                    ['answer' => $value]
                );
            }
        }
    }

    public function destroy(Application $application)
    {
        $application->delete();
        return redirect()->route('applications.index')->with('success', 'Application deleted.');
    }
}
