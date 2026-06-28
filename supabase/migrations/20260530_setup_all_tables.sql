-- Create extension if not exists
create extension if not exists "pgcrypto";

-- ============= INCOME TABLE =============
drop table if exists public.income cascade;

create table public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  amount numeric not null,
  date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_income_user_id on public.income(user_id);
create index idx_income_date on public.income(date);

alter table public.income enable row level security;

create policy "Users can view their own income"
  on public.income for select
  using (auth.uid() = user_id);

create policy "Users can insert their own income"
  on public.income for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own income"
  on public.income for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own income"
  on public.income for delete
  using (auth.uid() = user_id);

-- ============= EXPENSES TABLE =============
drop table if exists public.expenses cascade;

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  description text,
  amount numeric not null,
  date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_expenses_user_id on public.expenses(user_id);
create index idx_expenses_date on public.expenses(date);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- ============= SAVINGS TABLE =============
drop table if exists public.savings cascade;

create table public.savings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null,
  date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_savings_user_id on public.savings(user_id);
create index idx_savings_date on public.savings(date);

alter table public.savings enable row level security;

create policy "Users can view their own savings"
  on public.savings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own savings"
  on public.savings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own savings"
  on public.savings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own savings"
  on public.savings for delete
  using (auth.uid() = user_id);

-- ============= LOANS TABLE (Already created, but included for completeness) =============
drop table if exists public.loans cascade;

create table public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  principal numeric not null,
  rate numeric not null,
  tenure integer not null,
  loan_type text not null check (loan_type in ('simple', 'compound')),
  start_date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_loans_user_id on public.loans(user_id);
create index idx_loans_start_date on public.loans(start_date);

alter table public.loans enable row level security;

create policy "Users can view their own loans"
  on public.loans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own loans"
  on public.loans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own loans"
  on public.loans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own loans"
  on public.loans for delete
  using (auth.uid() = user_id);
