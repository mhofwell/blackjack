const API_URL = require('../../config.js');

const fetchGQL = async (query, variables) => {
    try {
        const res = await fetch(API_URL, {
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
        console.error(err);
    }
};

module.exports = fetchGQL;
