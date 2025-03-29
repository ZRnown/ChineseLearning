/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gray: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: '#333',
                        a: {
                            color: '#3182ce',
                            '&:hover': {
                                color: '#2c5282',
                            },
                        },
                    },
                },
                dark: {
                    css: {
                        color: '#fff',
                        a: {
                            color: '#63b3ed',
                            '&:hover': {
                                color: '#90cdf4',
                            },
                        },
                        h1: { color: '#fff' },
                        h2: { color: '#fff' },
                        h3: { color: '#fff' },
                        h4: { color: '#fff' },
                        h5: { color: '#fff' },
                        h6: { color: '#fff' },
                        strong: { color: '#fff' },
                        code: { color: '#fff' },
                        blockquote: {
                            color: '#fff',
                            borderLeftColor: '#4a5568',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};