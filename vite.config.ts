
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensures process.env.API_KEY is accessible in the browser context
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY)
    }
  }
});
