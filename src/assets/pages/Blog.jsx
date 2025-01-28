import { useState, useEffect } from 'react';
import { fetchAllContent, fetchCategories } from '../../utils/wordpress';
import PostCard from '../components/PostCard';

export default function Blog() {
  const [content, setContent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentType, setContentType] = useState('all'); // 'all', 'post', or 'page'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [allContent, fetchedCategories] = await Promise.all([
          fetchAllContent(),
          fetchCategories()
        ]);
        setContent(allContent);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const filteredContent = content
    .filter(item => {
      // Filter by content type
      if (contentType !== 'all' && item.type !== contentType) {
        return false;
      }
      // Filter by category
      if (selectedCategory === 'all') {
        return true;
      }
      return item.categories.some(cat => cat.id.toString() === selectedCategory);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Latest Updates</h1>
      
      {/* Content type filter */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setContentType('all')}
            className={\`px-4 py-2 rounded-lg \${
              contentType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }\`}
          >
            All Content
          </button>
          <button
            onClick={() => setContentType('post')}
            className={\`px-4 py-2 rounded-lg \${
              contentType === 'post'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }\`}
          >
            Articles
          </button>
          <button
            onClick={() => setContentType('page')}
            className={\`px-4 py-2 rounded-lg \${
              contentType === 'page'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }\`}
          >
            Pages
          </button>
        </div>
      </div>

      {/* Categories filter */}
      <div className="mb-8">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={\`px-4 py-2 rounded-lg \${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }\`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id.toString())}
              className={\`px-4 py-2 rounded-lg \${
                selectedCategory === category.id.toString()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }\`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <PostCard key={item.id} post={item} />
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No content found with the selected filters.
        </div>
      )}
    </div>
  );
}
