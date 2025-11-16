<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">正在重定向到新的标签页面...</p>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()

// 获取标签名称并重定向到新的标签页面
const tagName = route.params.tag
await router.replace(`/tag/${tagName}`)
</script>