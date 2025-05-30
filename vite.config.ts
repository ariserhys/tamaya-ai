import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Increase the chunk size warning limit as we have several large dependencies
    chunkSizeWarningLimit: 800,
    
    rollupOptions: {
      output: {
        // Configure manual chunks for better code splitting
        manualChunks: (id) => {
          // React and related core libraries
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/') || 
              id.includes('node_modules/react-router-dom/')) {
            return 'react';
          }
          
          // UI component libraries
          if (id.includes('/components/ui/')) {
            return 'ui';
          }
          
          // PDF generation libraries
          if (id.includes('node_modules/jspdf') || 
              id.includes('node_modules/html2canvas')) {
            return 'pdf-tools';
          }
          
          // Markdown rendering
          if (id.includes('markdown-renderer') || 
              id.includes('node_modules/react-markdown') || 
              id.includes('node_modules/remark') || 
              id.includes('node_modules/rehype')) {
            return 'markdown';
          }
          
          // Authentication related
          if (id.includes('node_modules/@supabase/supabase-js')) {
            return 'auth';
          }
          
          // Utility libraries
          if (id.includes('/lib/utils.ts')) {
            return 'utils';
          }
        }
      },
    },
  },
}));
