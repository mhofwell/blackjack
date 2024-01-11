const getLivePlayerData = async () => {
    try {
        // fetch gameweek players from EPL
        const res = await fetch(
            // event {gw} live. This gets players for the gameweek
            `https://fantasy.premierleague.com/api/event/${gameWeekId}/live`
        );

        if (parentPort) {
            parentPort.postMessage(
                `Fetched live data from the EPL API for gw ${gameWeekId}.`
            );
        } else {
            logger.info(
                `Fetched live player data from the EPL API for gameweek ${gameWeekId}.`
            );
        }

        const data = await res.json();
        // const data = testData;

        if (data.elements[0] === null) {
            if (parentPort) {
                parentPort.postMessage(
                    `Gameweek ${gameWeekId} has not started yet!`
                );
                parentPort.postMessage('done');
                process.exit(0);
            } else {
                logger.warn(`Gameweek ${gameWeekId} has not started yet!`);
                process.exit(0);
            }
        }
    } catch (err) {}
};

module.exports = getLivePlayerData;
