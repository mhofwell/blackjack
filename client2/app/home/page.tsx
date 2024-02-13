import Dashboard from '../components/UI/Dashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dasbhoard',
};

export default function Home() {
    return (
        <div className="h-screen">
            <Dashboard />
        </div>
    );
}
