const API_PORT = process.env.API_PORT || '';
const WS_PORT = process.env.WS_PORT || '';
const API_URL = process.env.API_URL_PUBLIC || process.env.API_URL_PRIVATE;

const API_URL_STRING = `https://${API_URL}/graphql`;
const WS_URL_STRING = `ws://${API_URL}/graphql`;

export { API_URL_STRING, WS_URL_STRING };
