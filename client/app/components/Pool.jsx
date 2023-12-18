'use client';
import Entry from './Entry';
import Card from './Card';
import { useState, useEffect } from 'react';
import { gql, useSubscription } from '@apollo/client';
import sortByNetGoals from '../utils/sort.js';

export const revalidate = 5;

const POOL_SUBSCRIPTION = gql`
    subscription Subscription {
        poolUpdated {
            id
            league
            name
            region
            season
            owner {
                id
                fn
                ln
                avatar
            }
            entries {
                id
                goals
                own_goals
                net_goals
                standing
                user {
                    id
                    fn
                    ln
                }
                players {
                    avatar
                    id
                    fn
                    ln
                    goals
                    own_goals
                    net_goals
                }
            }
        }
    }
`;

export default function Pool({ pool, logger }) {
    const [poolState, setPoolState] = useState(pool);

    const { data } = useSubscription(POOL_SUBSCRIPTION);

    poolState.entries.sort(sortByNetGoals);

    useEffect(() => {
        if (data) {
            data.poolUpdated.id === poolState.id
                ? setPoolState(data.poolUpdated)
                : null;
        }
    }, [data]);

    return (
        <div>
            <div
                className="grid grid-cols-6 gap-4 h-30 bg-platinum py-4"
                key={pool.id}
            >
                <div className="grid items-center justify-center">
                    <div>Pool: </div>
                    <div>{pool.name}</div>
                </div>
                <div className="grid items-center justify-center">
                    <div>Season: </div>
                    <div>{pool.season}</div>
                </div>
                <div className="flex flex-row items-center justify-center"></div>
                <div className="grid items-center justify-center">
                    <div>League: </div>
                    <div>{pool.league}</div>
                </div>
                <div className="grid items-center justify-center">
                    <div>Region: </div>
                    <div>{pool.region}</div>
                </div>
                <div className="grid items-center justify-center">
                    <div>Owner: </div>
                    <div>{pool.owner.fn}</div>
                </div>
            </div>
            <div>
                <ul role="list" className="divide-y divide-gray-100">
                    {poolState.entries.map((entry, i) => {
                        return (
                            <Card key={i}>
                                <Entry
                                    key={entry.id}
                                    entry={entry}
                                    logger={logger}
                                />
                            </Card>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
