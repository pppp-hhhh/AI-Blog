<template>
  <div>
    <!-- 页面头部 -->
    <div class="mb-8">
      <h1 class="mb-4 text-4xl font-bold text-gray-900">博客</h1>
      <p class="text-gray-600">探索技术文章，分享开发经验</p>
    </div>

    <!-- 搜索和筛选栏 -->
    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row">
        <!-- 搜索框 -->
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索文章..."
              class="px-4 py-2 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="handleSearch"
            >
            <svg class="absolute top-2.5 left-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- 分类筛选 -->
        <div class="md:w-48">
          <select
            v-model="selectedCategory"
            class="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="handleCategoryChange"
          >
            <option value="">所有分类</option>
            <option v-for="category in categories" :key="category.slug" :value="category.slug">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- 排序 -->
        <div class="md:w-32">
          <select
            v-model="sortBy"
            class="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="handleSortChange"
          >
            <option value="date">最新发布</option>
            <option value="title">标题排序</option>
            <option value="readingTime">阅读时长</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-if="filteredPosts.length > 0" class="space-y-6">
      <article
        v-for="post in paginatedPosts"
        :key="post._path"
        class="bg-white rounded-lg shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="p-6">
          <div class="flex flex-col gap-6 md:flex-row">
            <!-- 文章图片 -->
            <div v-if="post.image" class="flex-shrink-0 md:w-48">
              <img
                :src="post.image"
                :alt="post.title"
                class="object-cover w-full h-32 rounded-lg"
              >
            </div>
            
            <!-- 文章内容 -->
            <div class="flex-1">
              <div class="flex gap-2 items-center mb-2">
                <span class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                  {{ getCategoryName(post.category) }}
                </span>
                <time class="text-sm text-gray-500">{{ formatDate(post.date) }}</time>
                <span class="text-sm text-gray-500">• {{ post.readingTime.text }}</span>
              </div>
              
              <h2 class="mb-2 text-xl font-bold text-gray-900 transition-colors hover:text-blue-600">
                <NuxtLink :to="post._path.replace('/articles/', '/blog/')">{{ post.title }}</NuxtLink>
              </h2>
              
              <p class="mb-4 text-gray-600 line-clamp-2">{{ post.description }}</p>
              
              <div class="flex justify-between items-center">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <NuxtLink
                  :to="post._path.replace('/articles/', '/blog/')"
                  class="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  阅读全文 →
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- 无结果提示 -->
    <div v-else class="py-12 text-center">
      <div class="mb-4 text-gray-500">
        <svg class="mx-auto mb-4 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2.306" />
        </svg>
        <p class="text-lg">没有找到相关文章</p>
        <p class="text-sm">尝试调整搜索条件或分类筛选</p>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex gap-2 justify-center items-center mt-8">
      <button
        @click="currentPage--"
        :disabled="currentPage <= 1"
        class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        上一页
      </button>
      
      <div class="flex gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-2 rounded-lg',
            currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        @click="currentPage++"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
// 显式导入useLocalStorage
import { useLocalStorage } from '~/app/composables/useLocalStorage'

// 获取所有文章（合并Content数据和本地存储数据）
const contentPosts = await queryContent('/articles')
  .where({ status: 'published' })
  .sort({ date: -1 })
  .find()

// 获取本地存储的文章
const { getStoredArticles } = useLocalStorage()

// 合并文章数据，确保不重复
const safePosts = computed(() => {
  // 确保contentPosts有数据
  const contentArticles = Array.isArray(contentPosts) ? contentPosts : (contentPosts?.value || [])
  const storedArticles = process.client ? getStoredArticles() || [] : []
  
  // 创建一个Map来避免重复
  const articleMap = new Map()
  
  // 先添加Content文章
  contentArticles.forEach(article => {
    if (article.status === 'published') {
      articleMap.set(article._path || article.title, article)
    }
  })
  
  // 再添加本地存储的文章（如果路径或标题不重复）
  storedArticles.forEach(article => {
    if (article.status === 'published') {
      const key = article._path || article.title
      if (!articleMap.has(key)) {
        articleMap.set(key, article)
      }
    }
  })
  
  return Array.from(articleMap.values())
})

// 分类配置
const categoryConfig = [
  { name: '前端开发', slug: 'frontend', description: 'Vue.js, React, CSS等技术文章' },
  { name: '后端开发', slug: 'backend', description: 'Node.js, 数据库, API设计' },
  { name: '技术随笔', slug: 'thoughts', description: '编程思考和技术感悟' },
  { name: '工具推荐', slug: 'tools', description: '开发工具和资源分享' },
  { name: '人工智能', slug: 'ai', description: 'AI, 机器学习, 深度学习' },
  { name: '开发经验', slug: 'experience', description: '项目经验和最佳实践' }
]

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('date')
const currentPage = ref(1)
const postsPerPage = 10

// 计算属性
const categories = computed(() => categoryConfig)

const filteredPosts = computed(() => {
  let filtered = safePosts.value

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(post => post.category === selectedCategory.value)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'readingTime':
        return a.readingTime.minutes - b.readingTime.minutes
      default: // date
        return new Date(b.date) - new Date(a.date)
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return filteredPosts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCategoryName = (slug) => {
  const category = categoryConfig.find(c => c.slug === slug)
  return category ? category.name : slug
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleCategoryChange = () => {
  currentPage.value = 1
}

const handleSortChange = () => {
  currentPage.value = 1
}

// 页面SEO
useHead({
  title: '博客 - 技术文章',
  meta: [
    { name: 'description', content: '探索技术文章，分享前端开发、后端开发、人工智能等技术内容' }
  ]
})
</script>