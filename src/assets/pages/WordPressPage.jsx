import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchContentBySlug } from '../../utils/wordpress';

export default function WordPressPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const content = await fetchContentBySlug(slug);
        if (!content || content.type !== 'page') {
          navigate('/');
          return;
        }
        setPage(content);
      } catch (error) {
        console.error('Error loading page:', error);
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
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Featured Image */}
      {page.featuredImage && (
        <div className="relative h-64 md:h-96 w-full mb-6">
          <img
            src={page.featuredImage}
            alt={page.imageAlt || page.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}

      <article>
        <h1 
          className="text-4xl font-bold mb-8"
          dangerouslySetInnerHTML={{ __html: page.title }}
        />

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}
