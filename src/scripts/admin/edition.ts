// Moteur commun des rubriques de contenu de /admin : liste, ajout, modification, suppression.
// Chaque rubrique (rubriques.ts) ne décrit que sa table, ses champs et son résumé en liste.

import { messageErreur, supabase, urlMedia } from './client';
import { construireFormulaire, type Champ, type Ligne } from './champs';
import { annoncer, boutonConfirmation, el } from './dom';
import { supprimerImages } from './images';
import { signalerModification } from './publication';

export interface Resume {
  titre: string;
  details: string[];
  etat?: { libelle: string; ton: 'actif' | 'inactif' | 'attention' };
  image?: string | null;
}

export interface BoutonEnregistrement {
  libelle: string;
  /** Ajoute ou modifie des valeurs juste avant l'écriture (ex. statut d'un article). */
  completer?: (valeurs: Ligne, existant: Ligne | null) => Ligne;
  secondaire?: boolean;
}

export interface Rubrique {
  cle: string;
  titre: string;
  /** « un produit », « une promotion »… */
  unElement: string;
  table: string;
  /** Colonnes de tri, dans l'ordre : [colonne, ascendant]. */
  ordre: [string, boolean][];
  champs: Champ[];
  /** Phrase d'aide affichée sous le titre de la rubrique. */
  aide?: string;
  nouveau: () => Ligne;
  resume: (ligne: Ligne) => Resume;
  /** Contrôle entre plusieurs champs ; renvoie un message d'erreur ou une chaîne vide. */
  valider?: (valeurs: Ligne) => string;
  /** Chargements préalables (listes de choix). */
  preparer?: () => Promise<void>;
  /** Boutons d'enregistrement ; par défaut un seul bouton « Enregistrer ». */
  enregistrements?: (existant: Ligne | null) => BoutonEnregistrement[];
}

function imagesDe(rubrique: Rubrique, ligne: Ligne): string[] {
  return rubrique.champs.flatMap((champ) => {
    const valeur = ligne[champ.nom];
    if (champ.type === 'image' && typeof valeur === 'string') return [valeur];
    if (champ.type === 'images' && Array.isArray(valeur)) return valeur.map(String);
    return [];
  });
}

async function lireLignes(rubrique: Rubrique): Promise<Ligne[]> {
  let requete = supabase.from(rubrique.table).select('*');
  rubrique.ordre.forEach(([colonne, ascendant]) => {
    requete = requete.order(colonne, { ascending: ascendant, nullsFirst: false });
  });
  const { data, error } = await requete;
  if (error) throw new Error(messageErreur(error));
  return (data ?? []) as Ligne[];
}

/** Affiche la liste d'une rubrique dans la zone donnée. */
export async function afficherListe(rubrique: Rubrique, zone: HTMLElement): Promise<void> {
  zone.replaceChildren(el('p', { class: 'admin-chargement' }, 'Chargement…'));
  let lignes: Ligne[];
  try {
    await rubrique.preparer?.();
    lignes = await lireLignes(rubrique);
  } catch (erreur) {
    zone.replaceChildren(
      el('p', { class: 'admin-alerte' }, erreur instanceof Error ? erreur.message : 'Lecture impossible.'),
    );
    return;
  }

  const ajouter = el('button', { class: 'bouton bouton--compact', type: 'button' }, `Ajouter ${rubrique.unElement}`);
  ajouter.addEventListener('click', () => afficherEditeur(rubrique, zone, null));

  const recherche = el('input', {
    type: 'search',
    class: 'admin-recherche',
    placeholder: 'Rechercher…',
    'aria-label': `Rechercher dans ${rubrique.titre}`,
  });

  const liste = el('ul', { class: 'admin-liste' });
  const vide = el('p', { class: 'admin-vide' }, 'Aucun élément pour le moment.');

  const elements = lignes.map((ligne) => {
    const resume = rubrique.resume(ligne);
    const ouvrir = el(
      'button',
      { class: 'admin-element', type: 'button' },
      resume.image !== undefined
        ? resume.image
          ? el('img', { class: 'admin-element__image', src: urlMedia(resume.image), alt: '', loading: 'lazy' })
          : el('span', { class: 'admin-element__image admin-element__image--vide', 'aria-hidden': 'true' })
        : null,
      el(
        'span',
        { class: 'admin-element__texte' },
        el('span', { class: 'admin-element__titre' }, resume.titre),
        ...resume.details.filter(Boolean).map((detail) => el('span', { class: 'admin-element__detail' }, detail)),
      ),
      resume.etat ? el('span', { class: `admin-etat admin-etat--${resume.etat.ton}` }, resume.etat.libelle) : null,
    );
    ouvrir.addEventListener('click', () => afficherEditeur(rubrique, zone, ligne));
    const item = el('li', {}, ouvrir);
    const texte = [resume.titre, ...resume.details].join(' ').toLowerCase();
    return { item, texte };
  });

  const filtrer = () => {
    const terme = recherche.value.trim().toLowerCase();
    let visibles = 0;
    elements.forEach(({ item, texte }) => {
      item.hidden = terme !== '' && !texte.includes(terme);
      if (!item.hidden) visibles += 1;
    });
    vide.hidden = visibles !== 0;
  };
  recherche.addEventListener('input', filtrer);

  liste.append(...elements.map(({ item }) => item));
  zone.replaceChildren(
    el(
      'div',
      { class: 'admin-rubrique__entete' },
      el(
        'div',
        {},
        el('h2', { tabindex: '-1' }, rubrique.titre),
        el('p', { class: 'admin-rubrique__compte' }, `${lignes.length} élément${lignes.length > 1 ? 's' : ''}`),
      ),
      ajouter,
    ),
    ...[
      rubrique.aide ? el('p', { class: 'admin-rubrique__aide' }, rubrique.aide) : null,
      lignes.length > 5 ? recherche : null,
    ].filter((element): element is NonNullable<typeof element> => element !== null),
    liste,
    vide,
  );
  filtrer();
}

