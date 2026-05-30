(function () {
  'use strict';

  // Only run on article pages under /articles/
  try {
    if (!location.pathname.startsWith('/articles/')) return;

    // derive slug from filename: /articles/slug.html -> slug
    const parts = location.pathname.split('/');
    const file = parts.pop() || parts.pop();
    const slug = (file || '').replace(/\.html?$/i, '').trim();
    if (!slug) return;

    // supabase client is expected to be initialized in /assets/supabase-config.js
    if (typeof supabase === 'undefined') return;

    (async function () {
      try {
        const resp = await supabase.from('blog_posts').select('id,cover_image_url,og_image_url,seo_title,seo_description').eq('slug', slug).limit(1).single();
        if (resp.error || !resp.data) return;
        const post = resp.data;

        const newCover = post.cover_image_url || post.og_image_url || '';
        if (newCover) {
          // update first article image if present
          const img = document.querySelector('main article img') || document.querySelector('article img');
          if (img && img.src !== newCover) {
            img.src = newCover;
            img.style.display = 'block';
            img.alt = document.title || img.alt || '';
          }

          // update meta tags
          function setMeta(type, key, value) {
            const selector = 'meta[' + type + '="' + key + '"]';
            let tag = document.querySelector(selector);
            if (!tag) {
              tag = document.createElement('meta');
              tag.setAttribute(type, key);
              document.head.appendChild(tag);
            }
            tag.setAttribute('content', value || '');
          }

          setMeta('property', 'og:image', newCover);
          setMeta('name', 'twitter:image', newCover);
        }

        // update title/description meta if present
        if (post.seo_title) document.title = post.seo_title;
        if (post.seo_description) {
          const d = post.seo_description;
          const descTag = document.querySelector('meta[name="description"]');
          if (descTag) descTag.setAttribute('content', d);
          const ogDesc = document.querySelector('meta[property="og:description"]');
          if (ogDesc) ogDesc.setAttribute('content', d);
        }
      } catch (e) {
        // silent
      }
    })();
  } catch (e) { /* ignore */ }
})();
