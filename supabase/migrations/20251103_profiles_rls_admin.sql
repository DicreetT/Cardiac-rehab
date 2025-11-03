alter table public.profiles enable row level security;

-- El dueño puede leerse a sí mismo
create policy if not exists profiles_select_own
on public.profiles
for select
using (id = auth.uid());

-- Los admins pueden leer TODOS los perfiles
create policy if not exists profiles_select_admin
on public.profiles
for select
using (
  exists (
    select 1 from public.user_roles r
    where r.user_id = auth.uid()
      and r.role = 'admin'
  )
);
