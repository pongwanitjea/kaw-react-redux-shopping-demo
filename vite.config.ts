// vite.config.ts
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    TanStackRouterVite(),
    viteReact(),
    visualizer({
      emitFile: true,
      filename: "stats.html",
    }),
    // ...,
  ],
  define: {
    'process.env': process.env
  }
})