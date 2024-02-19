import PoolList from './components/PoolList';
import { gql } from '@apollo/client';
import { getClient } from './apollo/client.js';
import getLogger from './logger/logger.js';

const logger = getLogger('client');

// export const revalidate = 5;
export const dynamic = 'force-dynamic';

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
                rank
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
    const { data, loading, error } = await getClient().query({
        query: POOL_QUERY,
        // context: {
        //     fetchOptions: {
        //         next: { revalidate: 5 },
        //     },
        // },
    });

    let pools;

    if (data.pools) {
        logger.info('Pool data received.');
        pools = data.pools;
    } else {
        logger.warn('Could not reach server.');
        pools = [];
    }

    return (
        <main>
            {data.pools ? (
                <PoolList pools={pools} />
            ) : loading ? (
                <h2>Loading...</h2>
            ) : error ? (
                <h2>Error</h2>
            ) : (
                <h2>Cannot discover API.</h2>
            )}
        </main>
    );
}
