/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                // Preserving any potential existing custom colors if they were defined, 
                // though none were visible in the file list context.
                // 'slate' is a default tailwind color, so no need to define unless overriding.
            }
        },
    },
    plugins: [],
}
