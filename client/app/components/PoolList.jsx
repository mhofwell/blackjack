import React from 'react';
import Pool from './Pool';

import { gql } from '@apollo/client';

const GET_POOLS = gql`
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

export default async function PoolList({ pools }) {
    return (
        <div>
            {pools.map((pool) => {
                return (
                   <Pool pool={pool} />
                );
            })}
        </div>
    );
}
