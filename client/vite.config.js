import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000, // Change if needed
    },
    build: {
        outDir: "dist", // Match CRA output folder
    }
});
