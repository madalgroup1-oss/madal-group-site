// Textes officiels du groupe : docs/brief-strategique.md et maquettes validées.
// Ne rien ajouter ici qui ne figure pas dans ces sources.

export type NomIcone = 'consulting' | 'distribution' | 'technologie';

export interface Pole {
  cle: 'consulting' | 'distribution' | 'technologie';
  verbe: string;
  nom: string;
  domaines: string;
  texte: string;
  href: string;
  icone: NomIcone;
}

export const POLES_DETAILS: Pole[] = [
  {
    cle: 'consulting',
    verbe: 'Structurer',
    nom: 'Madal Consulting',
    domaines: 'Comptabilité · Fiscalité · Gestion sociale · Conseil',
    texte:
      'Nous accompagnons les entreprises dans la structuration et le pilotage de leur gestion comptable, fiscale, sociale et administrative.',
    href: '/consulting',
    icone: 'consulting',
  },
  {
    cle: 'distribution',
    verbe: 'Distribuer',
    nom: 'Madal Distribution',
    domaines: 'Produits · Fournitures · Équipements',
    texte:
      "Une offre de produits alimentaires, de fournitures professionnelles et d'équipements, pour les particuliers comme pour les professionnels.",
    href: '/distribution',
    icone: 'distribution',
  },
  {
    cle: 'technologie',
    verbe: 'Innover',
    nom: 'Madal Technologie',
    domaines: 'Solutions digitales · Cybersécurité · Développement · Vidéo IP',
    texte:
      'Logiciels sur mesure, applications, maintenance informatique, réseaux, cybersécurité et vidéosurveillance IP.',
    href: '/technologie',
    icone: 'technologie',
  },
];

export const INTRODUCTION =
  'Nous accompagnons les entreprises, professionnels et particuliers avec des solutions en gestion, distribution et technologie.';

export const POSITIONNEMENT =
  "MADAL GROUP n'est pas simplement une entreprise qui propose plusieurs services. C'est un groupe qui structure, distribue et innove.";

export interface Texte {
  titre: string;
  texte: string;
}

export const ARGUMENTS: Texte[] = [
  {
    titre: 'Une approche intégrée',
    texte: "Plusieurs expertises complémentaires réunies au sein d'un même groupe.",
  },
  {
    titre: 'Des solutions adaptées',
    texte: 'Chaque besoin est étudié pour proposer une réponse concrète, adaptée à votre contexte.',
  },
  { titre: 'La proximité', texte: 'Une relation durable avec nos clients et partenaires.' },
  {
    titre: 'Le professionnalisme',
    texte: "Rigueur, organisation, confidentialité et qualité d'exécution.",
  },
  {
    titre: "L'innovation",
    texte: 'Les outils numériques et les nouvelles technologies au service de la performance.',
  },
  {
    titre: 'Une vision à long terme',
    texte: 'Un groupe diversifié, structuré et durable, construit progressivement.',
  },
];

export interface EtapeSynergie {
  verbe: string;
  texte: string;
}

export const SYNERGIE: EtapeSynergie[] = [
  {
    verbe: 'Structurer',
    texte: 'Une PME confie sa comptabilité et ses déclarations à Madal Consulting.',
  },
  {
    verbe: 'Innover',
    texte: 'Elle adopte un logiciel de gestion développé par Madal Technologie.',
  },
  {
    verbe: 'Distribuer',
    texte:
      "Elle s'équipe en matériel informatique et en fournitures auprès de Madal Distribution.",
  },
];

export const METHODE: Texte[] = [
  { titre: 'Écouter', texte: 'Comprendre votre besoin.' },
  { titre: 'Analyser', texte: 'Identifier les contraintes et les opportunités.' },
  { titre: 'Concevoir', texte: 'Proposer une solution adaptée.' },
  { titre: 'Accompagner', texte: "Assurer le suivi et l'amélioration continue." },
];

export const A_PROPOS: string[] = [
  "MADAL GROUP SARL est une entreprise ivoirienne construite autour d'une vision entrepreneuriale : créer un groupe capable de répondre à différents besoins du marché à travers des expertises complémentaires.",
  "Notre organisation repose aujourd'hui sur trois pôles : Madal Consulting, Madal Distribution et Madal Technologie.",
  "Cette complémentarité nous permet d'intervenir aussi bien dans l'accompagnement des entreprises que dans la distribution de produits et fournitures ou dans la conception de solutions technologiques.",
  "Notre objectif est de construire une organisation professionnelle, responsable et durable, fondée sur la confiance, la qualité et l'innovation.",
];

export const VISION = {
  titre: "Devenir un groupe de référence en Côte d'Ivoire.",
  introduction:
    'MADAL GROUP ambitionne de développer progressivement ses activités et de construire un groupe reconnu pour :',
  engagements: [
    'son professionnalisme',
    'sa proximité',
    "sa capacité d'innovation",
    'la qualité de ses services',
    'la fiabilité de ses solutions',
    'son engagement auprès des entrepreneurs et des entreprises',
  ],
};

export const VALEURS: Texte[] = [
  { titre: 'Professionnalisme', texte: 'Nous privilégions la qualité et la rigueur.' },
  { titre: 'Rigueur', texte: 'Nous travaillons avec méthode et précision.' },
  { titre: 'Innovation', texte: 'Nous recherchons continuellement de meilleures solutions.' },
  { titre: 'Transparence', texte: 'Nous construisons nos relations sur la confiance.' },
  { titre: 'Engagement', texte: 'Nous assumons nos responsabilités et nos engagements.' },
  { titre: 'Satisfaction client', texte: "Le besoin du client reste au cœur de notre action." },
];
