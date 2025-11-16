<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">正在重定向到新的博客页面...</p>
    </div>
  </div>
</template>

<script setup>
// 重定向到新的博客首页
const router = useRouter()
await router.replace('/blog')
</script>