module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'dark': 'var(--color-dark)',
                'light': 'var(--color-light)',
                'light-80': 'var(--color-light-80)',
            },
        },
    },
    plugins: [],
}