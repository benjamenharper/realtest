import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {post.featuredImage && (
        <div className="relative h-48 w-full">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
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
        <h2 
          className="text-xl font-semibold mb-2 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div 
          className="text-gray-600 text-sm mb-3 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.excerpt }}
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{post.date}</span>
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
