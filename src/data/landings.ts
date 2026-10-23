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
import logoAlloLapins from '../assets/images/logo-allo-lapins.jpg';
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
      'Déclarations, TVA, mise en place de la facture normalisée électronique (FNE) et gestion de votre facturation : des obligations fiscales maîtrisées, sans retard ni pénalité.',
    description:
      'Madal Consulting, Abidjan : déclarations fiscales, TVA, mise en place de la facture normalisée électronique (FNE), facturation et assistance au contrôle fiscal.',
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
        texte:
          "Ouverture et paramétrage de votre espace FNE, puis, à votre demande, émission et suivi de vos factures normalisées pour une facturation fiable et conforme.",
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
      'Paie, dossiers du personnel, congés, mise en place de votre espace CNPS et déclarations sociales : une gestion du personnel rigoureuse et confidentielle.',
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
        titre: 'Déclarations CNPS',
        texte:
          'Ouverture et paramétrage de votre espace employeur CNPS, puis, à votre demande, prise en charge de vos déclarations et du suivi de vos cotisations.',
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
export const SERVICES_TECHNOLOGIE: ServiceDetaille[] = [
  {
    slug: 'developpement-logiciel',
    titre: 'Développement logiciel',
    titreComplet: 'Conception et développement de logiciels',
    texte:
      "De l'analyse des besoins à la maintenance, nous concevons des logiciels fiables, sécurisés et évolutifs, adaptés à l'organisation de votre entreprise.",
    description:
      'Madal Technologie, Abidjan : analyse des besoins, architecture, développement, gestion des accès, intégration, tests et maintenance de logiciels.',
    introduction: [
      "Un logiciel bien conçu fait gagner du temps, réduit les erreurs et donne une vision claire de l'activité.",
      "Madal Technologie conçoit et réalise des solutions logicielles adaptées aux réalités opérationnelles de chaque entreprise, avec une attention constante portée à la fiabilité, à la sécurité et à l'évolutivité.",
    ],
    prestations: [
      { titre: 'Analyse des besoins', texte: 'Recueil et formalisation de vos besoins fonctionnels et techniques.' },
      { titre: 'Architecture', texte: 'Conception de la structure du logiciel, pensée pour durer et évoluer.' },
      { titre: 'Fonctionnalités métier', texte: 'Développement des fonctions propres à votre activité.' },
      { titre: "Utilisateurs et droits d'accès", texte: 'Comptes, rôles et autorisations adaptés à votre organisation.' },
      { titre: 'Intégration', texte: 'Raccordement à vos bases de données et à vos outils existants.' },
      { titre: 'Tests et déploiement', texte: 'Contrôle de chaque fonctionnalité avant la mise en service.' },
      { titre: 'Maintenance évolutive', texte: 'Corrections, mises à jour et nouvelles fonctionnalités dans la durée.' },
    ],
    objectif: "Des logiciels fiables, sécurisés et capables d'accompagner la croissance de votre entreprise.",
    visuel: { src: codeDeveloppement, alt: "Code informatique à l'écran d'un ordinateur portable" },
  },
  {
    slug: 'applications-sur-mesure',
    titre: 'Applications sur mesure',
    titreComplet: 'Applications métier sur mesure',
    texte:
      'Quand les logiciels standards ne suffisent pas, nous développons des applications conçues pour vos procédures, vos contraintes et vos objectifs.',
    description:
      'Madal Technologie, Abidjan : applications métier sur mesure, analyse des processus, interfaces, modules métier, gestion des accès et mise en production.',
    introduction: [
      'Chaque entreprise a ses propres procédures, contraintes et objectifs, que les solutions standards couvrent rarement en totalité.',
      "Madal Technologie développe des applications personnalisées qui s'adaptent à votre fonctionnement, au lieu de vous obliger à vous adapter à un outil.",
    ],
    prestations: [
      { titre: 'Analyse des processus', texte: 'Étude de votre fonctionnement pour identifier ce qui doit être numérisé.' },
      { titre: 'Définition des fonctionnalités', texte: 'Cahier des charges clair, validé avec vous avant le développement.' },
      { titre: 'Interfaces', texte: 'Écrans simples et intuitifs, pensés pour vos utilisateurs.' },
      { titre: 'Modules métier', texte: 'Développement des fonctions spécifiques à votre activité.' },
      { titre: 'Gestion des accès', texte: 'Droits définis selon le rôle de chaque utilisateur.' },
      {
        titre: 'Intégration à vos outils',
        texte: 'Connexion avec les logiciels déjà en place, sous réserve de leur compatibilité technique.',
      },
      { titre: 'Mise en production', texte: 'Installation, mise en service et prise en main par vos équipes.' },
    ],
    objectif: 'Transformer vos besoins opérationnels en outils numériques concrets, pratiques et adaptés à votre organisation.',
    visuel: { src: equipeNumerique, alt: 'Équipe travaillant sur des ordinateurs dans un espace numérique' },
  },
  {
    slug: 'web-et-mobile',
    titre: 'Web et mobile',
    titreComplet: 'Sites web et applications mobiles',
    texte:
      'Sites vitrines, plateformes web, applications mobiles et espaces clients : une présence numérique professionnelle, accessible sur tous les écrans.',
    description:
      'Madal Technologie, Abidjan : création de sites vitrines, plateformes web, applications web métier et applications mobiles adaptées à tous les écrans.',
    introduction: [
      'Votre site et vos applications sont souvent le premier contact avec vos clients, vos collaborateurs et vos partenaires.',
      "Madal Technologie conçoit des solutions web et mobiles qui renforcent votre présence numérique, facilitent l'accès à vos services et simplifient les échanges.",
    ],
    prestations: [
      { titre: 'Sites vitrines', texte: 'Sites professionnels qui présentent votre entreprise et vos offres.' },
      { titre: 'Plateformes web', texte: 'Services en ligne interactifs pour vos clients et partenaires.' },
      { titre: 'Applications web métier', texte: 'Outils de travail accessibles depuis un simple navigateur.' },
      { titre: 'Applications mobiles', texte: 'Applications pour smartphones, selon les besoins du projet.' },
      { titre: 'Adaptation à tous les écrans', texte: 'Affichage optimisé sur ordinateur, tablette et smartphone.' },
      {
        titre: 'Formulaires et espaces clients',
        texte: 'Demandes en ligne, comptes clients et fonctionnalités métier intégrées.',
      },
      { titre: 'Performance et ergonomie', texte: 'Pages rapides, navigation claire et accessible.' },
    ],
    objectif: 'Des interfaces cohérentes, accessibles et au service des objectifs de chaque projet.',
    visuel: { src: appareilsConnectes, alt: 'Ordinateur, tablette et téléphone connectés' },
  },
  {
    slug: 'logiciels-de-gestion',
    titre: 'Logiciels de gestion',
    titreComplet: "Logiciels de gestion d'entreprise",
    texte:
      'Ventes, stocks, achats, finances, ressources humaines : des logiciels qui centralisent vos informations et simplifient votre gestion quotidienne.',
    description:
      "Madal Technologie, Abidjan : logiciels de gestion commerciale, de stocks, d'achats, de suivi financier et de ressources humaines, avec tableaux de bord.",
    introduction: [
      'Des informations dispersées entre cahiers, fichiers et messages font perdre du temps et rendent le pilotage difficile.',
      'Madal Technologie développe et propose des solutions qui centralisent les données utiles à votre activité et facilitent la gestion au quotidien.',
    ],
    prestations: [
      { titre: 'Gestion commerciale', texte: 'Devis, commandes, ventes et facturation.' },
      { titre: 'Gestion des stocks', texte: 'Entrées, sorties, inventaires et alertes de réapprovisionnement.' },
      { titre: 'Achats et fournisseurs', texte: 'Suivi des commandes, des fournisseurs et des règlements.' },
      { titre: 'Suivi financier', texte: 'Indicateurs de gestion et vision claire de votre activité.' },
      { titre: 'Ressources humaines et paie', texte: 'Dossiers du personnel, pointage et paie.' },
      { titre: 'Tableaux de bord', texte: "Pilotage de vos activités d'un seul coup d'œil." },
      { titre: 'Multi-utilisateur', texte: 'Accès partagé et, selon la solution, gestion de plusieurs sites.' },
    ],
    objectif: 'Une gestion centralisée, des informations fiables et un pilotage simplifié de votre activité.',
    visuel: { src: transformationDigitale, alt: "Appareils numériques au service de l'entreprise" },
  },
  {
    slug: 'maintenance-informatique',
    titre: 'Maintenance informatique',
    titreComplet: 'Maintenance et assistance informatique',
    texte:
      "Diagnostic, dépannage, maintenance préventive et contrats adaptés à votre parc : un matériel disponible pour que votre activité ne s'arrête pas.",
    description:
      'Madal Technologie, Abidjan : diagnostic de pannes, dépannage matériel et logiciel, maintenance préventive, assistance utilisateurs et contrats de maintenance.',
    introduction: [
      "Un poste en panne ou un serveur indisponible, et c'est toute une équipe qui s'arrête.",
      'Madal Technologie prévient les incidents et rétablit rapidement le fonctionnement de vos équipements informatiques.',
    ],
    prestations: [
      { titre: 'Diagnostic des pannes', texte: "Identification rapide de l'origine du problème." },
      { titre: 'Maintenance préventive', texte: 'Contrôles réguliers pour éviter les incidents.' },
      { titre: 'Dépannage', texte: 'Réparation des problèmes matériels et logiciels.' },
      { titre: 'Installation des systèmes', texte: 'Installation et mise à jour des systèmes et logiciels.' },
      { titre: 'Configuration des postes', texte: 'Préparation des ordinateurs de vos collaborateurs.' },
      { titre: 'Optimisation', texte: 'Amélioration des performances de vos équipements.' },
      { titre: 'Assistance aux utilisateurs', texte: 'Aide au quotidien pour vos équipes.' },
      {
        titre: 'Contrats de maintenance',
        texte: "Formules adaptées à votre parc, avec des modalités d'intervention définies à l'avance.",
      },
    ],
    objectif: 'Un parc informatique disponible, entretenu et performant.',
    visuel: { src: maintenanceOrdinateur, alt: "Technicien réparant l'unité centrale d'un ordinateur" },
  },
  {
    slug: 'reseaux',
    titre: 'Réseaux',
    titreComplet: "Réseaux informatiques d'entreprise",
    texte:
      'Câblage, Wi-Fi, routeurs, partage de fichiers et accès à distance : des réseaux stables, sécurisés et documentés, à la taille de votre entreprise.',
    description:
      'Madal Technologie, Abidjan : installation de réseaux locaux, câblage, Wi-Fi, configuration de routeurs et commutateurs, réseaux multisites et dépannage.',
    introduction: [
      "Un réseau fiable est la base de tout le système informatique : partage des fichiers, impression, accès à Internet et aux logiciels.",
      'Madal Technologie conçoit, installe et administre votre infrastructure réseau selon vos besoins de connectivité, de partage et de sécurité.',
    ],
    prestations: [
      { titre: 'Réseaux locaux', texte: 'Installation et configuration de votre réseau.' },
      { titre: 'Câblage', texte: 'Câblage informatique et raccordement des équipements.' },
      { titre: 'Équipements réseau', texte: "Configuration des routeurs, commutateurs et points d'accès Wi-Fi." },
      { titre: 'Partage des ressources', texte: 'Partage sécurisé des imprimantes et des fichiers.' },
      { titre: 'Plusieurs bureaux ou sites', texte: 'Réseaux reliant vos différentes implantations.' },
      { titre: 'Accès à distance', texte: "Connexion sécurisée depuis l'extérieur, lorsque l'architecture le permet." },
      { titre: 'Dépannage', texte: 'Diagnostic et résolution des problèmes de connexion.' },
    ],
    objectif: 'Des infrastructures stables, documentées et évolutives, adaptées à la taille de votre entreprise.',
    visuel: { src: cablageReseau, alt: 'Câbles réseau et outils de sertissage' },
  },
  {
    slug: 'cybersecurite',
    titre: 'Cybersécurité',
    titreComplet: 'Cybersécurité et protection des données',
    texte:
      'Évaluation des risques, sauvegardes, sécurisation des postes, des serveurs et des accès : protégez vos données et la continuité de votre activité.',
    description:
      "Madal Technologie, Abidjan : évaluation de la sécurité, droits d'accès, sauvegardes, sécurisation des postes, serveurs et réseaux, sensibilisation des équipes.",
    introduction: [
      'Perte de données, piratage ou panne prolongée : les conséquences peuvent être lourdes pour toute organisation.',
      'Madal Technologie identifie vos risques et renforce vos dispositifs de sécurité. Aucune solution ne garantit une protection absolue, mais de bonnes pratiques réduisent fortement les risques.',
    ],
    prestations: [
      { titre: 'Évaluation', texte: 'État des lieux de vos pratiques de sécurité informatique.' },
      { titre: "Comptes et droits d'accès", texte: 'Chaque utilisateur accède uniquement à ce dont il a besoin.' },
      { titre: 'Postes et serveurs', texte: 'Renforcement de la sécurité de vos équipements.' },
      { titre: 'Sauvegardes', texte: 'Stratégie de sauvegarde pour protéger vos données contre la perte.' },
      { titre: 'Réseaux et accès distants', texte: 'Sécurisation des connexions internes et externes.' },
      { titre: 'Mises à jour', texte: 'Systèmes et logiciels maintenus à jour.' },
      { titre: 'Sensibilisation', texte: 'Formation de vos équipes aux risques numériques.' },
      { titre: 'Continuité informatique', texte: "Aide à la préparation d'un plan de continuité." },
    ],
    objectif: "Réduire les risques d'accès non autorisé, de perte de données et d'interruption de vos activités.",
    visuel: { src: salleServeurs, alt: 'Allée de serveurs dans une salle informatique' },
  },
  {
    slug: 'video-ip',
    titre: 'Vidéo IP',
    titreComplet: 'Vidéo IP et vidéosurveillance',
    texte:
      'Étude, installation et configuration de caméras IP pour bureaux, commerces et entrepôts, avec consultation à distance et accès sécurisés.',
    description:
      "Madal Technologie, Abidjan : vidéosurveillance IP pour bureaux, commerces et entrepôts, de l'étude à la maintenance, avec consultation à distance.",
    introduction: [
      'Bureaux, commerces, entrepôts : la vidéosurveillance protège vos biens et vos équipes.',
      'Madal Technologie installe des systèmes de vidéo IP en tenant compte de la sécurité des accès, de la confidentialité des images et des obligations légales applicables.',
    ],
    prestations: [
      { titre: 'Étude des besoins', texte: 'Analyse des zones à surveiller et des contraintes du site.' },
      { titre: 'Emplacement des caméras', texte: 'Positionnement pour une couverture optimale.' },
      { titre: 'Installation', texte: 'Pose et raccordement des caméras IP.' },
      { titre: 'Enregistrement vidéo', texte: "Configuration de l'enregistrement et de la conservation des images." },
      { titre: 'Accès autorisés', texte: 'Consultation réservée aux personnes habilitées.' },
      { titre: 'Consultation à distance', texte: 'Accès aux images depuis un ordinateur ou un smartphone.' },
      { titre: 'Tests et maintenance', texte: 'Vérification du fonctionnement et entretien du système.' },
    ],
    objectif: 'Une surveillance fiable de vos locaux, dans le respect de la confidentialité et de la réglementation.',
    visuel: { src: interventionBaieReseau, alt: 'Technicien intervenant sur une baie de brassage' },
  },
  {
    slug: 'accompagnement-digital',
    titre: 'Accompagnement digital',
    titreComplet: 'Accompagnement à la transformation digitale',
    texte:
      'Numérisation des processus, automatisation, outils collaboratifs et intelligence artificielle : une transformation numérique progressive et mesurée.',
    description:
      'Madal Technologie, Abidjan : transformation digitale, numérisation des processus, automatisation, outils collaboratifs, intelligence artificielle et formation.',
    introduction: [
      "Les outils numériques simplifient les opérations, améliorent la productivité et facilitent la prise de décision, à condition d'être bien choisis.",
      'Madal Technologie suit une démarche progressive : comprendre vos besoins, sélectionner les solutions adaptées, accompagner leur mise en œuvre et mesurer les améliorations.',
    ],
    prestations: [
      { titre: 'Analyse des processus', texte: 'Repérage des tâches et des circuits qui gagnent à être numérisés.' },
      { titre: 'Choix des outils', texte: 'Sélection et déploiement des solutions adaptées.' },
      { titre: 'Automatisation', texte: 'Suppression des tâches répétitives.' },
      { titre: 'Outils collaboratifs', texte: 'Travail en équipe facilité, au bureau comme à distance.' },
      { titre: 'Intelligence artificielle', texte: "Intégration d'outils d'IA lorsque cela est pertinent." },
      { titre: 'Données et indicateurs', texte: 'Meilleure exploitation de vos données pour piloter votre activité.' },
      { titre: 'Formation', texte: 'Prise en main des outils par vos équipes.' },
      { titre: 'Suivi des résultats', texte: "Mesure de l'adoption et des améliorations obtenues." },
    ],
    objectif: 'Une transformation numérique utile, progressive et mesurable.',
    renvoi: {
      texte:
        'En amont, Madal Consulting analyse votre organisation et vos procédures, pour que les outils numériques répondent à de vrais besoins.',
      libelle: 'Découvrir le conseil aux entreprises',
      href: '/consulting/conseil',
    },
    visuel: { src: intelligenceArtificielle, alt: "Illustration de services numériques et d'intelligence artificielle" },
  },
];

