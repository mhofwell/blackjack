import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
    // darkMode: 'class',
    theme: {
        extend: {
            backgroundImage: {},
        },
    },
    plugins: [require('@tailwindcss/forms'), require('autoprefixer')],
};

export default config;
