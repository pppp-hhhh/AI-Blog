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
            <h1 class="text-xl font-semibold text-gray-900">
              {{ isEdit ? '编辑文章' : '新建文章' }}
            </h1>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="saveAsDraft"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              保存草稿
            </button>
            <button
              @click="preview"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              预览
            </button>
            <button
              @click="publish"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {{ isEdit ? '更新' : '发布' }}
            </button>
            <div v-if="lastSaved" class="text-sm text-gray-500">
              上次保存: {{ lastSaved }}
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 编辑区域 -->
        <div class="space-y-6">
          <!-- 基本信息 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input
                  v-model="article.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入文章标题"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">描述</label>
                <textarea
                  v-model="article.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入文章描述"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    v-model="article.category"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">选择分类</option>
                    <option v-for="category in availableCategories" :key="category" :value="category">
                      {{ category }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">发布日期</label>
                  <input
                    v-model="article.date"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <div class="space-y-2">
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="tag in article.tags"
                      :key="tag"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ tag }}
                      <button
                        @click="removeTag(tag)"
                        class="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <div class="flex space-x-2">
                    <input
                      v-model="newTag"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="添加标签"
                      @keyup.enter="addTag"
                    >
                    <button
                      @click="addTag"
                      class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      添加
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">封面图片</label>
                <div class="flex space-x-2">
                  <input
                    v-model="article.image"
                    type="text"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="输入图片URL"
                  >
                  <button
                    @click="selectImage"
                    class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    选择
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 内容编辑 -->
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">内容编辑</h3>
              <div class="flex space-x-2">
                <button
                  @click="showTemplateModal = true"
                  class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  模板
                </button>
                <button
            @click="insertImage"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            插入图片
          </button>
          <label class="px-3 py-1 text-sm border border-blue-300 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer">
            上传图片
            <input
              type="file"
              accept="image/*"
              @change="uploadImage"
              class="hidden"
            />
          </label>
          <div class="border-l border-gray-300 mx-2"></div>
          <button
            @click="insertMarkdown('bold')"
            class="px-2 py-1 text-sm font-bold border border-gray-300 rounded-md hover:bg-gray-50"
            title="粗体"
          >
            B
          </button>
          <button
            @click="insertMarkdown('italic')"
            class="px-2 py-1 text-sm italic border border-gray-300 rounded-md hover:bg-gray-50"
            title="斜体"
          >
            I
          </button>
          <button
            @click="insertMarkdown('link')"
            class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            title="链接"
          >
            🔗
          </button>
          <button
            @click="insertMarkdown('code')"
            class="px-2 py-1 text-sm font-mono border border-gray-300 rounded-md hover:bg-gray-50"
            title="代码"
          >
            &lt;/&gt;
          </button>
          <button
            @click="insertMarkdown('heading')"
            class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            title="标题"
          >
            H
          </button>
          <button
            @click="insertMarkdown('list')"
            class="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            title="列表"
          >
            •
          </button>
              </div>
            </div>
            <textarea
              v-model="article.body"
              rows="20"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="使用Markdown格式编写文章内容..."
            ></textarea>
          </div>
        </div>

        <!-- 预览区域 -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">实时预览</h3>
              <button
                @click="togglePreview"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {{ showPreview ? '隐藏' : '显示' }}
              </button>
            </div>
            <div v-if="showPreview" class="prose max-w-none">
              <h1>{{ article.title || '文章标题' }}</h1>
              <div class="text-gray-500 text-sm mb-4">
                <span>{{ article.date || '发布日期' }}</span>
                <span class="mx-2">•</span>
                <span>{{ article.category || '分类' }}</span>
                <span class="mx-2">•</span>
                <span>{{ readingTime }} 分钟阅读</span>
              </div>
              <div v-if="article.image" class="mb-4">
                <img :src="article.image" :alt="article.title" class="rounded-lg">
              </div>
              <div v-if="article.tags && article.tags.length" class="mb-4">
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2"
                >
                  {{ tag }}
                </span>
              </div>
              <div v-html="renderedContent" class="prose max-w-none"></div>
            </div>
            <div v-else class="text-gray-500 text-center py-8">
              点击"显示"按钮查看预览
            </div>
          </div>

          <!-- SEO预览 -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">SEO预览</h3>
            <div class="border border-gray-200 rounded p-4 bg-gray-50">
              <div class="text-blue-600 font-medium text-lg mb-1">
                {{ article.title || '文章标题' }}
              </div>
              <div class="text-green-600 text-sm mb-2">
                https://yourblog.com/articles/{{ articleSlug }}
              </div>
              <div class="text-gray-600 text-sm">
                {{ article.description || '文章描述' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模板选择模态框 -->
    <div v-if="showTemplateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">选择模板</h3>
          <button @click="showTemplateModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="template in templates" :key="template.id" class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors" @click="applyTemplate(template)">
            <div class="flex items-start justify-between mb-2">
              <h4 class="font-semibold text-gray-900">{{ template.name }}</h4>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ template.category }}</span>
            </div>
            <p class="text-gray-600 text-sm mb-3">{{ template.description }}</p>
            <div class="flex flex-wrap gap-1 mb-3">
              <span v-for="tag in template.tags" :key="tag" class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {{ tag }}
              </span>
            </div>
            <div class="bg-gray-100 rounded p-3 text-xs text-gray-700 overflow-hidden max-h-32 overflow-y-auto">
              <pre class="whitespace-pre-wrap">{{ template.content }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// 检查是否为编辑模式
const isEdit = computed(() => {
  const slugParam = route.params.slug
  return slugParam && slugParam !== 'new' && slugParam[0] !== 'new'
})

// 文章数据
const article = ref({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  tags: [],
  image: '',
  body: '',
  status: 'draft'
})

// 新标签输入
const newTag = ref('')

// 自动保存定时器
let autoSaveTimer = null
const lastSaved = ref(null)

// 预览控制
const showPreview = ref(true)

// 模板模态框
const showTemplateModal = ref(false)

// 可用分类
const availableCategories = ['frontend', 'backend', 'performance', 'thoughts', 'css']

// 模板列表
const templates = ref([])

// 加载模板
const loadTemplates = async () => {
  try {
    const response = await $fetch('/api/templates')
    if (response.success) {
      templates.value = response.templates
    }
  } catch (error) {
    console.error('加载模板失败:', error)
    // 使用默认模板
    templates.value = [
      {
        name: '技术教程',
        description: '适合技术教程类文章',
        content: `# 标题\n\n## 介绍\n\n在这里写介绍内容...\n\n## 前提条件\n\n- 条件1\n- 条件2\n- 条件3\n\n## 步骤\n\n### 第一步\n\n详细说明第一步...\n\n### 第二步\n\n详细说明第二步...\n\n## 总结\n\n总结内容...\n\n## 参考资料\n\n- [链接1](url)\n- [链接2](url)`
      },
      {
        name: '问题解决方案',
        description: '适合记录问题和解决方案',
        content: `# 问题描述\n\n## 现象\n\n描述问题的具体现象...\n\n## 环境信息\n\n- 操作系统：\n- 软件版本：\n- 其他相关信息：\n\n## 原因分析\n\n分析问题产生的原因...\n\n## 解决方案\n\n### 方案一\n\n详细说明方案一...\n\n### 方案二\n\n详细说明方案二...\n\n## 验证结果\n\n验证解决方案是否有效...\n\n## 总结\n\n总结经验教训...`
      },
      {
        name: '学习笔记',
        description: '适合学习笔记类文章',
        content: `# 学习主题\n\n## 学习目标\n\n- 目标1\n- 目标2\n- 目标3\n\n## 关键概念\n\n### 概念1\n\n解释概念1...\n\n### 概念2\n\n解释概念2...\n\n## 实践过程\n\n### 步骤1\n\n详细记录步骤1...\n\n### 步骤2\n\n详细记录步骤2...\n\n## 遇到的问题\n\n记录遇到的问题和解决方法...\n\n## 心得体会\n\n分享学习心得...\n\n## 下一步计划\n\n- 计划1\n- 计划2`
      }
    ]
  }
}

// 计算阅读时间
const readingTime = computed(() => {
  const wordsPerMinute = 200
  const words = (article.value.body || '').split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
})

// 改进的Markdown渲染
const renderedContent = computed(() => {
  let content = article.value.body || ''
  
  // 代码块处理（优先处理，避免与其他规则冲突）
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  
  // 行内代码
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // 标题
  content = content
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // 粗体和斜体
  content = content
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
  
  // 链接
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
  
  // 图片
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
  
  // 列表
  content = content.replace(/^- (.*$)/gim, '<li>$1</li>')
  content = content.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside my-2">$1</ul>')
  
  // 引用
  content = content.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 italic text-gray-600">$1</blockquote>')
  
  // 段落
  content = content.replace(/\n\n/g, '</p><p>')
  content = '<p>' + content + '</p>'
  
  // 清理多余的标签
  content = content.replace(/<p>(<h[1-6]>)/g, '$1')
  content = content.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
  content = content.replace(/<p>(<ul>)/g, '$1')
  content = content.replace(/(<\/ul>)<\/p>/g, '$1')
  content = content.replace(/<p>(<blockquote>)/g, '$1')
  content = content.replace(/(<\/blockquote>)<\/p>/g, '$1')
  content = content.replace(/<p>(<pre>)/g, '$1')
  content = content.replace(/(<\/pre>)<\/p>/g, '$1')
  
  return content
})

// 文章slug
const articleSlug = computed(() => {
  return article.value.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
})

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !article.value.tags.includes(tag)) {
    article.value.tags.push(tag)
    newTag.value = ''
  }
}

