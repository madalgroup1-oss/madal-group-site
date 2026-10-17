-- MADAL GROUP — restriction des droits par défaut
-- Constat après 0002 : les rôles anon et authenticated avaient encore les droits
-- accordés par défaut par Supabase (ex. insert sur demandes), seule la RLS bloquait.
-- On repart de zéro puis on réaccorde exactement les droits de 0002 :
-- double protection (droits SQL + RLS).

-- ---------------------------------------------------------------------------
-- 1. Retrait de tous les droits des rôles de l'API sur les tables existantes
-- ---------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Plus aucun droit automatique sur les futures tables : chaque migration
--    accorde explicitement les siens (voir 0002_droits_api.sql)
-- ---------------------------------------------------------------------------
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Droits réaccordés (identiques à 0002)
-- ---------------------------------------------------------------------------
grant select on
  familles_produits,
  produits,
  promotions,
  offres_consulting,
  solutions,
  articles
to anon;

grant select, insert, update, delete on
  familles_produits,
  produits,
  promotions,
  offres_consulting,
  solutions,
  articles
to authenticated;

grant select, update on demandes to authenticated;
grant select on admins to authenticated;

grant select, insert, update, delete on all tables in schema public to service_role;
grant execute on function est_admin() to anon, authenticated, service_role;
