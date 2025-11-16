<template>
  <div>
    <!-- 标签头部 -->
    <div class="mb-8">
      <div class="flex items-center mb-4">
        <NuxtLink to="/tag" class="text-blue-600 hover:text-blue-800 transition-colors">
          ← 返回标签列表
        </NuxtLink>
      </div>
      
      <div class="flex items-center mb-4">
        <div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-6">
          <span class="text-blue-600 text-3xl">#</span>
        </div>
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ tagName }}</h1>
          <p class="text-gray-600">包含标签 "{{ tagName }}" 的文章</p>
          <p class="text-sm text-gray-500 mt-1">{{ tagPosts.length }} 篇文章</p>
        </div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="在当前标签中搜索..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="handleSearch"
          >
        </div>
        <div class="md:w-32">
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              </div>
              
              <h2 class="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
              </h2>
              
              <p class="text-gray-600 mb-4 line-clamp-2">{{ post.description }}</p>
              
              <div class="flex items-center justify-between">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags.slice(0, 3)"
                    :key="tag"
                    class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    :class="{ 'bg-blue-100 text-blue-800': tag === tagName }"
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
    <div v-else class="text-center py-12">
      <div class="text-gray-500 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2.306" />
        </svg>
        <p class="text-lg">该标签下暂无文章</p>
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

    <!-- 相关标签推荐 -->
    <div v-if="relatedTags.length > 0" class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">相关标签</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          v-for="tag in relatedTags"
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
const route = useRoute()
const tagName = route.params.tag

// 获取包含当前标签的文章
const { data: allPosts } = await queryContent('/articles')
  .sort({ date: -1 })
  .find()

const tagPosts = allPosts.filter(post => 
  post.tags && post.tags.includes(tagName)
)

// 如果没有找到文章，显示404
if (tagPosts.length === 0) {
  // 检查这个标签是否存在
  const allTags = allPosts.flatMap(post => post.tags || [])
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1
    return acc
  }, {})
  
  if (!tagCounts[tagName]) {
    throw createError({
      statusCode: 404,
      statusMessage: '标签未找到'
    })
  }
}

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
const sortBy = ref('date')
const currentPage = ref(1)
const postsPerPage = 10

// 计算属性
const filteredPosts = computed(() => {
  let filtered = tagPosts

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    )
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

// 相关标签（基于共同出现的标签）
const relatedTags = computed(() => {
  const tagCooccurrence = {}
  
  tagPosts.forEach(post => {
    post.tags.forEach(tag => {
      if (tag !== tagName) {
        tagCooccurrence[tag] = (tagCooccurrence[tag] || 0) + 1
      }
    })
  })
  
  return Object.entries(tagCooccurrence)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 15)
    .map(([name, count]) => ({
      name,
      count,
      size: count > 5 ? 'large' : count > 2 ? 'medium' : 'small'
    }))
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

const handleSortChange = () => {
  currentPage.value = 1
}

// 页面SEO
useHead({
  title: `${tagName} - 文章标签`,
  meta: [
    { name: 'description', content: `查看所有包含标签 "${tagName}" 的技术文章` },
    { name: 'keywords', content: tagName }
  ]
})
</script>