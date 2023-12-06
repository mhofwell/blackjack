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
    const { data, loading, error } = await getClient().query({
        query: POOL_QUERY,
        context: {
            fetchOptions: {
                next: { revalidate: 1 },
            },
        },
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
