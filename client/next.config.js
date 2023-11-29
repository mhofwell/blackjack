/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@logtail/pino', 'pino'],
    },
    env: {
        API_URL_PUBLIC: $API_PUBLIC_URL,
        API_PORT: '8080',
        WS_PORT: '8080',
        API_PATH: '/graphql',
        API_URL: $API_PRIVATE_URL,
    },
};

module.exports = nextConfig;
