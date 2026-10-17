// Contenus des pages de pôle (/consulting, /distribution, /technologie).
// Titres : docs/cahier-des-charges.md (sections 4.3 à 4.5) et maquette consulting validée.
// Un texte à null n'a pas encore été fourni : la page affiche [À FOURNIR : …]
// (voir docs/contenus-en-attente.md). Ne rien inventer ici.

import comptabiliteCalculatrice from '../assets/images/poles/consulting/comptabilite-calculatrice.jpg';
import comptabiliteClasseur from '../assets/images/poles/consulting/comptabilite-classeur.jpg';
import reunionEquipe from '../assets/images/poles/consulting/reunion-equipe.jpg';
import analyseDocuments from '../assets/images/poles/consulting/analyse-documents.jpg';
import reunionPoigneeDeMain from '../assets/images/poles/consulting/reunion-poignee-de-main.jpg';
import codeDeveloppement from '../assets/images/poles/technologie/code-developpement.jpg';
import equipeNumerique from '../assets/images/poles/technologie/equipe-numerique.jpg';
import appareilsConnectes from '../assets/images/poles/technologie/appareils-connectes.jpg';
import transformationDigitale from '../assets/images/poles/technologie/transformation-digitale.jpg';
import maintenanceOrdinateur from '../assets/images/poles/technologie/maintenance-ordinateur.jpg';
import cablageReseau from '../assets/images/poles/technologie/cablage-reseau.jpg';
import salleServeurs from '../assets/images/poles/technologie/salle-serveurs.jpg';
import interventionBaieReseau from '../assets/images/poles/technologie/intervention-baie-reseau.jpg';
import intelligenceArtificielle from '../assets/images/poles/technologie/intelligence-artificielle.jpg';
import lapinFrais from '../assets/images/poles/distribution/lapin-frais.jpg';
import poulesPondeuses from '../assets/images/poles/distribution/poules-pondeuses.jpg';
import viandeDeBoeuf from '../assets/images/poles/distribution/viande-de-boeuf.jpg';
import pouletsDeChair from '../assets/images/poles/distribution/poulets-de-chair.jpg';
import serveursTour from '../assets/images/poles/technologie/serveurs-tour.jpg';
import type { NomIconeSite } from '../components/Icone.astro';
import type { Visuel } from './visuels';

export interface Service {
  titre: string;
  /** Présentation en deux lignes ; null tant qu'elle n'est pas fournie. */
  texte: string | null;
  visuel: Visuel;
}

export interface Etape {
  titre: string;
  texte: string | null;
}

// ---------------------------------------------------------------------------
// Madal Consulting
// ---------------------------------------------------------------------------
export const SERVICES_CONSULTING: Service[] = [
  {
    titre: 'Comptabilité',
    texte: null,
    visuel: { src: comptabiliteCalculatrice, alt: 'Saisie comptable avec une calculatrice' },
  },
  {
    titre: 'Fiscalité',
    texte: null,
    visuel: { src: comptabiliteClasseur, alt: 'Classeur de pièces fiscales et calculatrice' },
  },
  {
    titre: 'Gestion sociale',
    texte: null,
    visuel: { src: reunionEquipe, alt: "Réunion d'une équipe autour d'un dossier" },
  },
  {
    titre: 'Accompagnement administratif',
    texte: null,
    visuel: { src: analyseDocuments, alt: 'Analyse de documents administratifs' },
  },
  {
    titre: 'Conseil',
    texte: null,
    visuel: { src: reunionPoigneeDeMain, alt: "Poignée de main à l'issue d'un rendez-vous de conseil" },
  },
];

/** Déroulé d'une mission (maquette consulting validée). */
export const METHODE_CONSULTING: Etape[] = [
  { titre: 'Écouter', texte: 'Premier échange et prise en charge de votre dossier.' },
  { titre: 'Analyser', texte: 'État des lieux comptable, fiscal et social.' },
  { titre: 'Concevoir', texte: 'Une organisation et une offre adaptées à votre activité.' },
  { titre: 'Accompagner', texte: "Suivi mensuel et conseil tout au long de l'année." },
];

// ---------------------------------------------------------------------------
// Madal Technologie
// ---------------------------------------------------------------------------
export const SERVICES_TECHNOLOGIE: Service[] = [
  {
    titre: 'Développement logiciel',
    texte: null,
    visuel: { src: codeDeveloppement, alt: "Code informatique à l'écran d'un ordinateur portable" },
  },
  {
    titre: 'Applications sur mesure',
    texte: null,
    visuel: { src: equipeNumerique, alt: "Équipe travaillant sur des ordinateurs dans un espace numérique" },
  },
  {
    titre: 'Web et mobile',
    texte: null,
    visuel: { src: appareilsConnectes, alt: 'Ordinateur, tablette et téléphone connectés' },
  },
  {
    titre: 'Logiciels de gestion',
    texte: null,
    visuel: { src: transformationDigitale, alt: "Appareils numériques au service de l'entreprise" },
  },
  {
    titre: 'Maintenance informatique',
    texte: null,
    visuel: { src: maintenanceOrdinateur, alt: "Technicien réparant l'unité centrale d'un ordinateur" },
  },
  {
    titre: 'Réseaux',
    texte: null,
    visuel: { src: cablageReseau, alt: 'Câbles réseau et outils de sertissage' },
  },
  {
    titre: 'Cybersécurité',
    texte: null,
    visuel: { src: salleServeurs, alt: 'Allée de serveurs dans une salle informatique' },
  },
  {
    titre: 'Vidéo IP',
    texte: null,
    visuel: { src: interventionBaieReseau, alt: "Technicien intervenant sur une baie de brassage" },
  },
  {
    titre: 'Accompagnement digital',
    texte: null,
    visuel: { src: intelligenceArtificielle, alt: 'Illustration de services numériques et d’intelligence artificielle' },
  },
];

/** Méthode projet (cahier des charges, section 4.5) : descriptions à fournir. */
export const METHODE_TECHNOLOGIE: Etape[] = [
  { titre: 'Cadrage', texte: null },
  { titre: 'Maquette', texte: null },
  { titre: 'Développement', texte: null },
  { titre: 'Déploiement', texte: null },
  { titre: 'Maintenance', texte: null },
];

// ---------------------------------------------------------------------------
// Madal Distribution
// ---------------------------------------------------------------------------
/**
 * Visuel ou icône de chaque famille de produits, par slug (table familles_produits).
 * Familles sans photo fournie : icône seule.
 */
export const VISUELS_FAMILLES: Record<string, { visuel?: Visuel; icone: NomIconeSite }> = {
  'produits-alimentaires': {
    visuel: { src: pouletsDeChair, alt: 'Poulets de chair prêts à la vente' },
    icone: 'panier',
  },
  'lapins-et-volailles': {
    visuel: { src: poulesPondeuses, alt: 'Poules pondeuses dans un élevage' },
    icone: 'boutique',
  },
  'produits-carnes': {
    visuel: { src: viandeDeBoeuf, alt: 'Pièce de viande de bœuf sur une planche' },
    icone: 'panier',
  },
  'fournitures-de-bureau': { icone: 'bureau' },
  'equipements-informatiques': {
    visuel: { src: serveursTour, alt: 'Unités centrales et serveurs informatiques' },
    icone: 'ordinateur',
  },
};

/** Illustration provisoire de l'encart Allô Lapins & Volailles by MG (logo à fournir). */
export const VISUEL_ALLO_LAPINS: Visuel = {
  src: lapinFrais,
  alt: 'Lapin frais préparé, prêt à la vente',
};
