const WORDPRESS_API_URL = 'https://hawaiieliterealestate.com/wp-json/wp/v2';

export async function fetchPosts(params = {}) {
  try {
    const url = new URL(`${WORDPRESS_API_URL}/posts`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Add _embed parameter to get featured images
    url.searchParams.append('_embed', '1');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts.map(post => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      content: post.content.rendered,
      slug: post.slug,
      date: new Date(post.date).toLocaleDateString(),
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
      categories: post._embedded?.['wp:term']?.[0] || []
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function fetchRecentPosts(count = 3) {
  return fetchPosts({ per_page: count });
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
