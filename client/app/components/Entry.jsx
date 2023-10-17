export default function Entry({ entry, i }) {
    const rank = i + 1;

    console.log(entry.user.fn);

    const name = `${entry.user.fn} ${entry.user.ln}`;
    const rankString = `Rank: ${rank}`

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
                        <div>Goals: {entry.goals}</div>
                    </div>
                    <div className="px-3 grid justify-items-center">
                        <div>Own Goals: {entry.own_goals}</div>
                    </div>
                    <div className="px-3 grid justify-items-center">
                        <div>Net Goals: {entry.net_goals}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
