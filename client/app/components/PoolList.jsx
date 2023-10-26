import Pool from './Pool';
// import getLogger from '../logger/logger';

// const logger = getLogger('client');

export default function PoolList({ pools, logger }) {
    return (
        <div>
            {pools.map((pool) => {
                return <Pool key={pool.id} pool={pool} />;
            })}
        </div>
    );
}
