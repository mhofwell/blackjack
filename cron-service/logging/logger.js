const pino = require('pino');
const logLevelData = require('./log-level.js');

const logLevels = new Map(Object.entries(logLevelData));

function getLogLevel(logger) {
    return logLevels.get(logger) || logLevels.get('*') || 'info';
}

const getLogger = (name) => {
    let token;
    switch (name) {
        case 'cron-service':
            token = process.env.BETTERSTACK_TOKEN_CRON;
            break;
    }
    return pino(
        {
            name,
            level: getLogLevel(name),
        },
        pino.transport({
            targets: [
                {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                        translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
                    },
                    level: 'info',
                },
                // {
                //     target: '@logtail/pino',
                //     options: {
                //         sourceToken: token,
                //         colorize: true,
                //         translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
                //     },
                //     level: 'trace',
                // },
            ],
        })
    );
};

module.exports = getLogger;
