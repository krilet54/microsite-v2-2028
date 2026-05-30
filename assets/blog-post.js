(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const preview = params.get('preview') === 'true';

  const articleEl = document.getElementById('article-body');
  const titleEl = document.getElementById('article-title');
  const excerptEl = document.getElementById('article-excerpt');
  const metaEl = document.getElementById('article-meta');
  const heroTagEl = document.getElementById('article-tag');
  const coverEl = document.getElementById('article-cover');
  const breadcrumbPostEl = document.getElementById('breadcrumb-post');
  const relatedGrid = document.getElementById('related-grid');

  function formatDate(value) {
    if (!value) return 'Unscheduled';
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function getCategoryFromKeywords(keywords) {
    if (!keywords) return 'GTM Strategy';
    return (keywords.split(',')[0] || 'GTM Strategy').trim();
  }

  function setMeta(post) {
    document.title = post.seo_title || (post.title + ' — Microsite Studio');

    const description = post.seo_description || post.excerpt || '';
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', post.seo_title || post.title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', post.og_image_url || post.cover_image_url || '');
    setMetaTag('name', 'twitter:title', post.seo_title || post.title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', post.og_image_url || post.cover_image_url || '');
  }

  function setMetaTag(type, key, value) {
    const selector = 'meta[' + type + '="' + key + '"]';
    let tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(type, key);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', value || '');
  }

  async function fetchPost() {
    if (!slug) return null;

    let allowDraftPreview = false;
    if (preview) {
      const sessionRes = await supabase.auth.getSession();
      allowDraftPreview = !!(sessionRes.data && sessionRes.data.session);
    }

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .limit(1);

    if (!(preview && allowDraftPreview)) {
      query = query.eq('status', 'published');
    }

    const response = await query.single();
    if (response.error) {
      console.error(response.error);
      return null;
    }

    return response.data;
  }

  async function fetchRelated(currentId) {
    const response = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, published_at, read_time, seo_keywords')
      .eq('status', 'published')
      .neq('id', currentId)
      .order('published_at', { ascending: false })
      .limit(2);

    if (response.error) {
      console.error(response.error);
      return [];
    }

    return response.data || [];
  }

  function renderRelated(posts) {
    relatedGrid.innerHTML = posts.map(function (post) {
      const category = getCategoryFromKeywords(post.seo_keywords);
      return (
        '<article class="blog-card">' +
        '  <a class="blog-card-link" href="blog-post.html?slug=' + encodeURIComponent(post.slug) + '">' +
        '    <img class="blog-card-cover" loading="lazy" src="' + (post.cover_image_url || '') + '" alt="' + escapeHtml(post.title) + '">' +
        '    <div class="blog-card-body">' +
        '      <span class="blog-tag">' + escapeHtml(category) + '</span>' +
        '      <h3 class="blog-card-title">' + escapeHtml(post.title) + '</h3>' +
        '      <p class="blog-card-excerpt">' + escapeHtml(post.excerpt || '') + '</p>' +
        '      <div class="blog-card-meta">' +
        '        <span>' + (post.read_time || 5) + ' min read</span>' +
        '        <span>·</span>' +
        '        <span>' + formatDate(post.published_at) + '</span>' +
        '      </div>' +
        '    </div>' +
        '  </a>' +
        '</article>'
      );
    }).join('');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function init() {
    const post = await fetchPost();

    if (!post) {
      titleEl.textContent = 'Post not found';
      excerptEl.textContent = 'This article is unavailable.';
      metaEl.textContent = '';
      articleEl.innerHTML = '<p>The post may be unpublished or the link may be incorrect.</p>';
      return;
    }

    const category = getCategoryFromKeywords(post.seo_keywords);

    setMeta(post);
    titleEl.textContent = post.title;
    excerptEl.textContent = post.excerpt || '';
    breadcrumbPostEl.textContent = post.title;
    heroTagEl.textContent = category;
    coverEl.src = post.cover_image_url || '';
    coverEl.alt = post.title;

    const publishedDate = formatDate(post.published_at || post.created_at);
    metaEl.textContent = 'By ' + (post.author || 'Microsite Studio') + ' · ' + publishedDate + ' · ' + (post.read_time || 5) + ' min read';

    articleEl.innerHTML = post.content || '<p>No content yet.</p>';

    const relatedPosts = await fetchRelated(post.id);
    renderRelated(relatedPosts);
  }

  init();
})();
