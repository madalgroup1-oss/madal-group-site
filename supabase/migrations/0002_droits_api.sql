-- MADAL GROUP — droits d'accès des rôles de l'API
-- Le projet est créé avec « Afficher automatiquement les nouvelles tables » désactivé :
-- aucune table n'est accessible par l'API tant qu'un droit n'est pas accordé ici.
-- Les politiques RLS de 0001_init.sql s'appliquent en plus de ces droits.
--
-- Règle : toute nouvelle table reçoit ses droits dans sa propre migration,
-- sur le modèle ci-dessous (le minimum nécessaire à chaque rôle).

grant usage on schema public to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Visiteurs (anon) : lecture seule des contenus ; la RLS ne laisse passer
-- que les lignes publiées ou visibles.
-- ---------------------------------------------------------------------------
grant select on
  familles_produits,
  produits,
  promotions,
  offres_consulting,
  solutions,
  articles
to anon;

-- ---------------------------------------------------------------------------
-- Utilisateurs connectés (authenticated) : la RLS réserve l'écriture
-- aux membres de la table admins (fonction est_admin()).
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on
  familles_produits,
  produits,
  promotions,
  offres_consulting,
  solutions,
  articles
to authenticated;

-- Demandes : lecture et mise à jour (statut, note interne) ; jamais d'insertion ni de suppression
grant select, update on demandes to authenticated;

-- Liste des administrateurs : lecture seule (ajout et retrait par l'éditeur SQL)
grant select on admins to authenticated;

-- ---------------------------------------------------------------------------
-- Fonctions serveur (service_role) : l'Edge Function submit-demande insère les demandes.
-- service_role contourne la RLS mais a tout de même besoin des droits SQL.
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on all tables in schema public to service_role;

-- ---------------------------------------------------------------------------
-- Fonction utilisée par les politiques : exécutable par les rôles de l'API uniquement
-- ---------------------------------------------------------------------------
revoke execute on function est_admin() from public;
grant execute on function est_admin() to anon, authenticated, service_role;
