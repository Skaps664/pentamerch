create extension if not exists pgcrypto;

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  image text not null default '',
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  price numeric(12, 2) not null default 0,
  original_price numeric(12, 2),
  description text not null default '',
  category text not null,
  image text not null default '',
  rating numeric(3, 2) not null default 0,
  reviews integer not null default 0,
  in_stock boolean not null default true,
  is_featured boolean not null default false,
  is_bestseller boolean not null default false,
  images jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  key_features jsonb not null default '[]'::jsonb,
  shipping_info jsonb not null default '[]'::jsonb,
  return_info jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);

create table if not exists public.site_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

drop policy if exists user_profiles_select_own on public.user_profiles;
create policy user_profiles_select_own
on public.user_profiles
for select
using (auth.uid() = user_id);

drop policy if exists user_profiles_upsert_own on public.user_profiles;
create policy user_profiles_upsert_own
on public.user_profiles
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;
