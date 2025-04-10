import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Clock, FileSearch, Hourglass, Pencil } from 'lucide-react';

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
                            {applications.map((app) => (
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
                                        {(auth.user?.is_admin || app.status === 'Needs Update') && (
                                            <Link
                                                href={route('applications.edit', app.id)}
                                                className="inline-block rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                                            >
                                                Edit
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this application?')) {
                                                    router.delete(route('applications.destroy', app.id));
                                                }
                                            }}
                                            className="inline-block rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
