// express server
const express = require('express');

// middleware
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// test services
const { pingRedis, pingEpl } = require('./utils/services.js');




// logger
const getLogger = require('./logging/logger.js');

const logger = getLogger('cron_service');

// cron job entry point

const startGameweekUpdates = require('./jobs/main.js');

// constants
const { PORT, HOST } = require('./config.js');

// rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});

// Init the web server
const app = express();

const main = async () => {
    setTimeout(() => {
        pingEpl();
        pingRedis();
    }, 500);

    console.log(process.env.EPL_API_FUTURE);

    // Middleware for the express application.
    app.use(cors(), helmet(), limiter, bodyParser.json());

    // healthcheck
    app.get('/health', (req, res) => {
        res.status(200).send('Cron microservice is healthy.');
    });

    // http server start
    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Cron service is listening at: ${HOST}:${PORT}`);
    });

    setTimeout(() => {
        startGameweekUpdates();
    }, 2000);
};


main();
