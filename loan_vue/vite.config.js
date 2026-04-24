import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 区分环境的配置（开发/生产）
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'

  return {
    plugins: [vue(), vueDevTools()],
    // 基础路径（保持原有逻辑）
    base: './',
    // 开发服务器配置
    server: {
      port: 3000, // 固定开发端口，避免冲突
      host: '0.0.0.0', // 允许局域网访问（真机调试）
      open: true, // 启动后自动打开浏览器
      // 接口代理（解决跨域，根据后端地址调整）
      proxy: {
        '/api': {
          target: 'http://localhost:8080', // 后端接口域名
          changeOrigin: true, // 开启跨域代理
          rewrite: (path) => path.replace(/^\/api/, ''), // 移除路径前缀（按需）
        },
      },
    },
    // 解析别名（可扩展）
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // 可选：扩展更多常用别名（简化路径）
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      },
    },
    // 生产打包优化
    build: {
      // 核心修改：禁用 ES Module，输出兼容的 IIFE/UMD 格式
      rollupOptions: {
        output: {
          format: 'iife', // 把 ES 模块改成自执行函数格式
          inlineDynamicImports: true, // 内联动态导入，避免分包加载问题
          // 可选：统一输出文件名，减少路径问题
          entryFileNames: 'js/app.js',
          chunkFileNames: 'js/chunk-[name].js',
          assetFileNames: 'css/[name].css'
        }
      },
      // 禁用代码分割（避免多JS文件加载的MIME问题）
      cssCodeSplit: false,
      // 禁用模块预加载
      modulePreload: {
        polyfill: false
      }
    }
  }
})