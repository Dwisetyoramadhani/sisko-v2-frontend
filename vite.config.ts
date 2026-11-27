import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

function pwaRevisionPlugin() {
  const revision = Date.now().toString(36)

  return {
    name: 'sisko-pwa-revision',
    apply: 'build' as const,
    transformIndexHtml(html: string) {
      return html.replaceAll('v=1', `v=${revision}`)
    },
    closeBundle() {
      for (const file of ['manifest.webmanifest', 'sw.js']) {
        const path = resolve(process.cwd(), 'dist', file)
        let contents = readFileSync(path, 'utf8').replaceAll('v=1', `v=${revision}`)
        if (file === 'sw.js') contents = contents.replace('sisko-shell-v1', `sisko-shell-${revision}`)
        writeFileSync(path, contents)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')
  const certificatePath = resolve(process.cwd(), 'certs/sisko-local-cert.pem')
  const certificateKeyPath = resolve(process.cwd(), 'certs/sisko-local-key.pem')
  const localHttps = existsSync(certificatePath) && existsSync(certificateKeyPath)
    ? { cert: readFileSync(certificatePath), key: readFileSync(certificateKeyPath) }
    : undefined
  const backendProxy = {
    target: environment.VITE_PROXY_API_TARGET || 'http://localhost:8000',
    changeOrigin: true,
    headers: {
      origin: 'http://localhost:3000',
      referer: 'http://localhost:3000/',
    },
  }

  return {
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      https: localHttps,
      proxy: {
        '/api': backendProxy,
        '/sanctum': backendProxy,
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
      https: localHttps,
      proxy: {
        '/api': backendProxy,
        '/sanctum': backendProxy,
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      pwaRevisionPlugin(),
    ],
  }
})
