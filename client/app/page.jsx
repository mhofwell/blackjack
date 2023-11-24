import PoolList from './components/PoolList';
import { gql } from '@apollo/client';
import { getClient } from './apollo/client';
import getLogger from './logger/logger.js';

export const revalidate = 1;

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
    let pools;

    const { data, error, loading } = await getClient().query({
        query: POOL_QUERY,
    });

    if (error || !data) {
        pools = [];
        console.error('POOL_QUERY failed.', error);
    }

    if (data) {
        console.log('POOL_QUERY executed successfully.');
        pools = data.pools;
    }

    logger.error({ error: error }, 'error!');

    return (
        <main>
            {loading ? (
                <p>Loading</p>
            ) : error ? (
                <p>Something happened!</p>
            ) : data ? (
                <p>You've got mail!</p>
            ) : (
                <p>No</p>
            )}
            <PoolList pools={pools} />
        </main>
    );
}
