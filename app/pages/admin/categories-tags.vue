<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部导航 -->
    <nav class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/admin" class="text-gray-500 hover:text-gray-700">
              ← 返回管理
            </NuxtLink>
            <h1 class="text-xl font-semibold text-gray-900">分类和标签管理</h1>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 分类管理 -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">分类管理</h2>
              <button
                @click="showAddCategoryModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                添加分类
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="category in categories"
                :key="category.name"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span class="text-blue-600 font-semibold text-lg">
                      {{ category.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
                    <p class="text-sm text-gray-500">{{ category.count }} 篇文章</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editCategory(category)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteCategory(category)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 标签管理 -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">标签管理</h2>
              <button
                @click="showAddTagModal = true"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                添加标签
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="tag in tags"
                :key="tag.name"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {{ tag.name }}
                  </span>
                  <span class="text-sm text-gray-500">{{ tag.count }} 次使用</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editTag(tag)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    编辑
                  </button>
                  <button
                    @click="deleteTag(tag)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 批量操作 -->
      <div class="mt-8 bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">批量操作</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              @click="mergeTags"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              合并标签
            </button>
            <button
              @click="cleanupUnusedTags"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              清理未使用标签
            </button>
            <button
              @click="exportData"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              导出数据
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加分类模态框 -->
    <div v-if="showAddCategoryModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加新分类</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分类名称</label>
            <input
              v-model="newCategory.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入分类名称"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分类描述</label>
            <textarea
              v-model="newCategory.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入分类描述"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showAddCategoryModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="addCategory"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            添加
          </button>
        </div>
      </div>
    </div>

    <!-- 添加标签模态框 -->
    <div v-if="showAddTagModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加新标签</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">标签名称</label>
            <input
              v-model="newTag.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="输入标签名称"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">标签颜色</label>
            <select
              v-model="newTag.color"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="blue">蓝色</option>
              <option value="green">绿色</option>
              <option value="red">红色</option>
              <option value="yellow">黄色</option>
              <option value="purple">紫色</option>
              <option value="pink">粉色</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="showAddTagModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="addTag"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { categories, tags } = useBlogData()

// 模态框状态
const showAddCategoryModal = ref(false)
const showAddTagModal = ref(false)

// 新分类数据
const newCategory = ref({
  name: '',
  description: '',
  color: 'blue'
})

// 新标签数据
const newTag = ref({
  name: '',
  color: 'green'
})

// 添加分类
const addCategory = async () => {
  if (!newCategory.value.name) {
    alert('请输入分类名称')
    return
  }
  
  try {
    // 这里应该调用API添加分类
    console.log('添加分类:', newCategory.value)
    
    // 重置表单
    newCategory.value = { name: '', description: '', color: 'blue' }
    showAddCategoryModal.value = false
    
    alert('分类添加成功！')
  } catch (error) {
    console.error('添加分类失败:', error)
    alert('添加分类失败')
  }
}

// 添加标签
const addTag = async () => {
  if (!newTag.value.name) {
    alert('请输入标签名称')
    return
  }
  
  try {
    // 这里应该调用API添加标签
    console.log('添加标签:', newTag.value)
    
    // 重置表单
    newTag.value = { name: '', color: 'green' }
    showAddTagModal.value = false
    
    alert('标签添加成功！')
  } catch (error) {
    console.error('添加标签失败:', error)
    alert('添加标签失败')
  }
}

// 编辑分类
const editCategory = (category) => {
  const newName = prompt('请输入新的分类名称:', category.name)
  if (newName && newName !== category.name) {
    // 这里应该调用API更新分类
    console.log('更新分类:', category.name, '->', newName)
    alert('分类更新成功！')
  }
}

// 编辑标签
const editTag = (tag) => {
  const newName = prompt('请输入新的标签名称:', tag.name)
  if (newName && newName !== tag.name) {
    // 这里应该调用API更新标签
    console.log('更新标签:', tag.name, '->', newName)
    alert('标签更新成功！')
  }
}

// 删除分类
const deleteCategory = (category) => {
  if (confirm(`确定要删除分类 "${category.name}" 吗？该分类下的文章将变为未分类。`)) {
    // 这里应该调用API删除分类
    console.log('删除分类:', category.name)
    alert('分类删除成功！')
  }
}

// 删除标签
const deleteTag = (tag) => {
  if (confirm(`确定要删除标签 "${tag.name}" 吗？`)) {
    // 这里应该调用API删除标签
    console.log('删除标签:', tag.name)
    alert('标签删除成功！')
  }
}

// 合并标签
const mergeTags = () => {
  alert('标签合并功能开发中...')
}

// 清理未使用标签
const cleanupUnusedTags = () => {
  if (confirm('确定要清理所有未使用的标签吗？')) {
    // 这里应该调用API清理标签
    console.log('清理未使用标签')
    alert('清理完成！')
  }
}

// 导出数据
const exportData = () => {
  const data = {
    categories: categories.value,
    tags: tags.value,
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `categories-tags-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>