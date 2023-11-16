import getLogger from '../logging/logger.js';
import fetchGQL from './graphql/fetch.js';

const logger = getLogger('express');

async function healthcheck() {
    
    logger.info('Checking seed health.');

    const q = `query Pools {
                    pools {
                    id
                    }
                }`;

    const data = await fetchGQL(q);

    if (data.pools.length > 0) {
        logger.info('Success! Database ready.');
        return data; 
        process.exit(0);
    } else {
        logger.warn('Cannot connect to database on start.');
        process.exit(1);
    }
}

healthcheck();

