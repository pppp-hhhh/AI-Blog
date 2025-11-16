// 文章数据管理工具
export const useArticleManager = () => {
  const { data: articles, refresh: refreshArticles } = useAsyncData('admin-articles', () => 
    queryContent('articles').find()
  )

  // 获取所有文章（包含草稿）
  const getAllArticles = () => {
    return articles.value || []
  }

  // 获取已发布文章
  const getPublishedArticles = () => {
    return (articles.value || []).filter(article => article.status === 'published')
  }

  // 获取草稿文章
  const getDraftArticles = () => {
    return (articles.value || []).filter(article => article.status === 'draft')
  }

  // 获取归档文章
  const getArchivedArticles = () => {
    return (articles.value || []).filter(article => article.status === 'archived')
  }

  // 创建新文章
  const createArticle = async (articleData) => {
    try {
      const newArticle = {
        ...articleData,
        _path: `/articles/${generateSlug(articleData.title)}`,
        _type: 'markdown',
        date: articleData.date || new Date().toISOString().split('T')[0],
        status: articleData.status || 'draft'
      }
      
      // 在实际应用中，这里应该调用API保存文章
      console.log('创建文章:', newArticle)
      
      // 刷新数据
      await refreshArticles()
      
      return { success: true, article: newArticle }
    } catch (error) {
      console.error('创建文章失败:', error)
      return { success: false, error }
    }
  }

  // 更新文章
  const updateArticle = async (path, articleData) => {
    try {
      // 在实际应用中，这里应该调用API更新文章
      console.log('更新文章:', path, articleData)
      
      // 刷新数据
      await refreshArticles()
      
      return { success: true }
    } catch (error) {
      console.error('更新文章失败:', error)
      return { success: false, error }
    }
  }

  // 删除文章
  const deleteArticle = async (path) => {
    try {
      // 在实际应用中，这里应该调用API删除文章
      console.log('删除文章:', path)
      
      // 刷新数据
      await refreshArticles()
      
      return { success: true }
    } catch (error) {
      console.error('删除文章失败:', error)
      return { success: false, error }
    }
  }

  // 批量删除文章
  const batchDeleteArticles = async (paths) => {
    try {
      const results = []
      for (const path of paths) {
        const result = await deleteArticle(path)
        results.push({ path, success: result.success })
      }
      return { success: true, results }
    } catch (error) {
      console.error('批量删除文章失败:', error)
      return { success: false, error }
    }
  }

  // 批量更新文章状态
  const batchUpdateStatus = async (paths, status) => {
    try {
      const results = []
      for (const path of paths) {
        const article = articles.value.find(a => a._path === path)
        if (article) {
          const result = await updateArticle(path, { ...article, status })
          results.push({ path, success: result.success })
        }
      }
      return { success: true, results }
    } catch (error) {
      console.error('批量更新状态失败:', error)
      return { success: false, error }
    }
  }

  // 批量更新分类
  const batchUpdateCategory = async (paths, category) => {
    try {
      const results = []
      for (const path of paths) {
        const article = articles.value.find(a => a._path === path)
        if (article) {
          const result = await updateArticle(path, { ...article, category })
          results.push({ path, success: result.success })
        }
      }
      return { success: true, results }
    } catch (error) {
      console.error('批量更新分类失败:', error)
      return { success: false, error }
    }
  }

  // 批量添加标签
  const batchAddTags = async (paths, tags) => {
    try {
      const results = []
      for (const path of paths) {
        const article = articles.value.find(a => a._path === path)
        if (article) {
          const currentTags = article.tags || []
          const newTags = [...new Set([...currentTags, ...tags])]
          const result = await updateArticle(path, { ...article, tags: newTags })
          results.push({ path, success: result.success })
        }
      }
      return { success: true, results }
    } catch (error) {
      console.error('批量添加标签失败:', error)
      return { success: false, error }
    }
  }

  // 导出文章数据
  const exportArticles = (format = 'json') => {
    try {
      const data = articles.value.map(article => ({
        title: article.title,
        description: article.description,
        date: article.date,
        category: article.category,
        tags: article.tags,
        status: article.status,
        body: article.body
      }))

      if (format === 'json') {
        return JSON.stringify(data, null, 2)
      } else if (format === 'csv') {
        const headers = ['标题', '描述', '日期', '分类', '标签', '状态']
        const rows = data.map(article => [
          article.title,
          article.description,
          article.date,
          article.category,
          (article.tags || []).join(';'),
          article.status
        ])
        return [headers, ...rows].map(row => row.join(',')).join('\n')
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('导出文章失败:', error)
      return { success: false, error }
    }
  }

  // 导入文章数据
  const importArticles = async (fileData, format = 'json') => {
    try {
      let articlesData
      
      if (format === 'json') {
        articlesData = JSON.parse(fileData)
      } else if (format === 'csv') {
        // 简单的CSV解析
        const lines = fileData.split('\n')
        const headers = lines[0].split(',')
        articlesData = lines.slice(1).map(line => {
          const values = line.split(',')
          return {
            title: values[0],
            description: values[1],
            date: values[2],
            category: values[3],
            tags: values[4] ? values[4].split(';') : [],
            status: values[5]
          }
        })
      }

      const results = []
      for (const articleData of articlesData) {
        const result = await createArticle(articleData)
        results.push(result)
      }
      
      return { success: true, results }
    } catch (error) {
      console.error('导入文章失败:', error)
      return { success: false, error }
    }
  }

  // 生成文章slug
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // 获取文章统计信息
  const getArticleStats = () => {
    const allArticles = articles.value || []
    const published = allArticles.filter(a => a.status === 'published')
    const drafts = allArticles.filter(a => a.status === 'draft')
    const archived = allArticles.filter(a => a.status === 'archived')

    return {
      total: allArticles.length,
      published: published.length,
      drafts: drafts.length,
      archived: archived.length,
      categories: [...new Set(allArticles.map(a => a.category))].length,
      tags: [...new Set(allArticles.flatMap(a => a.tags || []))].length
    }
  }

  return {
    articles,
    refreshArticles,
    getAllArticles,
    getPublishedArticles,
    getDraftArticles,
    getArchivedArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    batchDeleteArticles,
    batchUpdateStatus,
    batchUpdateCategory,
    batchAddTags,
    exportArticles,
    importArticles,
    getArticleStats
  }
}