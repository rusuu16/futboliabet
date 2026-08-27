create table if not exists public.matches (
 id bigint generated always as identity primary key,
 teams text not null, league text, prediction text not null,
 odd numeric(8,2) not null check (odd > 1),
 status text not null default 'pending' check (status in ('pending','live','won','lost','void')),
 created_at timestamptz not null default now()
);
create table if not exists public.analyses (
 id bigint generated always as identity primary key,
 title text not null, stadium text, content text not null,
 created_at timestamptz not null default now()
);
alter table public.matches enable row level security;
alter table public.analyses enable row level security;
create policy "Public read matches" on public.matches for select using (true);
create policy "Public read analyses" on public.analyses for select using (true);
create policy "Authenticated users manage matches" on public.matches for all to authenticated using (true) with check (true);
create policy "Authenticated users manage analyses" on public.analyses for all to authenticated using (true) with check (true);