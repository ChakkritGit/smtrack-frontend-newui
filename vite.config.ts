import react from '@vitejs/plugin-react'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true, filename: 'stats.html' }),
    splitVendorChunkPlugin()
  ],
  build: {
    chunkSizeWarningLimit: 100000, // Unit is in KB => 100MB
    // rollupOptions: {
    //   output: {
    //     entryFileNames: 'assets/[name].js',
    //     chunkFileNames: 'assets/[name].js',
    //     assetFileNames: 'assets/[name].[ext]'
    //   }
    // }
    commonjsOptions: {
      transformMixedEsModules: true
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 12345,
    strictPort: true,
    host: true,
    cors: true,
    fs: {
      strict: true,
      deny: ['.env', '.env.*', '*.{crt,pem}', 'custom.secret']
    }
  },
  optimizeDeps: {
    exclude: ['fs']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../')
    }
  }
})
