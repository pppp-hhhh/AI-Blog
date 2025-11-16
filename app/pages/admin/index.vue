<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部导航 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">博客管理后台</h1>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-gray-500 hover:text-gray-700">
              返回博客
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">总文章数</p>
              <p class="text-2xl font-semibold text-gray-900">{{ articleCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">分类数</p>
              <p class="text-2xl font-semibold text-gray-900">{{ categoryCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">标签数</p>
              <p class="text-2xl font-semibold text-gray-900">{{ tagCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">草稿数</p>
              <p class="text-2xl font-semibold text-gray-900">{{ draftCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 class="text-lg font-medium text-gray-900">文章管理</h2>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <NuxtLink
                to="/admin/import-export"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
                导入导出
              </NuxtLink>
              <NuxtLink
                to="/admin/articles/new"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                新建文章
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-8">
        <div class="text-center">
          <div class="inline-flex items-center px-4 py-2 text-gray-500">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            数据加载中...
          </div>
        </div>
      </div>

      <div v-else-if="error" class="bg-white rounded-lg shadow p-8">
        <div class="text-center text-red-600">
          <p>加载数据时出错: {{ error }}</p>
          <button @click="loadData" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            重新加载
          </button>
        </div>
      </div>

      <div v-else-if="articles.length === 0" class="bg-white rounded-lg shadow p-8">
        <div class="text-center text-gray-500">
          <p>暂无文章</p>
          <NuxtLink to="/admin/articles/new" class="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            创建第一篇文章
          </NuxtLink>
        </div>
      </div>

      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标题
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="article in articles" :key="article._path" class="border-b hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ article.title }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ article.description }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ article.category || '未分类' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(article.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusText(article.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(article.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <NuxtLink
                      :to="`/admin/articles/${article.slug}`"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      编辑
                    </NuxtLink>
                    <button
                      @click="deleteArticle(article)"
                      class="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div class="px-6 py-3 bg-gray-50 border-t">
            <span class="text-sm text-gray-500">共 {{ articles.length }} 篇文章</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 简单的数据获取，避免复杂的异步问题
const loading = ref(true)
const error = ref(null)
const articles = ref([])
const categories = ref([])
const tags = ref([])

// 计算属性
const articleCount = computed(() => articles.value.length)
const categoryCount = computed(() => categories.value.length)
const tagCount = computed(() => tags.value.length)
const draftCount = computed(() => articles.value.filter(article => article.status === 'draft').length)

// 获取状态样式
const getStatusClass = (status) => {
  const statusMap = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800'
  }
  return statusMap[status] || 'bg-blue-100 text-blue-800'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档'
  }
  return statusMap[status] || '未知'
}

// 获取文章slug
const getArticleSlug = (path) => {
  return path.replace('/articles/', '')
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 删除文章
const deleteArticle = async (article) => {
  if (confirm(`确定要删除文章 "${article.title}" 吗？`)) {
    try {
      await $fetch(`/api/articles/${article.slug}`, {
        method: 'DELETE'
      })
      
      alert('文章删除成功！')
      // 重新加载数据
      await loadData()
    } catch (error) {
      console.error('删除文章失败:', error)
      alert('删除失败：' + (error.data?.statusMessage || error.message))
    }
  }
}

// 加载数据
const loadData = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 调用API获取文章数据
    const articlesData = await $fetch('/api/articles')
    
    articles.value = articlesData || []
    
    // 处理分类数据
    const categoryMap = new Map()
    articles.value.forEach(article => {
      const category = article.category || '未分类'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          count: 0,
          articles: []
        })
      }
      
      const categoryData = categoryMap.get(category)
      categoryData.count++
      categoryData.articles.push({
        title: article.title,
        slug: article.slug,
        date: article.date,
        description: article.description
      })
    })
    
    categories.value = Array.from(categoryMap.values())
    
    // 处理标签数据
    const tagMap = new Map()
    articles.value.forEach(article => {
      const tags = article.tags || []
      tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, 0)
        }
        tagMap.set(tag, tagMap.get(tag) + 1)
      })
    })
    
    tags.value = Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      
  } catch (err) {
    error.value = err.message
    console.error('加载数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>