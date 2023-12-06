
let API_URL;

if (process.env.NODE_ENV === 'development') {
    API_URL = 'localhost:8080';
} else if (process.env.NODE_ENV === 'production') {
    API_URL = 'api-production-9332.up.railway.app';
}

const API_URL_STRING = `http://${API_URL}/graphql`;
const WS_URL_STRING = `ws://${API_URL}/graphql`;

export { API_URL_STRING, WS_URL_STRING };
