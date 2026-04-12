create table if not exists sample_customers (
  id integer generated always as identity primary key,
  name text not null,
  tier text not null check (tier in ('starter', 'growth', 'enterprise')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
