// Mise en forme des textes affichés

/** Espace insécable avant chaque puce « · » ou « • » : une puce ne commence jamais une ligne. */
export function insecablePuces(texte: string): string {
  return texte.replace(/ ([·•]) /g, ' $1 ');
}
