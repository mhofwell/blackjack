const fetchGQL = require('../../utils/fetch');

const getGameweekPlayers = async (kickoffTime, gameWeekId) => {
    if (parentPort) {
        parentPort.postMessage(`Worker starting...👷 `);
    } else {
        logger.info(`Worker starting...👷 `);
    }

    const queryData = {
        input: {
            kickoffTime,
            gameWeekId,
        },
    };

    const query = `query Query($input: getGameweekPlayers) {
        getGameweekPlayers(input: $input) {
          id
          goals
          own_goals
          net_goals
        }
      }`;

    const res = await fetchGQL(query, queryData);

    if (!res) {
        throw new Error('Could not fetch gameweek players from the database.');
    }

    const players = res;

    return players;
};

getGameweekPlayers();
