import { Index as ConfettiShower } from 'confetti-react';

export function Confetti({ id }: { id?: string | null }) {
    if (!id) return null;

    return (
        <>
            {() => (
                <ConfettiShower
                    key={id}
                    run={Boolean(id)}
                    recycle={false}
                    numberOfPieces={500}
                    width={window.innerWidth}
                    height={window.innerHeight}
                />
            )}
        </>
    );
}
