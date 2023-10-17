import Entry from './Entry';
import Card from './Card';
import sortByNetGoals from '../utils/sort';
import PlayerTable from './PlayerTable';

export default async function Pool({ pool }) {
    const entries = [...pool.entries];
    const standings = entries.sort(sortByNetGoals);

    console.log(standings);

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
                    {standings.map((entry, i) => {
                        return (
                            <Card>
                                <Entry entry={entry} i={i} />
                                <PlayerTable players={entry.players} />
                            </Card>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
