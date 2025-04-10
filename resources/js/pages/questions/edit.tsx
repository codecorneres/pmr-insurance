import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import QuestionForm from './form';

type EditQuestionProps = {
    question: {
        id: number;
        label: string;
        key: string;
        type: string;
        options: string;
        is_required: boolean;
    };
};

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with dash
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

const EditQuestion = ({ question }: EditQuestionProps) => {
    const { data, setData, put, processing, errors } = useForm({
        label: question.label || '',
        key: question.key || '',
        type: question.type || 'text',
        options: question.options || '',
        is_required: question.is_required || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('questions.update', question.id));
    };

    const handleLabelChange = (value: string) => {
        setData('label', value);
        setData('key', slugify(value));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Questions',
            href: route('questions.index'),
        },
        {
            title: 'Edit',
            href: route('questions.edit', question.id),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Question" />
            <div className="mx-auto w-full max-w-3xl px-4 py-10">
                <QuestionForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    onLabelChange={handleLabelChange}
                />
            </div>
        </AppLayout>
    );
};

export default EditQuestion;
