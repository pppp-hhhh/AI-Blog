const fs = require('fs');
const path = require('path');

const articlesDir = 'content/articles';

if (fs.existsSync(articlesDir)) {
  const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));
  
  console.log('=== 所有文章文件 ===');
  files.forEach(f => {
    const content = fs.readFileSync(path.join(articlesDir, f), 'utf8');
    const lines = content.split('\n');
    const frontmatter = {};
    let inFrontmatter = false;
    
    lines.forEach(line => {
      if (line === '---') {
        inFrontmatter = !inFrontmatter;
      } else if (inFrontmatter) {
        const match = line.match(/^(.+?):\s*(.*)$/);
        if (match) {
          frontmatter[match[1].trim()] = match[2].trim();
        }
      }
    });
    
    console.log(`${f}: status=${frontmatter.status || '未设置'}, title=${frontmatter.title || '无标题'}`);
  });
} else {
  console.log('文章目录不存在');
}