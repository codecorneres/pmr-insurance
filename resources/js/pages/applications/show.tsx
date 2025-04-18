// show.tsx

import CommentItem from '@/components/ui/CommentItem';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Application, BreadcrumbItem, PageProps, Question } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { User } from 'lucide-react';

interface ShowApplicationProps extends PageProps {
    questions: Question[];
    application: Application;
}

export default function ShowApplication({ questions, application }: ShowApplicationProps) {
    const { auth } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Applications', href: route('applications.index') },
        { title: application.name, href: route('applications.show', application.id) },
    ];

    const commentForm = useForm({
        body: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`View Application - ${application.name}`} />

            <div className="max-w-8xl mx-auto grid w-full gap-6 px-4 py-10 md:grid-cols-4">
                {/* Left: Existing Comments */}
                <div className="space-y-4 rounded-xl border p-6 md:col-span-1 dark:border-gray-800 dark:bg-gray-900">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <div className="space-y-4">
                        {application.comments?.length ? (
                            application.comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    currentUser={auth.user}
                                    applicationId={application.id}
                                    canModify={false}
                                />
                            ))
                        ) : (
                            <div className="text-muted-foreground text-center">
                                <User className="mx-auto mb-2 h-6 w-6 opacity-50" />
                                <p className="text-sm font-medium">No comments yet</p>
                                <p className="text-xs">Reviewers and admins can leave comments here.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center: Application Details */}
                <div className="space-y-8 rounded-xl border p-8 md:col-span-2 dark:border-gray-800 dark:bg-gray-900">
                    <h2 className="text-3xl font-bold">Application Details</h2>

                    <div className="space-y-2">
                        <Label>Name</Label>
                        <p className="text-sm">{application.name}</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <p className="text-sm">{application.email}</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <p className="text-sm">{application.status}</p>
                    </div>

                    {questions.map((question) => (
                        <div className="space-y-2" key={question.key}>
                            <Label>{question.label}</Label>
                            <p className="text-sm">{application.answers?.[question.key] || '-'}</p>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
