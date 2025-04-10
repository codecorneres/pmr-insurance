import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

type Props = {
    data: {
        label: string;
        key: string;
        type: string;
        options: string;
        is_required: boolean;
    };
    setData: (field: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onLabelChange: (value: string) => void;
};

const QuestionForm: React.FC<Props> = ({ data, setData, errors, processing, onSubmit, onLabelChange }) => {
    const isEdit = !!data.key;

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Question' : 'Add Question'}</h2>

            <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input id="label" value={data.label} onChange={(e) => onLabelChange(e.target.value)} className="w-full" />
                {errors.label && <p className="text-sm text-red-500">{errors.label}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="key">Slug</Label>
                <Input id="key" value={data.key} disabled className="w-full cursor-not-allowed bg-gray-100 dark:bg-gray-800" />
                {errors.key && <p className="text-sm text-red-500">{errors.key}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                    id="type"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                </select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>

            {data.type === 'select' && (
                <div className="space-y-2">
                    <Label htmlFor="options">Options (comma separated)</Label>
                    <Textarea id="options" value={data.options} onChange={(e) => setData('options', e.target.value)} className="w-full" />
                    {errors.options && <p className="text-sm text-red-500">{errors.options}</p>}
                </div>
            )}

            <div className="flex items-center space-x-2">
                <input
                    id="is_required"
                    type="checkbox"
                    checked={data.is_required}
                    onChange={(e) => setData('is_required', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="is_required" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Is Required
                </Label>
            </div>

            <div>
                <Button type="submit" disabled={processing} className="w-full">
                    {processing ? (isEdit ? 'Updating...' : 'Submitting...') : isEdit ? 'Update Question' : 'Create Question'}
                </Button>
            </div>
        </form>
    );
};

export default QuestionForm;
