let API_URL, WS_URL;

if (process.env.NODE_ENV === 'development') {
    API_URL = process.env.API_URL;
    WS_URL = process.env.WS_URL;
} else if (process.env.NODE_ENV === 'production') {
    API_URL = `https://${process.env.API_PUBLIC_URL}/graphql`;
    WS_URL = `wss://${API_URL}/graphql`;
}

export { API_URL, WS_URL };
