<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">搜索文章</h1>
      <p class="text-gray-600">快速找到你感兴趣的技术文章</p>
    </div>

    <!-- 搜索框 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="relative">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="输入关键词搜索文章..."
          class="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
          @keyup.enter="handleSearch"
        >
        <svg class="absolute left-4 top-3.5 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute right-3 top-3.5 w-6 h-6 text-gray-400 hover:text-gray-600"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- 搜索建议 -->
      <div v-if="searchSuggestions.length > 0" class="mt-4">
        <p class="text-sm text-gray-600 mb-2">搜索建议：</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="suggestion in searchSuggestions"
            :key="suggestion"
            @click="searchQuery = suggestion; handleSearch()"
            class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- 高级筛选 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">高级筛选</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 分类筛选 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
          <select
            v-model="selectedCategory"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">所有分类</option>
            <option v-for="category in categories" :key="category.slug" :value="category.slug">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <!-- 标签筛选 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
          <select
            v-model="selectedTag"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">所有标签</option>
            <option v-for="tag in popularTags" :key="tag.name" :value="tag.name">
              {{ tag.name }} ({{ tag.count }})
            </option>
          </select>
        </div>
        
        <!-- 时间范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">时间范围</label>
          <select
            v-model="timeRange"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">所有时间</option>
            <option value="week">最近一周</option>
            <option value="month">最近一月</option>
            <option value="year">最近一年</option>
            <option value="2024">2024年</option>
            <option value="2023">2023年</option>
          </select>
        </div>
      </div>
      
      <!-- 排序选项 -->
      <div class="mt-4 flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700">排序方式：</span>
        <div class="flex gap-2">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="sortBy = option.value; handleSearch()"
            :class="[
              'px-3 py-1 text-sm rounded-full transition-colors',
              sortBy === option.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索结果统计 -->
    <div v-if="hasSearched" class="mb-6">
      <div class="flex items-center justify-between">
        <p class="text-gray-600">
          找到 <span class="font-semibold text-gray-900">{{ filteredPosts.length }}</span> 篇文章
          <span v-if="searchQuery" class="ml-2">
            ，关键词：<span class="font-semibold text-blue-600">"{{ searchQuery }}"</span>
          </span>
        </p>
        <button
          @click="resetFilters"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          重置筛选
        </button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-if="filteredPosts.length > 0" class="space-y-6">
      <article
        v-for="post in paginatedPosts"
        :key="post._path"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <div v-if="post.image" class="md:w-48 flex-shrink-0">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-32 object-cover rounded-lg"
              >
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {{ getCategoryName(post.category) }}
                </span>
                <time class="text-sm text-gray-500">{{ formatDate(post.date) }}</time>
                <span class="text-sm text-gray-500">• {{ post.readingTime.text }}</span>
                <span 
                  v-if="isRecentPost(post.date)"
                  class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                >
                  最新
                </span>
              </div>
              
              <h2 class="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                <NuxtLink :to="post._path">
                  <span v-html="highlightText(post.title)"></span>
                </NuxtLink>
              </h2>
              
              <p class="text-gray-600 mb-4 line-clamp-2">
                <span v-html="highlightText(post.description)"></span>
              </p>
              
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    :class="{ 'bg-yellow-100 text-yellow-800': tag === selectedTag }"
                  >
                    {{ tag }}
                  </span>
                </div>
                
                <NuxtLink
                  :to="post._path"
                  class="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
    <div v-else-if="hasSearched" class="text-center py-12">
      <div class="text-gray-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2.306" />
        </svg>
        <p class="text-lg mb-2">没有找到相关文章</p>
        <p class="text-sm mb-4">尝试调整搜索关键词或筛选条件</p>
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          重置所有筛选
        </button>
      </div>
    </div>

    <!-- 初始状态提示 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-lg mb-2">开始搜索文章</p>
        <p class="text-sm">输入关键词或使用高级筛选功能</p>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
      <button
        @click="currentPage--"
        :disabled="currentPage <= 1"
        class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
        class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        下一页
      </button>
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
  const nameMap = {
    frontend: '前端开发',
    backend: '后端开发',
    thoughts: '技术随笔',
    tools: '工具推荐',
    ai: '人工智能',
    experience: '开发经验',
    css: 'CSS样式',
    performance: '性能优化'
  }
  
  return Object.entries(categoryStats.value).map(([slug, count]) => ({
    name: nameMap[slug] || slug,
    slug,
    count
  }))
})

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTag = ref('')
const timeRange = ref('')
const sortBy = ref('relevance')
const currentPage = ref(1)
const hasSearched = ref(false)
const postsPerPage = 10

