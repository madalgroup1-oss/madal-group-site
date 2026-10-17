// Libellés affichés pour les valeurs énumérées de la base (types pole, type_solution).

import type { Enums } from './database.types';

/** Nom complet du pôle (cartes de solution, fil d'Ariane). */
export const NOM_POLE: Record<Enums<'pole'>, string> = {
  consulting: 'Madal Consulting',
  distribution: 'Madal Distribution',
  technologie: 'Madal Technologie',
  groupe: 'MADAL GROUP',
};

/** Nom court du pôle (rubriques du Mag). */
export const NOM_POLE_COURT: Record<Enums<'pole'>, string> = {
  consulting: 'Consulting',
  distribution: 'Distribution',
  technologie: 'Technologie',
  groupe: 'Groupe',
};

export const TYPE_SOLUTION: Record<Enums<'type_solution'>, string> = {
  logiciel: 'Logiciel',
  site_web: 'Site web',
  reseau: 'Réseau',
  videosurveillance: 'Vidéosurveillance',
  mission: 'Mission',
};
