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
    type: item.type || 'post'
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
