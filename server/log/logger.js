import pino from 'pino';
import 'dotenv/config';

const transport = pino.transport({
    targets: [
        {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
        {
            target: 'pino/file',
            options: { destination: `./log/app.log` },
        },
        {
            target: '@logtail/pino',
            options: {
                sourceToken: process.env.BETTERSTACK_TOKEN,
                colorize: true,
            },
        },
    ],
});

// const logger = pino(transport);

// Create a logging instance
const logger = pino(
    {
        level: process.env.PINO_LOG_LEVEL || 'info',
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport
);

export default logger;
