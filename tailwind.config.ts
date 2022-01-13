import { defineConfig } from 'windicss/helpers'

export default defineConfig({
    attributify: true,
    darkMode: 'media',
    content: ['./index.html', './src/**/*.{js,ts,svelte}'],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: '#fff',
                    dark: '#323233'
                }
            }
        }
    },
    plugins: []
})
