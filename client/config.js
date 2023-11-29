const API_HOST = process.env.API_HOST || process.env.API_HOST_DEV;
const API_PORT = process.env.API_PORT || process.env.API_HOST_PORT;
const WS_HOST = process.env.WS_HOST || process.env.WS_HOST_DEV;
const WS_PORT = process.env.WS_PORT || process.env.WS_PORT_DEV;

const API_URL = `http://${API_HOST}:${API_PORT}/graphql`;
const WS_URL = `ws://${WS_HOST}:${WS_PORT}/graphql`;

export { API_URL, WS_URL };
