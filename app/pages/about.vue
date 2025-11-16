<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题 -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">关于我</h1>
      <p class="text-xl text-gray-600">欢迎来到我的个人博客</p>
    </div>

    <!-- 个人介绍 -->
    <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
        <!-- 头像 -->
        <div class="flex-shrink-0">
          <div class="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-4xl font-bold">博</span>
          </div>
        </div>
        
        <!-- 介绍内容 -->
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">你好，我是博主</h2>
          <p class="text-gray-600 leading-relaxed mb-4">
            我是一名热爱技术的开发者，专注于前端开发和用户体验设计。在这个博客中，我分享我的技术见解、项目经验和学习心得。
          </p>
          <p class="text-gray-600 leading-relaxed mb-6">
            我相信技术可以改变世界，而分享知识是促进技术进步的最好方式。希望我的文章能够对你有所帮助，也欢迎你与我交流讨论。
          </p>
          
          <!-- 联系信息 -->
          <div class="flex flex-wrap gap-4 justify-center md:justify-start">
            <a href="mailto:contact@example.com" class="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              联系邮箱
            </a>
            <a href="#" class="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
              </svg>
              GitHub
            </a>
            <a href="#" class="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              个人网站
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能展示 -->
    <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h3 class="text-2xl font-bold text-gray-900 mb-6">技术栈</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span class="text-green-600 text-2xl">⚡</span>
          </div>
          <h4 class="font-semibold text-gray-900 mb-1">前端开发</h4>
          <p class="text-sm text-gray-600">Vue.js, React, TypeScript</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span class="text-blue-600 text-2xl">🎨</span>
          </div>
          <h4 class="font-semibold text-gray-900 mb-1">UI/UX</h4>
          <p class="text-sm text-gray-600">Tailwind CSS, Figma</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span class="text-purple-600 text-2xl">🔧</span>
          </div>
          <h4 class="font-semibold text-gray-900 mb-1">后端开发</h4>
          <p class="text-sm text-gray-600">Node.js, Python, 数据库</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span class="text-orange-600 text-2xl">🚀</span>
          </div>
          <h4 class="font-semibold text-gray-900 mb-1">DevOps</h4>
          <p class="text-sm text-gray-600">Docker, CI/CD, 云服务</p>
        </div>
      </div>
    </div>

    <!-- 博客统计 -->
    <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
      <h3 class="text-2xl font-bold text-gray-900 mb-6">博客统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalPosts }}</div>
          <div class="text-gray-600">文章总数</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-green-600 mb-2">{{ totalCategories }}</div>
          <div class="text-gray-600">分类数量</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ totalTags }}</div>
          <div class="text-gray-600">标签数量</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-orange-600 mb-2">{{ totalWords }}</div>
          <div class="text-gray-600">总字数</div>
        </div>
      </div>
    </div>

    <!-- 最新文章 -->
    <div class="bg-white rounded-lg shadow-sm p-8">
      <h3 class="text-2xl font-bold text-gray-900 mb-6">最新文章</h3>
      <div class="space-y-4">
        <article 
          v-for="post in recentPosts" 
          :key="post._path"
          class="flex items-center justify-between py-3 border-b last:border-b-0"
        >
          <div class="flex-1">
            <NuxtLink :to="post._path" class="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
              {{ post.title }}
            </NuxtLink>
            <div class="text-sm text-gray-500 mt-1">
              {{ formatDate(post.date) }} • {{ post.readingTime.text }}
            </div>
          </div>
          <NuxtLink 
            :to="post._path" 
            class="text-blue-600 hover:text-blue-800 font-medium"
          >
            阅读 →
          </NuxtLink>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取文章数据
const { data: posts } = await queryContent('/articles')
  .sort({ date: -1 })
  .find()

// 确保 posts 存在，如果为 undefined 则使用空数组
const safePosts = posts || []

// 获取最新文章
const recentPosts = safePosts.slice(0, 5)

// 计算统计数据
const totalPosts = safePosts.length
const totalCategories = new Set(safePosts.map(post => post.category)).size
const totalTags = new Set(safePosts.flatMap(post => post.tags || [])).size
const totalWords = safePosts.reduce((sum, post) => sum + (post.readingTime.words || 0), 0)

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 页面SEO
useHead({
  title: '关于我',
  meta: [
    { name: 'description', content: '了解博主的个人经历、技术栈和博客创作理念' }
  ]
})
</script>