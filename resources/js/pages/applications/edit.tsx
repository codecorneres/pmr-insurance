import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Application, BreadcrumbItem, PageProps, Question } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

interface EditApplicationProps extends PageProps {
    questions: Question[];
    application: Application;
}

export default function EditApplication({ questions, application }: EditApplicationProps) {
    const { auth } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Applications', href: route('applications.index') },
        { title: application.name, href: route('applications.show', application.id) },
        { title: 'Edit', href: route('applications.edit', application.id) },
    ];

    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: application.name || '',
        email: application.email || '',
        status: application.status || 'Pending',
        answers: application.answers || {},
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('applications.update', application.id));
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
            <Head title={`Edit Application - ${application.name}`} />
            <div className="mx-auto w-full max-w-4xl px-4 py-10">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Application</h2>

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
                                    value={data.answers[question.key] || ''}
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
                                    value={data.answers[question.key] || ''}
                                    onChange={(e) => updateAnswer(question.key, e.target.value)}
                                />
                            ) : (
                                <Input
                                    id={question.key}
                                    type={question.type}
                                    value={data.answers[question.key] || ''}
                                    onChange={(e) => updateAnswer(question.key, e.target.value)}
                                />
                            )}

                            {(errors as any)[`answers.${question.key}`] && (
                                <p className="text-sm text-red-500">{(errors as any)[`answers.${question.key}`]}</p>
                            )}
                        </div>
                    ))}

                    <div>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Saving...' : 'Update Application'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
