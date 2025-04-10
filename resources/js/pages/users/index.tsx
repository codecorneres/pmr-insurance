import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
    {
        title: 'Users',
        href: route('users.index'),
    },
];

type AppUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
};

interface Props {
    auth: {
        user: User;
    };
    users: AppUser[];
}

export default function Users({ auth, users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="p-6">
                <h2 className="mb-4 text-2xl font-semibold">Users</h2>

                <div className="rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                user.role === 'Admin'
                                                    ? 'bg-red-100 text-red-800'
                                                    : user.role === 'Reviewer'
                                                      ? 'bg-blue-100 text-blue-800'
                                                      : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
