'use server';
import pino from 'pino';

// log set-up
import logLevelData from './log-level.js';

// import log levels in a map
const logLevels = new Map(Object.entries(logLevelData));

function getLogLevel(logger) {
    return logLevels.get(logger) || logLevels.get('*') || 'info';
}

const getLogger = (name) => {
    let token;
    switch (name) {
        case 'client':
            token = process.env.BETTERSTACK_TOKEN_CLIENT;
            break;
    }
    return pino(
        { name, level: getLogLevel(name) },
        pino.transport({
            targets: [
                {
                    target: 'pino-pretty',
                    options: {
                        colorize: true,
                    },
                    level: 'info',
                },
                {
                    target: '@logtail/pino',
                    options: {
                        sourceToken: token,
                        colorize: true,
                    },
                    level: 'trace',
                },
            ],
        })
    );
};

export default getLogger;
