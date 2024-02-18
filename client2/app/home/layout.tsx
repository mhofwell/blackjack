import { redirect } from 'next/navigation';
import Navigation from './components/Navigation';
import { getSession } from '@/lib/auth/utils';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    let username: string = '';

    if (!session) {
        redirect('/login');
    } else {
        username = session.user.username;
    }

    return (
        <section>
            <Navigation username={username} />
            {children}
        </section>
    );
}

export const dynamic = 'force-dynamic';
