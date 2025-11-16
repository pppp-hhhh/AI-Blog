<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="text-xl font-bold text-gray-900">TechBlog</span>
          </NuxtLink>
        </div>

        <!-- 桌面端导航 -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-8">
            <NuxtLink 
              to="/" 
              class="nav-link"
              :class="{ 'active': $route.path === '/' }"
            >
              首页
            </NuxtLink>
            <NuxtLink 
              to="/blog" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/blog') }"
            >
              博客
            </NuxtLink>
            <NuxtLink 
              to="/category" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/category') }"
            >
              分类
            </NuxtLink>
            <NuxtLink 
              to="/tag" 
              class="nav-link"
              :class="{ 'active': $route.path.startsWith('/tag') }"
            >
              标签
            </NuxtLink>
            <NuxtLink 
              to="/archive" 
              class="nav-link"
              :class="{ 'active': $route.path === '/archive' }"
            >
              归档
            </NuxtLink>
            <NuxtLink 
              to="/search" 
              class="nav-link"
              :class="{ 'active': $route.path === '/search' }"
            >
              搜索
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="nav-link"
              :class="{ 'active': $route.path === '/about' }"
            >
              关于
            </NuxtLink>
          </div>
        </div>

        <!-- 搜索框 -->
        <div class="hidden md:block flex-1 max-w-md mx-8">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="搜索文章..."
            >
          </div>
        </div>

        <!-- 搜索按钮 -->
        <div class="hidden md:block">
          <NuxtLink 
            to="/search" 
            class="nav-link"
            :class="{ 'active': $route.path === '/search' }"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </NuxtLink>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="md:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                v-if="!isMenuOpen" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
              <path 
                v-else 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 -->
      <div v-show="isMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <NuxtLink 
            to="/" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path === '/' }"
            @click="isMenuOpen = false"
          >
            首页
          </NuxtLink>
          <NuxtLink 
            to="/blog" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path.startsWith('/blog') }"
            @click="isMenuOpen = false"
          >
            博客
          </NuxtLink>
          <NuxtLink 
            to="/category" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path.startsWith('/category') }"
            @click="isMenuOpen = false"
          >
            分类
          </NuxtLink>
          <NuxtLink 
            to="/tag" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path.startsWith('/tag') }"
            @click="isMenuOpen = false"
          >
            标签
          </NuxtLink>
          <NuxtLink 
            to="/archive" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path === '/archive' }"
            @click="isMenuOpen = false"
          >
            归档
          </NuxtLink>
          <NuxtLink 
            to="/search" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path === '/search' }"
            @click="isMenuOpen = false"
          >
            搜索
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path === '/about' }"
            @click="isMenuOpen = false"
          >
            关于
          </NuxtLink>
        </div>
        
        <!-- 移动端搜索 -->
        <div class="px-2 pb-3">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="搜索文章..."
            >
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from '#app'

const router = useRouter()
const searchQuery = ref('')
const isMenuOpen = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/search',
      query: { q: searchQuery.value.trim() }
    })
    isMenuOpen.value = false
  }
}
</script>

<style scoped>
.nav-link {
  padding: 0.5rem 0.75rem;
  color: #4b5563;
  transition: color 0.2s, background-color 0.2s;
  border-radius: 0.375rem;
.nav-link:hover {
  color: #111827;
  background-color: #f3f4f6;
}
}

.nav-link.active {
  color: #2563eb;
  background-color: #eff6ff;
  font-weight: 500;
}

.mobile-nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  color: #4b5563;
  border-radius: 0.375rem;
  transition: color 0.2s, background-color 0.2s;
}
.mobile-nav-link:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.mobile-nav-link.active {
  color: #2563eb;
  background-color: #eff6ff;
  font-weight: 500;
}
</style>