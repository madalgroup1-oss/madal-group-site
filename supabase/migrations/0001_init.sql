-- MADAL GROUP — site vitrine
-- Schéma initial : contenus, demandes, administration, RLS, stockage, données de départ.
-- À appliquer sur un projet Supabase vierge (supabase db push, ou éditeur SQL).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------------
create type pole as enum ('consulting', 'distribution', 'technologie', 'groupe');
create type statut_article as enum ('brouillon', 'publie');
create type statut_demande as enum ('nouvelle', 'traitee', 'convertie');
create type type_solution as enum ('logiciel', 'site_web', 'reseau', 'videosurveillance', 'mission');

-- ---------------------------------------------------------------------------
-- Administration
-- ---------------------------------------------------------------------------
create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  cree_le timestamptz not null default now()
);

create or replace function est_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

create or replace function maj_modifie_le()
returns trigger
language plpgsql
as $$
begin
  new.modifie_le = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Madal Distribution : familles, produits, promotions
-- ---------------------------------------------------------------------------
create table familles_produits (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text not null unique,
  ordre integer not null default 0
);

create table produits (
  id uuid primary key default gen_random_uuid(),
  famille_id uuid not null references familles_produits (id) on delete restrict,
  nom text not null check (char_length(nom) between 2 and 120),
  slug text not null unique,
  conditionnement text,
  description text,
  prix_fcfa integer check (prix_fcfa is null or prix_fcfa >= 0),
  photo_path text,
  visible boolean not null default true,
  ordre integer not null default 0,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create index produits_famille_idx on produits (famille_id);
create trigger produits_maj before update on produits
  for each row execute function maj_modifie_le();

create table promotions (
  id uuid primary key default gen_random_uuid(),
  produit_id uuid references produits (id) on delete cascade,
  titre text not null,
  description text,
  prix_promo_fcfa integer check (prix_promo_fcfa is null or prix_promo_fcfa >= 0),
  date_debut date not null,
  date_fin date not null,
  visible boolean not null default true,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now(),
  check (date_fin >= date_debut)
);
create trigger promotions_maj before update on promotions
  for each row execute function maj_modifie_le();

-- ---------------------------------------------------------------------------
-- Madal Consulting : offres
-- ---------------------------------------------------------------------------
create table offres_consulting (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  description text,
  prestations text[] not null default '{}',
  tarif_fcfa integer check (tarif_fcfa is null or tarif_fcfa >= 0),
  periodicite text not null default 'mois',
  mise_en_avant boolean not null default false,
  visible boolean not null default true,
  ordre integer not null default 0,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create trigger offres_consulting_maj before update on offres_consulting
  for each row execute function maj_modifie_le();

-- ---------------------------------------------------------------------------
-- Solutions et réalisations
-- ---------------------------------------------------------------------------
create table solutions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nom text not null,
  pole pole not null default 'technologie',
  type type_solution not null default 'logiciel',
  resume text not null,
  probleme text,
  fonctionnalites text[] not null default '{}',
  logo_path text,
  captures text[] not null default '{}',
  mise_en_avant boolean not null default false,
  publie boolean not null default false,
  ordre integer not null default 0,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create trigger solutions_maj before update on solutions
  for each row execute function maj_modifie_le();

-- ---------------------------------------------------------------------------
-- Le Mag MADAL
-- ---------------------------------------------------------------------------
create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titre text not null check (char_length(titre) between 3 and 160),
  pole pole not null,
  rubrique text,
  resume text not null check (char_length(resume) <= 160),
  corps_md text not null default '',
  couverture_path text,
  statut statut_article not null default 'brouillon',
  publie_le timestamptz,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);
create index articles_publication_idx on articles (statut, publie_le desc);
create trigger articles_maj before update on articles
  for each row execute function maj_modifie_le();

-- ---------------------------------------------------------------------------
-- Demandes (contact et devis)
-- Insertion uniquement par l'Edge Function submit-demande (clé service_role).
-- ---------------------------------------------------------------------------
create table demandes (
  id uuid primary key default gen_random_uuid(),
  cree_le timestamptz not null default now(),
  nom text not null check (char_length(nom) between 2 and 100),
  telephone text not null,
  email text,
  pole pole not null,
  objet text not null check (char_length(objet) between 3 and 150),
  description text not null check (char_length(description) between 20 and 2000),
  piece_jointe_path text,
  page_origine text,
  consentement boolean not null check (consentement),
  statut statut_demande not null default 'nouvelle',
  note_interne text,
  ip_hash text
);
create index demandes_liste_idx on demandes (statut, cree_le desc);
create index demandes_ip_idx on demandes (ip_hash, cree_le desc);

-- ---------------------------------------------------------------------------
-- Sécurité au niveau des lignes
-- ---------------------------------------------------------------------------
alter table admins             enable row level security;
alter table familles_produits  enable row level security;
alter table produits           enable row level security;
alter table promotions         enable row level security;
alter table offres_consulting  enable row level security;
alter table solutions          enable row level security;
alter table articles           enable row level security;
alter table demandes           enable row level security;

-- Lecture publique : uniquement ce qui est visible ou publié
create policy "lecture publique" on familles_produits
  for select using (true);
create policy "lecture publique" on produits
  for select using (visible);
create policy "lecture publique" on promotions
  for select using (visible and current_date between date_debut and date_fin);
create policy "lecture publique" on offres_consulting
  for select using (visible);
create policy "lecture publique" on solutions
  for select using (publie);
create policy "lecture publique" on articles
  for select using (statut = 'publie' and publie_le is not null and publie_le <= now());

-- Administrateurs : tous les droits sur les contenus
create policy "admin complet" on familles_produits
  for all to authenticated using (est_admin()) with check (est_admin());
create policy "admin complet" on produits
  for all to authenticated using (est_admin()) with check (est_admin());
create policy "admin complet" on promotions
  for all to authenticated using (est_admin()) with check (est_admin());
create policy "admin complet" on offres_consulting
  for all to authenticated using (est_admin()) with check (est_admin());
create policy "admin complet" on solutions
  for all to authenticated using (est_admin()) with check (est_admin());
create policy "admin complet" on articles
  for all to authenticated using (est_admin()) with check (est_admin());

-- Demandes : aucune lecture ni insertion publique ; l'administrateur lit et met à jour
create policy "admin lecture" on demandes
  for select to authenticated using (est_admin());
create policy "admin mise a jour" on demandes
  for update to authenticated using (est_admin()) with check (est_admin());

-- Table admins : un administrateur voit la liste ; ajout et retrait par l'éditeur SQL uniquement
create policy "admin lecture" on admins
  for select to authenticated using (est_admin());

-- ---------------------------------------------------------------------------
-- Stockage
-- media          : images du site (public en lecture, écriture administrateur)
-- pieces-jointes : fichiers des demandes (privé, 5 Mo, types restreints)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']),
  ('pieces-jointes', 'pieces-jointes', false, 5242880,
   array['application/pdf', 'image/jpeg', 'image/png',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

create policy "media lecture publique" on storage.objects
  for select using (bucket_id = 'media');
create policy "media ecriture admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and est_admin());
create policy "media modification admin" on storage.objects
  for update to authenticated using (bucket_id = 'media' and est_admin());
create policy "media suppression admin" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and est_admin());
create policy "pieces jointes lecture admin" on storage.objects
  for select to authenticated using (bucket_id = 'pieces-jointes' and est_admin());

-- ---------------------------------------------------------------------------
-- Données de départ
-- ---------------------------------------------------------------------------
insert into familles_produits (nom, slug, ordre) values
  ('Produits alimentaires',     'produits-alimentaires',     1),
  ('Lapins et volailles',       'lapins-et-volailles',       2),
  ('Produits carnés',           'produits-carnes',           3),
  ('Fournitures de bureau',     'fournitures-de-bureau',     4),
  ('Équipements informatiques', 'equipements-informatiques', 5);

insert into solutions (slug, nom, pole, type, resume, mise_en_avant, publie, ordre) values
  ('bmvt-gestion-pro', 'BMVT GESTION PRO', 'technologie', 'logiciel',
   'Solution de gestion administrative, commerciale et comptable.', true, true, 1),
  ('madal-rh', 'Madal RH', 'technologie', 'logiciel',
   'Solution de gestion des ressources humaines.', true, true, 2);

-- ---------------------------------------------------------------------------
-- Après création du compte administrateur dans Authentication > Users :
--   insert into admins (user_id)
--   select id from auth.users where email = 'madalgroup1@gmail.com';
-- ---------------------------------------------------------------------------
