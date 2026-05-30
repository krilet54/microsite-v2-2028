-- BLOG POSTS TABLE
create table if not exists blog_posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now()),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  author text default 'Microsite Studio',
  status text default 'draft' check (status in ('draft', 'published')),
  seo_title text,
  seo_description text,
  seo_keywords text,
  og_image_url text,
  read_time integer,
  published_at timestamp with time zone
);

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update
set public = excluded.public,
    name = excluded.name;

-- CONTACT FORM SUBMISSIONS TABLE
create table if not exists contact_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc', now()),
  name text not null,
  email text not null,
  phone text,
  company text,
  stage text,
  challenge text,
  services text[],
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  notes text,
  source text default 'contact_page'
);

-- NEWSLETTER SUBSCRIBERS TABLE
create table if not exists newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc', now()),
  email text not null unique
);

-- ROW LEVEL SECURITY
alter table blog_posts enable row level security;

create policy "Public can read published posts"
  on blog_posts for select
  using (status = 'published');

create policy "Authenticated users have full access to posts"
  on blog_posts for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete posts"
  on blog_posts for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can upload blog images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Authenticated users can update blog images"
  on storage.objects for update
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete blog images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated');

alter table contact_submissions enable row level security;

create policy "Authenticated users can read submissions"
  on contact_submissions for select
  using (auth.role() = 'authenticated');

create policy "Anyone can insert a submission"
  on contact_submissions for insert
  with check (true);

create policy "Authenticated users can update submissions"
  on contact_submissions for update
  using (auth.role() = 'authenticated');

alter table newsletter_subscribers enable row level security;

create policy "Anyone can insert subscriber"
  on newsletter_subscribers for insert
  with check (true);

create policy "Authenticated can read subscribers"
  on newsletter_subscribers for select
  using (auth.role() = 'authenticated');

-- AUTO-UPDATE updated_at on blog_posts
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

create trigger update_blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at_column();
