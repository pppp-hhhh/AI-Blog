<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">动态文章管理测试</h1>
    
    <!-- 文章统计 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-blue-100 p-4 rounded-lg">
        <h3 class="text-lg font-semibold">总文章数</h3>
        <p class="text-2xl font-bold text-blue-600">{{ stats?.total || 0 }}</p>
      </div>
      <div class="bg-green-100 p-4 rounded-lg">
        <h3 class="text-lg font-semibold">已发布</h3>
        <p class="text-2xl font-bold text-green-600">{{ stats?.published || 0 }}</p>
      </div>
      <div class="bg-yellow-100 p-4 rounded-lg">
        <h3 class="text-lg font-semibold">草稿</h3>
        <p class="text-2xl font-bold text-yellow-600">{{ stats?.drafts || 0 }}</p>
      </div>
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="text-lg font-semibold">已归档</h3>
        <p class="text-2xl font-bold text-gray-600">{{ stats?.archived || 0 }}</p>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-xl font-semibold mb-4">快速操作</h2>
      <div class="flex flex-wrap gap-4">
        <button @click="createSampleArticle" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          创建示例文章
        </button>
        <button @click="importSampleData" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          导入示例数据
        </button>
        <button @click="exportArticles" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
          导出所有文章
        </button>
        <button @click="refreshData" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          刷新数据
        </button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold">文章列表</h2>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p class="mt-2 text-gray-500">加载中...</p>
        </div>
        
        <div v-else-if="articles.length === 0" class="text-center py-8 text-gray-500">
          <p>暂无文章</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="article in articles" :key="article.id" class="border rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold">{{ article.title }}</h3>
                <p class="text-gray-600 mt-1">{{ article.description }}</p>
                <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>分类: {{ article.category }}</span>
                  <span>状态: <span :class="getStatusClass(article.status)">{{ article.status }}</span></span>
                  <span>日期: {{ article.date }}</span>
                </div>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span v-for="tag in article.tags" :key="tag" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {{ tag }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="toggleStatus(article)" class="text-blue-500 hover:text-blue-700">
                  切换状态
                </button>
                <button @click="deleteArticle(article)" class="text-red-500 hover:text-red-700">
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getAllArticles, createArticle, updateArticle, deleteArticle: deleteArticleFromDB, dataIO, getArticleStats } = useEnhancedArticles()

const articles = ref([])
const stats = ref({ total: 0, published: 0, draft: 0, archived: 0 })
const loading = ref(true)

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    articles.value = await getAllArticles()
    stats.value = await getArticleStats()
  } catch (error) {
    console.error('加载数据失败:', error)
    alert('加载数据失败: ' + error.message)
  } finally {
    loading.value = false
  }
}

// 创建示例文章
const createSampleArticle = async () => {
  try {
    const sampleData = {
      title: '示例文章 - ' + new Date().toLocaleString(),
      description: '这是一个动态创建的示例文章',
      body: '# 示例内容\n\n这是通过动态文章管理功能创建的文章内容。',
      category: '测试分类',
      tags: ['测试', '示例'],
      status: 'draft',
      date: new Date().toISOString().split('T')[0]
    }
    
    const result = await createArticle(sampleData)
    if (result.success) {
      alert('文章创建成功！')
      await loadData()
    } else {
      alert('创建失败: ' + result.error)
    }
  } catch (error) {
    alert('创建失败: ' + error.message)
  }
}

// 导入示例数据
const importSampleData = async () => {
  try {
    const response = await fetch('/sample-articles.json')
    const sampleArticles = await response.json()
    
    let successCount = 0
    for (const article of sampleArticles) {
      const result = await createArticle(article)
      if (result.success) {
        successCount++
      }
    }
    
    alert(`成功导入 ${successCount} 篇文章！`)
    await loadData()
  } catch (error) {
    alert('导入失败: ' + error.message)
  }
}

// 导出文章
const exportArticles = async () => {
  try {
    const data = await dataIO.export('json')
    if (data) {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `articles_export_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      alert('导出成功！')
    }
  } catch (error) {
    alert('导出失败: ' + error.message)
  }
}

// 切换文章状态
const toggleStatus = async (article) => {
  const newStatus = article.status === 'published' ? 'draft' : 'published'
  try {
    const result = await updateArticle(article.id, { status: newStatus })
    if (result.success) {
      await loadData()
    } else {
      alert('更新失败: ' + result.error)
    }
  } catch (error) {
    alert('更新失败: ' + error.message)
  }
}

// 删除文章
const deleteArticle = async (article) => {
  if (!confirm(`确定要删除文章 "${article.title}" 吗？`)) {
    return
  }
  
  try {
    const result = await deleteArticleFromDB(article.id)
    if (result.success) {
      alert('文章已删除')
      await loadData()
    } else {
      alert('删除失败: ' + result.error)
    }
  } catch (error) {
    alert('删除失败: ' + error.message)
  }
}

// 刷新数据
const refreshData = () => {
  loadData()
}

// 获取状态样式
const getStatusClass = (status) => {
  const classes = {
    published: 'text-green-600 font-semibold',
    draft: 'text-yellow-600 font-semibold',
    archived: 'text-gray-600 font-semibold'
  }
  return classes[status] || 'text-gray-600'
}

// 页面加载时获取数据
onMounted(() => {
  loadData()
})
</script>