export const useBlogData = () => {
  const { data: articles } = useAsyncData('articles', () => 
    queryContent('articles').find()
  )

  const { data: categories } = useAsyncData('categories', () => {
    const articlesData = articles.value || []
    const categoryMap = new Map()
    
    articlesData.forEach(article => {
      const category = article.category || 'uncategorized'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          name: category,
          count: 0,
          articles: []
        })
      }
      
      const categoryData = categoryMap.get(category)
      categoryData.count++
      categoryData.articles.push({
        title: article.title,
        slug: article._path.replace('/articles/', ''),
        date: article.date,
        description: article.description
      })
    })
    
    return Array.from(categoryMap.values())
  }, {
    watch: [articles]
  })

  const { data: tags } = useAsyncData('tags', () => {
    const articlesData = articles.value || []
    const tagMap = new Map()
    
    articlesData.forEach(article => {
      const tags = article.tags || []
      tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, 0)
        }
        tagMap.set(tag, tagMap.get(tag) + 1)
      })
    })
    
    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, {
    watch: [articles]
  })

  const getLatestArticles = (count = 5) => {
    const articlesData = articles.value || []
    return articlesData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count)
  }

  const getRelatedArticles = (currentArticle, count = 3) => {
    const articlesData = articles.value || []
    const currentTags = currentArticle.tags || []
    
    return articlesData
      .filter(article => article._path !== currentArticle._path)
      .map(article => {
        const articleTags = article.tags || []
        const commonTags = currentTags.filter(tag => articleTags.includes(tag))
        return {
          ...article,
          relevance: commonTags.length
        }
      })
      .filter(article => article.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, count)
  }

  const searchArticles = (query) => {
    const articlesData = articles.value || []
    const lowercaseQuery = query.toLowerCase()
    
    return articlesData.filter(article => {
      const titleMatch = article.title.toLowerCase().includes(lowercaseQuery)
      const descriptionMatch = article.description?.toLowerCase().includes(lowercaseQuery)
      const contentMatch = article.body?.toLowerCase().includes(lowercaseQuery)
      const tagMatch = article.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      
      return titleMatch || descriptionMatch || contentMatch || tagMatch
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const readingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} 分钟`
  }

  return {
    articles: articles.value || [],
    categories: categories.value || [],
    tags: tags.value || [],
    getLatestArticles,
    getRelatedArticles,
    searchArticles,
    formatDate,
    readingTime
  }
}