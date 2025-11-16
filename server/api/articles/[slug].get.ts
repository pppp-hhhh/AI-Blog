import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug')
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少文章标识'
      })
    }

    const filePath = join(process.cwd(), 'content', 'articles', `${slug}.md`)
    
    try {
      await fs.access(filePath)
    } catch {
      throw createError({
        statusCode: 404,
        statusMessage: '文章不存在'
      })
    }

    const content = await fs.readFile(filePath, 'utf-8')
    
    // 解析Markdown文件的frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    
    if (!frontmatterMatch) {
      throw createError({
        statusCode: 500,
        statusMessage: '文章格式错误'
      })
    }
    
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
        
        metadata[key] = value
      }
    })

    return {
      slug,
      title: metadata.title || '无标题',
      description: metadata.description || '',
      date: metadata.date || '',
      category: metadata.category || '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : (typeof metadata.tags === 'string' ? metadata.tags.split(',').map((tag: string) => tag.trim()) : []),
      image: metadata.image || '',
      status: metadata.status || 'published',
      body: body.trim()
    }
  } catch (error: any) {
    console.error('获取文章失败:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || '获取文章失败'
    })
  }
})