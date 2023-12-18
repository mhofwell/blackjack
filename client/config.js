let API_URL, WS_URL;

if (process.env.NODE_ENV === 'development') {
    API_URL = process.env.API_URL;
    WS_URL = process.env.WS_URL;
} else if (process.env.NODE_ENV === 'production') {
    API_BASE = process.env.API_PUBLIC_URL;
    API_URL = `https://${API_BASE}/graphql`;
    WS_URL = `wss://${API_BASE}/graphql`;
}

export { API_URL, WS_URL };
