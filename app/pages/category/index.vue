<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">文章分类</h1>
      <p class="text-gray-600">按分类浏览文章，找到你感兴趣的内容</p>
    </div>

    <!-- 分类列表 -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="category in categories" 
        :key="category.slug"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateTo(`/category/${category.slug}`)"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-blue-600 text-2xl">{{ category.icon }}</span>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ category.name }}</h3>
              <p class="text-gray-500 text-sm">{{ category.count }} 篇文章</p>
            </div>
          </div>
          
          <p class="text-gray-600 mb-4">{{ category.description }}</p>
          
          <!-- 最新文章预览 -->
          <div v-if="category.recentPosts.length > 0" class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">最新文章</h4>
            <div class="space-y-2">
              <NuxtLink 
                v-for="post in category.recentPosts.slice(0, 2)" 
                :key="post._path"
                :to="post._path"
                class="block text-sm text-gray-600 hover:text-blue-600 transition-colors truncate"
                @click.stop
              >
                {{ post.title }}
              </NuxtLink>
            </div>
          </div>
          
          <div class="mt-4 text-blue-600 font-medium text-sm">
            查看全部分类 →
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="mt-12 bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">分类统计</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalCategories }}</div>
          <div class="text-gray-600">总分类数</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-green-600 mb-2">{{ totalPosts }}</div>
          <div class="text-gray-600">总文章数</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ activeCategories }}</div>
          <div class="text-gray-600">活跃分类</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-orange-600 mb-2">{{ avgPostsPerCategory }}</div>
          <div class="text-gray-600">平均文章数</div>
        </div>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">热门标签</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          v-for="tag in popularTags"
          :key="tag.name"
          :to="`/tag/${tag.name}`"
          class="px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
          :class="{ 'text-lg': tag.size === 'large', 'text-sm': tag.size === 'small' }"
        >
          {{ tag.name }} ({{ tag.count }})
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// 获取所有文章
const { data: posts } = await queryContent('/articles')
  .sort({ date: -1 })
  .find()

// 确保 posts 存在，如果为 undefined 则使用空数组
const safePosts = posts || []

// 动态计算分类数据
const categoryStats = computed(() => {
  const stats = {}
  
  safePosts.forEach(post => {
    const category = post.category || 'uncategorized'
    stats[category] = (stats[category] || 0) + 1
  })
  
  return stats
})

// 分类配置 - 基于实际存在的分类
const categoryConfig = computed(() => {
  const descriptions = {
    frontend: 'Vue.js, React, CSS等技术文章',
    backend: 'Node.js, 数据库, API设计',
    thoughts: '编程思考和技术感悟',
    tools: '开发工具和资源分享',
    ai: 'AI, 机器学习, 深度学习',
    experience: '项目经验和最佳实践',
    css: 'CSS样式与布局',
    performance: '性能优化指南'
  }
  
  const icons = {
    frontend: '💻',
    backend: '⚙️',
    thoughts: '📝',
    tools: '🛠️',
    ai: '🤖',
    experience: '💡',
    css: '🎨',
    performance: '⚡'
  }
  
  return Object.entries(categoryStats.value).map(([slug, count]) => ({
    name: getCategoryName(slug),
    slug,
    count,
    description: descriptions[slug] || '技术文章',
    icon: icons[slug] || '📁'
  }))
})

// 处理分类数据
const categories = computed(() => {
  return categoryConfig.value.map(category => {
    const categoryPosts = safePosts.filter(post => post.category === category.slug)
    return {
      ...category,
      count: categoryPosts.length,
      recentPosts: categoryPosts.slice(0, 3)
    }
  }).filter(category => category.count > 0)
})

// 计算统计信息
const totalCategories = computed(() => categories.value.length)
const totalPosts = safePosts.length
const activeCategories = computed(() => categories.value.filter(c => c.count > 0).length)
const avgPostsPerCategory = computed(() => Math.round(totalPosts / totalCategories.value))

// 获取所有标签
const allTags = safePosts.flatMap(post => post.tags || [])
const tagCounts = allTags.reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1
  return acc
}, {})

// 热门标签（按数量排序，取前30个）
const popularTags = Object.entries(tagCounts)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 30)
  .map(([name, count]) => ({
    name,
    count,
    size: count > 10 ? 'large' : count > 5 ? 'medium' : 'small'
  }))

// 页面SEO
useHead({
  title: '文章分类',
  meta: [
    { name: 'description', content: '按分类浏览所有技术文章，包含前端开发、后端开发、人工智能等多个分类' }
  ]
})
</script>