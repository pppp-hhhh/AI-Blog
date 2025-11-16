// 测试脚本：比较不同页面的文章获取逻辑
import { queryContent } from '#content'

async function testArticleQueries() {
  console.log('=== 测试不同页面的文章获取逻辑 ===\n')
  
  try {
    // 1. 首页获取最新文章（限制6篇）
    console.log('1. 首页获取逻辑（限制6篇）：')
    const { data: recentPosts } = await queryContent('/articles')
      .sort({ date: -1 })
      .limit(6)
      .find()
    
    console.log(`获取到 ${recentPosts?.length || 0} 篇文章`)
    if (recentPosts && recentPosts.length > 0) {
      console.log('最新文章：')
      recentPosts.forEach((post, index) => {
        console.log(`  ${index + 1}. ${post.title} (${post.date})`)
      })
    }
    
    // 2. 博客页面获取所有文章
    console.log('\n2. 博客页面获取逻辑（所有文章）：')
    const { data: allPosts } = await queryContent('/articles')
      .sort({ date: -1 })
      .find()
    
    console.log(`获取到 ${allPosts?.length || 0} 篇文章`)
    if (allPosts && allPosts.length > 0) {
      console.log('最新文章：')
      allPosts.slice(0, 6).forEach((post, index) => {
        console.log(`  ${index + 1}. ${post.title} (${post.date})`)
      })
    }
    
    // 3. 比较差异
    console.log('\n3. 差异分析：')
    if (recentPosts && allPosts) {
      const recentTitles = recentPosts.map(post => post.title)
      const allTitles = allPosts.slice(0, 6).map(post => post.title)
      
      const isSame = recentTitles.every(title => allTitles.includes(title))
      console.log(`首页和博客页面的最新6篇文章是否一致：${isSame}`)
      
      if (!isSame) {
        console.log('不一致的文章：')
        console.log('首页的6篇文章：', recentTitles)
        console.log('博客页面的前6篇文章：', allTitles)
      }
    }
    
  } catch (error) {
    console.error('测试出错：', error)
  }
}

// 执行测试
testArticles()