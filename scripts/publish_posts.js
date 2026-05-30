#!/usr/bin/env node
/**
 * publish_posts.js
 * Reads articles/posts-manifest.json and article files, then upserts them to Supabase blog_posts.
 * USAGE (local):
 *   set SUPABASE_URL=https://your-project.supabase.co
 *   set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *   node scripts/publish_posts.js
 *
 * IMPORTANT: keep the service role key secret and delete/revoke it after use.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function main() {
  const manifestPath = path.join(__dirname, '..', 'articles', 'posts-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('Missing posts-manifest.json at', manifestPath);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  for (const post of manifest) {
    try {
      const fileRel = post.file.replace(/^\//, '');
      const filePath = path.join(__dirname, '..', fileRel);
      let content = '';
      if (fs.existsSync(filePath)) {
        content = fs.readFileSync(filePath, 'utf8');
      } else {
        console.warn('Article file not found, inserting placeholder content for', post.slug);
        content = `<!-- content file missing: ${fileRel} -->`;
      }

      const row = {
        title: post.title,
        slug: post.slug,
        excerpt: post.seo_description || post.excerpt || '',
        content: content,
        cover_image_url: post.cover_image_url || null,
        og_image_url: post.og_image_url || post.cover_image_url || null,
        author: post.author || 'Microsite Studio',
        status: post.status || 'published',
        seo_title: post.seo_title || post.title,
        seo_description: post.seo_description || post.excerpt || '',
        seo_keywords: post.seo_keywords || null,
        read_time: post.read_time || null,
        published_at: post.published_at ? new Date(post.published_at).toISOString() : null
      };

      console.log('Upserting', post.slug);
      const { data, error } = await supabase.from('blog_posts').upsert(row, { onConflict: 'slug' }).select().single();
      if (error) {
        console.error('Error upserting', post.slug, error.message || error);
      } else {
        console.log('Upserted:', data.slug, 'id:', data.id);
      }
    } catch (err) {
      console.error('Failed for', post.slug, err.message || err);
    }
  }

  console.log('Done. Please revoke the service role key when finished.');
}

main().catch(err => { console.error(err); process.exit(1); });
