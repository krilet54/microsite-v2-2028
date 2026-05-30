const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SITE_ORIGIN = 'https://micro-site.studio';
const FALLBACK_IMAGE = 'https://micro-site.studio/assets/og-image.png';

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function resolveImageUrl(url) {
  if (!url) return FALLBACK_IMAGE;
  if (/^data:/i.test(url)) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.charAt(0) === '/') return SITE_ORIGIN + url;
  return url;
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function renderPage(post, relatedPosts) {
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || 'Read on Microsite Studio';
  const imageUrl = resolveImageUrl(post.og_image_url || post.cover_image_url);
  const canonicalUrl = SITE_ORIGIN + '/blog-post.html?slug=' + encodeURIComponent(post.slug);

  const relatedHtml = relatedPosts.length
    ? relatedPosts.map(function (item) {
        const itemImage = resolveImageUrl(item.cover_image_url || item.og_image_url);
        return (
          '<article class="blog-card">' +
          '  <a class="blog-card-link" href="/blog-post.html?slug=' + encodeURIComponent(item.slug) + '\">' +
          '    <img class="blog-card-cover" loading="lazy" src="' + itemImage + '" alt="' + escapeHtml(item.title) + '">' +
          '    <div class="blog-card-body">' +
          '      <span class="blog-tag">' + escapeHtml((item.seo_keywords || 'GTM Strategy').split(',')[0].trim()) + '</span>' +
          '      <h3 class="blog-card-title">' + escapeHtml(item.title) + '</h3>' +
          '      <p class="blog-card-excerpt">' + escapeHtml(item.excerpt || '') + '</p>' +
          '      <div class="blog-card-meta">' +
          '        <span>' + escapeHtml(String(item.read_time || 5)) + ' min read</span>' +
          '        <span>·</span>' +
          '        <span>' + escapeHtml(formatDate(item.published_at)) + '</span>' +
          '      </div>' +
          '    </div>' +
          '  </a>' +
          '</article>'
        );
      }).join('')
    : '<p style="color:#a9a9a9;">More posts coming soon.</p>';

  return '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '  <meta charset="UTF-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>' + escapeHtml(title) + '</title>' +
    '  <meta name="description" content="' + escapeHtml(description) + '">' +
    '  <meta name="robots" content="index, follow">' +
    '  <meta property="og:type" content="article">' +
    '  <meta property="og:site_name" content="Microsite Studio">' +
    '  <meta property="og:title" content="' + escapeHtml(title) + '">' +
    '  <meta property="og:description" content="' + escapeHtml(description) + '">' +
    '  <meta property="og:url" content="' + canonicalUrl + '">' +
    '  <meta property="og:image" content="' + escapeHtml(imageUrl) + '">' +
    '  <meta property="og:image:width" content="1200">' +
    '  <meta property="og:image:height" content="630">' +
    '  <meta property="og:image:alt" content="' + escapeHtml(title) + '">' +
    '  <meta property="article:published_time" content="' + escapeHtml(post.published_at || '') + '">' +
    '  <meta property="article:author" content="' + escapeHtml(post.author || 'Microsite Studio') + '">' +
    '  <meta name="twitter:card" content="summary_large_image">' +
    '  <meta name="twitter:title" content="' + escapeHtml(title) + '">' +
    '  <meta name="twitter:description" content="' + escapeHtml(description) + '">' +
    '  <meta name="twitter:image" content="' + escapeHtml(imageUrl) + '">' +
    '  <meta name="twitter:image:alt" content="' + escapeHtml(title) + '">' +
    '  <link rel="canonical" href="' + canonicalUrl + '">' +
    '  <link rel="icon" type="image/svg+xml" href="/favicon.svg">' +
    '  <link rel="preconnect" href="https://fonts.googleapis.com">' +
    '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
    '  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">' +
    '  <link rel="stylesheet" href="/style.css">' +
    '  <link rel="stylesheet" href="/brand-shell.css">' +
    '  <link rel="stylesheet" href="/assets/blog.css">' +
    '  <style>.article-body p, .article-body li { line-height: 1.8; }</style>' +
    '</head>' +
    '<body>' +
    '  <nav class="nav" id="nav">' +
    '    <div class="nav-inner">' +
    '      <a href="/index.html" class="nav-logo">Microsite <span class="nav-studio">Studio</span></a>' +
    '      <ul class="nav-links">' +
    '        <li><a href="/work.html">Work</a></li>' +
    '        <li><a href="/services.html">Services</a></li>' +
    '        <li><a href="/about.html">About</a></li>' +
    '        <li><a href="/contact.html" class="nav-cta">Start a Project</a></li>' +
    '      </ul>' +
    '    </div>' +
    '  </nav>' +
    '  <main class="container article-shell">' +
    '    <article>' +
    '      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/index.html">Home</a> → <a href="/blog.html">Blog</a> → <span>' + escapeHtml(post.title) + '</span></nav>' +
    '      <span class="blog-tag">' + escapeHtml((post.seo_keywords || 'GTM Strategy').split(',')[0].trim()) + '</span>' +
    '      <h1 class="article-title">' + escapeHtml(post.title) + '</h1>' +
    '      <p class="article-subtitle">' + escapeHtml(description) + '</p>' +
    '      <p class="article-meta">By ' + escapeHtml(post.author || 'Microsite Studio') + ' · ' + escapeHtml(formatDate(post.published_at)) + ' · ' + escapeHtml(String(post.read_time || 5)) + ' min read</p>' +
    '      <img class="article-cover" src="' + escapeHtml(imageUrl) + '" alt="' + escapeHtml(post.title) + '">' +
    '      <div class="article-body-wrap"><div class="article-body">' + (post.content || '<p>No content yet.</p>') + '</div></div>' +
    '      <section class="related-wrap"><h2 style="font-family:\'Bebas Neue\',sans-serif;font-size:46px;margin-bottom:14px;">Related Posts</h2><div class="related-grid">' + relatedHtml + '</div></section>' +
    '    </article>' +
    '  </main>' +
    '</body>' +
    '</html>';
}

module.exports = async function handler(req, res) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      res.statusCode = 500;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Microsite Studio</title></head><body><p>Blog preview is not configured.</p></body></html>');
      return;
    }

    const slug = (req.query && req.query.slug) || new URL(req.url, SITE_ORIGIN).searchParams.get('slug');
    if (!slug) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Microsite Studio</title></head><body><p>Missing blog slug.</p></body></html>');
      return;
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });

    const [postRes, relatedRes] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('title, slug, excerpt, content, cover_image_url, og_image_url, seo_title, seo_description, published_at, read_time, author, seo_keywords')
        .eq('slug', slug)
        .eq('status', 'published')
        .single(),
      supabase
        .from('blog_posts')
        .select('title, slug, excerpt, cover_image_url, og_image_url, published_at, read_time, seo_keywords')
        .eq('status', 'published')
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(2)
    ]);

    const post = postRes.data;
    if (!post) {
      res.statusCode = 404;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Post not found</title><meta property="og:title" content="Post not found"><meta property="og:description" content="The requested article is unavailable."><meta property="og:image" content="' + FALLBACK_IMAGE + '"><meta name="twitter:card" content="summary_large_image"></head><body><p>Post not found.</p></body></html>');
      return;
    }

    const html = renderPage(post, relatedRes.data || []);
    res.statusCode = 200;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.setHeader('cache-control', 'no-store');
    res.end(html);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('content-type', 'text/html; charset=utf-8');
    res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><title>Microsite Studio</title></head><body><p>Preview render failed.</p></body></html>');
  }
};