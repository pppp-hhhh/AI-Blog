// 增强的文章数据管理
export const useEnhancedArticles = () => {
  try {
    const { getStoredArticles, addArticle, updateArticle, deleteArticle, batchDeleteArticles, getStats, exportData, importData } = useLocalStorage()
  
  // 获取所有文章（合并本地存储和Content数据）
  const getAllArticles = async () => {
    try {
      // 获取Content文章
      const contentArticles = await queryContent('articles').find()
      
      // 获取本地存储文章
      const storedArticles = getStoredArticles()
      
      // 合并文章，本地存储优先
      const allArticles = [...contentArticles]
      
      // 添加本地存储的文章（避免重复）
      storedArticles.forEach(stored => {
        const exists = allArticles.find(content => 
          content.title === stored.title || 
          (content._path && stored._path && content._path === stored._path)
        )
        if (!exists) {
          allArticles.push(stored)
        }
      })
      
      return allArticles
    } catch (error) {
      console.error('获取文章失败:', error)
      return getStoredArticles() // 降级到本地存储
    }
  }

  // 创建新文章
  const createArticle = async (articleData) => {
    try {
      // 保存到本地存储
      const newArticle = addArticle(articleData)
      
      // 在实际应用中，这里还可以调用API保存到服务器
      console.log('创建文章成功:', newArticle)
      
      return { success: true, article: newArticle }
    } catch (error) {
      console.error('创建文章失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 更新文章
  const updateArticleData = async (id, articleData) => {
    try {
      const updated = updateArticle(id, articleData)
      if (updated) {
        console.log('更新文章成功:', updated)
        return { success: true, article: updated }
      } else {
        return { success: false, error: '文章不存在' }
      }
    } catch (error) {
      console.error('更新文章失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 删除文章
  const removeArticle = async (id) => {
    try {
      const success = deleteArticle(id)
      if (success) {
        console.log('删除文章成功')
        return { success: true }
      } else {
        return { success: false, error: '删除失败' }
      }
    } catch (error) {
      console.error('删除文章失败:', error)
      return { success: false, error: error.message }
    }
  }

  // 批量操作
  const batchOperations = {
    // 批量删除
    async delete(ids) {
      try {
        batchDeleteArticles(ids)
        console.log('批量删除成功')
        return { success: true }
      } catch (error) {
        console.error('批量删除失败:', error)
        return { success: false, error: error.message }
      }
    },

    // 批量更新状态
    async updateStatus(ids, status) {
      try {
        const articles = getStoredArticles()
        const results = []
        
        for (const id of ids) {
          const article = articles.find(a => a._id === id)
          if (article) {
            const updated = updateArticle(id, { ...article, status })
            if (updated) {
              results.push({ id, success: true })
            } else {
              results.push({ id, success: false, error: '更新失败' })
            }
          }
        }
        
        return { success: true, results }
      } catch (error) {
        console.error('批量更新状态失败:', error)
        return { success: false, error: error.message }
      }
    },

    // 批量更新分类
    async updateCategory(ids, category) {
      try {
        const articles = getStoredArticles()
        const results = []
        
        for (const id of ids) {
          const article = articles.find(a => a._id === id)
          if (article) {
            const updated = updateArticle(id, { ...article, category })
            if (updated) {
              results.push({ id, success: true })
            } else {
              results.push({ id, success: false, error: '更新失败' })
            }
          }
        }
        
        return { success: true, results }
      } catch (error) {
        console.error('批量更新分类失败:', error)
        return { success: false, error: error.message }
      }
    },

    // 批量添加标签
    async addTags(ids, tags) {
      try {
        const articles = getStoredArticles()
        const results = []
        
        for (const id of ids) {
          const article = articles.find(a => a._id === id)
          if (article) {
            const currentTags = article.tags || []
            const newTags = [...new Set([...currentTags, ...tags])]
            const updated = updateArticle(id, { ...article, tags: newTags })
            if (updated) {
              results.push({ id, success: true })
            } else {
              results.push({ id, success: false, error: '更新失败' })
            }
          }
        }
        
        return { success: true, results }
      } catch (error) {
        console.error('批量添加标签失败:', error)
        return { success: false, error: error.message }
      }
    }
  }

  // 搜索和过滤
  const searchArticles = (query, filters = {}) => {
    const articles = getStoredArticles()
    
    return articles.filter(article => {
      // 文本搜索
      if (query) {
        const searchText = query.toLowerCase()
        const titleMatch = article.title.toLowerCase().includes(searchText)
        const descriptionMatch = article.description.toLowerCase().includes(searchText)
        const contentMatch = article.body && article.body.toLowerCase().includes(searchText)
        const tagMatch = article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchText))
        
        if (!titleMatch && !descriptionMatch && !contentMatch && !tagMatch) {
          return false
        }
      }
      
      // 状态过滤
      if (filters.status && article.status !== filters.status) {
        return false
      }
      
      // 分类过滤
      if (filters.category && article.category !== filters.category) {
        return false
      }
      
      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        const articleTags = article.tags || []
        const hasAllTags = filters.tags.every(tag => articleTags.includes(tag))
        if (!hasAllTags) return false
      }
      
      // 日期范围过滤
      if (filters.dateFrom && article.date < filters.dateFrom) {
        return false
      }
      
      if (filters.dateTo && article.date > filters.dateTo) {
        return false
      }
      
      return true
    })
  }

  // 获取文章统计
  const getArticleStats = () => {
    return getStats()
  }

  // 数据导入导出
  const dataIO = {
    export(format = 'json') {
      return exportData(format)
    },

    import(data, format = 'json') {
      return importData(data, format)
    }
  }

    return {
      getAllArticles,
      createArticle,
      updateArticle: updateArticleData,
      deleteArticle: removeArticle,
      batchOperations,
      searchArticles,
      getArticleStats,
      dataIO
    }
  } catch (error) {
    console.warn('Enhanced articles manager failed, using fallback:', error.message)
    return createFallbackArticles()
  }
}

// 回退函数 - 当依赖不可用时使用
const createFallbackArticles = () => {
  console.log('Using fallback articles manager')
  
  // 简单的内存存储
  let fallbackArticles = []
  
  const getAllArticles = async () => {
    return fallbackArticles
  }
  
  const createArticle = async (articleData) => {
    const newArticle = {
      ...articleData,
      _id: Date.now().toString(),
      date: new Date().toISOString()
    }
    fallbackArticles.push(newArticle)
    return { success: true, article: newArticle }
  }
  
  const updateArticleData = async (id, articleData) => {
    const index = fallbackArticles.findIndex(a => a._id === id)
    if (index >= 0) {
      fallbackArticles[index] = { ...fallbackArticles[index], ...articleData }
      return { success: true, article: fallbackArticles[index] }
    }
    return { success: false, error: '文章不存在' }
  }
  
  const removeArticle = async (id) => {
    const index = fallbackArticles.findIndex(a => a._id === id)
    if (index >= 0) {
      fallbackArticles.splice(index, 1)
      return { success: true }
    }
    return { success: false, error: '删除失败' }
  }
  
  const batchOperations = {
    async delete(ids) {
      fallbackArticles = fallbackArticles.filter(a => !ids.includes(a._id))
      return { success: true }
    },
    async updateStatus(ids, status) {
      const results = []
      ids.forEach(id => {
        const article = fallbackArticles.find(a => a._id === id)
        if (article) {
          article.status = status
          results.push({ id, success: true })
        } else {
          results.push({ id, success: false, error: '文章不存在' })
        }
      })
      return { success: true, results }
    },
    async updateCategory(ids, category) {
      const results = []
      ids.forEach(id => {
        const article = fallbackArticles.find(a => a._id === id)
        if (article) {
          article.category = category
          results.push({ id, success: true })
        } else {
          results.push({ id, success: false, error: '文章不存在' })
        }
      })
      return { success: true, results }
    },
    async addTags(ids, tags) {
      const results = []
      ids.forEach(id => {
        const article = fallbackArticles.find(a => a._id === id)
        if (article) {
          article.tags = [...new Set([...(article.tags || []), ...tags])]
          results.push({ id, success: true })
        } else {
          results.push({ id, success: false, error: '文章不存在' })
        }
      })
      return { success: true, results }
    }
  }
  
  const searchArticles = (query, filters = {}) => {
    return fallbackArticles.filter(article => {
      if (query) {
        const searchText = query.toLowerCase()
        const titleMatch = article.title.toLowerCase().includes(searchText)
        const descriptionMatch = article.description.toLowerCase().includes(searchText)
        const contentMatch = article.body && article.body.toLowerCase().includes(searchText)
        const tagMatch = article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchText))
        
        if (!titleMatch && !descriptionMatch && !contentMatch && !tagMatch) {
          return false
        }
      }
      
      if (filters.status && article.status !== filters.status) {
        return false
      }
      
      if (filters.category && article.category !== filters.category) {
        return false
      }
      
      if (filters.tags && filters.tags.length > 0) {
        const articleTags = article.tags || []
        const hasAllTags = filters.tags.every(tag => articleTags.includes(tag))
        if (!hasAllTags) return false
      }
      
      return true
    })
  }
  
  const getArticleStats = () => {
    return {
      total: fallbackArticles.length,
      published: fallbackArticles.filter(a => a.status === 'published').length,
      draft: fallbackArticles.filter(a => a.status === 'draft').length,
      archived: fallbackArticles.filter(a => a.status === 'archived').length
    }
  }
  
  const dataIO = {
    export(format = 'json') {
      if (format === 'json') {
        return JSON.stringify(fallbackArticles, null, 2)
      }
      return JSON.stringify(fallbackArticles, null, 2)
    },
    import(data, format = 'json') {
      try {
        if (format === 'json') {
          const articles = JSON.parse(data)
          fallbackArticles = articles
          return { success: true, count: articles.length }
        }
        return { success: false, error: '不支持的格式' }
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
  }
  
  return {
    getAllArticles,
    createArticle,
    updateArticle: updateArticleData,
    deleteArticle: removeArticle,
    batchOperations,
    searchArticles,
    getArticleStats,
    dataIO
  }
}