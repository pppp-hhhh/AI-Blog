<template>
  <div class="mx-auto max-w-4xl">
    <!-- 文章头部 -->
    <header class="mb-8">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <NuxtLink 
          to="/articles" 
          class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"
        >
          <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回文章列表
        </NuxtLink>
      </div>

      <!-- 文章元信息 -->
      <div class="mb-4">
        <div class="flex items-center mb-2 text-sm text-gray-500">
          <time>{{ formatDate(data.date) }}</time>
          <span class="mx-2">•</span>
          <span>{{ data.readingTime.text }}</span>
          <span class="mx-2">•</span>
          <span class="px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">
            {{ data.category }}
          </span>
        </div>
        
        <!-- 标签 -->
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in data.tags" 
            :key="tag"
            class="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 文章标题 -->
      <h1 class="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
        {{ data.title }}
      </h1>

      <!-- 文章描述 -->
      <p class="text-xl leading-relaxed text-gray-600">
        {{ data.description }}
      </p>
    </header>

    <!-- 文章封面图片 -->
    <div v-if="data.image" class="mb-8">
      <img 
        :src="data.image" 
        :alt="data.title"
        class="object-cover w-full h-64 rounded-lg shadow-lg md:h-96"
      >
    </div>

    <!-- 文章内容 -->
    <article class="max-w-none prose prose-lg">
      <ContentRenderer :value="data" />
    </article>

    <!-- 文章底部 -->
    <footer class="pt-8 mt-12 border-t">
      <!-- 作者信息 -->
      <div class="p-6 mb-8 bg-gray-50 rounded-lg">
        <div class="flex items-center">
          <div class="flex justify-center items-center mr-4 w-12 h-12 bg-blue-600 rounded-full">
            <span class="text-lg font-bold text-white">博</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">博主</h3>
            <p class="text-gray-600">热爱技术，乐于分享</p>
          </div>
        </div>
      </div>

      <!-- 相关文章 -->
      <div v-if="relatedPosts.length > 0" class="mb-8">
        <h2 class="mb-6 text-2xl font-bold text-gray-900">相关文章</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <article 
            v-for="post in relatedPosts" 
            :key="post._path"
            class="p-6 bg-white rounded-lg border transition-shadow hover:shadow-md"
          >
            <NuxtLink :to="post._path.replace('/articles/', '/blog/')" class="block">
              <h3 class="mb-2 font-semibold text-gray-900 transition-colors hover:text-blue-600">
                {{ post.title }}
              </h3>
              <p class="mb-3 text-sm text-gray-600 line-clamp-2">
                {{ post.description }}
              </p>
              <div class="flex items-center text-sm text-gray-500">
                <time>{{ formatDate(post.date) }}</time>
                <span class="mx-2">•</span>
                <span>{{ post.readingTime.text }}</span>
              </div>
            </NuxtLink>
          </article>
        </div>
      </div>

      <!-- 导航链接 -->
      <div class="flex justify-between items-center">
        <NuxtLink 
          v-if="prevPost"
          :to="prevPost._path.replace('/articles/', '/blog/')"
          class="flex items-center text-blue-600 transition-colors hover:text-blue-800"
        >
          <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <div>
            <div class="text-sm text-gray-500">上一篇</div>
            <div class="font-medium">{{ prevPost.title }}</div>
          </div>
        </NuxtLink>
        
        <div v-else></div>
        
        <NuxtLink 
          v-if="nextPost"
          :to="nextPost._path.replace('/articles/', '/blog/')"
          class="flex items-center text-right text-blue-600 transition-colors hover:text-blue-800"
        >
          <div>
            <div class="text-sm text-gray-500">下一篇</div>
            <div class="font-medium">{{ nextPost.title }}</div>
          </div>
          <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
        
        <div v-else></div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// 获取文章数据
const { path } = useRoute()
// 将 /blog/ 路径映射到 /articles/ 路径
const articlePath = path.replace('/blog/', '/articles/')
console.log('Blog path:', path, 'Article path:', articlePath)

let data
try {
  data = await queryContent(articlePath).findOne()
  console.log('Query result:', data ? 'Found' : 'Not found')
  console.log('Data title:', data?.title)
} catch (error) {
  console.error('Query error:', error)
  throw createError({
    statusCode: 404,
    statusMessage: '文章查询失败'
  })
}

// 如果没有找到文章，显示404
if (!data) {
  throw createError({
    statusCode: 404,
    statusMessage: '文章未找到'
  })
}

// 获取相关文章（同分类）
let relatedPosts = []
try {
  const result = await queryContent('/articles')
    .where({ category: data.category, _path: { $ne: articlePath } })
    .sort({ date: -1 })
    .limit(2)
    .find()
  relatedPosts = result
} catch (error) {
  console.error('Related posts query error:', error)
  relatedPosts = []
}

// 获取上一篇和下一篇
let prevPost = null
let nextPost = null
try {
  const [prevResult, nextResult] = await Promise.all([
    queryContent('/articles')
      .where({ date: { $lt: data.date } })
      .sort({ date: -1 })
      .limit(1)
      .find(),
    queryContent('/articles')
      .where({ date: { $gt: data.date } })
      .sort({ date: 1 })
      .limit(1)
      .find()
  ])
  prevPost = prevResult[0] || null
  nextPost = nextResult[0] || null
} catch (error) {
  console.error('Prev/Next posts query error:', error)
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 文章SEO
useHead({
  title: data.title,
  meta: [
    { name: 'description', content: data.description },
    { name: 'keywords', content: data.tags?.join(', ') },
    { name: 'author', content: '博主' },
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: data.image || '/favicon.ico' },
    { property: 'article:published_time', content: data.date },
    { property: 'article:modified_time', content: data.date },
    { property: 'article:tag', content: data.tags?.join(', ') }
  ]
})
</script>

<style>
/* 自定义文章样式 - 使用标准CSS避免Tailwind @apply问题 */
.prose {
  max-width: none !important;
}

.prose h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}

.prose p {
  color: #374151;
  line-height: 1.625;
  margin-bottom: 1rem;
}

.prose code {
  background-color: #f3f4f6;
  color: #dc2626;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #111827;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose blockquote {
  border-left-width: 4px;
  border-left-color: #3b82f6;
  padding-left: 1rem;
  font-style: italic;
  color: #4b5563;
}

.prose ul {
  list-style: disc;
  list-style-position: inside;
  margin-bottom: 1rem;
}

.prose ol {
  list-style: decimal;
  list-style-position: inside;
  margin-bottom: 1rem;
}

.prose img {
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  margin-left: auto;
  margin-right: auto;
}
</style>