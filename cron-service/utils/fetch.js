const { API_URL } = require('../config.js');

const getLogger = require('../logging/logger.js');
const logger = getLogger('express');

const fetchGQL = async (query, variables) => {
    try {
        const res = await fetch('http://localhost:8080/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables,
            }),
        });
        const obj = await res.json();
        return obj.data;
    } catch (err) {
        logger.error({ error: err }, 'GraphQL fetch failed.');
    }
};

module.exports = fetchGQL;
