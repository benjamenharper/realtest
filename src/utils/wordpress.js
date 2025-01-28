const WORDPRESS_URL = 'https://hawaiieliterealestate.com';
const WORDPRESS_API_URL = `${WORDPRESS_URL}/wp-json/wp/v2`;

async function fetchFromAPI(endpoint, params = {}) {
  try {
    const url = new URL(`${WORDPRESS_API_URL}/${endpoint}`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Add _embed parameter to get featured images and categories
    url.searchParams.append('_embed', '');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

function processContent(item) {
  const featuredMedia = item._embedded?.['wp:featuredmedia']?.[0];
  const categories = item._embedded?.['wp:term']?.[0] || [];
  
  return {
    id: item.id,
    title: item.title.rendered,
    content: item.content.rendered,
    excerpt: item.excerpt?.rendered || '',
    slug: item.slug,
    date: new Date(item.date).toLocaleDateString(),
    featuredImage: featuredMedia?.source_url || null,
    imageAlt: featuredMedia?.alt_text || '',
    categories: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug
    })),
    type: item.type || 'post',
    link: item.link ? new URL(item.link).pathname : null // Extract pathname from WordPress URL
  };
}

export async function fetchPosts(params = {}) {
  const posts = await fetchFromAPI('posts', params);
  return posts.map(processContent);
}

export async function fetchPages(params = {}) {
  const pages = await fetchFromAPI('pages', params);
  return pages.map(processContent);
}

export async function fetchCategories() {
  return fetchFromAPI('categories');
}

export async function fetchAllContent(params = {}) {
  try {
    const [posts, pages] = await Promise.all([
      fetchPosts(params),
      fetchPages(params)
    ]);

    return [...posts, ...pages].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  } catch (error) {
    console.error('Error fetching all content:', error);
    return [];
  }
}

export async function fetchContentBySlug(slug) {
  try {
    // Try to find it as a post first
    const posts = await fetchFromAPI('posts', { slug });
    if (posts.length > 0) {
      return processContent(posts[0]);
    }

    // If not found as a post, try as a page
    const pages = await fetchFromAPI('pages', { slug });
    if (pages.length > 0) {
      return processContent(pages[0]);
    }

    return null;
  } catch (error) {
    console.error('Error fetching content by slug:', error);
    return null;
  }
}

export async function fetchRelatedPosts(currentSlug, postType = 'post', limit = 3) {
  try {
    // Get all posts
    const allPosts = await fetchPosts();
    
    // Find the current post to get its categories
    const currentPost = allPosts.find(post => post.slug === currentSlug);
    if (!currentPost) return [];

    // Get category IDs of the current post
    const currentCategories = currentPost.categories.map(cat => cat.id);

    // Filter and sort related posts
    const relatedPosts = allPosts
      .filter(post => 
        post.slug !== currentSlug && // Exclude current post
        post.type === postType && // Match post type
        post.categories.some(cat => currentCategories.includes(cat.id)) // Must share at least one category
      )
      .sort((a, b) => {
        // Count matching categories
        const aMatches = a.categories.filter(cat => currentCategories.includes(cat.id)).length;
        const bMatches = b.categories.filter(cat => currentCategories.includes(cat.id)).length;
        return bMatches - aMatches; // Sort by most categories in common
      })
      .slice(0, limit);

    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}