// 排序选项
const sortOptions = [
  { value: 'relevance', label: '相关度' },
  { value: 'date', label: '发布时间' },
  { value: 'title', label: '标题' },
  { value: 'readingTime', label: '阅读时长' }
]

// 计算属性
const categories = computed(() => categoryConfig.value)

const popularTags = computed(() => {
  const allTags = safePosts.flatMap(post => post.tags || [])
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})
  
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }))
})

const searchSuggestions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const query = searchQuery.value.toLowerCase()
  const suggestions = new Set()
  
  // 从文章标题、描述、标签中提取建议
  safePosts.forEach(post => {
    if (post.title.toLowerCase().includes(query)) {
      suggestions.add(post.title)
    }
    if (post.description.toLowerCase().includes(query)) {
      const words = post.description.split(' ')
      words.forEach(word => {
        if (word.toLowerCase().includes(query) && word.length > 3) {
          suggestions.add(word)
        }
      })
    }
    post.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(query)) {
        suggestions.add(tag)
      }
    })
  })
  
  return Array.from(suggestions).slice(0, 8)
})

const filteredPosts = computed(() => {
  let filtered = safePosts

  // 搜索关键词筛选
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

  // 标签筛选
  if (selectedTag.value) {
    filtered = filtered.filter(post => post.tags?.includes(selectedTag.value))
  }

  // 时间范围筛选
  if (timeRange.value) {
    const now = new Date()
    const cutoffDate = new Date()
    
    switch (timeRange.value) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        if (timeRange.value.match(/^\d{4}$/)) {
          const year = parseInt(timeRange.value)
          filtered = filtered.filter(post => {
            const postYear = new Date(post.date).getFullYear()
            return postYear === year
          })
        }
        return filtered
    }
    
    filtered = filtered.filter(post => new Date(post.date) >= cutoffDate)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'relevance':
        // 简单的相关度排序：标题匹配优先
        const aInTitle = a.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const bInTitle = b.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        if (aInTitle && !bInTitle) return -1
        if (!aInTitle && bInTitle) return 1
        return new Date(b.date) - new Date(a.date)
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
  const category = categoryConfig.value.find(c => c.slug === slug)
  return category ? category.name : slug
}

const highlightText = (text) => {
  if (!searchQuery.value) return text
  
  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
}

const isRecentPost = (date) => {
  const postDate = new Date(date)
  const now = new Date()
  const diffDays = Math.floor((now - postDate) / (1000 * 60 * 60 * 24))
  return diffDays <= 7
}

const handleSearch = () => {
  currentPage.value = 1
  hasSearched.value = true
}

const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedTag.value = ''
  timeRange.value = ''
  sortBy.value = 'relevance'
  currentPage.value = 1
  hasSearched.value = false
}

// 页面加载时聚焦搜索框
onMounted(() => {
  nextTick(() => {
    const searchInput = document.querySelector('input[type="text"]')
    if (searchInput) {
      searchInput.focus()
    }
  })
})

// 页面SEO
useHead({
  title: '搜索文章',
  meta: [
    { name: 'description', content: '搜索技术文章，支持关键词搜索、分类筛选、标签筛选和时间范围筛选' }
  ]
})
</script>