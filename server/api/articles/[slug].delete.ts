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

    // 删除文件
    await fs.unlink(filePath)

    return {
      success: true,
      message: '文章删除成功'
    }
  } catch (error: any) {
    console.error('删除文章失败:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || '删除文章失败'
    })
  }
})