/** Méthode projet (cahier des charges, section 4.5) : textes fournis par MADAL GROUP le 23/10/2026. */
export const METHODE_TECHNOLOGIE: Etape[] = [
  {
    titre: 'Cadrage du projet',
    texte:
      'Nous analysons vos besoins, vos objectifs et vos contraintes pour définir le périmètre, les fonctionnalités, les priorités et les résultats attendus.',
  },
  {
    titre: 'Maquette et conception',
    texte:
      "Une maquette présente l'organisation, les écrans et le parcours des utilisateurs : vous validez l'expérience et les fonctionnalités avant le développement.",
  },
  {
    titre: 'Développement',
    texte:
      'Nous réalisons la solution selon les spécifications validées, avec une exigence de fiabilité, de sécurité et de simplicité, et la testons à chaque étape.',
  },
  {
    titre: 'Déploiement',
    texte:
      'Nous installons et mettons en service la solution, vérifions les fonctionnalités essentielles et accompagnons vos utilisateurs dans la prise en main.',
  },
  {
    titre: 'Maintenance et évolution',
    texte:
      'Selon les modalités convenues, nous assurons le suivi technique, les corrections et les mises à jour, et faisons évoluer la solution avec vos besoins.',
  },
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

/** Présentation de la marque (textes fournis par MADAL GROUP le 23/10/2026). */
export const TEXTE_ALLO_LAPINS: string[] = [
  'Allô Lapins & Volailles by MG est la marque de Madal Distribution dédiée à la vente de lapins et de volailles, pour les particuliers comme pour les professionnels.',
  "Nous mettons l'accent sur la qualité des produits, la proximité avec nos clients et un achat simple et pratique.",
  'Notre ambition : devenir une marque de confiance, accessible et engagée pour la satisfaction de chaque client.',
];

/** Logo de la marque (fichier fourni le 23/10/2026, 200 × 200 px : à remplacer par une version haute définition). */
export const LOGO_ALLO_LAPINS: Visuel = {
  src: logoAlloLapins,
  alt: 'Logo Allô Lapins & Volailles by MG',
};

/** Photo de l'encart Allô Lapins & Volailles by MG. */
export const VISUEL_ALLO_LAPINS: Visuel = {
  src: lapinFrais,
  alt: 'Lapin frais préparé, prêt à la vente',
};
