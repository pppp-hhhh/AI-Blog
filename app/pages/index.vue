<template>
  <div>
    <!-- 英雄区域 -->
    <section class="py-20 mb-12 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
      <div class="text-center">
        <h1 class="mb-4 text-4xl font-bold md:text-6xl">
          欢迎来到我的博客
        </h1>
        <p class="mb-8 text-xl opacity-90 md:text-2xl">
          分享技术见解，记录成长历程
        </p>
        <div class="flex justify-center space-x-4">
          <NuxtLink 
            to="/blog" 
            class="px-6 py-3 font-semibold text-blue-600 bg-white rounded-lg transition-colors hover:bg-gray-100"
          >
            查看文章
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="px-6 py-3 font-semibold text-white rounded-lg border-2 border-white transition-colors hover:bg-white hover:text-blue-600"
          >
            了解更多
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="mb-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">最新文章</h2>
        <NuxtLink to="/blog" class="font-medium text-blue-600 hover:text-blue-800">
          查看全部 →
        </NuxtLink>
      </div>
      
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="post in publishedPosts" :key="post._path" class="overflow-hidden bg-white rounded-lg shadow-md article-card">
          <NuxtLink :to="post._path" class="block">
            <div class="p-6">
              <div class="flex items-center mb-2 text-sm text-gray-500">
                <time>{{ formatDate(post.date) }}</time>
                <span class="mx-2">•</span>
                <span>{{ post.readingTime.text }}</span>
              </div>
              
              <h3 class="mb-3 text-xl font-semibold text-gray-900 transition-colors hover:text-blue-600">
                {{ post.title }}
              </h3>
              
              <p class="mb-4 text-gray-600 line-clamp-3">
                {{ post.description }}
              </p>
              
              <div class="flex justify-between items-center">
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="tag in post.tags.slice(0, 2)" 
                    :key="tag"
                    class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
                <span class="font-medium text-blue-600">阅读更多 →</span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </section>

    <!-- 分类展示 -->
    <section class="mb-12">
      <h2 class="mb-8 text-3xl font-bold text-gray-900">文章分类</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div 
          v-for="category in categories" 
          :key="category.name"
          class="p-6 bg-white rounded-lg shadow-md transition-shadow cursor-pointer hover:shadow-lg"
          @click="navigateTo(`/category/${category.slug}`)"
        >
          <div class="flex items-center mb-3">
            <div class="flex justify-center items-center mr-3 w-10 h-10 bg-blue-100 rounded-lg">
              <span class="text-xl text-blue-600">{{ category.icon }}</span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
          </div>
          <p class="mb-2 text-sm text-gray-600">{{ category.description }}</p>
          <p class="text-sm font-medium text-blue-600">{{ category.count }} 篇文章</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 获取最新文章
const { data: recentPosts } = await queryContent('/articles')
  .sort({ date: -1 })
  .limit(6)
  .find()

// 获取所有文章用于分类统计
const { data: allPosts } = await queryContent('/articles')
  .sort({ date: -1 })
  .find()

// 过滤已发布的文章
const publishedPosts = (recentPosts || []).filter(post => post.status === 'published')
const publishedAllPosts = (allPosts || []).filter(post => post.status === 'published')

// 确保文章数据存在
const safePosts = publishedAllPosts || []

// 计算分类统计数据
const categoryStats = computed(() => {
  const stats = {}
  safePosts.forEach(post => {
    if (post.category) {
      stats[post.category] = (stats[post.category] || 0) + 1
    }
  })
  return stats
})

// 分类数据（基于实际文章统计）
const categories = computed(() => [
  {
    name: '前端开发',
    slug: 'frontend',
    description: 'Vue.js, React, CSS等技术文章',
    icon: '💻',
    count: categoryStats.value['frontend'] || 0
  },
  {
    name: '后端开发',
    slug: 'backend',
    description: 'Node.js, 数据库, API设计',
    icon: '⚙️',
    count: categoryStats.value['backend'] || 0
  },
  {
    name: '技术随笔',
    slug: 'thoughts',
    description: '编程思考和技术感悟',
    icon: '📝',
    count: categoryStats.value['thoughts'] || 0
  },
  {
    name: '工具推荐',
    slug: 'tools',
    description: '开发工具和资源分享',
    icon: '🛠️',
    count: categoryStats.value['tools'] || 0
  },
  {
    name: '性能优化',
    slug: 'performance',
    description: '前端性能优化和最佳实践',
    icon: '⚡',
    count: categoryStats.value['performance'] || 0
  },
  {
    name: 'CSS技术',
    slug: 'css',
    description: 'CSS布局、动画和样式技巧',
    icon: '🎨',
    count: categoryStats.value['css'] || 0
  }
].filter(category => category.count > 0))

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
  title: '首页',
  meta: [
    { name: 'description', content: '个人技术博客，分享前端开发和编程技术文章' }
  ]
})
</script>