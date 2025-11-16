// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // 启用模块
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  // Content模块配置
  content: {
    highlight: {
      theme: 'github-dark',
      preload: ['javascript', 'typescript', 'vue', 'html', 'css']
    },
    markdown: {
      remarkPlugins: ['remark-reading-time']
    }
  },
  
  // 应用配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: '我的博客',
      meta: [
        { name: 'description', content: '一个使用Nuxt.js构建的个人博客网站' },
        { name: 'keywords', content: '博客, Nuxt.js, Vue.js, 技术博客' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // CSS配置
  css: ['~/app/assets/css/main.css'],
  
  // 目录配置
  dir: {
    pages: 'app/pages'
  },
  
  // 构建配置
  nitro: {
    prerender: {
      routes: []
    }
  }
})
