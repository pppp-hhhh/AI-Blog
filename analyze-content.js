// 读取并分析Nuxt Content数据
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('nuxt-content-data.json', 'utf8'));
console.log('文章数量:', data.length);
data.forEach((article, i) => {
  console.log(`${i+1}. ${article.title} (${article.status}) - ${article._path}`);
});