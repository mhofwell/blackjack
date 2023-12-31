import pino from 'pino';
import 'dotenv/config';
import logLevelData from './log-level.js';

const logLevels = new Map(Object.entries(logLevelData));

function getLogLevel(logger) {
    return logLevels.get(logger) || logLevels.get('*') || 'info';
}

const getLogger = (name) => {
    let token;
    switch (name) {
        case 'api':
            token = process.env.BETTERSTACK_TOKEN_API;
            break;
        case 'express':
            token = process.env.BETTERSTACK_TOKEN_EXPRESS;
            break;
        case 'worker':
            token = process.env.BETTERSTACK_TOKEN_WORKER;
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

export default getLogger;
