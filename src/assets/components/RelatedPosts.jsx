import { Link } from 'react-router-dom';

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="bg-white p-4 rounded-lg shadow-sm">
            {post.featuredImage && (
              <div className="relative h-32 w-full mb-3">
                <img
                  src={post.featuredImage}
                  alt={post.imageAlt || post.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <h3 
              className="text-lg font-medium mb-2 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.title }}
            />
            <div 
              className="text-sm text-gray-600 mb-3 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
            <Link 
              to={`/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Read More
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
