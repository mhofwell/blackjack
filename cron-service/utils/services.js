const client = require('./redis/client.js');
const getLogger = require('../logging/logger.js');

const logger = getLogger('cron_service');

const pingEpl = async () => {
    try {
        const res = await fetch(
            'https://fantasy.premierleague.com/api/bootstrap-static'
        );
        const data = await res.json();
        const payload = {
            data: data,
            status: res.status,
        };
        logger.info(`EPL API status ${payload.status}.`);
    } catch (err) {
        logger.warn(
            { error: err },
            `Something went wrong connecting to the EPL API`
        );
    }
};

const pingRedis = async () => {
    try {
        await client.connect();
        const res = await client.ping();
        logger.info(`Redis connected! ${res}`);
    } catch (err) {
        logger.warn({ error: err }, 'Redis failed to connect.');
    }
    client.quit();
};

module.exports = { pingEpl, pingRedis };
