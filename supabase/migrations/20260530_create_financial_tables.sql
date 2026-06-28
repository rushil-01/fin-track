-- Create extension for UUID generation if not exists
create extension if not exists "pgcrypto";

-- Income table
create table if not exists public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  source text not null,
  amount numeric not null,
  date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Expenses table
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category text not null,
  description text,
  amount numeric not null,
  date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Savings table
create table if not exists public.savings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  amount numeric not null,
  date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Loans table
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  principal numeric not null,
  rate numeric not null,
  tenure integer not null,
  loan_type text not null check (loan_type in ('simple', 'compound')),
  start_date date not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add foreign key constraints
alter table public.income
  add constraint fk_income_user_id
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.expenses
  add constraint fk_expenses_user_id
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.savings
  add constraint fk_savings_user_id
  foreign key (user_id) references auth.users (id) on delete cascade;

alter table public.loans
  add constraint fk_loans_user_id
  foreign key (user_id) references auth.users (id) on delete cascade;

-- Create indexes for better query performance
create index if not exists idx_income_user_id on public.income(user_id);
create index if not exists idx_income_date on public.income(date);

create index if not exists idx_expenses_user_id on public.expenses(user_id);
create index if not exists idx_expenses_date on public.expenses(date);

create index if not exists idx_savings_user_id on public.savings(user_id);
create index if not exists idx_savings_date on public.savings(date);

create index if not exists idx_loans_user_id on public.loans(user_id);
create index if not exists idx_loans_start_date on public.loans(start_date);
