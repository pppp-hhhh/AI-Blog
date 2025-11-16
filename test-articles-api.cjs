const http = require('http');

console.log('测试文章API...');

http.get('http://localhost:3001/api/articles', (res) => {
  let data = '';
  
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('API状态码:', res.statusCode);
    
    if (res.statusCode === 200) {
      try {
        const articles = JSON.parse(data);
        console.log('找到文章数量:', articles.length);
        
        if (articles.length > 0) {
          console.log('\n文章列表:');
          articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title}`);
            console.log(`   - 状态: ${article.status}`);
            console.log(`   - 分类: ${article.category}`);
            console.log(`   - 标签: ${JSON.stringify(article.tags)}`);
            console.log(`   - 链接: /articles/${article.slug}`);
            console.log('');
          });
        } else {
          console.log('没有找到文章');
        }
        
        // 检查是否有已发布的文章
        const publishedArticles = articles.filter(article => article.status === 'published');
        console.log(`已发布文章数量: ${publishedArticles.length}`);
        
      } catch (e) {
        console.log('JSON解析错误:', e.message);
        console.log('原始响应数据:', data.substring(0, 300));
      }
    } else {
      console.log('API返回错误状态:', res.statusCode);
      console.log('响应数据:', data);
    }
  });
}).on('error', err => {
  console.error('请求错误:', err.message);
  console.log('请确保开发服务器正在运行 (pnpm dev)');
});