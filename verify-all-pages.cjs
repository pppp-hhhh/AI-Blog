const fs = require('fs')
const path = require('path')

console.log('=== 验证所有页面分类数据修复效果 ===\n')

// 读取文章文件
const articlesDir = path.join(__dirname, 'app/content/articles')
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'))

console.log(`发现 ${files.length} 篇文章文件：`)

// 实际分类统计
const realCategories = {}
const realTags = {}

files.forEach(file => {
  const filePath = path.join(articlesDir, file)
  const content = fs.readFileSync(filePath, 'utf-8')
  
  // 提取元数据
  const metadata = {}
  const lines = content.split('\n')
  let inFrontMatter = false
  
  for (const line of lines) {
    if (line === '---') {
      if (inFrontMatter) break
      inFrontMatter = true
      continue
    }
    
    if (inFrontMatter) {
      const match = line.match(/^(.+?):\s*(.+)$/)
      if (match) {
        const [, key, value] = match
        metadata[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
      }
    }
  }
  
  // 统计分类
  if (metadata.category) {
    realCategories[metadata.category] = (realCategories[metadata.category] || 0) + 1
  }
  
  // 统计标签
  if (metadata.tags) {
    const tags = metadata.tags.split(',').map(tag => tag.trim())
    tags.forEach(tag => {
      realTags[tag] = (realTags[tag] || 0) + 1
    })
  }
  
  console.log(`- ${metadata.title || file}: category=${metadata.category}, tags=${metadata.tags || 'none'}`)
})

console.log('\n=== 实际分类统计 ===')
Object.entries(realCategories).forEach(([category, count]) => {
  console.log(`${category}: ${count}篇`)
})

console.log('\n=== 实际标签统计 ===')
Object.entries(realTags).forEach(([tag, count]) => {
  console.log(`${tag}: ${count}次`)
})

// 检查页面文件
console.log('\n=== 检查页面文件 ===')

const pages = [
  { name: '首页', file: 'app/pages/index.vue' },
  { name: '分类页', file: 'app/pages/category/index.vue' },
  { name: '归档页', file: 'app/pages/archive/index.vue' },
  { name: '标签页', file: 'app/pages/tag/index.vue' },
  { name: '搜索页', file: 'app/pages/search/index.vue' }
]

pages.forEach(page => {
  const filePath = path.join(__dirname, page.file)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 检查是否使用动态数据
    const hasDynamicCategory = content.includes('categoryStats') || 
                              (content.includes('computed') && content.includes('categories'))
    const hasHardcodedConfig = content.includes('categoryConfig = [')
    
    console.log(`${page.name}: ${hasDynamicCategory ? '✅ 使用动态数据' : '❌ 可能使用硬编码数据'}`)
    if (hasHardcodedConfig) {
      console.log(`  ⚠️  发现硬编码配置`)
    }
  } else {
    console.log(`${page.name}: ❌ 文件不存在`)
  }
})

console.log('\n=== 修复建议 ===')
console.log('1. 确保所有页面都使用 computed() 计算属性')
console.log('2. 基于实际文章数据动态生成分类和标签统计')
console.log('3. 移除所有硬编码的 categoryConfig')
console.log('4. 过滤掉 count 为 0 的分类')

console.log('\n=== 验证完成 ===')