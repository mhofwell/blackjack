let API_URL;

if (process.env.NODE_ENV === 'development') {
    API_URL = 'localhost:8080';
} else if (process.env.NODE_ENV === 'build') {
    API_URL = process.env.API_PUBLIC_URL;
} else if (process.env.NODE_ENG === 'production') {
    API_URL = process.env.API_PRIVATE_URL;
}

const API_URL_STRING = `http://${API_URL}/graphql`;
const WS_URL_STRING = `ws://${API_URL}/graphql`;

export { API_URL_STRING, WS_URL_STRING };
