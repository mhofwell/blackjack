import Link from 'next/link';
import Button from './Button';

export default function Entry({ fn, ln, goals, own_goals, net_goals }) {
    const rank = 1;
    fn = 'Michael';
    ln = 'Hofweller';
    const name = `${fn} ${ln}`;
    goals = 0;
    own_goals = 0;
    net_goals = 0;

    return (
        <div className="grid grid-cols-4 gap-4 h-30 bg-wwhite">
            <div className="flex flex-row items-center justify-start ">
                <div className="px-2">
                    <div>{rank}</div>
                </div>
                <div className="px-2">
                    <div>{name}</div>
                </div>
            </div>
            <div className="col-span-2 flex justify-center px-4">
                <div className="px-3 grid justify-items-center">
                    <div>Goals</div>
                    <div>{goals}</div>
                </div>
                <div className="px-3 grid justify-items-center">
                    <div>Own Goals</div>
                    <div>{own_goals}</div>
                </div>
                <div className="px-3 grid justify-items-center">
                    <div>Net Goals</div>
                    <div>{net_goals}</div>
                </div>
            </div>
            <div className="flex flex-row items-center justify-end">
                <Link href="/entry">
                    <Button>View Entry</Button>
                </Link>
            </div>
        </div>
    );
}
