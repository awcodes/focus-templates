import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
    // Focus serves the build from its own origin, so pages keep Astro's default `{name}/index.html` layout.
    build: {
        format: 'directory',
    },
    vite: {
        plugins: [tailwindcss()],
    },
});
