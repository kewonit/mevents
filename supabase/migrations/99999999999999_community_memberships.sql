-- Create enum for membership roles
create type public.membership_role as enum ('member', 'moderator', 'admin');

-- Create enum for membership status
create type public.membership_status as enum ('pending', 'approved', 'rejected', 'banned');

-- Create memberships table
create table public.community_memberships (
  id uuid not null default gen_random_uuid(),
  community_id uuid not null,
  profile_id uuid not null,
  role membership_role not null default 'member',
  status membership_status not null default 'pending',
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint community_memberships_pkey primary key (id),
  constraint community_memberships_community_profile_unique unique (community_id, profile_id),
  constraint community_memberships_community_id_fkey foreign key (community_id) references communities(id) on delete cascade,
  constraint community_memberships_profile_id_fkey foreign key (profile_id) references profiles(id) on delete cascade
);

-- Create indexes
create index idx_community_memberships_community_id on public.community_memberships using btree (community_id);
create index idx_community_memberships_profile_id on public.community_memberships using btree (profile_id);
create index idx_community_memberships_status on public.community_memberships using btree (status);

-- Create RLS policies
alter table public.community_memberships enable row level security;

create policy "Users can view their own memberships"
  on public.community_memberships for select
  using (auth.uid() = profile_id);

create policy "Community admins can view all memberships"
  on public.community_memberships for select
  using (
    exists (
      select 1 from community_memberships
      where community_id = community_memberships.community_id
      and profile_id = auth.uid()
      and role in ('admin', 'moderator')
    )
  );

create policy "Users can request to join communities"
  on public.community_memberships for insert
  with check (
    auth.uid() = profile_id
    and role = 'member'
    and status = 'pending'
  );

create policy "Admins can update membership status"
  on public.community_memberships for update
  using (
    exists (
      select 1 from community_memberships
      where community_id = community_memberships.community_id
      and profile_id = auth.uid()
      and role in ('admin', 'moderator')
    )
  );

-- Create function to update member count
create or replace function public.update_community_member_count()
returns trigger as $$
begin
  if (TG_OP = 'INSERT' and NEW.status = 'approved') then
    update communities
    set member_count = member_count + 1
    where id = NEW.community_id;
  elsif (TG_OP = 'UPDATE' and OLD.status != 'approved' and NEW.status = 'approved') then
    update communities
    set member_count = member_count + 1
    where id = NEW.community_id;
  elsif (TG_OP = 'UPDATE' and OLD.status = 'approved' and NEW.status != 'approved') then
    update communities
    set member_count = member_count - 1
    where id = NEW.community_id;
  elsif (TG_OP = 'DELETE' and OLD.status = 'approved') then
    update communities
    set member_count = member_count - 1
    where id = OLD.community_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Create triggers for member count
create trigger on_membership_change
  after insert or update or delete on public.community_memberships
  for each row execute procedure public.update_community_member_count();

-- Add updated_at trigger
create trigger update_community_memberships_updated_at
  before update on public.community_memberships
  for each row execute procedure update_updated_at_column();
