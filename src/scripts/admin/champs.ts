// Formulaires de /admin construits à partir d'une liste de champs (voir rubriques.ts).
// Chaque type de champ sait s'afficher, lire sa valeur au format de la base et se vérifier.

import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { urlMedia } from './client';
import { annoncer, el, slugifier } from './dom';
import { supprimerImages, televerserImage } from './images';

export type TypeChamp =
  | 'texte'
  | 'zone'
  | 'nombre'
  | 'prix'
  | 'case'
  | 'liste'
  | 'date'
  | 'lignes'
  | 'slug'
  | 'image'
  | 'images'
  | 'markdown';

export interface Option {
  valeur: string;
  libelle: string;
}

export interface Champ {
  /** Colonne de la table. */
  nom: string;
  libelle: string;
  type: TypeChamp;
  requis?: boolean;
  aide?: string;
  /** Longueur (texte) ou valeur (nombre) minimale et maximale. */
  min?: number;
  max?: number;
  /** Choix d'une liste ; une fonction est relue à chaque ouverture du formulaire. */
  options?: Option[] | (() => Option[]);
  /** Champ « slug » : colonne dont il est dérivé (ex. « nom »). */
  source?: string;
  /** Champs « image » et « images » : dossier du bucket media. */
  dossier?: string;
  /** Deux champs « demi » consécutifs partagent une ligne sur grand écran. */
  demi?: boolean;
}

export type Ligne = Record<string, unknown>;

interface ChampRendu {
  bloc: HTMLElement;
  lire: () => unknown;
  verifier: () => string;
  saisie?: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
}

export interface Formulaire {
  element: HTMLElement;
  /** Valeurs prêtes pour la base, ou null si un champ est invalide (erreurs affichées). */
  lire: () => Ligne | null;
  /** Images téléversées pendant l'édition (à supprimer si l'on annule). */
  nouveauxFichiers: string[];
  /** Images d'origine retirées (à supprimer après l'enregistrement). */
  fichiersRetires: string[];
}

let compteur = 0;

function identifiant(nom: string): string {
  compteur += 1;
  return `champ-${nom}-${compteur}`;
}

function longueur(valeur: string): number {
  return Array.from(valeur).length;
}

function texteValeur(valeur: unknown): string {
  if (valeur === null || valeur === undefined) return '';
  return String(valeur);
}

