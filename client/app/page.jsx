import { getClient } from './apollo/apollo-provider';
import { gql } from '@apollo/client';
import PoolList from './components/PoolList';

export const revalidate = 5;

const query = gql`
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
    const client = getClient();
    const { data } = await client.query({ query });
    const pools = data.pools;

    return (
        <div>
            <PoolList pools={pools} />
        </div>
    );
}
