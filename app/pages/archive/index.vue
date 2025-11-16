<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-8">
      <h1 class="mb-4 text-4xl font-bold text-gray-900">文章归档</h1>
      <p class="text-gray-600">按时间顺序浏览所有文章</p>
    </div>

    <!-- 年份导航 -->
    <div class="p-4 mb-8 bg-white rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="year in availableYears"
          :key="year"
          @click="scrollToYear(year)"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            selectedYear === year 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ year }}
        </button>
        <button
          @click="selectedYear = null"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            selectedYear === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          全部
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="p-6 mb-8 bg-white rounded-lg shadow-sm">
      <div class="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
        <div>
          <div class="mb-2 text-3xl font-bold text-blue-600">{{ totalPosts }}</div>
          <div class="text-gray-600">总文章数</div>
        </div>
        <div>
          <div class="mb-2 text-3xl font-bold text-green-600">{{ availableYears.length }}</div>
          <div class="text-gray-600">年份跨度</div>
        </div>
        <div>
          <div class="mb-2 text-3xl font-bold text-purple-600">{{ avgPostsPerYear }}</div>
          <div class="text-gray-600">年均文章</div>
        </div>
        <div>
          <div class="mb-2 text-3xl font-bold text-orange-600">{{ mostProductiveYear }}</div>
          <div class="text-gray-600">最高产年份</div>
        </div>
      </div>
    </div>

    <!-- 按年份分组的文章列表 -->
    <div class="space-y-8">
      <div
        v-for="(yearData, year) in groupedPosts"
        :key="year"
        :id="`year-${year}`"
        class="bg-white rounded-lg shadow-sm"
      >
        <div class="p-6 border-b border-gray-100">
          <h2 class="flex items-center text-2xl font-bold text-gray-900">
            <span class="mr-3">📅</span>
            {{ year }} 年
            <span class="ml-4 text-base font-normal text-gray-500">
              ({{ yearData.posts.length }} 篇文章)
            </span>
          </h2>
        </div>
        
        <div class="divide-y divide-gray-100">
          <article
            v-for="post in yearData.posts"
            :key="post._path"
            class="p-6 transition-colors hover:bg-gray-50"
          >
            <div class="flex flex-col gap-4 md:flex-row">
              <div class="flex-shrink-0 md:w-32">
                <div class="mb-2 text-sm text-gray-500">
                  {{ formatMonthDay(post.date) }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ post.readingTime.text }}
                </div>
              </div>
              
              <div class="flex-1">
                <div class="flex gap-2 items-center mb-2">
                  <span class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
                    {{ getCategoryName(post.category) }}
                  </span>
                </div>
                
                <h3 class="mb-2 text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600">
                  <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
                </h3>
                
                <p class="mb-3 text-sm text-gray-600 line-clamp-2">{{ post.description }}</p>
                
                <div class="flex justify-between items-center">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in post.tags.slice(0, 3)"
                      :key="tag"
                      class="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  
                  <NuxtLink
                    :to="post._path"
                    class="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    阅读全文 →
                  </NuxtLink>
                </div>
              </div>
            </div>
          </article>
        </div>
        
        <!-- 年份统计 -->
        <div class="p-4 bg-gray-50 rounded-b-lg">
          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>📊 {{ yearData.posts.length }} 篇文章</span>
            <span>🏷️ {{ yearData.uniqueTags }} 个标签</span>
            <span>⏱️ {{ Math.round(yearData.totalReadingTime / 60) }} 小时阅读时间</span>
            <span>📈 {{ yearData.avgWords }} 字/篇</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 月份归档 -->
    <div class="p-6 mt-12 bg-white rounded-lg shadow-sm">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">月份归档</h2>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <div
          v-for="month in monthlyArchive"
          :key="month.key"
          class="p-4 text-center rounded-lg transition-colors cursor-pointer hover:bg-gray-50"
          @click="scrollToMonth(month.key)"
        >
          <div class="text-lg font-semibold text-gray-900">{{ month.name }}</div>
          <div class="text-sm text-gray-500">{{ month.count }} 篇</div>
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
const selectedYear = ref(null)

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
  const colorMap = {
    frontend: 'blue',
    backend: 'green',
    thoughts: 'purple',
    tools: 'orange',
    ai: 'red',
    experience: 'yellow',
    css: 'pink',
    performance: 'indigo'
  }
  
  return Object.entries(categoryStats.value).map(([slug, count]) => ({
    name: getCategoryName(slug),
    slug,
    count,
    color: colorMap[slug] || 'gray'
  }))
})

// 计算属性
const availableYears = computed(() => {
  const years = new Set(safePosts.map(post => new Date(post.date).getFullYear()))
  return Array.from(years).sort((a, b) => b - a)
})

const groupedPosts = computed(() => {
  const grouped = {}
  
  const filteredPosts = selectedYear.value 
    ? safePosts.filter(post => new Date(post.date).getFullYear() === selectedYear.value)
    : safePosts
  
  filteredPosts.forEach(post => {
    const year = new Date(post.date).getFullYear()
    if (!grouped[year]) {
      grouped[year] = {
        posts: [],
        uniqueTags: 0,
        totalReadingTime: 0,
        avgWords: 0
      }
    }
    grouped[year].posts.push(post)
  })
  
  // 计算每年的统计信息
  Object.keys(grouped).forEach(year => {
    const yearData = grouped[year]
    const allTags = yearData.posts.flatMap(post => post.tags || [])
    yearData.uniqueTags = new Set(allTags).size
    yearData.totalReadingTime = yearData.posts.reduce((sum, post) => sum + post.readingTime.minutes, 0)
    yearData.avgWords = Math.round(yearData.posts.reduce((sum, post) => sum + (post.readingTime.words || 0), 0) / yearData.posts.length)
  })
  
  return grouped
})

const totalPosts = safePosts.length
const avgPostsPerYear = Math.round(totalPosts / availableYears.value.length)
const mostProductiveYear = computed(() => {
  const yearCounts = {}
  safePosts.forEach(post => {
    const year = new Date(post.date).getFullYear()
    yearCounts[year] = (yearCounts[year] || 0) + 1
  })
  
  return Object.entries(yearCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || '暂无'
})

const monthlyArchive = computed(() => {
  const monthlyCounts = {}
  
  safePosts.forEach(post => {
    const date = new Date(post.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })
    
    if (!monthlyCounts[monthKey]) {
      monthlyCounts[monthKey] = {
        key: monthKey,
        name: monthName,
        count: 0
      }
    }
    monthlyCounts[monthKey].count++
  })
  
  return Object.values(monthlyCounts)
    .sort((a, b) => b.key.localeCompare(a.key))
    .slice(0, 12)
})

// 方法
const formatMonthDay = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  })
}

const getCategoryName = (slug) => {
  const category = categoryConfig.find(c => c.slug === slug)
  return category ? category.name : slug
}

const scrollToYear = (year) => {
  selectedYear.value = year
  const element = document.getElementById(`year-${year}`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const scrollToMonth = (monthKey) => {
  // 可以添加滚动到具体月份的逻辑
  console.log('Scrolling to month:', monthKey)
}

// 页面SEO
useHead({
  title: '文章归档',
  meta: [
    { name: 'description', content: '按时间顺序浏览所有技术文章，查看每年的写作历程' }
  ]
})
</script>