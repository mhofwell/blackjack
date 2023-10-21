'use client';
import Entry from './Entry';
import Card from './Card';
import sortByNetGoals from '../utils/sort';
import { useState, useEffect } from 'react';

export default function Pool({ pool }) {
    // const [standings, setStandings] = useState(pool);
    // // try messing with state to solve this!

    // useEffect(() => {
    //     setStandings(pool.entries.sort(sortByNetGoals));
    // }, [pool]);
    // const pools = [...data.pools];
    // pools[0] = 'abc';

    const a = pool.entries.sort(sortByNetGoals);

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
                    {pool.entries.sort(sortByNetGoals).map((entry, i) => {
                        return (
                            <Card key={i}>
                                <Entry key={entry.id} entry={entry} i={i} />
                            </Card>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

// use Prisma to return the entries already sorted by net_goals!!!!
// Here is your error long standing is you can't edit read only shit.
