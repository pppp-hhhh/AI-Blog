// 检查本地存储中的文章
// 模拟浏览器环境
global.localStorage = {
  data: new Map(),
  getItem(key) {
    return this.data.get(key) || null;
  },
  setItem(key, value) {
    this.data.set(key, value);
  },
  removeItem(key) {
    this.data.delete(key);
  },
  clear() {
    this.data.clear();
  }
};

// 模拟 useLocalStorage 函数
const useLocalStorage = () => {
  const getStoredArticles = () => {
    if (process.client) {
      const stored = localStorage.getItem('blog-articles');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  };

  return {
    getStoredArticles
  };
};

// 检查文章
const { getStoredArticles } = useLocalStorage();
const articles = getStoredArticles();

console.log('本地存储中的文章数量:', articles.length);
if (articles.length > 0) {
  console.log('\n文章列表:');
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.title}`);
    console.log(`   - 状态: ${article.status}`);
    console.log(`   - 分类: ${article.category}`);
    console.log(`   - 标签: ${JSON.stringify(article.tags)}`);
    console.log(`   - 日期: ${article.date}`);
    console.log(`   - ID: ${article._id}`);
    console.log('');
  });
} else {
  console.log('本地存储中没有文章');
}