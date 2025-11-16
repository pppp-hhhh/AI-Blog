import { promises as fs } from 'fs'
import { join } from 'path'

// 模板存储目录
const templatesDir = join(process.cwd(), 'content', 'templates')

// 确保模板目录存在
async function ensureTemplatesDir() {
  try {
    await fs.access(templatesDir)
  } catch {
    await fs.mkdir(templatesDir, { recursive: true })
  }
}

// 获取所有模板
export default defineEventHandler(async (event) => {
  try {
    await ensureTemplatesDir()
    
    const templateFiles = await fs.readdir(templatesDir)
    const templates = []
    
    for (const file of templateFiles) {
      if (file.endsWith('.md')) {
        const filePath = join(templatesDir, file)
        const content = await fs.readFile(filePath, 'utf-8')
        
        // 解析元数据
        const metaMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
        if (metaMatch) {
          const meta: Record<string, any> = {}
          const metaLines = metaMatch[1].split('\n')
          
          metaLines.forEach((line: string) => {
            const [key, value] = line.split(':').map((s: string) => s.trim())
            if (key && value) {
              meta[key] = value.replace(/^["']|["']$/g, '')
            }
          })
          
          templates.push({
            id: file.replace('.md', ''),
            name: meta.name || file.replace('.md', ''),
            description: meta.description || '',
            category: meta.category || 'general',
            tags: meta.tags ? meta.tags.split(',').map((tag: string) => tag.trim()) : [],
            content: metaMatch[2].trim()
          })
        }
      }
    }
    
    // 如果没有模板，创建默认模板
    if (templates.length === 0) {
      const defaultTemplates = [
        {
          id: 'tech-tutorial',
          name: '技术教程',
          description: '适合技术教程类文章',
          category: 'frontend',
          tags: ['教程', '技术'],
          content: `# 标题\n\n## 介绍\n\n在这里写介绍内容...\n\n## 前提条件\n\n- 条件1\n- 条件2\n- 条件3\n\n## 步骤\n\n### 第一步\n\n详细说明第一步...\n\n### 第二步\n\n详细说明第二步...\n\n## 总结\n\n总结内容...\n\n## 参考资料\n\n- [链接1](url)\n- [链接2](url)`
        },
        {
          id: 'problem-solution',
          name: '问题解决方案',
          description: '适合记录问题和解决方案',
          category: 'backend',
          tags: ['问题', '解决方案'],
          content: `# 问题描述\n\n## 现象\n\n描述问题的具体现象...\n\n## 环境信息\n\n- 操作系统：\n- 软件版本：\n- 其他相关信息：\n\n## 原因分析\n\n分析问题产生的原因...\n\n## 解决方案\n\n### 方案一\n\n详细说明方案一...\n\n### 方案二\n\n详细说明方案二...\n\n## 验证结果\n\n验证解决方案是否有效...\n\n## 总结\n\n总结经验教训...`
        },
        {
          id: 'learning-notes',
          name: '学习笔记',
          description: '适合学习笔记类文章',
          category: 'thoughts',
          tags: ['学习', '笔记'],
          content: `# 学习主题\n\n## 学习目标\n\n- 目标1\n- 目标2\n- 目标3\n\n## 关键概念\n\n### 概念1\n\n解释概念1...\n\n### 概念2\n\n解释概念2...\n\n## 实践过程\n\n### 步骤1\n\n详细记录步骤1...\n\n### 步骤2\n\n详细记录步骤2...\n\n## 遇到的问题\n\n记录遇到的问题和解决方法...\n\n## 心得体会\n\n分享学习心得...\n\n## 下一步计划\n\n- 计划1\n- 计划2`
        },
        {
          id: 'performance-analysis',
          name: '性能分析',
          description: '适合性能分析和优化类文章',
          category: 'performance',
          tags: ['性能', '优化', '分析'],
          content: `# 性能问题分析\n\n## 问题背景\n\n描述性能问题的背景...\n\n## 性能指标\n\n### 关键指标\n\n- 加载时间：\n- 响应时间：\n- 内存使用：\n- CPU使用率：\n\n## 问题定位\n\n### 分析过程\n\n详细记录分析过程...\n\n### 瓶颈识别\n\n识别性能瓶颈...\n\n## 优化方案\n\n### 方案一\n\n详细说明优化方案一...\n\n### 方案二\n\n详细说明优化方案二...\n\n## 效果验证\n\n### 优化前后对比\n\n对比优化前后的性能指标...\n\n## 总结建议\n\n总结优化经验...`
        },
        {
          id: 'css-guide',
          name: 'CSS指南',
          description: '适合CSS技巧和最佳实践类文章',
          category: 'css',
          tags: ['CSS', '样式', '前端'],
          content: `# CSS技巧指南\n\n## 背景\n\n介绍CSS技巧的背景...\n\n## 核心技巧\n\n### 技巧1：Flexbox布局\n\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\`\`\`\n\n### 技巧2：Grid布局\n\n\`\`\`css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n\`\`\`\n\n### 技巧3：响应式设计\n\n\`\`\`css\n@media (max-width: 768px) {\n  .responsive {\n    flex-direction: column;\n  }\n}\n\`\`\`\n\n## 最佳实践\n\n### 命名规范\n\n- 使用BEM命名法\n- 保持命名一致性\n\n### 性能优化\n\n- 减少选择器复杂度\n- 使用CSS预处理器\n\n## 常见陷阱\n\n### 陷阱1\n\n说明常见陷阱...\n\n### 陷阱2\n\n说明常见陷阱...\n\n## 总结\n\n总结CSS技巧要点...`
        }
      ]
      
      // 创建模板文件
      for (const template of defaultTemplates) {
        const meta = [
          `name: "${template.name}"`,
          `description: "${template.description}"`,
          `category: "${template.category}"`,
          `tags: "${template.tags.join(', ')}"`
        ].join('\n')
        
        const content = `---\n${meta}\n---\n${template.content}`
        await fs.writeFile(join(templatesDir, `${template.id}.md`), content)
      }
      
      return {
        success: true,
        templates: defaultTemplates
      }
    }
    
    return {
      success: true,
      templates
    }
  } catch (error) {
    console.error('获取模板失败:', error)
    throw createError({
      statusCode: 500,
      statusMessage: '获取模板失败'
    })
  }
})