// Photos des pôles (dossier src/assets/images/poles/, fournies le 17/10/2026).
// Banque d'images : à réserver aux cartes et aux sections intérieures,
// jamais en hero (cahier des charges, section 6 « Photographies »).

import conseillereEntretien from '../assets/images/poles/consulting/conseillere-entretien.jpg';
import poulesPondeuses from '../assets/images/poles/distribution/poules-pondeuses.jpg';
import developpeurs from '../assets/images/poles/technologie/developpeurs.jpg';
import madalRh from '../assets/images/madal-rh.jpg';
import type { Pole } from './groupe';

export interface Visuel {
  src: ImageMetadata;
  alt: string;
}

/** Photo de la carte de chaque pôle (accueil, page Le Groupe). */
export const VISUELS_POLES: Record<Pole['cle'], Visuel> = {
  consulting: {
    src: conseillereEntretien,
    alt: 'Une conseillère présente une analyse à un client lors d’un entretien',
  },
  distribution: {
    src: poulesPondeuses,
    alt: 'Poules pondeuses dans un élevage',
  },
  technologie: {
    src: developpeurs,
    alt: 'Deux développeurs travaillent sur des ordinateurs portables',
  },
};

/**
 * Visuel local provisoire d'une solution, par slug, tant que son logo
 * n'est pas téléversé dans /admin (colonne solutions.logo_path).
 */
export const VISUELS_SOLUTIONS_PROVISOIRES: Record<string, Visuel> = {
  'madal-rh': { src: madalRh, alt: 'Logo Madal RH' },
};
