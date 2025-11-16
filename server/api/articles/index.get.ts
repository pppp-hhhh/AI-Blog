import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const contentDir = join(process.cwd(), 'content', 'articles')
    
    try {
      await fs.access(contentDir)
    } catch {
      // 如果目录不存在，返回空数组
      return []
    }

    const files = await fs.readdir(contentDir)
    const articles = []

    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = join(contentDir, file)
        const content = await fs.readFile(filePath, 'utf-8')
        
        // 解析Markdown文件的frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
        
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1]
          const body = frontmatterMatch[2]
          
          // 解析frontmatter
          const metadata: Record<string, any> = {}
          frontmatter.split('\n').forEach((line: string) => {
            const match = line.match(/^(.+?):\s*(.*)$/)
            if (match) {
              const key = match[1].trim()
              let value = match[2].trim()
              
              // 处理数组类型的值（如tags）
              if (value.startsWith('[') && value.endsWith(']')) {
                const arrayValue = value.slice(1, -1).split(',').map((item: string) => item.trim().replace(/^"|"$/g, ''))
                metadata[key] = arrayValue
              } else {
                // 移除字符串的引号
                metadata[key] = value.replace(/^"|"$/g, '')
              }
            }
          })
          
          const slug = file.replace('.md', '')
          
          articles.push({
            slug,
            title: metadata.title || '无标题',
            description: metadata.description || '',
            date: metadata.date || '',
            category: metadata.category || '',
            tags: Array.isArray(metadata.tags) ? metadata.tags : (typeof metadata.tags === 'string' ? metadata.tags.split(',').map((tag: string) => tag.trim()) : []),
            image: metadata.image || '',
            status: metadata.status || 'published',
            body: body.trim()
          })
        }
      }
    }

    // 按日期排序（最新的在前）
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return articles
  } catch (error) {
    console.error('获取文章列表失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取文章列表失败'
    })
  }
})