/** Affiche le formulaire d'ajout (existant = null) ou de modification. */
export function afficherEditeur(rubrique: Rubrique, zone: HTMLElement, existant: Ligne | null): void {
  const formulaire = construireFormulaire(rubrique.champs, existant ?? rubrique.nouveau());
  const alerte = el('p', { class: 'admin-alerte', role: 'alert', hidden: true });

  const fermer = async (annuler: boolean) => {
    if (annuler) await supprimerImages(formulaire.nouveauxFichiers);
    await afficherListe(rubrique, zone);
    zone.querySelector<HTMLElement>('h2')?.focus();
  };

  const retour = el('button', { class: 'admin-lien', type: 'button' }, '← Retour à la liste');
  retour.addEventListener('click', () => void fermer(true));

  const boutons = (rubrique.enregistrements?.(existant) ?? [{ libelle: 'Enregistrer' }]).map((definition) => {
    const bouton = el(
      'button',
      { class: definition.secondaire ? 'bouton bouton--contour' : 'bouton', type: 'button' },
      definition.libelle,
    );
    bouton.addEventListener('click', async () => {
      alerte.hidden = true;
      const lues = formulaire.lire();
      if (!lues) return;
      const incoherence = rubrique.valider?.(lues) ?? '';
      if (incoherence !== '') {
        alerte.textContent = incoherence;
        alerte.hidden = false;
        return;
      }
      const valeurs = definition.completer ? definition.completer(lues, existant) : lues;
      bouton.disabled = true;
      const requete = existant
        ? supabase.from(rubrique.table).update(valeurs).eq('id', String(existant.id))
        : supabase.from(rubrique.table).insert(valeurs);
      const { error } = await requete;
      bouton.disabled = false;
      if (error) {
        alerte.textContent = messageErreur(error);
        alerte.hidden = false;
        return;
      }
      await supprimerImages(formulaire.fichiersRetires);
      signalerModification();
      annoncer('Enregistré. Publiez le site pour mettre la modification en ligne.');
      await fermer(false);
    });
    return bouton;
  });

  const supprimer = existant
    ? boutonConfirmation('Supprimer', 'Confirmer la suppression', async () => {
        const { error } = await supabase.from(rubrique.table).delete().eq('id', String(existant.id));
        if (error) {
          alerte.textContent = messageErreur(error);
          alerte.hidden = false;
          return;
        }
        await supprimerImages([...imagesDe(rubrique, existant), ...formulaire.nouveauxFichiers]);
        signalerModification();
        annoncer('Supprimé. Publiez le site pour retirer l’élément en ligne.');
        await fermer(false);
      })
    : null;

  const titre = existant ? `Modifier : ${rubrique.resume(existant).titre}` : `Ajouter ${rubrique.unElement}`;
  const entete = el('h2', { tabindex: '-1' }, titre);

  zone.replaceChildren(
    retour,
    entete,
    el('p', { class: 'champ__aide' }, 'Les champs marqués d’un * sont obligatoires.'),
    formulaire.element,
    alerte,
    el('div', { class: 'admin-actions' }, ...boutons, supprimer),
  );
  entete.focus();
  window.scrollTo({ top: 0 });
}
