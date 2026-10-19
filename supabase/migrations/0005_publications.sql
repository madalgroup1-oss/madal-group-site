-- MADAL GROUP — historique des publications du site
-- Chaque clic sur « Publier sur le site » dans /admin passe par l'Edge Function rebuild,
-- qui enregistre ici le résultat de l'appel au deploy hook Cloudflare Pages.
-- Insertion uniquement par la fonction (service_role) ; lecture par les administrateurs.

create table publications (
  id uuid primary key default gen_random_uuid(),
  demandee_le timestamptz not null default now(),
  demandee_par uuid references auth.users (id) on delete set null,
  reussie boolean not null,
  message text
);
create index publications_date_idx on publications (demandee_le desc);

alter table publications enable row level security;

create policy "admin lecture" on publications
  for select to authenticated using (est_admin());

-- Droits explicites (voir 0003_droits_restreints.sql) : aucun droit pour anon
grant select on publications to authenticated;
grant select, insert, update, delete on publications to service_role;
