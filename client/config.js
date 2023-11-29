// const API_HOST = process.env.API_HOST
const API_PORT = process.env.API_PORT;
// const WS_HOST = $WS_HOST A
const WS_PORT = process.env.WS_PORT;
const API_URL = process.env.API_URL_PUBLIC;

const API_URL_STRING = `http://${API_URL}:${API_PORT}/graphql`;
const WS_URL_STRING = `ws://${API_URL}:${WS_PORT}/graphql`;

export { API_URL_STRING, WS_URL_STRING };
