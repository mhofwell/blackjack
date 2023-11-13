'use client';
import PlayerTable from './PlayerTable';
import { useEffect, useState } from 'react';

export default function Entry({ entry, logger }) {
    const [entryState, setEntryState] = useState(entry);
    const name = `${entryState.user.fn} ${entryState.user.ln}`;
    const rank = `Rank: ${entryState.standing}`;

    useEffect(() => {
        setEntryState(entry);
    }, [entry]);

    return (
        <>
            <div className="grid grid-cols-6 gap-4 h-30 bg-orange py-4">
                <div className="flex flex-row items-center justify-center">
                    <div>{rank}</div>
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
