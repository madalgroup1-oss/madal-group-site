// Petits outils de construction du DOM pour /admin.
// Les données saisies ne passent jamais par innerHTML : uniquement textContent et attributs.

type Enfant = Node | string | null | undefined | false;

/** Crée un élément : el('p', { class: 'x' }, 'texte', autreNoeud). */
export function el<K extends keyof HTMLElementTagNameMap>(
  balise: K,
  attributs: Record<string, string | boolean | undefined> = {},
  ...enfants: Enfant[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(balise);
  Object.entries(attributs).forEach(([nom, valeur]) => {
    if (valeur === undefined || valeur === false) return;
    element.setAttribute(nom, valeur === true ? '' : valeur);
  });
  enfants.forEach((enfant) => {
    if (enfant === null || enfant === undefined || enfant === false) return;
    element.append(enfant);
  });
  return element;
}

let minuterie: number | undefined;

/** Message court en bas d'écran (lu par les lecteurs d'écran). */
export function annoncer(texte: string, ton: 'succes' | 'erreur' = 'succes'): void {
  const zone = document.querySelector<HTMLElement>('[data-message]');
  if (!zone) return;
  zone.textContent = texte;
  zone.dataset.ton = ton;
  zone.hidden = false;
  window.clearTimeout(minuterie);
  minuterie = window.setTimeout(() => {
    zone.hidden = true;
  }, ton === 'erreur' ? 8000 : 4000);
}

/**
 * Bouton à double confirmation (sans boîte de dialogue du navigateur) :
 * le premier clic demande confirmation, le second exécute l'action.
 */
export function boutonConfirmation(
  libelle: string,
  confirmation: string,
  action: () => Promise<void> | void,
  classe = 'bouton bouton--contour bouton--compact admin-danger',
): HTMLButtonElement {
  const bouton = el('button', { class: classe, type: 'button' }, libelle);
  let arme = false;
  let delai: number | undefined;
  bouton.addEventListener('click', async () => {
    if (!arme) {
      arme = true;
      bouton.textContent = confirmation;
      bouton.dataset.arme = '';
      delai = window.setTimeout(() => {
        arme = false;
        bouton.textContent = libelle;
        delete bouton.dataset.arme;
      }, 5000);
      return;
    }
    window.clearTimeout(delai);
    bouton.disabled = true;
    try {
      await action();
    } finally {
      bouton.disabled = false;
      arme = false;
      bouton.textContent = libelle;
      delete bouton.dataset.arme;
    }
  });
  return bouton;
}

/** Date et heure lisibles, fuseau d'Abidjan : « 19 oct. 2026 à 14:05 ». */
export function dateHeure(valeur: string | null | undefined): string {
  if (!valeur) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Abidjan',
  }).format(new Date(valeur));
}

/** Date seule : « 19 oct. 2026 ». */
export function dateCourte(valeur: string | null | undefined): string {
  if (!valeur) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Africa/Abidjan',
  }).format(new Date(valeur));
}

/** Prix en FCFA (même règle que src/lib/format.ts). */
export function prix(montant: number | null | undefined): string {
  if (montant === null || montant === undefined) return 'Prix sur demande';
  return `${Math.round(montant).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;
}

/** Adresse web à partir d'un titre : « Gésiers de poulet » → « gesiers-de-poulet ». */
export function slugifier(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
