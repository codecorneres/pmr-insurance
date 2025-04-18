import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Clock, FileSearch, Hourglass, Pencil } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Applications',
        href: route('applications.index'),
    },
];

type Application = {
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
};

interface Props {
    auth: {
        user: User;
    };
    applications: Application[];
}

export default function Applications({ auth, applications }: Props) {
    const [appToDelete, setAppToDelete] = useState<Application | null>(null);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications" />

            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Applications</h2>

                    <Link href={route('applications.create')} className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + New Application
                    </Link>
                </div>

                <div className="rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                        No applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">{app.name}</TableCell>
                                        <TableCell>{app.email}</TableCell>
                                        <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                                                                app.status === 'Submitted'
                                                                    ? 'bg-gray-100 text-gray-800'
                                                                    : app.status === 'Under Review'
                                                                      ? 'bg-yellow-100 text-yellow-800'
                                                                      : app.status === 'Reviewed'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : app.status === 'Approved'
                                                                          ? 'bg-green-100 text-green-800'
                                                                          : app.status === 'Needs Update'
                                                                            ? 'bg-red-100 text-red-800'
                                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {app.status === 'Submitted' && <Clock size={14} />}
                                                            {app.status === 'Under Review' && <Hourglass size={14} />}
                                                            {app.status === 'Reviewed' && <FileSearch size={14} />}
                                                            {app.status === 'Approved' && <CheckCircle size={14} />}
                                                            {app.status === 'Needs Update' && <Pencil size={14} />}
                                                            {app.status}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {app.status === 'Submitted' && <p>Waiting for admin to review</p>}
                                                        {app.status === 'Under Review' && <p>Under review by reviewer</p>}
                                                        {app.status === 'Reviewed' && <p>Reviewed by reviewer</p>}
                                                        {app.status === 'Approved' && <p>Final approval granted</p>}
                                                        {app.status === 'Needs Update' && <p>Requires changes by applicant</p>}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell className="space-x-2 text-right">
                                            <Link
                                                href={route('applications.show', app.id)}
                                                className="inline-block rounded-md bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                                            >
                                                View
                                            </Link>
                                            {(auth.user?.is_admin ||
                                                app.status === 'Needs Update' ||
                                                (auth.user?.is_reviewer && app.status === 'Under Review')) && (
                                                <Link
                                                    href={route('applications.edit', app.id)}
                                                    className="inline-block rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {!auth.user?.is_reviewer && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button
                                                            onClick={() => setAppToDelete(app)}
                                                            className="inline-block cursor-pointer rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete the application <strong>{appToDelete?.name}</strong>.
                                                                This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => {
                                                                    if (appToDelete) {
                                                                        router.delete(route('applications.destroy', appToDelete.id));
                                                                        setAppToDelete(null);
                                                                    }
                                                                }}
                                                                className="bg-red-600 text-white hover:bg-red-700"
                                                            >
                                                                Yes, delete it
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
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
