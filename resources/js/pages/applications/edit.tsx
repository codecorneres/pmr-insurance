import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Application, BreadcrumbItem, PageProps, Question } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CalendarClock, User } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface EditApplicationProps extends PageProps {
    questions: Question[];
    application: Application;
}

type CommentCreatedEvent = {
    comment: {
        id: number;
        body: string;
        created_at: string;
        user: {
            id: number;
            name: string;
            role: string;
        };
    };
};

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
        status: application.status || 'Submitted',
        answers: application.answers || {},
    });

    useEffect(() => {
        if (!application?.id) return;

        const channel = window.Echo.channel('comments');
        channel.listen('.comment.created', (event: CommentCreatedEvent) => {
            if (auth.user.id === event.comment.user.id) return;
            toast.success(`New comment posted by ${event.comment.user.name}`);
            router.reload({ only: ['application'] });
        });

        return () => {
            window.Echo.leave('comments');
        };
    }, [application?.id]);

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

    const commentForm = useForm({
        body: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Application - ${application.name}`} />

            <div className="max-w-8xl mx-auto grid w-full gap-6 px-4 py-10 md:grid-cols-4">
                {/* Left: Existing Comments */}

                <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-1 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comments</h3>
                    <div className="space-y-4">
                        {application.comments?.length ? (
                            application.comments.map((comment, index) => (
                                <div key={index} className="border-muted bg-background rounded-xl border p-4 shadow-sm dark:border-gray-700">
                                    <div className="text-muted-foreground mb-2 flex items-center gap-1 text-xs">
                                        <CalendarClock className="h-4 w-4" />
                                        {new Date(comment.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short',
                                        })}
                                    </div>
                                    <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                            <div className="text-foreground flex items-center gap-1 text-sm font-medium">
                                                <User className="h-4 w-4" />
                                                {comment.user.name}
                                            </div>
                                            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                                {comment.user.role}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">{comment.body}</p>
                                </div>
                            ))
                        ) : (
                            <div className="border-muted bg-background text-muted-foreground flex flex-col items-center justify-center gap-2 rounded-xl border p-6 text-center shadow-sm dark:border-gray-700">
                                <User className="h-6 w-6 opacity-50" />
                                <p className="text-sm font-medium">No comments yet</p>
                                <p className="text-xs">Reviewers and admins can leave comments here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center: Application Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm md:col-span-2 dark:border-gray-800 dark:bg-gray-900"
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

                    {/* Status */}
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

                {/* Right: Add Comment */}
                {!auth.user?.is_user && (
                    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-1 dark:border-gray-800 dark:bg-gray-900">
                        <Label htmlFor="comment">Add Comment</Label>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                commentForm.post(route('comments.store', application.id), {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        commentForm.reset();
                                        toast.success('Comment added');
                                        router.reload({ only: ['application'] });
                                    },
                                    onError: () => {
                                        toast.error('Failed to post comment');
                                    },
                                });
                            }}
                            className="space-y-2"
                        >
                            <Textarea
                                id="comment"
                                name="body"
                                placeholder="Write your comment..."
                                className="min-h-[150px]"
                                value={commentForm.data.body}
                                onChange={(e) => commentForm.setData('body', e.target.value)}
                            />
                            {commentForm.errors.body && <p className="text-sm text-red-500">{commentForm.errors.body}</p>}
                            <Button type="submit" disabled={commentForm.processing} className="w-full">
                                {commentForm.processing ? 'Saving...' : 'Add Comment'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
