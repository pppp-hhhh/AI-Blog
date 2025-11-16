<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-gray-900">
              我的博客
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 transition-colors">
              首页
            </NuxtLink>
            <NuxtLink to="/blog" class="text-gray-600 hover:text-gray-900 transition-colors">
              博客
            </NuxtLink>
            <NuxtLink to="/category" class="text-gray-600 hover:text-gray-900 transition-colors">
              分类
            </NuxtLink>
            <NuxtLink to="/tag" class="text-gray-600 hover:text-gray-900 transition-colors">
              标签
            </NuxtLink>
            <NuxtLink to="/archive" class="text-gray-600 hover:text-gray-900 transition-colors">
              归档
            </NuxtLink>
            <NuxtLink to="/search" class="text-gray-600 hover:text-gray-900 transition-colors">
              搜索
            </NuxtLink>
            <NuxtLink to="/about" class="text-gray-600 hover:text-gray-900 transition-colors">
              关于
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t mt-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; 2024 我的博客. 使用 Nuxt.js 构建</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 全局SEO配置
useHead({
  titleTemplate: (title) => title ? `${title} - 我的博客` : '我的博客',
  meta: [
    { name: 'description', content: '分享技术文章和个人思考的个人博客' },
    { name: 'keywords', content: '技术博客,前端开发,Vue.js,Nuxt.js' },
    { name: 'author', content: '博主' }
  ]
})
</script>
