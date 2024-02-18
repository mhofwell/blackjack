import DataBanner from '../components/DataBanner';
import PoolFrame from './PoolFrame';

export default async function Dashboard() {
    return (
        <>
            <section className="-mt-32">
                <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 ">
                    <div className="rounded-lg bg-white dark:bg-gray-900 px-5 py-6 shadow sm:px-6">
                        <DataBanner />
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8 ">
                    <div className="rounded-lg bg-white dark:bg-gray-900 px-5 py-6 shadow sm:px-6">
                        <PoolFrame />
                    </div>
                </div>
            </section>
        </>
    );
}
