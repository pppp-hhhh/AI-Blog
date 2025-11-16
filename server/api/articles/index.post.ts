import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { title, description, date, category, tags, image, body: content, status } = body

    // 验证必填字段
    if (!title || !description || !category || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: '缺少必填字段'
      })
    }

    // 生成文章slug
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // 创建文章内容（使用Markdown格式）
    const markdownContent = `---
title: "${title}"
description: "${description}"
date: "${date}"
category: "${category}"
tags: [${Array.isArray(tags) ? tags.map((tag: string) => `"${tag}"`).join(', ') : ''}]
image: "${image || ''}"
status: "${status}"
---

${content}`

    // 确保content目录存在
    const contentDir = join(process.cwd(), 'content', 'articles')
    try {
      await fs.access(contentDir)
    } catch {
      await fs.mkdir(contentDir, { recursive: true })
    }

    // 保存文件
    const fileName = `${slug}.md`
    const filePath = join(contentDir, fileName)
    
    await fs.writeFile(filePath, markdownContent, 'utf-8')

    return {
      success: true,
      message: '文章保存成功',
      data: {
        slug,
        title,
        description,
        date,
        category,
        tags,
        image,
        status
      }
    }
  } catch (error: any) {
    console.error('保存文章失败:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || '保存文章失败'
    })
  }
})