create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.allowed_family_members (
  email text primary key check (email = lower(email)),
  family_id uuid not null references public.families(id) on delete cascade,
  role public.member_role not null,
  display_name text not null,
  avatar text not null
);

insert into private.allowed_family_members(email, family_id, role, display_name, avatar)
values
  ('vanessabenigno@gmail.com', '2959578b-8007-4ef8-a7d8-12d7ba1dc6d7', 'responsavel', 'Vanessa', '👩'),
  ('vgabrielbenigno@gmail.com', '2959578b-8007-4ef8-a7d8-12d7ba1dc6d7', 'filho', 'Biel', '🦸');

create function private.create_allowlisted_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare member private.allowed_family_members;
begin
  select * into member
  from private.allowed_family_members
  where email = lower(new.email);

  if member.email is not null then
    insert into public.profiles(id, family_id, role, display_name, avatar)
    values (new.id, member.family_id, member.role, member.display_name, member.avatar)
    on conflict (id) do nothing;
  end if;
  return new;
end $$;

revoke all on function private.create_allowlisted_profile() from public, anon, authenticated;

create trigger create_allowlisted_profile_after_signup
  after insert on auth.users
  for each row execute function private.create_allowlisted_profile();
