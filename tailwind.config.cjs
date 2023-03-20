/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts}"],
    theme: {
        extend: {
            colors: {
                gray: {
                    800: "#27272A",
                    900: "#18181B",
                },
            },
        },
    },
    plugins: [],
};
