/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@logtail/pino', 'pino'],
    },
    env: {
        API_PUBLIC_URL: 'api-production-9332.up.railway.app',
        API_PATH: '/graphql',
        API_URL: `http://localhost:8080/graphql`,
        WS_URL: `ws://localhost:8080/graphql`,
        BETTERSTACK_TOKEN_CLIENT: 'psgFFB17v9xfYhUYw7EKGGzt',
    },
};
module.exports = nextConfig;
