import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps, Question, User } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

interface CreateApplicationProps extends PageProps {
    questions: Question[];
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Applications', href: route('applications.index') },
    { title: 'Create', href: route('applications.create') },
];

export default function CreateApplication({ questions, users }: CreateApplicationProps) {
    const { auth } = usePage<PageProps>().props;
    const initialAnswers = useMemo(() => {
        return Object.fromEntries(questions.map((q) => [q.key, '']));
    }, [questions]);

    const { data, setData, post, processing, errors, clearErrors } = useForm({
        name: '',
        email: '',
        status: 'Submitted',
        answers: initialAnswers,
        assigned_user_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('applications.store'));
    };

    const updateField = (field: 'name' | 'email' | 'status', value: string) => {
        setData(field, value);
        clearErrors(field);
    };

    const updateAnswer = (key: string, value: string) => {
        setData('answers', {
            ...data.answers,
            [key]: value,
        });
        clearErrors(`answers.${key}` as any);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Application" />
            <div className="mx-auto w-full max-w-4xl px-4 py-10">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Insurance Application</h2>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => updateField('name', e.target.value)} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>

                    {/* Status (Admin only) */}
                    {auth.user?.is_admin && (
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) => updateField('status', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="Submitted">Submitted</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Approved">Approved</option>
                                <option value="Needs Update">Needs Update</option>
                            </select>
                        </div>
                    )}

                    {/* Dynamic Questions */}
                    {questions.map((question) => (
                        <div className="space-y-2" key={question.key}>
                            <Label htmlFor={question.key}>
                                {question.label}
                                {!!question.is_required && <span className="ml-1 text-red-500">*</span>}
                            </Label>

                            {question.type === 'select' ? (
                                <select
                                    id={question.key}
                                    value={data.answers[question.key]}
                                    onChange={(e) => updateAnswer(question.key, e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">Select...</option>
                                    {question.options?.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            ) : question.type === 'textarea' ? (
                                <Textarea
                                    id={question.key}
                                    value={data.answers[question.key]}
                                    onChange={(e) => updateAnswer(question.key, e.target.value)}
                                />
                            ) : (
                                <Input
                                    id={question.key}
                                    type={question.type}
                                    value={data.answers[question.key]}
                                    onChange={(e) => updateAnswer(question.key, e.target.value)}
                                />
                            )}

                            {(errors as any)[`answers.${question.key}`] && (
                                <p className="text-sm text-red-500">{(errors as any)[`answers.${question.key}`]}</p>
                            )}
                        </div>
                    ))}

                    {auth.user?.is_admin && (
                        <div className="space-y-2">
                            <Label htmlFor="assigned_user_id">Assign to User</Label>
                            <select
                                id="assigned_user_id"
                                value={data.assigned_user_id}
                                onChange={(e) => setData('assigned_user_id', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="">Select user...</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {errors.assigned_user_id && <p className="text-sm text-red-500">{errors.assigned_user_id}</p>}
                        </div>
                    )}

                    <div>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
