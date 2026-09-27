create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint connection_requests_no_self_connection check (sender_id <> receiver_id)
);

create index if not exists connection_requests_sender_status_idx
  on public.connection_requests (sender_id, status);
create index if not exists connection_requests_receiver_status_idx
  on public.connection_requests (receiver_id, status);

alter table public.connection_requests enable row level security;
grant select, insert, update on table public.connection_requests to authenticated;

drop policy if exists "Users can view their own connection requests" on public.connection_requests;
create policy "Users can view their own connection requests"
  on public.connection_requests for select
  to authenticated
  using (sender_id = (select auth.uid()) or receiver_id = (select auth.uid()));

drop policy if exists "Users can send their own connection requests" on public.connection_requests;
create policy "Users can send their own connection requests"
  on public.connection_requests for insert
  to authenticated
  with check (sender_id = (select auth.uid()) and sender_id <> receiver_id and status = 'pending');

drop policy if exists "Participants can update their own connection requests" on public.connection_requests;
create policy "Participants can update their own connection requests"
  on public.connection_requests for update
  to authenticated
  using (sender_id = (select auth.uid()) or receiver_id = (select auth.uid()))
  with check (sender_id = (select auth.uid()) or receiver_id = (select auth.uid()));

create or replace function public.validate_connection_request_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    if new.sender_id <> current_user_id or new.sender_id = new.receiver_id or new.status <> 'pending' then
      raise exception 'Invalid connection request.';
    end if;

    perform pg_advisory_xact_lock(hashtextextended(least(new.sender_id::text, new.receiver_id::text) || ':' || greatest(new.sender_id::text, new.receiver_id::text), 0));
    if exists (
      select 1 from public.connection_requests existing
      where existing.status in ('pending', 'accepted')
        and ((existing.sender_id = new.sender_id and existing.receiver_id = new.receiver_id)
          or (existing.sender_id = new.receiver_id and existing.receiver_id = new.sender_id))
    ) then
      raise exception 'An active connection request already exists between these users.';
    end if;
    return new;
  end if;

  if new.id <> old.id or new.sender_id <> old.sender_id or new.receiver_id <> old.receiver_id
    or new.created_at <> old.created_at then
    raise exception 'Connection request participants cannot be changed.';
  end if;

  if old.status <> 'pending' then
    raise exception 'Only pending requests can be changed.';
  end if;

  if new.status = 'accepted' or new.status = 'rejected' then
    if current_user_id <> old.receiver_id then
      raise exception 'Only the recipient can accept or reject this request.';
    end if;
  elsif new.status = 'cancelled' then
    if current_user_id <> old.sender_id then
      raise exception 'Only the sender can cancel this request.';
    end if;
  else
    raise exception 'Invalid connection request status transition.';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists validate_connection_request_change on public.connection_requests;
create trigger validate_connection_request_change
  before insert or update on public.connection_requests
  for each row execute function public.validate_connection_request_change();

revoke all on function public.validate_connection_request_change() from public, anon, authenticated;