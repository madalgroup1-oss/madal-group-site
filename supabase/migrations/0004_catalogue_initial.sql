-- MADAL GROUP — catalogue Distribution de départ (validé par MADAL GROUP le 19/10/2026)
-- Dix produits photographiés, sans prix (« Prix sur demande ») ni conditionnement :
-- l'administrateur les complète dans /admin.
-- Photos déposées dans le bucket « media » sous produits/<slug>.jpg.
-- Aucune nouvelle table : pas de droit à accorder.

insert into produits (famille_id, nom, slug, photo_path, ordre)
select famille.id, produit.nom, produit.slug, 'produits/' || produit.slug || '.jpg', produit.ordre
from (
  values
    ('lapins-et-volailles', 'Lapin frais',        'lapin-frais',        1),
    ('lapins-et-volailles', 'Poulets de chair',   'poulets-de-chair',   2),
    ('lapins-et-volailles', 'Poules pondeuses',   'poules-pondeuses',   3),
    ('lapins-et-volailles', 'Caille',             'caille',             4),
    ('lapins-et-volailles', 'Canard',             'canard',             5),
    ('lapins-et-volailles', 'Dinde',              'dinde',              6),
    ('produits-carnes',     'Ailes de poulet',    'ailes-de-poulet',    7),
    ('produits-carnes',     'Blanc de poulet',    'blanc-de-poulet',    8),
    ('produits-carnes',     'Gésiers de poulet',  'gesiers-de-poulet',  9),
    ('produits-carnes',     'Viande de bœuf',     'viande-de-boeuf',   10)
) as produit (famille_slug, nom, slug, ordre)
join familles_produits famille on famille.slug = produit.famille_slug
on conflict (slug) do nothing;
