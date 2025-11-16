// 测试文章数据获取逻辑
import { useLocalStorage } from './app/composables/useLocalStorage.js';

// 模拟文章内容
const mockContentPosts = [
  {
    _path: '/articles/test',
    title: 'test',
    description: '测试文章',
    date: '2025-11-16',
    category: 'frontend',
    tags: ['测试'],
    status: 'published'
  },
  {
    _path: '/articles/test-new-article',
    title: '测试新文章',
    description: '这是通过API创建的文章',
    date: '2025-11-16',
    category: 'frontend',
    tags: ['测试', '前端'],
    status: 'published'
  }
];

// 获取本地存储的文章
const { getStoredArticles } = useLocalStorage();

// 模拟computed逻辑
function getSafePosts() {
  const contentArticles = mockContentPosts || [];
  const storedArticles = getStoredArticles() || [];
  
  console.log('Content文章数量:', contentArticles.length);
  console.log('本地存储文章数量:', storedArticles.length);
  
  // 创建一个Map来避免重复
  const articleMap = new Map();
  
  // 先添加Content文章
  contentArticles.forEach(article => {
    if (article.status === 'published') {
      const key = article._path || article.title;
      articleMap.set(key, article);
      console.log('添加Content文章:', key, article.title);
    }
  });
  
  // 再添加本地存储的文章（如果路径或标题不重复）
  storedArticles.forEach(article => {
    if (article.status === 'published') {
      const key = article._path || article.title;
      if (!articleMap.has(key)) {
        articleMap.set(key, article);
        console.log('添加本地存储文章:', key, article.title);
      } else {
        console.log('跳过重复文章:', key);
      }
    }
  });
  
  return Array.from(articleMap.values());
}

const safePosts = getSafePosts();
console.log('最终文章数量:', safePosts.length);
safePosts.forEach((post, i) => {
  console.log(`${i+1}. ${post.title} (${post.status}) - ${post._path}`);
});