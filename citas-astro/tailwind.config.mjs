/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            colors: {
                background: '#F9F9F7', // Alabastro
                surface: '#FFFFFF',    // Blanco Papel
                primary: '#1C1917',    // Carbón
                secondary: '#57534E',  // Grafito
                accent: '#EA580C',     // Naranja Internacional
                technical: '#0E7490',  // Azul Cianotipo
                border: '#E7E5E4',     // Trazo Lápiz
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'brutal': '3px 3px 0px 0px rgba(28, 25, 23, 1)', // Sombra dura, sin desenfoque
            }
        },
    },
    plugins: [],
}
