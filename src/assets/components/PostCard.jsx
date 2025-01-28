import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {post.featuredImage && (
        <div className="relative h-48 w-full">
          <img
            src={post.featuredImage}
            alt={post.imageAlt || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        {post.type === 'post' && post.categories && post.categories.length > 0 && (
          <div className="flex gap-2 mb-2">
            {post.categories.map((category) => (
              <span
                key={category.id}
                className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            post.type === 'post'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-purple-50 text-purple-600'
          }`}>
            {post.type === 'post' ? 'Article' : 'Page'}
          </span>
          <span className="text-sm text-gray-500">{post.date}</span>
        </div>
        <h2 
          className="text-xl font-semibold mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div 
          className="text-gray-600 text-sm mb-3 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="flex justify-end">
          <Link 
            to={`/blog/${post.slug}`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
