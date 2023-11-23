import Pool from './Pool';

export default function PoolList({ pools, logger }) {

    
    return (
        <div>
            {pools.map((pool) => {
                return <Pool key={pool.id} pool={pool} />;
            })}
        </div>
    );
}
