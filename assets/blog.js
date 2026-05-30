(function () {
  'use strict';

  const PAGE_SIZE = 9;
  let offset = 0;
  let loadedPosts = [];
  let activeCategory = 'All';
  let hasMore = true;

  const postsGrid = document.getElementById('posts-grid');
  const emptyState = document.getElementById('blog-empty');
  const loadMoreWrap = document.getElementById('load-more-wrap');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const filterButtons = Array.from(document.querySelectorAll('.filter-pill'));
  const subscribeForm = document.getElementById('newsletter-form');

  const FALLBACK_COVER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%23161616'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-size='42' font-family='sans-serif'%3EMicrosite Studio%3C/text%3E%3C/svg%3E";

  const CATEGORY_OPTIONS = ['GTM Strategy', 'Launch', 'Growth', 'SEO', 'Case Studies'];

  function normalizeCategory(raw) {
    if (!raw) return 'GTM Strategy';
    const cleaned = String(raw).trim();
    const found = CATEGORY_OPTIONS.find(function (item) {
      return item.toLowerCase() === cleaned.toLowerCase();
    });
    return found || 'GTM Strategy';
  }

  function getCategoryFromKeywords(seoKeywords) {
    if (!seoKeywords) return 'GTM Strategy';
    const firstKeyword = seoKeywords.split(',')[0];
    return normalizeCategory(firstKeyword);
  }

  function formatDate(value) {
    if (!value) return 'Unscheduled';
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function resolveAssetUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (url.charAt(0) === '/') {
      if (location.protocol === 'file:') return url.replace(/^\//, '');
      return (location.origin && location.origin !== 'null') ? (location.origin + url) : url.replace(/^\//, '');
    }
    return url;
  }

  function getArticlePageUrl(slug) {
    return '/articles/' + encodeURIComponent(slug) + '.html';
  }

  function renderPosts() {
    const filtered = activeCategory === 'All'
      ? loadedPosts
      : loadedPosts.filter(function (post) {
          return post.category === activeCategory;
        });

    if (!filtered.length) {
      postsGrid.innerHTML = '';
      emptyState.style.display = 'block';
      loadMoreWrap.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    postsGrid.innerHTML = filtered
      .map(function (post) {
        const readTime = post.read_time ? post.read_time + ' min read' : '5 min read';
        return (
          '<article class="blog-card">' +
          '  <a class="blog-card-link" href="' + getArticlePageUrl(post.slug) + '">' +
          '    <img class="blog-card-cover" loading="lazy" src="' + resolveAssetUrl(post.cover_image_url || post.og_image_url || FALLBACK_COVER) + '" alt="' + escapeHtml(post.title) + '">' +
          '    <div class="blog-card-body">' +
          '      <span class="blog-tag">' + escapeHtml(post.category) + '</span>' +
          '      <h3 class="blog-card-title">' + escapeHtml(post.title) + '</h3>' +
          '      <p class="blog-card-excerpt">' + escapeHtml(post.excerpt || '') + '</p>' +
          '      <div class="blog-card-meta">' +
          '        <span>' + readTime + '</span>' +
          '        <span>·</span>' +
          '        <span>' + formatDate(post.published_at) + '</span>' +
          '        <span>·</span>' +
          '        <span style="color:var(--color-red)">Read →</span>' +
          '      </div>' +
          '    </div>' +
          '  </a>' +
          '</article>'
        );
      })
      .join('');

    loadMoreWrap.style.display = hasMore && activeCategory === 'All' ? 'flex' : 'none';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function fetchPosts(currentOffset) {
    const response = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, og_image_url, published_at, read_time, seo_keywords')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(currentOffset, currentOffset + (PAGE_SIZE - 1));

    if (response.error) {
      throw response.error;
    }

    return (response.data || []).map(function (post) {
      return Object.assign({}, post, {
        category: getCategoryFromKeywords(post.seo_keywords)
      });
    });
  }

  async function loadInitialPosts() {
    try {
      const data = await fetchPosts(0);
      loadedPosts = data;
      offset = data.length;
      hasMore = data.length === PAGE_SIZE;
      renderPosts();
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      emptyState.style.display = 'block';
      loadMoreWrap.style.display = 'none';
    }
  }

  async function loadMorePosts() {
    if (!hasMore) return;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading...';

    try {
      const data = await fetchPosts(offset);
      loadedPosts = loadedPosts.concat(data);
      offset += data.length;
      hasMore = data.length === PAGE_SIZE;
      renderPosts();
    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Load more';
    }
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (btn) {
        btn.classList.remove('active');
      });
      button.classList.add('active');
      activeCategory = button.dataset.filter;
      renderPosts();
    });
  });

  loadMoreBtn.addEventListener('click', loadMorePosts);

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const emailInput = subscribeForm.querySelector('input[name="email"]');
      const statusEl = document.getElementById('newsletter-status');
      const email = emailInput.value.trim();
      if (!email) return;

      const response = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email }]);

      if (response.error) {
        statusEl.textContent = 'Something went wrong. Please try again.';
        return;
      }

      statusEl.textContent = 'You are on the list.';
      subscribeForm.reset();
    });
  }

  loadInitialPosts();
})();
