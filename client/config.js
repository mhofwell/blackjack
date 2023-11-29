const API_HOST = process.env.API_HOST 
const API_PORT = process.env.API_PORT 
const WS_HOST = process.env.WS_HOST
const WS_PORT = process.env.WS_PORT 

const API_URL = `${API_HOST}:${API_PORT}/graphql`;
const WS_URL = `${WS_HOST}:${WS_PORT}/graphql`;

export { API_URL, WS_URL };
