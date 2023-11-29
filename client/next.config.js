/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@logtail/pino', 'pino'],
    },
    env: {
        API_URL_PUBLIC: `api-production-1846.up.railway.app`,
        API_PORT: '8080',
        WS_PORT: '8080',
        API_PATH: '/graphql',
    },
};

module.exports = nextConfig;
