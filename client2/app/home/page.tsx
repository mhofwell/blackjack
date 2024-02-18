import Dashboard from '../../components/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dasbhoard',
};

export default async function Home() {
    return (
        <div className="h-screen">
            <Dashboard />
        </div>
    );
}
