/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@logtail/pino', 'pino'],
    },
    env: {
        GQL_SERVER: 'http://express-api:8080/graphql',
        LOGFLARE_ACCESS_TOKEN: 'wmg0R5_uFwzq',
        BETTERSTACK_TOKEN_CLIENT: 'psgFFB17v9xfYhUYw7EKGGzt',
    },
};

module.exports = nextConfig;