// 删除标签
const removeTag = (tag) => {
  const index = article.value.tags.indexOf(tag)
  if (index > -1) {
    article.value.tags.splice(index, 1)
  }
}

// 应用模板
const applyTemplate = (template) => {
  article.value.body = template.content
  if (template.category) {
    article.value.category = template.category
  }
  if (template.tags && template.tags.length > 0) {
    article.value.tags = [...template.tags]
  }
  showTemplateModal.value = false
}

// 选择图片
const selectImage = () => {
  const url = prompt('请输入图片URL:')
  if (url) {
    article.value.image = url
  }
}

// 插入图片
const insertImage = () => {
  const url = prompt('请输入图片URL:')
  if (url) {
    const alt = prompt('请输入图片描述（可选）:') || '图片'
    const markdown = `![${alt}](${url})`
    article.value.body += '\n\n' + markdown
  }
}

// 上传图片
const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (response.success) {
      const alt = prompt('请输入图片描述（可选）:') || '图片'
      const markdown = `![${alt}](${response.url})`
      article.value.body += '\n\n' + markdown
      alert('图片上传成功！')
    } else {
      alert('上传失败：' + response.message)
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    alert('图片上传失败：' + (error.data?.statusMessage || error.message))
  }
}

// Markdown快捷键
const insertMarkdown = (type) => {
  const textarea = document.querySelector('textarea')
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = article.value.body.substring(start, end)
  
  let newText = ''
  let newCursorPos = start

  switch (type) {
    case 'bold':
      newText = `**${selectedText || '粗体文本'}**`
      newCursorPos = start + 2 + (selectedText ? selectedText.length : 4) + 2
      break
    case 'italic':
      newText = `*${selectedText || '斜体文本'}*`
      newCursorPos = start + 1 + (selectedText ? selectedText.length : 4) + 1
      break
    case 'link':
      const url = prompt('请输入链接URL:')
      if (url) {
        newText = `[${selectedText || '链接文本'}](${url})`
        newCursorPos = start + (selectedText ? selectedText.length : 4) + url.length + 4
      }
      break
    case 'code':
      newText = '`' + (selectedText || '代码') + '`'
      newCursorPos = start + 1 + (selectedText ? selectedText.length : 2) + 1
      break
    case 'heading':
      newText = `## ${selectedText || '标题'}`
      newCursorPos = start + 3 + (selectedText ? selectedText.length : 2)
      break
    case 'list':
      newText = `- ${selectedText || '列表项'}`
      newCursorPos = start + 2 + (selectedText ? selectedText.length : 3)
      break
  }

  if (newText) {
    article.value.body = article.value.body.substring(0, start) + newText + article.value.body.substring(end)
    
    // 设置光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }
}

// 预览
const preview = () => {
  const previewWindow = window.open('', '_blank')
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${article.value.title || '文章预览'}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 40px 20px; 
          line-height: 1.7; 
          color: #333;
          background: #fff;
        }
        h1 { font-size: 2em; margin: 0.67em 0; color: #2d3748; }
        h2 { font-size: 1.5em; margin: 0.75em 0; color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
        h3 { font-size: 1.17em; margin: 0.83em 0; color: #2d3748; }
        h4 { font-size: 1em; margin: 1em 0; color: #2d3748; }
        p { margin-bottom: 1em; }
        code { 
          background: #f7fafc; 
          padding: 2px 6px; 
          border-radius: 3px; 
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 0.9em;
          border: 1px solid #e2e8f0;
        }
        pre { 
          background: #f7fafc; 
          padding: 16px; 
          border-radius: 6px; 
          overflow-x: auto; 
          border: 1px solid #e2e8f0;
          margin: 1em 0;
        }
        pre code { 
          background: none; 
          padding: 0; 
          border: none; 
          font-size: 0.85em;
        }
        blockquote { 
          border-left: 4px solid #4299e1; 
          margin: 1em 0; 
          padding-left: 1.5em; 
          color: #4a5568; 
          font-style: italic;
          background: #f7fafc;
          padding: 1em 1.5em;
          border-radius: 0 6px 6px 0;
        }
        img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 8px; 
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin: 1.5em 0;
        }
        ul {
          margin: 1em 0;
          padding-left: 2em;
        }
        li {
          margin: 0.5em 0;
        }
        a {
          color: #3182ce;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .article-header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 1em;
          margin-bottom: 2em;
        }
        .article-meta {
          color: #718096;
          font-size: 0.9em;
          margin-top: 0.5em;
        }
      </style>
    </head>
    <body>
      <div class="article-header">
        <h1>${article.value.title || '无标题'}</h1>
        <div class="article-meta">
          ${article.value.date || ''} • ${article.value.category || '未分类'} • ${readingTime.value} 分钟阅读
        </div>
      </div>
      ${renderedContent.value}
    </body>
    </html>
  `
  previewWindow.document.write(html)
  previewWindow.document.close()
}

// 保存草稿
const saveAsDraft = async () => {
  article.value.status = 'draft'
  await saveArticle()
}

// 发布
const publish = async () => {
  if (!article.value.title) {
    alert('请输入文章标题')
    return
  }
  if (!article.value.description) {
    alert('请输入文章描述')
    return
  }
  if (!article.value.category) {
    alert('请选择分类')
    return
  }
  if (!article.value.body) {
    alert('请输入文章内容')
    return
  }
  
  article.value.status = 'published'
  await saveArticle()
}

// 保存文章
const saveArticle = async (isAutoSave = false) => {
  try {
    // 调用保存API
    const response = await $fetch('/api/articles', {
      method: 'POST',
      body: article.value
    })
    
    if (response.success) {
      if (!isAutoSave) {
        alert('文章保存成功！')
        // 返回管理后台
        router.push('/admin')
      } else {
        lastSaved.value = new Date().toLocaleTimeString()
        console.log('自动保存成功:', lastSaved.value)
      }
    } else {
      if (!isAutoSave) {
        alert('保存失败：' + response.message)
      }
    }
  } catch (error) {
    console.error('保存文章失败:', error)
    if (!isAutoSave) {
      alert('保存失败：' + (error.data?.statusMessage || error.message))
    }
  }
}

// 切换预览
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 加载文章（编辑模式）
const loadArticle = async () => {
  if (isEdit.value) {
    try {
      // 获取正确的slug参数
      const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
      
      // 调用API加载文章
      const data = await $fetch(`/api/articles/${slug}`)
      
      // 填充表单数据
      article.value = {
        title: data.title || '',
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || '',
        tags: data.tags || [],
        image: data.image || '',
        body: data.body || '',
        status: data.status || 'published'
      }
      
      console.log('文章加载成功:', data)
    } catch (error) {
      console.error('加载文章失败:', error)
      alert('加载文章失败：' + (error.data?.statusMessage || error.message))
    }
  }
}

// 自动保存函数
const autoSave = () => {
  // 清除之前的定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  // 设置新的定时器，30秒后自动保存
  autoSaveTimer = setTimeout(() => {
    if (article.value.title && article.value.body) {
      console.log('执行自动保存...')
      saveArticle(true)
    }
  }, 30000) // 30秒
}

// 监听文章内容变化
watch([() => article.value.title, () => article.value.body, () => article.value.description], () => {
  if (isEdit.value) {
    autoSave()
  }
})

// 页面加载时初始化
onMounted(() => {
  loadArticle()
  loadTemplates()
  // 如果是编辑模式，启动自动保存
  if (isEdit.value) {
    autoSave()
  }
})

// 页面卸载时清除定时器
onUnmounted(() => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
})
</script>