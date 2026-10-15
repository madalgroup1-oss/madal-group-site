// Menu principal et liens du pied de page (cahier des charges, section 3)

export interface LienPole {
  verbe: string;
  nom: string;
  href: string;
}

export const POLES: LienPole[] = [
  { verbe: 'Structurer', nom: 'Madal Consulting', href: '/consulting' },
  { verbe: 'Distribuer', nom: 'Madal Distribution', href: '/distribution' },
  { verbe: 'Innover', nom: 'Madal Technologie', href: '/technologie' },
];

export interface EntreeMenu {
  libelle: string;
  href?: string;
  sousMenu?: LienPole[];
}

export const MENU: EntreeMenu[] = [
  { libelle: 'Accueil', href: '/' },
  { libelle: 'Le Groupe', href: '/le-groupe' },
  { libelle: 'Nos expertises', sousMenu: POLES },
  { libelle: 'Nos solutions', href: '/solutions' },
  { libelle: 'Actualités', href: '/mag' },
  { libelle: 'Contact', href: '/contact' },
];

export const LIENS_ENTREPRISE = [
  { libelle: 'À propos', href: '/le-groupe#a-propos' },
  { libelle: 'Notre vision', href: '/le-groupe#vision' },
  { libelle: 'Nos valeurs', href: '/le-groupe#valeurs' },
  { libelle: 'Nos projets', href: '/solutions' },
  { libelle: 'Actualités', href: '/mag' },
  { libelle: 'Contact', href: '/contact' },
];

/** Normalise un chemin (sans barre finale, sauf pour la racine). */
export function normaliserChemin(chemin: string): string {
  const sansBarre = chemin.replace(/\/+$/, '');
  return sansBarre === '' ? '/' : sansBarre;
}

/** Vrai si `href` correspond à la page courante ou à l'une de ses sous-pages. */
export function estActif(href: string, cheminCourant: string): boolean {
  const courant = normaliserChemin(cheminCourant);
  const cible = normaliserChemin(href.split('#')[0] ?? href);
  if (cible === '/') return courant === '/';
  return courant === cible || courant.startsWith(`${cible}/`);
}
