// Mise en forme des textes affichés

/** Espace insécable avant chaque puce « · » ou « • » : une puce ne commence jamais une ligne. */
export function insecablePuces(texte: string): string {
  return texte.replace(/ ([·•]) /g, ' $1 ');
}

/**
 * Prix en FCFA, entier, milliers séparés par une espace insécable : « 25 000 FCFA ».
 * Prix absent : « Prix sur demande ».
 */
export function formatPrix(prix: number | null | undefined): string {
  if (prix === null || prix === undefined) return 'Prix sur demande';
  const milliers = Math.round(prix)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${milliers} FCFA`;
}

/** Date lisible en français, fuseau d'Abidjan : « 17 octobre 2026 ». */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Abidjan',
  }).format(date);
}
