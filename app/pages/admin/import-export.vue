<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部导航 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/admin" class="flex items-center text-gray-600 hover:text-gray-900">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              返回管理后台
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold text-gray-900">数据导入导出</h1>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- 导入功能 -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">导入文章</h2>
          <p class="text-sm text-gray-500">从文件导入文章数据</p>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">文件格式</label>
              <select v-model="importFormat" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">选择文件</label>
              <input 
                type="file" 
                @change="handleFileSelect" 
                :accept="getFileAcceptTypes()"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div class="flex gap-3">
              <button 
                @click="handleImportArticles" 
                :disabled="!selectedFile"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                导入文章
              </button>
              <button 
                @click="previewImport" 
                :disabled="!selectedFile"
                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                预览
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 导出功能 -->
      <div class="bg-white rounded-lg shadow mb-8">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">导出文章</h2>
          <p class="text-sm text-gray-500">将文章数据导出到文件</p>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">导出范围</label>
              <select v-model="exportScope" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">所有文章</option>
                <option value="published">已发布文章</option>
                <option value="draft">草稿文章</option>
                <option value="archived">归档文章</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">文件格式</label>
              <select v-model="exportFormat" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>
            <button 
                @click="handleExportArticles" 
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                导出文章
              </button>
          </div>
        </div>
      </div>

      <!-- 备份功能 -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">数据备份</h2>
          <p class="text-sm text-gray-500">创建完整的数据备份</p>
        </div>
        <div class="px-6 py-4">
          <div class="space-y-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-blue-900 mb-2">备份包含内容</h3>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• 所有文章数据</li>
                <li>• 分类和标签信息</li>
                <li>• 文章状态信息</li>
                <li>• 文章元数据</li>
              </ul>
            </div>
            <button 
              @click="createBackup" 
              class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              创建备份
            </button>
          </div>
        </div>
      </div>

      <!-- 预览模态框 -->
      <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">导入预览</h3>
            <button @click="showPreview = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
            <pre class="text-sm text-gray-700">{{ previewData }}</pre>
          </div>
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button @click="showPreview = false" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
              取消
            </button>
            <button @click="confirmImport" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              确认导入
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { dataIO } = useEnhancedArticles()

// 导入相关状态
const importFormat = ref('json')
const selectedFile = ref(null)
const showPreview = ref(false)
const previewData = ref('')

// 导出相关状态
const exportScope = ref('all')
const exportFormat = ref('json')

// 获取文件接受类型
const getFileAcceptTypes = () => {
  switch (importFormat.value) {
    case 'json': return '.json'
    case 'csv': return '.csv'
    case 'markdown': return '.md,.markdown'
    default: return '*'
  }
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

// 预览导入
const previewImport = async () => {
  if (!selectedFile.value) return
  
  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewData.value = e.target.result
      showPreview.value = true
    }
    reader.readAsText(selectedFile.value)
  } catch (error) {
    alert('预览失败: ' + error.message)
  }
}

// 导入文章
const handleImportArticles = async () => {
  if (!selectedFile.value) return
  
  try {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const fileData = e.target.result
      const result = await dataIO.import(fileData, importFormat.value)
      
      if (result.success) {
        alert(`成功导入 ${result.count} 篇文章`)
        selectedFile.value = null
      } else {
        alert('导入失败: ' + result.error)
      }
    }
    reader.readAsText(selectedFile.value)
  } catch (error) {
    alert('导入失败: ' + error.message)
  }
}

// 确认导入
const confirmImport = () => {
  showPreview.value = false
  handleImportArticles()
}

// 导出文章
const handleExportArticles = async () => {
  try {
    const data = await dataIO.export(exportFormat.value)
    
    if (data) {
      // 创建下载链接
      const blob = new Blob([data], { type: getContentType(exportFormat.value) })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `articles_${exportScope.value}_${new Date().toISOString().split('T')[0]}.${exportFormat.value}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      alert('导出失败：没有数据')
    }
  } catch (error) {
    alert('导出失败: ' + error.message)
  }
}

// 创建备份
const createBackup = async () => {
  try {
    const data = await dataIO.export('json')
    
    if (data) {
      const backupData = {
        version: '1.0',
        createdAt: new Date().toISOString(),
        articles: JSON.parse(data)
      }
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `blog_backup_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert('备份创建成功')
    } else {
      alert('备份创建失败：没有数据')
    }
  } catch (error) {
    alert('备份创建失败: ' + error.message)
  }
}

// 获取内容类型
const getContentType = (format) => {
  switch (format) {
    case 'json': return 'application/json'
    case 'csv': return 'text/csv'
    case 'markdown': return 'text/markdown'
    default: return 'text/plain'
  }
}
</script>