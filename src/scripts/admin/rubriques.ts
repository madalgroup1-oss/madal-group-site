// Rubriques de contenu de /admin (cahier des charges, section 5) : une définition par table.
// La rubrique Demandes, différente (lecture, statut, export), est dans demandes.ts.

import { messageErreur, supabase } from './client';
import type { Ligne, Option } from './champs';
import { dateCourte, prix } from './dom';
import type { Rubrique } from './edition';
import { NOM_POLE, NOM_POLE_COURT, TYPE_SOLUTION } from '../../lib/libelles';

const OPTIONS_POLES: Option[] = Object.entries(NOM_POLE).map(([valeur, libelle]) => ({ valeur, libelle }));
const OPTIONS_TYPES: Option[] = Object.entries(TYPE_SOLUTION).map(([valeur, libelle]) => ({ valeur, libelle }));

// Rubriques du Mag (cahier des charges, section 4.7)
const RUBRIQUES_MAG: Record<string, string[]> = {
  Consulting: ['Actualité fiscale ivoirienne', 'Conseils comptables', "Gestion d'entreprise", 'Entrepreneuriat'],
  Technologie: ['Cybersécurité', 'Logiciels', 'IA', 'Transformation digitale'],
  Distribution: ['Promotions', 'Nouveaux produits', 'Conseils'],
};
const OPTIONS_RUBRIQUES_MAG: Option[] = Object.entries(RUBRIQUES_MAG).flatMap(([pole, rubriques]) =>
  rubriques.map((rubrique) => ({ valeur: rubrique, libelle: `${pole} · ${rubrique}` })),
);

const PERIODICITES: Option[] = ['mois', 'trimestre', 'semestre', 'an', 'mission'].map((valeur) => ({
  valeur,
  libelle: `par ${valeur}`,
}));

const AIDE_ORDRE = 'Ordre d’affichage : les plus petits nombres apparaissent en premier.';
const AIDE_SLUG = 'Adresse de la page (ex. madal-rh). La modifier après publication casse les liens déjà partagés.';

// Listes de choix chargées à l'ouverture d'une rubrique
let familles: Option[] = [];
let produits: Option[] = [];

async function chargerFamilles(): Promise<void> {
  const { data, error } = await supabase.from('familles_produits').select('id, nom').order('ordre');
  if (error) throw new Error(messageErreur(error));
  familles = (data ?? []).map((famille) => ({ valeur: String(famille.id), libelle: String(famille.nom) }));
}

async function chargerProduits(): Promise<void> {
  const { data, error } = await supabase.from('produits').select('id, nom').order('nom');
  if (error) throw new Error(messageErreur(error));
  produits = (data ?? []).map((produit) => ({ valeur: String(produit.id), libelle: String(produit.nom) }));
}

function libelleDe(options: Option[], valeur: unknown): string {
  return options.find((option) => option.valeur === String(valeur))?.libelle ?? '';
}

function visibilite(visible: unknown, oui = 'Visible', non = 'Masqué'): { libelle: string; ton: 'actif' | 'inactif' } {
  return visible === true ? { libelle: oui, ton: 'actif' } : { libelle: non, ton: 'inactif' };
}

/** Date du jour à Abidjan (UTC), au format AAAA-MM-JJ. */
function aujourdhui(): string {
  return new Date().toISOString().slice(0, 10);
}

