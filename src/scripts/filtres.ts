// Filtrage des listes (catalogue, solutions, Mag) : voir src/components/Filtres.astro.
// Un élément reste visible s'il correspond à chaque critère actif (comparaison stricte ===).

function nomAttribut(critere: string): string {
  // data-f-pole → dataset.fPole
  return `f${critere.charAt(0).toUpperCase()}${critere.slice(1)}`;
}

function initialiser(zone: HTMLElement): void {
  const groupes = Array.from(zone.querySelectorAll<HTMLElement>('[data-filtre]'));
  const elements = Array.from(zone.querySelectorAll<HTMLElement>('[data-element]'));
  const compte = zone.querySelector<HTMLElement>('[data-filtres-compte]');
  const vide = zone.querySelector<HTMLElement>('[data-filtres-vide]');
  if (groupes.length === 0 || elements.length === 0) return;

  const actifs = new Map<string, string>();

  function appliquer(): void {
    let visibles = 0;
    elements.forEach((element) => {
      const correspond = Array.from(actifs.entries()).every(
        ([critere, valeur]) => valeur === '' || element.dataset[nomAttribut(critere)] === valeur,
      );
      element.hidden = !correspond;
      if (correspond) visibles += 1;
    });
    if (vide) vide.hidden = visibles !== 0;
    if (compte) {
      compte.textContent = `${visibles} résultat${visibles > 1 ? 's' : ''} affiché${visibles > 1 ? 's' : ''}`;
    }
  }

  function choisir(groupe: HTMLElement, valeur: string): void {
    const critere = groupe.dataset.filtre ?? '';
    actifs.set(critere, valeur);
    groupe.querySelectorAll<HTMLButtonElement>('button[data-valeur]').forEach((bouton) => {
      bouton.setAttribute('aria-pressed', String(bouton.dataset.valeur === valeur));
    });
    appliquer();
  }

  // Pré-sélection depuis l'adresse, ex. /distribution?famille=produits-carnes#catalogue
  const parametres = new URLSearchParams(window.location.search);

  groupes.forEach((groupe) => {
    const critere = groupe.dataset.filtre ?? '';
    const boutons = Array.from(groupe.querySelectorAll<HTMLButtonElement>('button[data-valeur]'));
    const demande = parametres.get(critere) ?? '';
    const existe = boutons.some((bouton) => bouton.dataset.valeur === demande);
    actifs.set(critere, existe ? demande : '');

    boutons.forEach((bouton) => {
      bouton.addEventListener('click', () => choisir(groupe, bouton.dataset.valeur ?? ''));
    });

    groupe.hidden = false;
    choisir(groupe, actifs.get(critere) ?? '');
  });
}

document.querySelectorAll<HTMLElement>('[data-filtres]').forEach(initialiser);
