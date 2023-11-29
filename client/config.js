const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 8080;
const WS_HOST = process.env.WS_HOST || 'localhost';
const WS_PORT = process.env.WS_PORT || 8080;

const API_URL = `http://${API_HOST}:${API_PORT}/graphql`;
const WS_URL = `ws://${WS_HOST}:${WS_PORT}/graphql`;

export { API_URL, WS_URL };
