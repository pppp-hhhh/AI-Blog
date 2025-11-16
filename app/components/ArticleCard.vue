<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="aspect-w-16 aspect-h-9 bg-gray-200">
      <img 
        v-if="article.image" 
        :src="article.image" 
        :alt="article.title"
        class="w-full h-full object-cover"
        loading="lazy"
      >
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    
    <div class="p-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {{ article.category || '未分类' }}
        </span>
        <time class="text-sm text-gray-500">
          {{ formatDate(article.date) }}
        </time>
      </div>
      
      <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
        <NuxtLink :to="`/articles/${getArticleSlug(article._path)}`" class="hover:text-blue-600 transition-colors">
          {{ article.title }}
        </NuxtLink>
      </h3>
      
      <p class="text-gray-600 mb-4 line-clamp-3">
        {{ article.description }}
      </p>
      
      <div class="flex items-center justify-between">
        <div class="flex flex-wrap gap-1">
          <span 
            v-for="tag in (article.tags || []).slice(0, 3)" 
            :key="tag"
            class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
          >
            {{ tag }}
          </span>
        </div>
        
        <NuxtLink 
          :to="`/articles/${getArticleSlug(article._path)}`"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          阅读更多
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const { formatDate } = useBlogData()

const getArticleSlug = (path) => {
  return path.replace('/articles/', '')
}
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.aspect-h-9 > * {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>