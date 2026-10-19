// /admin : connexion (Supabase Auth, email + mot de passe), vérification du rôle
// administrateur, navigation entre les rubriques par l'ancre de l'adresse (#produits…).

import { messageErreur, supabase } from './client';
import { el } from './dom';
import { afficherDemandes } from './demandes';
import { afficherListe } from './edition';
import { initialiserPublication } from './publication';
import { RUBRIQUES } from './rubriques';

type Vue = 'chargement' | 'connexion' | 'nouveau-mdp' | 'espace';

const ONGLETS = [{ cle: 'demandes', titre: 'Demandes' }, ...RUBRIQUES.map(({ cle, titre }) => ({ cle, titre }))];

let espaceInitialise = false;
let recuperation = false;

function montrer(vue: Vue): void {
  document.querySelectorAll<HTMLElement>('[data-vue]').forEach((element) => {
    element.hidden = element.dataset.vue !== vue;
  });
}

function alerte(selecteur: string, message: string): void {
  const zone = document.querySelector<HTMLElement>(selecteur);
  if (!zone) return;
  zone.textContent = message;
  zone.hidden = message === '';
}

function ongletCourant(): string {
  const demande = window.location.hash.slice(1);
  return ONGLETS.some((onglet) => onglet.cle === demande) ? demande : 'demandes';
}

async function afficherOnglet(): Promise<void> {
  const zone = document.querySelector<HTMLElement>('[data-rubrique]');
  if (!zone) return;
  const cle = ongletCourant();
  document.querySelectorAll<HTMLAnchorElement>('[data-onglets] a').forEach((lien) => {
    if (lien.dataset.cle === cle) lien.setAttribute('aria-current', 'page');
    else lien.removeAttribute('aria-current');
  });
  if (cle === 'demandes') {
    await afficherDemandes(zone);
    return;
  }
  const rubrique = RUBRIQUES.find((element) => element.cle === cle);
  if (rubrique) await afficherListe(rubrique, zone);
}

function initialiserEspace(): void {
  if (espaceInitialise) return;
  espaceInitialise = true;
  const onglets = document.querySelector<HTMLElement>('[data-onglets]');
  onglets?.replaceChildren(
    ...ONGLETS.map((onglet) => el('li', {}, el('a', { href: `#${onglet.cle}`, 'data-cle': onglet.cle }, onglet.titre))),
  );
  window.addEventListener('hashchange', () => void afficherOnglet());
  initialiserPublication();
}

/** Ouvre l'espace si le compte connecté est administrateur ; sinon retour à la connexion. */
async function entrer(email: string | undefined): Promise<void> {
  const { data: estAdmin, error } = await supabase.rpc('est_admin');
  if (error || estAdmin !== true) {
    await supabase.auth.signOut();
    montrer('connexion');
    alerte(
      '[data-connexion-alerte]',
      error ? messageErreur(error) : 'Ce compte n’est pas administrateur du site.',
    );
    return;
  }
  const compte = document.querySelector<HTMLElement>('[data-compte]');
  const libelle = document.querySelector<HTMLElement>('[data-compte-email]');
  if (libelle) libelle.textContent = email ?? '';
  if (compte) compte.hidden = false;
  initialiserEspace();
  montrer('espace');
  await afficherOnglet();
}

function sortir(): void {
  const compte = document.querySelector<HTMLElement>('[data-compte]');
  if (compte) compte.hidden = true;
  montrer('connexion');
}

// ---------- Connexion ----------
document.querySelector<HTMLFormElement>('[data-connexion]')?.addEventListener('submit', async (evenement) => {
  evenement.preventDefault();
  const formulaire = evenement.currentTarget as HTMLFormElement;
  const email = String(new FormData(formulaire).get('email') ?? '').trim();
  const motDePasse = String(new FormData(formulaire).get('mot_de_passe') ?? '');
  if (email === '' || motDePasse === '') {
    alerte('[data-connexion-alerte]', 'Indiquez votre email et votre mot de passe.');
    return;
  }
  const bouton = formulaire.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (bouton) bouton.disabled = true;
  alerte('[data-connexion-alerte]', '');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
  if (bouton) bouton.disabled = false;
  if (error || !data.user) {
    alerte(
      '[data-connexion-alerte]',
      error?.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : messageErreur(error),
    );
    return;
  }
  formulaire.reset();
  await entrer(data.user.email);
});

// ---------- Mot de passe oublié ----------
document.querySelector<HTMLButtonElement>('[data-oubli]')?.addEventListener('click', async () => {
  const champ = document.querySelector<HTMLInputElement>('#connexion-email');
  const email = champ?.value.trim() ?? '';
  if (email === '') {
    alerte('[data-connexion-alerte]', 'Indiquez d’abord votre email, puis cliquez sur « Mot de passe oublié ? ».');
    champ?.focus();
    return;
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/`,
  });
  alerte(
    '[data-connexion-alerte]',
    error
      ? messageErreur(error)
      : 'Si cette adresse correspond à un compte, un email avec un lien de réinitialisation vient d’être envoyé.',
  );
});

document.querySelector<HTMLFormElement>('[data-nouveau-mdp]')?.addEventListener('submit', async (evenement) => {
  evenement.preventDefault();
  const formulaire = evenement.currentTarget as HTMLFormElement;
  const motDePasse = String(new FormData(formulaire).get('mot_de_passe') ?? '');
  if (motDePasse.length < 10) {
    alerte('[data-mdp-alerte]', 'Le mot de passe doit faire au moins 10 caractères.');
    return;
  }
  const { data, error } = await supabase.auth.updateUser({ password: motDePasse });
  if (error) {
    alerte('[data-mdp-alerte]', messageErreur(error));
    return;
  }
  recuperation = false;
  formulaire.reset();
  window.history.replaceState(null, '', window.location.pathname);
  await entrer(data.user?.email);
});

// ---------- Déconnexion ----------
document.querySelector<HTMLButtonElement>('[data-deconnexion]')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  sortir();
});

// ---------- Démarrage ----------
supabase.auth.onAuthStateChange((evenement) => {
  if (evenement === 'PASSWORD_RECOVERY') {
    recuperation = true;
    montrer('nouveau-mdp');
  }
  if (evenement === 'SIGNED_OUT') sortir();
});

void (async () => {
  const { data } = await supabase.auth.getSession();
  if (recuperation) return;
  if (data.session) await entrer(data.session.user.email);
  else montrer('connexion');
})();
