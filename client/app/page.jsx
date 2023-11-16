import PoolList from './components/PoolList';
import { gql } from '@apollo/client';
import { getClient } from './apollo/client';
// import getLogger from './logger/logger.js';

export const revalidate = 1;

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

// const logger = getLogger('client');

export default async function Home() {
    const { data, error } = await getClient().query({ query: POOL_QUERY });
    
    if (error) {
        console.error('POOL_QUERY failed.', error);
    }
    if (data) {
        console.log('POOL_QUERY executed successfully.');
    }

    const pools = data.pools;

    return (
        <main>
            <PoolList pools={pools} />
        </main>
    );
}
