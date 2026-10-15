// DONNÉES PROVISOIRES — phase 1 uniquement.
// Remplacées en phase 2 par la lecture des tables Supabase `solutions` et `articles`.
// Les contenus non fournis restent affichés entre crochets (docs/contenus-en-attente.md).

import type { ImageMetadata } from 'astro';
import madalRh from '../assets/images/madal-rh.jpg';

export interface SolutionResume {
  slug: string;
  nom: string;
  pole: string;
  type: string;
  description: string;
  image?: ImageMetadata;
  altImage?: string;
  /** Texte affiché à la place de l'image tant qu'elle n'est pas fournie. */
  imageAFournir?: string;
}

export const SOLUTIONS_PROVISOIRES: SolutionResume[] = [
  {
    slug: 'bmvt-gestion-pro',
    nom: 'BMVT GESTION PRO',
    pole: 'Madal Technologie',
    type: 'Logiciel',
    description: 'Solution de gestion administrative, commerciale et comptable.',
    imageAFournir: "[À FOURNIR : capture d'écran BMVT GESTION PRO]",
  },
  {
    slug: 'madal-rh',
    nom: 'Madal RH',
    pole: 'Madal Technologie',
    type: 'Logiciel',
    description:
      'Solution de gestion des ressources humaines. Votre capital humain, mieux géré.',
    image: madalRh,
    altImage: 'Logo Madal RH',
  },
];

export interface ArticleResume {
  slug?: string;
  pole: string;
  rubrique: string;
  titre: string;
  resume: string;
  date?: Date;
}

export const ARTICLES_PROVISOIRES: ArticleResume[] = [
  {
    pole: 'Consulting',
    rubrique: 'Actualité fiscale',
    titre: "[À FOURNIR : titre du premier article Consulting]",
    resume: "[À FOURNIR : résumé de 160 caractères saisi par l'administrateur]",
  },
  {
    pole: 'Technologie',
    rubrique: 'Cybersécurité',
    titre: "[À FOURNIR : titre du premier article Technologie]",
    resume: "[À FOURNIR : résumé de 160 caractères saisi par l'administrateur]",
  },
  {
    pole: 'Distribution',
    rubrique: 'Nouveaux produits',
    titre: "[À FOURNIR : titre du premier article Distribution]",
    resume: "[À FOURNIR : résumé de 160 caractères saisi par l'administrateur]",
  },
];
