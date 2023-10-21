'use client';
import { gql } from '@apollo/client';
import PlayerTable from './PlayerTable';
import { useSubscription } from '@apollo/client';
import { useEffect, useState } from 'react';

const ENTRY_SUB = gql`
    subscription Subscription {
        entryUpdated {
            id
            goals
            net_goals
            own_goals
            players {
                id
                fn
                ln
                goals
                own_goals
                net_goals
            }
        }
    }
`;

export default function Entry({ entry, i, updateHandler }) {
    const [entryState, setEntryState] = useState(entry);

    const { data, loading, error } = useSubscription(ENTRY_SUB);

    useEffect(() => {
        if (data) {
            if (data.entryUpdated.id === entry.id) {
                setEntryState(data.entryUpdated);
                updateHandler();
                console.log('Made it');
            }
            console.log(`No update to ${entry.id}`);
        }
    }, [data]);

    const name = `${entry.user.fn} ${entry.user.ln}`;
    const rankString = `Rank: ${i + 1}`;

    return (
        <>
            <div className="grid grid-cols-6 gap-4 h-30 bg-orange py-4">
                <div className="flex flex-row items-center justify-center">
                    <div>{rankString}</div>
                </div>
                <div className="flex flex-row items-center justify-start col-start-2 col-span-2">
                    <div>{name}</div>
                </div>
                <div className="col-span-3 flex justify-center">
                    <div className="px-3 grid justify-items-center">
                        <div>Goals: {entryState.goals}</div>
                    </div>
                    <div className="px-3 grid justify-items-center">
                        <div>Own Goals: {entryState.own_goals}</div>
                    </div>
                    <div className="px-3 grid justify-items-center">
                        <div>Net Goals: {entryState.net_goals}</div>
                    </div>
                </div>
            </div>
            <PlayerTable players={entryState.players} />
        </>
    );
}
