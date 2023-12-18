import Pool from './Pool';
// import { useEffect, useState } from 'react';

export default function PoolList({ pools, logger }) {
    // const [pools, setPools] = useState(pools);

    // useEffect(() => {
    //     setPools(pools);
    // }, [pools]);

    return (
        <div>
            {pools.map((pool) => {
                return <Pool key={pool.id} pool={pool} />;
            })}
        </div>
    );
}
