import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import QuestionForm from './form';

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
        title: 'Create',
        href: route('questions.create'),
    },
];

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with dash
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

const CreateQuestion = () => {
    const { data, setData, post, processing, errors } = useForm({
        label: '',
        key: '',
        type: 'text',
        options: '',
        is_required: false,
    });

    const handleLabelChange = (value: string) => {
        setData('label', value);
        setData('key', slugify(value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('questions.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Question" />
            <div className="mx-auto w-full max-w-3xl px-4 py-10">
                <QuestionForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    onLabelChange={handleLabelChange} // pass custom handler
                />
            </div>
        </AppLayout>
    );
};

export default CreateQuestion;
