/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        serverActions: true,
        serverComponentsExternalPackages: ['@logtail/pino', 'pino'],
    },
    env: {
        API_HOST: 'api.railway.internal',
        API_PORT: '8080',
        WS_HOST: 'api.railway.internal',
        WS_PORT: '8080',
        BETTERSTACK_TOKEN_CLIENT: 'psgFFB17v9xfYhUYw7EKGGzt',
    },
};


module.exports = nextConfig;
