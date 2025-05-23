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
    },
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('node_modules')) {
            if (id.includes('apexcharts')) return 'vendor_apexcharts'
            if (id.includes('pdfjs-dist')) return 'vendor_pdfjs'
            if (id.includes('xlsx')) return 'vendor_xlsx'
            if (id.includes('sweetalert2')) return 'vendor_sweetalert'
            if (id.includes('html2canvas')) return 'vendor_html2canvas'
            if (id.includes('@react-pdf')) return 'vendor_react_pdf'
            if (id.includes('fontkit')) return 'vendor_fontkit'
            if (id.includes('reading-time-estimator')) return 'vendor_reading_time_estimator'
            if (id.includes('heic2any')) return 'vendor_heic'
            return 'vendor'
          }
        }
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