export function construireFormulaire(champs: Champ[], ligne: Ligne): Formulaire {
  const formulaire: Formulaire = {
    element: el('div', { class: 'admin-champs' }),
    lire: () => null,
    nouveauxFichiers: [],
    fichiersRetires: [],
  };
  const originaux = new Set<string>();
  champs.forEach((champ) => {
    const valeur = ligne[champ.nom];
    if (champ.type === 'image' && typeof valeur === 'string') originaux.add(valeur);
    if (champ.type === 'images' && Array.isArray(valeur)) valeur.forEach((chemin) => originaux.add(String(chemin)));
  });

  /** Retire une image : différée si elle est déjà enregistrée, immédiate si elle vient d'être envoyée. */
  function retirerFichier(chemin: string): void {
    if (originaux.has(chemin)) {
      formulaire.fichiersRetires.push(chemin);
    } else {
      formulaire.nouveauxFichiers = formulaire.nouveauxFichiers.filter((element) => element !== chemin);
      void supprimerImages([chemin]);
    }
  }

  const rendus = new Map<string, ChampRendu>();

  champs.forEach((champ) => {
    const id = identifiant(champ.nom);
    const erreur = el('p', { class: 'champ__erreur', id: `${id}-erreur` });
    const aide = champ.aide ? el('p', { class: 'champ__aide', id: `${id}-aide` }, champ.aide) : null;
    const decrit = [aide ? `${id}-aide` : '', `${id}-erreur`].filter(Boolean).join(' ');
    const libelle = el('label', { for: id }, `${champ.libelle}${champ.requis ? ' *' : ''}`);
    const valeur = ligne[champ.nom];
    let rendu: ChampRendu;

    const verifierTexte = (texte: string): string => {
      if (champ.requis && texte === '') return 'Champ obligatoire.';
      if (texte !== '' && champ.min !== undefined && longueur(texte) < champ.min) {
        return `${champ.min} caractères minimum.`;
      }
      if (champ.max !== undefined && longueur(texte) > champ.max) return `${champ.max} caractères maximum.`;
      return '';
    };

    switch (champ.type) {
      case 'texte':
      case 'slug': {
        const saisie = el('input', {
          id,
          type: 'text',
          value: texteValeur(valeur),
          maxlength: champ.max ? String(champ.max) : undefined,
          'aria-describedby': decrit,
          spellcheck: champ.type === 'slug' ? 'false' : undefined,
        });
        rendu = {
          bloc: el('div', { class: 'champ' }, libelle, saisie, aide, erreur),
          saisie,
          lire: () => (saisie.value.trim() === '' ? null : saisie.value.trim()),
          verifier: () => {
            const texte = saisie.value.trim();
            if (champ.type === 'slug' && texte !== '' && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(texte)) {
              return 'Lettres minuscules sans accent, chiffres et tirets uniquement.';
            }
            return verifierTexte(texte);
          },
        };
        break;
      }
      case 'zone':
      case 'markdown': {
        const saisie = el('textarea', {
          id,
          rows: champ.type === 'markdown' ? '16' : '4',
          maxlength: champ.max ? String(champ.max) : undefined,
          'aria-describedby': decrit,
        });
        saisie.value = texteValeur(valeur);
        const enfants: (Node | null)[] = [libelle, saisie];
        if (champ.max) {
          const compte = el('p', { class: 'champ__aide', 'aria-live': 'polite' });
          const majCompte = () => {
            compte.textContent = `${longueur(saisie.value)} / ${champ.max} caractères`;
          };
          majCompte();
          saisie.addEventListener('input', majCompte);
          enfants.push(compte);
        }
        if (champ.type === 'markdown') {
          const apercu = el('div', { class: 'admin-apercu prose', hidden: true });
          const bascule = el('button', { class: 'admin-lien', type: 'button', 'aria-pressed': 'false' }, 'Voir l’aperçu');
          bascule.addEventListener('click', () => {
            const visible = apercu.hidden;
            if (visible) {
              const html = marked.parse(saisie.value, { async: false, gfm: true });
              apercu.innerHTML = DOMPurify.sanitize(html);
            }
            apercu.hidden = !visible;
            saisie.hidden = visible;
            bascule.textContent = visible ? 'Revenir à la saisie' : 'Voir l’aperçu';
            bascule.setAttribute('aria-pressed', String(visible));
          });
          enfants.splice(1, 0, bascule);
          enfants.push(apercu);
        }
        rendu = {
          bloc: el('div', { class: 'champ' }, ...enfants, aide, erreur),
          saisie,
          lire: () =>
            champ.type === 'markdown' ? saisie.value : saisie.value.trim() === '' ? null : saisie.value.trim(),
          verifier: () => verifierTexte(saisie.value.trim()),
        };
        break;
      }
      case 'nombre':
      case 'prix': {
        const saisie = el('input', {
          id,
          type: 'text',
          inputmode: 'numeric',
          value: valeur === null || valeur === undefined ? '' : String(valeur),
          'aria-describedby': decrit,
        });
        const nombre = () => saisie.value.replace(/[\s  ]/g, '');
        rendu = {
          bloc: el('div', { class: 'champ' }, libelle, saisie, aide, erreur),
          saisie,
          lire: () => {
            if (nombre() === '') return champ.type === 'prix' ? null : 0;
            return Number.parseInt(nombre(), 10);
          },
          verifier: () => {
            if (nombre() === '') return champ.requis ? 'Champ obligatoire.' : '';
            if (!/^\d+$/.test(nombre())) return 'Nombre entier sans virgule (ex. 25000).';
            return '';
          },
        };
        break;
      }
      case 'case': {
        const saisie = el('input', { id, type: 'checkbox', checked: valeur === true, 'aria-describedby': decrit });
        rendu = {
          bloc: el('div', { class: 'champ' }, el('div', { class: 'case' }, saisie, libelle), aide, erreur),
          saisie,
          lire: () => saisie.checked,
          verifier: () => '',
        };
        break;
      }
      case 'liste': {
        const options = typeof champ.options === 'function' ? champ.options() : (champ.options ?? []);
        const saisie = el(
          'select',
          { id, 'aria-describedby': decrit },
          champ.requis ? null : el('option', { value: '' }, '—'),
          ...options.map((option) =>
            el('option', { value: option.valeur, selected: option.valeur === texteValeur(valeur) }, option.libelle),
          ),
        );
        rendu = {
          bloc: el('div', { class: 'champ' }, libelle, saisie, aide, erreur),
          saisie,
          lire: () => (saisie.value === '' ? null : saisie.value),
          verifier: () => (champ.requis && saisie.value === '' ? 'Champ obligatoire.' : ''),
        };
        break;
      }
      case 'date': {
        const saisie = el('input', {
          id,
          type: 'date',
          value: texteValeur(valeur).slice(0, 10),
          'aria-describedby': decrit,
        });
        rendu = {
          bloc: el('div', { class: 'champ' }, libelle, saisie, aide, erreur),
          saisie,
          lire: () => (saisie.value === '' ? null : saisie.value),
          verifier: () => (champ.requis && saisie.value === '' ? 'Champ obligatoire.' : ''),
        };
        break;
      }
      case 'lignes': {
        const saisie = el('textarea', { id, rows: '5', 'aria-describedby': decrit });
        saisie.value = Array.isArray(valeur) ? valeur.join('\n') : '';
        const lignes = () =>
          saisie.value
            .split('\n')
            .map((element) => element.trim())
            .filter((element) => element !== '');
        rendu = {
          bloc: el('div', { class: 'champ' }, libelle, saisie, aide, erreur),
          saisie,
          lire: lignes,
          verifier: () => (champ.requis && lignes().length === 0 ? 'Au moins une ligne.' : ''),
        };
        break;
      }
      case 'image':
      case 'images': {
        const multiple = champ.type === 'images';
        let chemins: string[] = multiple
          ? (Array.isArray(valeur) ? valeur.map(String) : [])
          : typeof valeur === 'string' && valeur !== ''
            ? [valeur]
            : [];
        const galerie = el('ul', { class: 'admin-galerie' });
        const etat = el('p', { class: 'champ__aide', 'aria-live': 'polite' });
        const saisie = el('input', {
          id,
          type: 'file',
          accept: 'image/jpeg,image/png,image/webp',
          multiple,
          'aria-describedby': decrit,
        });

        const afficher = () => {
          galerie.replaceChildren(
            ...chemins.map((chemin, index) => {
              const retirer = el(
                'button',
                { class: 'bouton bouton--contour bouton--compact', type: 'button' },
                'Retirer',
                el('span', { class: 'visuellement-cache' }, ` l’image ${index + 1}`),
              );
              retirer.addEventListener('click', () => {
                retirerFichier(chemin);
                chemins = chemins.filter((element) => element !== chemin);
                afficher();
              });
              return el(
                'li',
                {},
                el('img', { src: urlMedia(chemin), alt: `Image ${index + 1}`, loading: 'lazy' }),
                retirer,
              );
            }),
          );
          galerie.hidden = chemins.length === 0;
        };
        afficher();

        saisie.addEventListener('change', async () => {
          const fichiers = Array.from(saisie.files ?? []);
          if (fichiers.length === 0) return;
          saisie.disabled = true;
          const base = slugifier(String(ligne.slug ?? ligne.nom ?? ligne.titre ?? champ.dossier ?? 'image')) || 'image';
          try {
            for (const [index, fichier] of fichiers.entries()) {
              etat.textContent = `Envoi de l’image ${index + 1} sur ${fichiers.length}…`;
              const chemin = await televerserImage(fichier, champ.dossier ?? 'divers', base);
              formulaire.nouveauxFichiers.push(chemin);
              if (!multiple) chemins.forEach(retirerFichier);
              chemins = multiple ? [...chemins, chemin] : [chemin];
              afficher();
            }
            etat.textContent = 'Image envoyée. Pensez à enregistrer.';
          } catch (erreurEnvoi) {
            const message = erreurEnvoi instanceof Error ? erreurEnvoi.message : 'Envoi impossible.';
            etat.textContent = message;
            annoncer(message, 'erreur');
          } finally {
            saisie.value = '';
            saisie.disabled = false;
          }
        });

        rendu = {
          bloc: el('div', { class: 'champ' }, libelle, galerie, saisie, etat, aide, erreur),
          lire: () => (multiple ? chemins : (chemins[0] ?? null)),
          verifier: () => (champ.requis && chemins.length === 0 ? 'Image obligatoire.' : ''),
        };
        break;
      }
    }

    if (champ.demi) rendu.bloc.classList.add('champ--demi');
    rendus.set(champ.nom, rendu);
    formulaire.element.append(rendu.bloc);
  });

  // Slug : suit la source tant qu'il n'a pas été modifié à la main (nouvel élément uniquement)
  champs
    .filter((champ) => champ.type === 'slug' && champ.source)
    .forEach((champ) => {
      const cible = rendus.get(champ.nom)?.saisie;
      const source = rendus.get(champ.source ?? '')?.saisie;
      if (!cible || !source) return;
      let manuel = texteValeur(ligne[champ.nom]) !== '';
      cible.addEventListener('input', () => {
        manuel = cible.value.trim() !== '';
      });
      source.addEventListener('input', () => {
        if (!manuel) cible.value = slugifier(source.value);
      });
    });

  formulaire.lire = () => {
    const valeurs: Ligne = {};
    let premierInvalide: HTMLElement | null = null;
    rendus.forEach((rendu, nom) => {
      const message = rendu.verifier();
      const zone = rendu.bloc.querySelector<HTMLElement>('.champ__erreur');
      if (zone) zone.textContent = message;
      if (rendu.saisie) {
        if (message === '') rendu.saisie.removeAttribute('aria-invalid');
        else rendu.saisie.setAttribute('aria-invalid', 'true');
      }
      if (message !== '' && premierInvalide === null) premierInvalide = rendu.saisie ?? rendu.bloc;
      valeurs[nom] = rendu.lire();
    });
    if (premierInvalide !== null) {
      (premierInvalide as HTMLElement).focus();
      return null;
    }
    return valeurs;
  };

  return formulaire;
}
