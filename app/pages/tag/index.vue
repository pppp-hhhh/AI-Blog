<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">文章标签</h1>
      <p class="text-gray-600">按标签浏览文章，发现感兴趣的技术主题</p>
    </div>

    <!-- 标签搜索 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索标签..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          @input="handleSearch"
        >
        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- 标签云 -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">热门标签</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          v-for="tag in displayedTags"
          :key="tag.name"
          :to="`/tag/${tag.name}`"
          class="px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
          :class="getTagSizeClass(tag)"
        >
          {{ tag.name }}
          <span class="ml-1 text-xs opacity-75">({{ tag.count }})</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 标签分类 -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="group in tagGroups" 
        :key="group.name"
        class="bg-white rounded-lg shadow-sm p-6"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span class="mr-2">{{ group.icon }}</span>
          {{ group.name }}
        </h3>
        <div class="space-y-2">
          <NuxtLink
            v-for="tag in group.tags.slice(0, 8)"
            :key="tag.name"
            :to="`/tag/${tag.name}`"
            class="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-center">
              <span class="text-gray-700 hover:text-blue-600">{{ tag.name }}</span>
              <span class="text-xs text-gray-500">{{ tag.count }}</span>
            </div>
          </NuxtLink>
          <NuxtLink
            v-if="group.tags.length > 8"
            :to="`/tag`"
            class="block px-3 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            查看全部 {{ group.tags.length }} 个标签 →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="mt-12 bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">标签统计</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold text-blue-600 mb-2">{{ totalTags }}</div>
          <div class="text-gray-600">总标签数</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-green-600 mb-2">{{ totalPosts }}</div>
          <div class="text-gray-600">总文章数</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-purple-600 mb-2">{{ avgTagsPerPost }}</div>
          <div class="text-gray-600">平均标签数</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-orange-600 mb-2">{{ mostPopularTag }}</div>
          <div class="text-gray-600">最热门标签</div>
        </div>
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

// 响应式数据
const searchQuery = ref('')

// 获取所有标签
const allTags = safePosts.flatMap(post => post.tags || [])
const tagCounts = allTags.reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1
  return acc
}, {})

// 标签分组配置
const tagGroupConfig = [
  { 
    name: '前端技术', 
    icon: '🎨', 
    keywords: ['vue', 'react', 'javascript', 'css', 'html', 'typescript', 'webpack', 'vite', 'tailwind', 'sass', 'less', 'jquery', 'angular', 'svelte']
  },
  { 
    name: '后端开发', 
    icon: '⚙️', 
    keywords: ['node', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'csharp', 'mysql', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes']
  },
  { 
    name: '人工智能', 
    icon: '🤖', 
    keywords: ['ai', 'machine-learning', 'deep-learning', 'tensorflow', 'pytorch', 'neural-network', 'nlp', 'computer-vision', 'data-science', 'algorithm']
  },
  { 
    name: '开发工具', 
    icon: '🛠️', 
    keywords: ['git', 'github', 'vscode', 'ide', 'npm', 'yarn', 'pnpm', 'eslint', 'prettier', 'babel', 'postman', 'figma', 'photoshop']
  },
  { 
    name: '移动开发', 
    icon: '📱', 
    keywords: ['android', 'ios', 'flutter', 'react-native', 'swift', 'kotlin', 'objective-c', 'xamarin', 'ionic', 'cordova']
  },
  { 
    name: '其他', 
    icon: '📦', 
    keywords: [] }
]

// 处理标签数据
const processedTags = Object.entries(tagCounts)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count)

// 标签分组
const tagGroups = computed(() => {
  const groups = tagGroupConfig.map(group => ({
    ...group,
    tags: []
  }))

  processedTags.forEach(tag => {
    let assigned = false
    for (const group of groups) {
      if (group.keywords.some(keyword => tag.name.toLowerCase().includes(keyword))) {
        group.tags.push(tag)
        assigned = true
        break
      }
    }
    if (!assigned) {
      groups[groups.length - 1].tags.push(tag)
    }
  })

  return groups.filter(group => group.tags.length > 0)
})

// 筛选后的标签
const displayedTags = computed(() => {
  if (!searchQuery.value) {
    return processedTags.slice(0, 50)
  }
  
  const query = searchQuery.value.toLowerCase()
  return processedTags.filter(tag => 
    tag.name.toLowerCase().includes(query)
  ).slice(0, 50)
})

// 计算属性
const totalTags = processedTags.length
const totalPosts = safePosts.length
const avgTagsPerPost = (allTags.length / totalPosts).toFixed(1)
const mostPopularTag = processedTags[0]?.name || '暂无'

// 方法
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const getTagSizeClass = (tag) => {
  if (tag.count > 20) {
    return 'text-xl bg-blue-600 text-white hover:bg-blue-700'
  } else if (tag.count > 10) {
    return 'text-lg bg-blue-100 text-blue-800 hover:bg-blue-200'
  } else if (tag.count > 5) {
    return 'bg-blue-50 text-blue-700 hover:bg-blue-100'
  }
  return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
}

// 页面SEO
useHead({
  title: '文章标签',
  meta: [
    { name: 'description', content: '按标签浏览所有技术文章，发现前端开发、后端开发、人工智能等技术主题' }
  ]
})
</script>