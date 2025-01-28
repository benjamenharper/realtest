import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchContentBySlug } from '../../utils/wordpress';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      try {
        const content = await fetchContentBySlug(slug);
        if (!content) {
          navigate('/'); // Redirect to home if post not found
          return;
        }
        setPost(content);
      } catch (error) {
        console.error('Error loading post:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto p-6">
      {post.featuredImage && (
        <div className="relative h-64 md:h-96 w-full mb-6">
          <img
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

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
    </article>
  );
}
