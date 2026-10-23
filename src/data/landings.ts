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

export interface Prestation {
  titre: string;
  texte: string;
}

/** Service doté de sa propre page (/consulting/<slug>). */
export interface ServiceDetaille extends Service {
  slug: string;
  texte: string;
  /** Titre complet, <h1> de la page du service. */
  titreComplet: string;
  /** Meta description de la page (≈ 150 caractères). */
  description: string;
  introduction: string[];
  prestations: Prestation[];
  objectif: string;
  /** Renvoi vers un autre pôle ou une solution du groupe. */
  renvoi?: { texte: string; libelle: string; href: string };
}

// ---------------------------------------------------------------------------
// Madal Consulting
// Textes fournis par MADAL GROUP le 23/10/2026, retravaillés à la relecture.
// ---------------------------------------------------------------------------
export const SERVICES_CONSULTING: ServiceDetaille[] = [
  {
    slug: 'comptabilite',
    titre: 'Comptabilité',
    titreComplet: 'Comptabilité et suivi financier',
    texte:
      'Tenue de votre comptabilité, suivi de vos opérations et préparation de vos états financiers selon le SYSCOHADA révisé, pour piloter votre activité avec des chiffres fiables.',
    description:
      'Madal Consulting, Abidjan : tenue de comptabilité SYSCOHADA, rapprochements bancaires, clôture, états financiers et tableaux de bord pour PME.',
    introduction: [
      "La comptabilité permet de connaître la situation réelle de votre entreprise, de mesurer ses performances et de décider en connaissance de cause.",
      'Madal Consulting met en place pour les entrepreneurs, les PME et les organisations une comptabilité rigoureuse, tenue selon le référentiel SYSCOHADA révisé.',
    ],
    prestations: [
      { titre: 'Comptabilité générale', texte: 'Enregistrement des achats, ventes, encaissements et décaissements.' },
      {
        titre: 'Pièces justificatives',
        texte: 'Classement des factures, reçus et relevés bancaires, pour la traçabilité de chaque opération.',
      },
      { titre: 'Rapprochements bancaires', texte: 'Contrôle de la concordance entre vos écritures et vos relevés.' },
      { titre: 'Comptes clients et fournisseurs', texte: 'Suivi des créances, des dettes et des échéances de règlement.' },
      { titre: "Clôture de l'exercice", texte: "Préparation et contrôle des écritures de fin d'année." },
      { titre: 'États financiers', texte: "Préparation des documents de fin d'exercice exigés par le référentiel applicable." },
      { titre: 'Tableaux de bord', texte: 'Indicateurs simples pour suivre vos charges, vos produits et votre rentabilité.' },
    ],
    objectif: 'Une comptabilité à jour, fiable et réellement utile à la gestion quotidienne.',
    visuel: { src: comptabiliteCalculatrice, alt: 'Saisie comptable avec une calculatrice' },
  },
  {
    slug: 'fiscalite',
    titre: 'Fiscalité',
    titreComplet: 'Fiscalité et conformité fiscale',
    texte:
      'Déclarations, calendrier fiscal, TVA et facture normalisée électronique (FNE) : nous sécurisons vos obligations pour éviter retards et pénalités.',
    description:
      'Madal Consulting, Abidjan : déclarations fiscales, calendrier des échéances, TVA, facture normalisée électronique (FNE) et assistance au contrôle fiscal.',
    introduction: [
      'Une déclaration tardive, une erreur de calcul ou une obligation mal comprise peut entraîner des pénalités et peser sur votre trésorerie.',
      'Madal Consulting identifie les obligations propres à votre régime et à votre activité, puis vous aide à les respecter dans les délais.',
    ],
    prestations: [
      { titre: 'Diagnostic fiscal', texte: "Analyse de votre régime d'imposition et des obligations qui en découlent." },
      { titre: 'Déclarations', texte: 'Collecte des données, calculs et préparation des déclarations.' },
      { titre: 'Calendrier fiscal', texte: 'Anticipation des échéances de déclaration et de paiement.' },
      { titre: 'TVA', texte: 'Contrôle des opérations concernées et préparation des éléments déclaratifs.' },
      {
        titre: "Impôts et taxes liés à l'activité",
        texte: 'Suivi des autres prélèvements applicables à votre entreprise.',
      },
      {
        titre: 'Facture normalisée électronique (FNE)',
        texte: "Organisation de votre facturation pour répondre aux exigences en vigueur en Côte d'Ivoire.",
      },
      {
        titre: 'Prévention des risques',
        texte: "Contrôle de cohérence et correction des anomalies avant qu'elles ne coûtent cher.",
      },
      {
        titre: 'Contrôle fiscal',
        texte: 'Préparation des documents et assistance pendant la procédure, selon la mission convenue.',
      },
    ],
    objectif: "Des obligations respectées, des échéances anticipées et moins de risques d'erreur.",
    visuel: { src: comptabiliteClasseur, alt: 'Classeur de pièces fiscales et calculatrice' },
  },
  {
    slug: 'gestion-sociale',
    titre: 'Gestion sociale',
    titreComplet: 'Gestion sociale et administration du personnel',
    texte:
      'Paie, dossiers du personnel, congés et déclarations CNPS : une administration du personnel rigoureuse et confidentielle.',
    description:
      'Madal Consulting, Abidjan : traitement de la paie, dossiers du personnel, congés, déclarations CNPS et documents sociaux pour les entreprises.',
    introduction: [
      'La gestion du personnel demande de la rigueur, de la confidentialité et une bonne connaissance du droit du travail.',
      'Madal Consulting aide les entreprises à fiabiliser leur paie et à organiser leur administration du personnel.',
    ],
    prestations: [
      { titre: 'Paie', texte: 'Collecte des éléments variables, calcul des rémunérations et contrôle des bulletins.' },
      { titre: 'Dossiers du personnel', texte: 'Constitution et mise à jour du dossier de chaque salarié.' },
      { titre: 'Absences et congés', texte: 'Suivi des congés, permissions et absences ayant une incidence sur la paie.' },
      { titre: 'Documents sociaux', texte: 'Contrats, attestations et autres documents liés à la relation de travail.' },
      {
        titre: 'Déclarations sociales',
        texte: 'Préparation des déclarations et cotisations CNPS et des retenues sur salaires.',
      },
      { titre: 'Entrées et sorties', texte: 'Formalités et documents liés aux embauches et aux départs.' },
      { titre: 'Éléments de rémunération', texte: 'Contrôle des primes, indemnités et retenues.' },
      { titre: 'Procédures RH', texte: 'Méthodes de classement, de contrôle et de suivi administratif.' },
    ],
    objectif: 'Un personnel géré avec rigueur et une visibilité claire sur vos obligations sociales.',
    renvoi: {
      texte:
        "Pour automatiser la paie et le pointage, cette prestation s'appuie sur Madal RH, le logiciel développé par Madal Technologie.",
      libelle: 'Découvrir Madal RH',
      href: '/solutions/madal-rh',
    },
    visuel: { src: reunionEquipe, alt: "Réunion d'une équipe autour d'un dossier" },
  },
  {
    slug: 'accompagnement-administratif',
    titre: 'Accompagnement administratif',
    titreComplet: 'Assistance et organisation administrative',
    texte:
      'Classement, suivi des dossiers, des contrats et des échéances, dématérialisation : une organisation claire qui vous libère du temps.',
    description:
      'Madal Consulting, Abidjan : organisation documentaire, suivi des dossiers, contrats et échéances, procédures internes et dématérialisation.',
    introduction: [
      "Une administration bien organisée fait circuler l'information, facilite le suivi des dossiers et évite les oublis.",
      'Madal Consulting met en place des méthodes de travail adaptées au fonctionnement de votre entreprise.',
    ],
    prestations: [
      { titre: 'Organisation documentaire', texte: 'Classement, archivage et structuration de vos dossiers.' },
      { titre: 'Factures et échéances', texte: 'Suivi des règlements et des dates importantes.' },
      {
        titre: 'Dossiers administratifs',
        texte: 'Préparation, mise à jour et suivi des dossiers indispensables à votre activité.',
      },
      { titre: 'Contrats et courriers', texte: 'Organisation des contrats, attestations et documents professionnels.' },
      {
        titre: 'Procédures internes',
        texte: "Circuits de traitement, de validation et de conservation de l'information.",
      },
      { titre: 'Appui au quotidien', texte: 'Préparation de documents et coordination administrative.' },
      { titre: 'Dématérialisation', texte: 'Passage au numérique de vos documents et de vos circuits de travail.' },
      { titre: "Gain d'efficacité", texte: 'Repérage des tâches répétitives et méthodes pour les alléger.' },
    ],
    objectif: 'Une organisation plus fluide, mieux structurée et adaptée à vos besoins réels.',
    visuel: { src: analyseDocuments, alt: 'Analyse de documents administratifs' },
  },
  {
    slug: 'conseil',
    titre: 'Conseil',
    titreComplet: "Conseil en gestion et développement d'entreprise",
    texte:
      "Diagnostic, budgets, tableaux de bord et aide à la création d'entreprise : des décisions fondées sur des informations fiables.",
    description:
      "Madal Consulting, Abidjan : diagnostic organisationnel, gestion financière, budgets, tableaux de bord et accompagnement à la création d'entreprise.",
    introduction: [
      "Un dirigeant décide chaque jour de questions de finances, d'organisation, de personnel et de croissance.",
      "Madal Consulting l'aide à y voir clair, à structurer ses activités et à améliorer ses résultats.",
    ],
    prestations: [
      {
        titre: 'Diagnostic organisationnel',
        texte: 'Analyse de votre fonctionnement, de vos processus et de vos difficultés.',
      },
      {
        titre: 'Gestion financière',
        texte: 'Analyse des charges, des marges, de la trésorerie et des indicateurs clés.',
      },
      { titre: 'Budgets', texte: 'Prévisions financières et suivi des écarts avec les objectifs.' },
      { titre: 'Procédures', texte: 'Circuits de validation, responsabilités et méthodes de travail formalisés.' },
      {
        titre: "Création d'entreprise",
        texte: 'Structuration du projet, budget prévisionnel et organisation de départ.',
      },
      { titre: 'Suivi de la performance', texte: 'Indicateurs de gestion et tableaux de bord sur mesure.' },
      { titre: 'Développement', texte: 'Analyse des opportunités et des priorités de croissance.' },
      { titre: 'Digitalisation', texte: "Choix des outils numériques utiles, avec l'appui de Madal Technologie." },
    ],
    objectif: 'Une vision claire de votre entreprise pour des décisions fondées sur des informations fiables.',
    renvoi: {
      texte:
        'Logiciels de gestion, applications sur mesure, réseaux : Madal Technologie met en œuvre les outils numériques recommandés.',
      libelle: 'Découvrir Madal Technologie',
      href: '/technologie',
    },
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
