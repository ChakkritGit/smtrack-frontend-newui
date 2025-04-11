import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // rollupOptions: {
    //   output: {
    //     manualChunks (id) {
    //       const normalizedId = id.split(path.sep).join('/')

    //       if (normalizedId.includes('node_modules')) {
    //         return 'vendor'
    //       }

    //       if (normalizedId.includes('/src/components/')) {
    //         const parts = normalizedId.split('/src/components/')[1].split('/')
    //         const folder = parts[0]
    //         return `components/${folder}`
    //       }

    //       if (normalizedId.includes('/src/pages/')) {
    //         const parts = normalizedId.split('/src/pages/')[1].split('/')
    //         const folder = parts[0]
    //         return `pages/${folder}`
    //       }

    //       if (normalizedId.includes('/src/constants/')) {
    //         const parts = normalizedId.split('/src/constants/')[1].split('/')
    //         const folder = parts[0]
    //         return `constants/${folder}`
    //       }

    //       if (normalizedId.includes('/src/middleware/')) {
    //         const parts = normalizedId.split('/src/middleware/')[1].split('/')
    //         const folder = parts[0]
    //         return `middleware/${folder}`
    //       }

    //       if (normalizedId.includes('/src/routes/')) {
    //         const parts = normalizedId.split('/src/routes/')[1].split('/')
    //         const folder = parts[0]
    //         return `routes/${folder}`
    //       }
    //     },
    //     assetFileNames: assetInfo => {
    //       const name = assetInfo.name ?? 'asset'
    //       if (name.endsWith('.css')) {
    //         if (name.includes('component-')) return 'component/[name][extname]'
    //         if (name.includes('page-')) return 'page/[name][extname]'
    //         return 'style/[name][extname]'
    //       }

    //       return 'assets/[name][extname]'
    //     }
    //   }
    // }
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
