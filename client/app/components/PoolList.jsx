'use client';
import Pool from './Pool';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr';
import { useState } from 'react';
import sortByNetGoals from '../utils/sort';

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

export default function PoolList() {
    const { data, loading, error } = useQuery(POOL_QUERY);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    // maybe sort the data here? before sending it down?

    if (data) {
        const pools = data.pools;

        return (
            <div>
                {pools.map((pool) => {
                    return <Pool key={pool.id} pool={pool} />;
                })}
            </div>
        );
    }
}
