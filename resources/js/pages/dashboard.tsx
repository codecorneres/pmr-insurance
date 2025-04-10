import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { LucideClock, LucideFileText, LucideUser } from 'lucide-react';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Dummy stats
const stats = [
    {
        title: 'Total Applications',
        count: 128,
        icon: <LucideFileText className="h-6 w-6 text-blue-500" />,
        color: 'bg-blue-100 text-blue-800',
    },
    {
        title: 'Pending Applications',
        count: 37,
        icon: <LucideClock className="h-6 w-6 text-yellow-500" />,
        color: 'bg-yellow-100 text-yellow-800',
    },
    {
        title: 'Total Users',
        count: 54,
        icon: <LucideUser className="h-6 w-6 text-green-500" />,
        color: 'bg-green-100 text-green-800',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="border-border bg-card relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                        >
                            <div>
                                <p className="text-muted-foreground text-sm">{stat.title}</p>
                                <h3 className="text-3xl font-semibold">{stat.count}</h3>
                            </div>
                            <div className={`flex items-center justify-center rounded-full p-3 ${stat.color}`}>{stat.icon}</div>
                        </div>
                    ))}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    {/* You can add recent activity / charts / latest applications here */}
                    <div className="text-muted-foreground p-6 text-center">Coming soon...</div>
                </div>
            </div>
        </AppLayout>
    );
}
