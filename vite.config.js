import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  build: {
    // Set a larger warning limit to avoid unnecessary warnings
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Implement manual chunk splitting strategy
        manualChunks: (id) => {
          // Create a vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Group major frameworks/libraries together
            if (id.includes('/react/') || 
                id.includes('/react-dom/') || 
                id.includes('/scheduler/')) {
              return 'vendor-react';
            }
            
            // Group UI components libraries
            if (id.includes('/@mui/') || 
                id.includes('/material-ui/') || 
                id.includes('/styled-components/')) {
              return 'vendor-ui';
            }
            
            // Data visualization libraries
            if (id.includes('/d3/') || 
                id.includes('/chart.js/') ||
                id.includes('/echarts/')) {
              return 'vendor-charts';
            }
            
            // State management
            if (id.includes('/redux/') || 
                id.includes('/mobx/') ||
                id.includes('/recoil/') ||
                id.includes('/zustand/')) {
              return 'vendor-state';
            }
            
            // Form libraries
            if (id.includes('/formik/') || 
                id.includes('/react-hook-form/') ||
                id.includes('/yup/') ||
                id.includes('/zod/')) {
              return 'vendor-forms';
            }
            
            // Utility libraries
            if (id.includes('/lodash/') || 
                id.includes('/date-fns/') || 
                id.includes('/axios/')) {
              return 'vendor-utils';
            }
            
            // Math and markdown related
            if (id.includes('/katex/') || 
                id.includes('/markdown/') ||
                id.includes('/remark/') ||
                id.includes('/rehype/')) {
              return 'vendor-content';
            }

            // Create chunks by the first level of node_modules
            // This helps to distribute dependencies more evenly
            const pkg = id.toString().split('node_modules/')[1].split('/')[0];
            return `vendor-${pkg}`;
          }
          
          // Group app code by feature/module when possible
          if (id.includes('/src/')) {
            if (id.includes('/src/components/')) {
              return 'app-components';
            }
            if (id.includes('/src/pages/')) {
              return 'app-pages';
            }
            if (id.includes('/src/utils/') || id.includes('/src/helpers/')) {
              return 'app-utils';
            }
          }
        }
      }
    },
    // Enable source map for better debugging
    sourcemap: true,
    // Decrease the number of concurrent builds to avoid memory issues
    assetsInlineLimit: 4096, // 4kb - default
    // Ensure CSS is properly code split
    cssCodeSplit: true,
  }
}); 