/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@logtail/pino', 'pino'],
    },
    env: {
        GQL_SERVER: 'http://localhost:8080/graphql',
        BETTERSTACK_TOKEN_CLIENT: 'psgFFB17v9xfYhUYw7EKGGzt',
    },
};

module.exports = nextConfig;