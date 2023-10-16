/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // you can call this! as "text-primary" as in the text will be "primary" color
                platinum: '#E5E5E5',
                orange: '#FCA311',
                wwhite: '#FFFFF',
                oxford_blue: '#14213D',
                bblack: '#00000',
            },
        },
    },
    plugins: [],
};
