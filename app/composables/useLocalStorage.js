// 本地存储管理工具
export const useLocalStorage = () => {
  // 获取存储的文章数据
  const getStoredArticles = () => {
    if (process.client) {
      const stored = localStorage.getItem('blog-articles')
      return stored ? JSON.parse(stored) : []
    }
    return []
  }

  // 保存文章数据到本地存储
  const saveArticles = (articles) => {
    if (process.client) {
      localStorage.setItem('blog-articles', JSON.stringify(articles))
      return true
    }
    return false
  }

  // 添加新文章
  const addArticle = (article) => {
    const articles = getStoredArticles()
    const newArticle = {
      ...article,
      _id: generateId(),
      _created: new Date().toISOString(),
      _updated: new Date().toISOString()
    }
    articles.push(newArticle)
    saveArticles(articles)
    return newArticle
  }

  // 更新文章
  const updateArticle = (id, updates) => {
    const articles = getStoredArticles()
    const index = articles.findIndex(a => a._id === id)
    if (index !== -1) {
      articles[index] = {
        ...articles[index],
        ...updates,
        _updated: new Date().toISOString()
      }
      saveArticles(articles)
      return articles[index]
    }
    return null
  }

  // 删除文章
  const deleteArticle = (id) => {
    const articles = getStoredArticles()
    const filtered = articles.filter(a => a._id !== id)
    saveArticles(filtered)
    return true
  }

  // 批量删除文章
  const batchDeleteArticles = (ids) => {
    const articles = getStoredArticles()
    const filtered = articles.filter(a => !ids.includes(a._id))
    saveArticles(filtered)
    return true
  }

  // 生成唯一ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 获取文章统计信息
  const getStats = () => {
    const articles = getStoredArticles()
    const published = articles.filter(a => a.status === 'published')
    const drafts = articles.filter(a => a.status === 'draft')
    const archived = articles.filter(a => a.status === 'archived')
    
    const categories = [...new Set(articles.map(a => a.category))]
    const tags = [...new Set(articles.flatMap(a => a.tags || []))]

    return {
      total: articles.length,
      published: published.length,
      drafts: drafts.length,
      archived: archived.length,
      categories: categories.length,
      tags: tags.length,
      categoriesList: categories,
      tagsList: tags
    }
  }

  // 导出数据
  const exportData = (format = 'json') => {
    const articles = getStoredArticles()
    
    if (format === 'json') {
      return JSON.stringify(articles, null, 2)
    } else if (format === 'csv') {
      const headers = ['标题', '描述', '日期', '分类', '标签', '状态', '内容']
      const rows = articles.map(article => [
        article.title,
        article.description,
        article.date,
        article.category,
        (article.tags || []).join(';'),
        article.status,
        article.body || ''
      ])
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    return ''
  }

  // 导入数据
  const importData = (data, format = 'json') => {
    try {
      let articles = []
      
      if (format === 'json') {
        articles = JSON.parse(data)
      } else if (format === 'csv') {
        // 简单的CSV解析
        const lines = data.split('\n')
        const headers = lines[0].split(',')
        articles = lines.slice(1).map(line => {
          const values = line.split(',')
          return {
            title: values[0],
            description: values[1],
            date: values[2],
            category: values[3],
            tags: values[4] ? values[4].split(';') : [],
            status: values[5],
            body: values[6] || ''
          }
        })
      }
      
      // 为导入的文章生成新的ID
      const articlesWithIds = articles.map(article => ({
        ...article,
        _id: generateId(),
        _created: new Date().toISOString(),
        _updated: new Date().toISOString()
      }))
      
      saveArticles(articlesWithIds)
      return { success: true, count: articlesWithIds.length }
    } catch (error) {
      console.error('导入数据失败:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    getStoredArticles,
    saveArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    batchDeleteArticles,
    getStats,
    exportData,
    importData
  }
}