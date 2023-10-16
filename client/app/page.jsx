import Link from 'next/link';
import Card from './components/Card';
import Button from './components/Button';
import Entry from './components/Entry';

export default function Home() {
    return (
        <main>
            {/* <Pool />÷\ */}
            <div>
                <h2>Pool Standings - Canada</h2>
                <Card>
                    <Entry />
                </Card>
                <Card className="card">
                    <Entry />
                </Card>
            </div>
            <div>
                {/* <Pool />÷\ */}
                <h2>Pool Standings - UK</h2>
                <Card>
                    <Entry />
                </Card>
                <Card className="card">
                    <Entry />
                </Card>
            </div>
        </main>
    );
}
