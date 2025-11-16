// 简单的文章数据对比测试
const fs = require('fs');
const path = require('path');

// 模拟文章内容数据
const articlesPath = 'g:\\学习\\blog\\blog\\app\\content\\articles';

console.log('=== 文章数据对比测试 ===');
console.log('检查目录:', articlesPath);

try {
  // 检查目录是否存在
  if (fs.existsSync(articlesPath)) {
    const files = fs.readdirSync(articlesPath);
    console.log('找到文章文件:', files);
    
    // 读取所有文章文件
    const articles = [];
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const filePath = path.join(articlesPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 简单的元数据提取
        const lines = content.split('\n');
        let title = '';
        let date = '';
        let category = '';
        
        lines.forEach(line => {
          if (line.startsWith('title:')) title = line.replace('title:', '').replace(/['"]/g, '').trim();
          if (line.startsWith('date:')) date = line.replace('date:', '').replace(/['"]/g, '').trim();
          if (line.startsWith('category:')) category = line.replace('category:', '').replace(/['"]/g, '').trim();
        });
        
        articles.push({
          file: file,
          title: title,
          date: date,
          category: category
        });
      }
    });
    
    console.log('\n=== 文章列表 ===');
    articles.forEach(article => {
      console.log(`- ${article.title} (${article.date}) [${article.category}]`);
    });
    
    // 按日期排序（模拟首页逻辑）
    const sortedArticles = articles.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // 降序
    });
    
    console.log('\n=== 首页显示 (最新6篇) ===');
    const homePageArticles = sortedArticles.slice(0, 6);
    homePageArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.date})`);
    });
    
    console.log('\n=== 博客页面显示 (所有文章) ===');
    sortedArticles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.date})`);
    });
    
    console.log('\n=== 分类统计 ===');
    const categoryStats = {};
    articles.forEach(article => {
      if (article.category) {
        categoryStats[article.category] = (categoryStats[article.category] || 0) + 1;
      }
    });
    
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`${category}: ${count}篇`);
    });
    
  } else {
    console.log('文章目录不存在！');
  }
} catch (error) {
  console.error('读取文件时出错:', error.message);
}