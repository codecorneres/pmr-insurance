import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Question, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Questions',
        href: route('questions.index'),
    },
];

interface Props {
    auth: {
        user: User;
    };
    questions: Question[];
}

export default function Questions({ auth, questions }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Questions" />

            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Insurance Questions</h2>

                    <Link href={route('questions.create')} className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + New Question
                    </Link>
                </div>

                <div className="rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>

                                <TableHead>Required</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No questions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questions.map((question) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="font-medium">{question.label}</TableCell>

                                        <TableCell>
                                            {question.is_required ? (
                                                <span className="font-semibold text-green-600 dark:text-green-400">Yes</span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">No</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Link
                                                href={route('questions.edit', question.id)}
                                                className="inline-block rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this question?')) {
                                                        router.delete(route('questions.destroy', question.id));
                                                    }
                                                }}
                                                className="inline-block rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
