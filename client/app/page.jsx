import PoolList from './components/PoolList';
import { gql } from '@apollo/client';
import { getClient } from './apollo/client';
import getLogger from './logger/logger.js';

// export const revalidate = 1;

const logger = getLogger('client');

const POOL_QUERY = gql`
    query Pools {
        pools {
            id
            name
            season
            league
            region
            owner {
                id
                fn
                ln
            }
            entries {
                id
                user {
                    id
                    fn
                    ln
                }
                standing
                goals
                net_goals
                own_goals
                players {
                    avatar
                    fn
                    ln
                    goals
                    net_goals
                    own_goals
                }
            }
        }
    }
`;

export default async function Home() {
    let pools = [];

    const { data, loading } = await getClient().query({
        query: POOL_QUERY,
        context: {
            fetchOptions: {
                next: { revalidate: 1 },
            },
        },
    });

    if (data.pools) {
        logger.info('Data:', data);
        pools = data.pools;
    } else {
        logger.info('Could not reach server.');
    }

    // if (errors || !data) {
    //     pools = [];
    //     console.error('POOL_QUERY failed.', errors);
    // }

    // if (data) {
    //     logger.info('POOL_QUERY executed successfully.');
    //     console.log('data', data);
    //     logger.info('POOL_QUERY executed successfully.');
    //     pools = data.pools;
    // }

    if (loading) return <span>loading...</span>;

    return (
        <main>
            {data ? <PoolList pools={pools} /> : <p>Something went wrong.</p>}
        </main>
    );
}
