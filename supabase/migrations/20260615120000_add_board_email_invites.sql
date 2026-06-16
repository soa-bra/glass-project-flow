create table if not exists public.board_email_invites (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.planning_boards(id) on delete cascade,
  email text not null,
  role text not null check (role in ('viewer', 'editor', 'commenter')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  invited_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  accepted_at timestamptz null
);

create unique index if not exists board_email_invites_pending_email_key
  on public.board_email_invites (board_id, lower(email))
  where status = 'pending';

create index if not exists board_email_invites_board_created_at_idx
  on public.board_email_invites (board_id, created_at desc);

alter table public.board_email_invites enable row level security;

drop policy if exists "hosts read board email invites" on public.board_email_invites;
drop policy if exists "hosts and board writers create board email invites" on public.board_email_invites;

create policy "hosts read board email invites"
  on public.board_email_invites
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.planning_boards b
      where b.id = board_email_invites.board_id
        and (b.owner_id = auth.uid() or public.is_owner(auth.uid()))
    )
  );

create policy "hosts and board writers create board email invites"
  on public.board_email_invites
  for insert
  to authenticated
  with check (
    invited_by = auth.uid()
    and (
      exists (
        select 1
        from public.planning_boards b
        where b.id = board_email_invites.board_id
          and (b.owner_id = auth.uid() or public.is_owner(auth.uid()))
      )
      or private.can_write_planning_board(board_id)
    )
  );
