<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">正在重定向到新的文章页面...</p>
    </div>
  </div>
</template>

<script setup>
// 获取当前路由参数
const route = useRoute()
const router = useRouter()

// 提取文章slug
const slug = route.params.slug

// 重定向到新的博客路由
if (slug) {
  await router.replace(`/blog/${slug}`)
} else {
  // 如果没有slug，重定向到博客首页
  await router.replace('/blog')
}
</script>