export const RUBRIQUES: Rubrique[] = [
  {
    cle: 'produits',
    titre: 'Produits',
    unElement: 'un produit',
    table: 'produits',
    ordre: [
      ['ordre', true],
      ['nom', true],
    ],
    aide: 'Catalogue de Madal Distribution. Sans prix, le site affiche « Prix sur demande ».',
    preparer: chargerFamilles,
    nouveau: () => ({ visible: true, ordre: 0 }),
    champs: [
      { nom: 'nom', libelle: 'Nom du produit', type: 'texte', requis: true, min: 2, max: 120, demi: true },
      { nom: 'famille_id', libelle: 'Famille', type: 'liste', requis: true, options: () => familles, demi: true },
      { nom: 'slug', libelle: 'Identifiant', type: 'slug', requis: true, source: 'nom', aide: 'Rempli automatiquement à partir du nom.' },
      {
        nom: 'conditionnement',
        libelle: 'Conditionnement',
        type: 'texte',
        max: 120,
        aide: 'Ex. « le kilo », « carton de 30 œufs ».',
        demi: true,
      },
      { nom: 'prix_fcfa', libelle: 'Prix (FCFA)', type: 'prix', aide: 'Nombre entier, ex. 25000. Vide : « Prix sur demande ».', demi: true },
      { nom: 'photo_path', libelle: 'Photo', type: 'image', dossier: 'produits' },
      { nom: 'visible', libelle: 'Visible sur le site', type: 'case' },
      { nom: 'ordre', libelle: 'Ordre', type: 'nombre', aide: AIDE_ORDRE },
    ],
    resume: (ligne) => ({
      titre: String(ligne.nom ?? ''),
      details: [
        libelleDe(familles, ligne.famille_id),
        [ligne.conditionnement, prix(ligne.prix_fcfa as number | null)].filter(Boolean).join(' · '),
      ],
      etat: visibilite(ligne.visible),
      image: (ligne.photo_path as string | null) ?? null,
    }),
  },

  {
    cle: 'promotions',
    titre: 'Promotions',
    unElement: 'une promotion',
    table: 'promotions',
    ordre: [['date_fin', false]],
    aide: 'Affichées sur la page Distribution entre la date de début et la date de fin, puis retirées automatiquement la nuit suivante.',
    preparer: chargerProduits,
    nouveau: () => ({ visible: true, date_debut: aujourdhui() }),
    champs: [
      { nom: 'titre', libelle: 'Titre de la promotion', type: 'texte', requis: true, min: 3, max: 120 },
      {
        nom: 'produit_id',
        libelle: 'Produit concerné',
        type: 'liste',
        options: () => produits,
        aide: 'Facultatif : laisser « — » pour une promotion générale.',
      },
      { nom: 'prix_promo_fcfa', libelle: 'Prix promotionnel (FCFA)', type: 'prix', aide: 'Facultatif. Nombre entier, ex. 20000.' },
      { nom: 'date_debut', libelle: 'Date de début', type: 'date', requis: true, demi: true },
      { nom: 'date_fin', libelle: 'Date de fin', type: 'date', requis: true, demi: true },
      { nom: 'visible', libelle: 'Visible sur le site', type: 'case' },
    ],
    valider: (valeurs) =>
      String(valeurs.date_fin) < String(valeurs.date_debut)
        ? 'La date de fin doit être postérieure ou égale à la date de début.'
        : '',
    resume: (ligne) => {
      const jour = aujourdhui();
      const debut = String(ligne.date_debut);
      const fin = String(ligne.date_fin);
      let etat: { libelle: string; ton: 'actif' | 'inactif' | 'attention' };
      if (ligne.visible !== true) etat = { libelle: 'Masquée', ton: 'inactif' };
      else if (fin < jour) etat = { libelle: 'Terminée', ton: 'inactif' };
      else if (debut > jour) etat = { libelle: 'À venir', ton: 'attention' };
      else etat = { libelle: 'En cours', ton: 'actif' };
      return {
        titre: String(ligne.titre ?? ''),
        details: [
          `Du ${dateCourte(debut)} au ${dateCourte(fin)}`,
          [libelleDe(produits, ligne.produit_id), ligne.prix_promo_fcfa !== null ? prix(ligne.prix_promo_fcfa as number) : '']
            .filter(Boolean)
            .join(' · '),
        ],
        etat,
      };
    },
  },

  {
    cle: 'offres',
    titre: 'Offres Consulting',
    unElement: 'une offre',
    table: 'offres_consulting',
    ordre: [
      ['ordre', true],
      ['nom', true],
    ],
    aide: 'Formules affichées sur la page Madal Consulting.',
    nouveau: () => ({ visible: true, periodicite: 'mois', ordre: 0, prestations: [] }),
    champs: [
      { nom: 'nom', libelle: 'Nom de l’offre', type: 'texte', requis: true, min: 2, max: 80 },
      { nom: 'description', libelle: 'Description courte', type: 'zone', max: 300 },
      { nom: 'prestations', libelle: 'Prestations incluses', type: 'lignes', aide: 'Une prestation par ligne.' },
      { nom: 'tarif_fcfa', libelle: 'Tarif (FCFA)', type: 'prix', aide: 'Nombre entier. Vide : « Prix sur demande ».', demi: true },
      { nom: 'periodicite', libelle: 'Périodicité', type: 'liste', requis: true, options: PERIODICITES, demi: true },
      { nom: 'mise_en_avant', libelle: 'Mettre en avant (carte sur fond vert foncé)', type: 'case' },
      { nom: 'visible', libelle: 'Visible sur le site', type: 'case' },
      { nom: 'ordre', libelle: 'Ordre', type: 'nombre', aide: AIDE_ORDRE },
    ],
    resume: (ligne) => ({
      titre: String(ligne.nom ?? ''),
      details: [
        ligne.tarif_fcfa !== null ? `${prix(ligne.tarif_fcfa as number)} / ${String(ligne.periodicite)}` : prix(null),
        ligne.mise_en_avant === true ? 'Mise en avant' : '',
      ],
      etat: visibilite(ligne.visible, 'Visible', 'Masquée'),
    }),
  },

  {
    cle: 'solutions',
    titre: 'Solutions',
    unElement: 'une solution',
    table: 'solutions',
    ordre: [
      ['ordre', true],
      ['nom', true],
    ],
    aide: 'Logiciels et réalisations, présentés sur /solutions et sur la page de leur pôle.',
    nouveau: () => ({ pole: 'technologie', type: 'logiciel', publie: false, ordre: 0, fonctionnalites: [], captures: [] }),
    champs: [
      { nom: 'nom', libelle: 'Nom', type: 'texte', requis: true, min: 2, max: 80 },
      { nom: 'slug', libelle: 'Adresse', type: 'slug', requis: true, source: 'nom', aide: AIDE_SLUG },
      { nom: 'pole', libelle: 'Pôle', type: 'liste', requis: true, options: OPTIONS_POLES, demi: true },
      { nom: 'type', libelle: 'Type', type: 'liste', requis: true, options: OPTIONS_TYPES, demi: true },
      { nom: 'resume', libelle: 'Résumé', type: 'zone', requis: true, max: 300, aide: 'Une ou deux phrases, affichées sur les cartes.' },
      { nom: 'probleme', libelle: 'Problème traité', type: 'zone', max: 1000 },
      { nom: 'fonctionnalites', libelle: 'Fonctionnalités', type: 'lignes', aide: 'Une fonctionnalité par ligne.' },
      { nom: 'logo_path', libelle: 'Logo', type: 'image', dossier: 'solutions', aide: 'PNG à fond transparent de préférence.' },
      { nom: 'captures', libelle: 'Captures d’écran', type: 'images', dossier: 'solutions', aide: 'Trois captures recommandées.' },
      { nom: 'mise_en_avant', libelle: 'Afficher sur la page d’accueil', type: 'case' },
      { nom: 'publie', libelle: 'Publiée sur le site', type: 'case' },
      { nom: 'ordre', libelle: 'Ordre', type: 'nombre', aide: AIDE_ORDRE },
    ],
    resume: (ligne) => ({
      titre: String(ligne.nom ?? ''),
      details: [
        `${libelleDe(OPTIONS_POLES, ligne.pole)} · ${libelleDe(OPTIONS_TYPES, ligne.type)}`,
        ligne.mise_en_avant === true ? 'Sur la page d’accueil' : '',
      ],
      etat: visibilite(ligne.publie, 'Publiée', 'Non publiée'),
      image: (ligne.logo_path as string | null) ?? null,
    }),
  },

  {
    cle: 'articles',
    titre: 'Le Mag',
    unElement: 'un article',
    table: 'articles',
    ordre: [['modifie_le', false]],
    aide: 'Un brouillon n’apparaît jamais sur le site. « Publier » le met en ligne à la prochaine publication du site.',
    nouveau: () => ({ statut: 'brouillon', pole: 'groupe', corps_md: '' }),
    champs: [
      { nom: 'titre', libelle: 'Titre', type: 'texte', requis: true, min: 3, max: 160 },
      { nom: 'slug', libelle: 'Adresse', type: 'slug', requis: true, source: 'titre', aide: AIDE_SLUG },
      { nom: 'pole', libelle: 'Pôle', type: 'liste', requis: true, options: OPTIONS_POLES, demi: true },
      { nom: 'rubrique', libelle: 'Rubrique', type: 'liste', options: OPTIONS_RUBRIQUES_MAG, demi: true },
      {
        nom: 'resume',
        libelle: 'Résumé',
        type: 'zone',
        requis: true,
        max: 160,
        aide: 'Affiché sous le titre et dans les partages (160 caractères maximum).',
      },
      { nom: 'couverture_path', libelle: 'Image de couverture', type: 'image', dossier: 'articles' },
      {
        nom: 'corps_md',
        libelle: 'Texte de l’article',
        type: 'markdown',
        requis: true,
        aide: 'Mise en forme : « ## » en début de ligne pour un intertitre, **gras**, *italique*, « - » pour une liste, [texte du lien](https://…).',
      },
    ],
    enregistrements: (existant) => {
      const publie = existant?.statut === 'publie';
      const publier = (valeurs: Ligne): Ligne => ({
        ...valeurs,
        statut: 'publie',
        publie_le: (existant?.publie_le as string | null) ?? new Date().toISOString(),
      });
      return publie
        ? [
            { libelle: 'Enregistrer', completer: publier },
            { libelle: 'Dépublier', secondaire: true, completer: (valeurs) => ({ ...valeurs, statut: 'brouillon' }) },
          ]
        : [
            { libelle: 'Publier', completer: publier },
            {
              libelle: 'Enregistrer le brouillon',
              secondaire: true,
              completer: (valeurs) => ({ ...valeurs, statut: 'brouillon' }),
            },
          ];
    },
    resume: (ligne) => ({
      titre: String(ligne.titre ?? ''),
      details: [
        [NOM_POLE_COURT[ligne.pole as keyof typeof NOM_POLE_COURT], ligne.rubrique].filter(Boolean).join(' · '),
        ligne.statut === 'publie' && ligne.publie_le ? `Publié le ${dateCourte(String(ligne.publie_le))}` : '',
      ],
      etat: ligne.statut === 'publie' ? { libelle: 'Publié', ton: 'actif' } : { libelle: 'Brouillon', ton: 'attention' },
      image: (ligne.couverture_path as string | null) ?? null,
    }),
  },
];
