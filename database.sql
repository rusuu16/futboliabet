-- FUTBOLIA BET v3 migration
create table if not exists public.coupons (
 id bigint generated always as identity primary key,
 title text not null,
 coupon_date date default current_date,
 status text not null default 'pending' check(status in ('pending','won','lost')),
 created_at timestamptz not null default now()
);

alter table public.matches add column if not exists coupon_id bigint references public.coupons(id) on delete cascade;

-- Mövcud köhnə oyunları itirməmək üçün bir legacy kupon yaradılır və oyunlar ona bağlanır.
insert into public.coupons(title,coupon_date)
select 'Günün Kuponu', current_date
where not exists (select 1 from public.coupons);
update public.matches set coupon_id=(select id from public.coupons order by id limit 1) where coupon_id is null;

alter table public.coupons enable row level security;
alter table public.matches enable row level security;
alter table public.analyses enable row level security;

drop policy if exists "Public read coupons" on public.coupons;
drop policy if exists "Authenticated manage coupons" on public.coupons;
drop policy if exists "Public read matches" on public.matches;
drop policy if exists "Authenticated users manage matches" on public.matches;
drop policy if exists "Public read analyses" on public.analyses;
drop policy if exists "Authenticated users manage analyses" on public.analyses;

create policy "Public read coupons" on public.coupons for select using (true);
create policy "Authenticated manage coupons" on public.coupons for all to authenticated using (true) with check (true);
create policy "Public read matches" on public.matches for select using (true);
create policy "Authenticated users manage matches" on public.matches for all to authenticated using (true) with check (true);
create policy "Public read analyses" on public.analyses for select using (true);
create policy "Authenticated users manage analyses" on public.analyses for all to authenticated using (true) with check (true);
