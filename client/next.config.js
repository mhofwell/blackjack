/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@logtail/pino', 'pino'],
    },
    env: {
        // API_HOST_DEV: 'localhost',
        // API_PORT_DEV: '8080',
        // WS_HOST_DEV: 'localhost',
        // WS_PORT_DEV: '8080',
        BETTERSTACK_TOKEN_CLIENT: 'psgFFB17v9xfYhUYw7EKGGzt',
    },
};

module.exports = nextConfig;
