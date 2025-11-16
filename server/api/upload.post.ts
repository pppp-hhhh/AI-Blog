import { writeFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]
    
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type || '')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only images are allowed.'
      })
    }

    // 验证文件大小 (最大5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if ((file.data as Buffer).length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File too large. Maximum size is 5MB.'
      })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.filename?.split('.').pop() || 'jpg'
    const filename = `image-${timestamp}-${randomString}.${extension}`
    
    // 确保public/uploads目录存在
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadsDir, filename)
    
    try {
      await import('fs').then(fs => {
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
      })
    } catch (err) {
      console.error('创建上传目录失败:', err)
    }

    // 保存文件
    writeFileSync(filePath, file.data as Buffer)

    // 返回文件URL
    return {
      success: true,
      url: `/uploads/${filename}`,
      filename: filename,
      size: (file.data as Buffer).length
    }

  } catch (error: any) {
    console.error('文件上传失败:', error)
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || 'File upload failed'
    })
  }
})