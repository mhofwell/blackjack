import { Badge } from './UI/badge';

const stats = [
    { name: 'Active Pools', value: '2' },
    { name: 'Treasury', value: '$330.25', unit: 'CAD' },
    { name: 'Total Players', value: '36', unit: 'OK' },
    { name: 'Eliminated', value: '3' },
];

export default async function Banner() {
    return (
        <div className="bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.name}
                            className="bg-gray-900 px-4 py-6 sm:px-6 lg:px-8"
                        >
                            <p className="text-sm font-medium leading-6 text-gray-400">
                                {stat.name}
                            </p>
                            <div className=" mt-2 flex gap-x-2">
                                <p>
                                    <span className="text-4xl font-semibold tracking-tight text-white">
                                        {stat.value}
                                    </span>
                                </p>
                                {stat.unit === 'OK' ? (
                                    <div className="py-[10px]">
                                        <Badge color="lime">All Paid</Badge>
                                    </div>
                                ) : stat.unit ? (
                                    <div className="py-4">
                                        <span className="text-sm text-gray-400">
                                            {stat.unit}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
