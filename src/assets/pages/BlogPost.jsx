import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchContentBySlug, fetchRelatedPosts } from '../../utils/wordpress';
import RelatedPosts from '../components/RelatedPosts';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const content = await fetchContentBySlug(slug);
        if (!content) {
          navigate('/');
          return;
        }
        setPost(content);

        // Fetch related posts
        const related = await fetchRelatedPosts(slug, content.type);
        setRelatedPosts(related);
      } catch (error) {
        console.error('Error loading content:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-64 md:h-96 w-full mb-6">
          <img
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {post.type === 'post' && post.categories && post.categories.length > 0 && (
                <div className="flex gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category.id}
                      className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
              <span className="text-gray-500">{post.date}</span>
            </div>
            <h1 
              className="text-4xl font-bold mb-4"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
          </header>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </main>

        {/* Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-6">
            <RelatedPosts posts={relatedPosts} />
          </div>
        </aside>
      </div>
    </div>
  );
}
