/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ink': {
                    50: '#f5f5f5',
                    100: '#e9e9e9',
                    200: '#d9d9d9',
                    300: '#c4c4c4',
                    400: '#9d9d9d',
                    500: '#7b7b7b',
                    600: '#555555',
                    700: '#434343',
                    800: '#262626',
                    900: '#171717',
                },
                'bamboo': {
                    50: '#f0f7f4',
                    100: '#dceee6',
                    200: '#b9ddd0',
                    300: '#8fc4b3',
                    400: '#65a694',
                    500: '#4a8b77',
                    600: '#3a6f5f',
                    700: '#31584c',
                    800: '#2a473f',
                    900: '#253b35',
                },
                'silk': {
                    50: '#fdf6f6',
                    100: '#fbe7e7',
                    200: '#f5d3d3',
                    300: '#efb5b5',
                    400: '#e58d8d',
                    500: '#d86464',
                    600: '#c43d3d',
                    700: '#a32d2d',
                    800: '#872828',
                    900: '#722525',
                },
            },
            fontFamily: {
                'serif': ['Noto Serif SC', 'serif'],
                'sans': ['Noto Sans SC', 'sans-serif'],
            },
            backgroundImage: {
                'paper-texture': "url('/textures/paper.png')",
                'ink-splash': "url('/textures/ink-splash.png')",
            },
            boxShadow: {
                'ink': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
} 