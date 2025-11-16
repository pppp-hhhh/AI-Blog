// 测试Content查询
import { queryContent } from '@nuxt/content'

async function testQuery() {
  try {
    console.log('测试Content查询...')
    
    // 模拟页面中的查询
    const { data: contentPosts } = await queryContent('/articles')
      .sort({ date: -1 })
      .find()
    
    console.log('Content查询结果:')
    console.log('- contentPosts类型:', typeof contentPosts)
    console.log('- contentPosts是否存在:', !!contentPosts)
    console.log('- contentPosts.value:', contentPosts?.value)
    console.log('- contentPosts长度:', contentPosts?.value?.length || 0)
    
    if (contentPosts?.value && contentPosts.value.length > 0) {
      console.log('- 第一篇文章标题:', contentPosts.value[0].title)
      console.log('- 第一篇文章状态:', contentPosts.value[0].status)
    }
    
  } catch (error) {
    console.error('Content查询错误:', error.message)
  }
}

testQuery()