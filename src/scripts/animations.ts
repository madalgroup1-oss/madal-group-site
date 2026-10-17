// Apparition des blocs au défilement (voir src/styles/animations.css).
// Rien ne se passe si l'utilisateur a demandé de réduire les animations :
// le contenu reste alors visible tel quel, comme sans JavaScript.

const SELECTEUR = '[data-apparition], [data-apparition-groupe] > *';
/** Écart entre deux enfants d'un même groupe, plafonné pour ne jamais faire attendre. */
const PAS_GROUPE_MS = 90;
const DELAI_MAX_MS = 450;

function preparerGroupes(): void {
  document.querySelectorAll<HTMLElement>('[data-apparition-groupe]').forEach((groupe) => {
    Array.from(groupe.children).forEach((enfant, index) => {
      if (enfant instanceof HTMLElement) {
        enfant.style.setProperty('--delai', `${Math.min(index * PAS_GROUPE_MS, DELAI_MAX_MS)}ms`);
      }
    });
  });
}

function demarrer(): void {
  const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduit || !('IntersectionObserver' in window)) return;

  const cibles = Array.from(document.querySelectorAll<HTMLElement>(SELECTEUR));
  if (cibles.length === 0) return;

  // Ce qui est déjà à l'écran au chargement reste affiché, sans clignotement
  const hauteurEcran = window.innerHeight;
  const aSurveiller = cibles.filter((cible) => {
    const zone = cible.getBoundingClientRect();
    const dejaVisible = zone.top < hauteurEcran && zone.bottom > 0;
    if (dejaVisible) cible.classList.add('est-visible');
    return !dejaVisible;
  });

  preparerGroupes();
  document.documentElement.classList.add('anime');

  const observateur = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        entree.target.classList.add('est-visible');
        observateur.unobserve(entree.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  aSurveiller.forEach((cible) => observateur.observe(cible));
}

demarrer();
