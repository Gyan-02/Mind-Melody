/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'slide-in-right': {
                    '0%': {
                        transform: 'translateX(120%) scale(0.8)',
                        opacity: '0'
                    },
                    '50%': {
                        transform: 'translateX(-10px) scale(1.05)',
                        opacity: '1'
                    },
                    '70%': {
                        transform: 'translateX(5px) scale(0.98)'
                    },
                    '100%': {
                        transform: 'translateX(0) scale(1)',
                        opacity: '1'
                    },
                },
            },
            animation: {
                'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
        },
    },
    plugins: [],
}
