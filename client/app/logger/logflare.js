import pino from 'pino';

// create pino-logflare console stream for serverless functions and send function for browser logs
// Browser logs are going to: https://logflare.app/sources/13989
// Vercel log drain was setup to send logs here: https://logflare.app/sources/13830

// create pino-logflare stream
const stream = createWriteStream({
    apiKey: process.env.LOGFLARE_ACCESS_TOKEN,
    sourceToken: '760d1860-417f-4527-aa4e-a664b1d6fe37',
});

// create pino-logflare browser stream
const send = createPinoBrowserSend({
    apiKey: process.env.LOGFLARE_ACCESS_TOKEN,
    sourceToken: '760d1860-417f-4527-aa4e-a664b1d6fe37',
});

// create pino logger
const logger = pino(
    {
        browser: {
            transmit: {
                level: 'debug',
                send: send,
            },
        },
        level: 'debug',
        base: {
            env: process.env.NODE_ENV,
            revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
        },
    },
    stream
);

export default logger;
