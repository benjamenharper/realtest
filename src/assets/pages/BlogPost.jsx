import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchContentBySlug, fetchRelatedPosts } from '../../utils/wordpress';
import RelatedPosts from '../components/RelatedPosts';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

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
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <article className="bg-white rounded-lg shadow-sm">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative h-64 md:h-96 w-full">
            <img
              src={post.featuredImage}
              alt={post.imageAlt || post.title}
              className="w-full h-full object-cover rounded-t-lg"
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 p-6">
          {/* Main Content */}
          <main className="flex-1">
            <header className="mb-8">
              {/* Categories */}
              {post.type === 'post' && post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <span
                      key={category.id}
                      className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                dangerouslySetInnerHTML={{ __html: post.title }}
              />

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{post.date}</span>
                </div>
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <FaClock className="text-gray-400" />
                    <span>{post.readingTime} min read</span>
                  </div>
                )}
              </div>
            </header>

            {/* Content */}
            <div 
              className="prose prose-lg prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              {/* Author Info if available */}
              {post.author && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-4">
                    {post.author.avatar && (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{post.author.name}</div>
                      {post.author.bio && (
                        <p className="text-sm text-gray-600 mt-1">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Related Posts */}
              <RelatedPosts posts={relatedPosts} />
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
