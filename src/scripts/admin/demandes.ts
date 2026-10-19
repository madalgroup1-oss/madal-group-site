// Rubrique Demandes de /admin (cahier des charges F7) : liste filtrable, statut, note interne,
// pièce jointe (lien temporaire) et export Excel (CSV UTF-8 avec BOM, séparateur point-virgule).
// Les demandes ne sont jamais créées ni supprimées ici : insertion par l'Edge Function submit-demande.

import { messageErreur, supabase } from './client';
import { annoncer, dateHeure, el } from './dom';
import { NOM_POLE } from '../../lib/libelles';
import type { Tables } from '../../lib/database.types';

type Demande = Tables<'demandes'>;

const STATUTS: Record<Demande['statut'], string> = {
  nouvelle: 'Nouvelle',
  traitee: 'Traitée',
  convertie: 'Convertie',
};

const TON_STATUT: Record<Demande['statut'], 'attention' | 'inactif' | 'actif'> = {
  nouvelle: 'attention',
  traitee: 'inactif',
  convertie: 'actif',
};

// Filtres conservés pendant la session (retour du détail vers la liste)
const filtres = { statut: '', pole: '', recherche: '' };

function telephoneInternational(telephone: string): string {
  return `225${telephone.replace(/\D/g, '').slice(-10)}`;
}

function celluleCsv(valeur: string): string {
  return `"${valeur.replace(/"/g, '""')}"`;
}

function exporterCsv(demandes: Demande[]): void {
  const entetes = [
    'Date',
    'Statut',
    'Pôle',
    'Nom / entreprise',
    'Téléphone',
    'Email',
    'Objet',
    'Description',
    'Page d’origine',
    'Pièce jointe',
    'Note interne',
  ];
  const lignes = demandes.map((demande) =>
    [
      dateHeure(demande.cree_le),
      STATUTS[demande.statut],
      NOM_POLE[demande.pole],
      demande.nom,
      demande.telephone,
      demande.email ?? '',
      demande.objet,
      demande.description,
      demande.page_origine ?? '',
      demande.piece_jointe_path ? 'oui' : 'non',
      demande.note_interne ?? '',
    ]
      .map(celluleCsv)
      .join(';'),
  );
  const contenu = `﻿${[entetes.map(celluleCsv).join(';'), ...lignes].join('\r\n')}`;
  const lien = el('a', {
    href: URL.createObjectURL(new Blob([contenu], { type: 'text/csv;charset=utf-8' })),
    download: `demandes-madal-group-${new Date().toISOString().slice(0, 10)}.csv`,
  });
  document.body.append(lien);
  lien.click();
  lien.remove();
  window.setTimeout(() => URL.revokeObjectURL(lien.href), 10000);
}

function correspond(demande: Demande): boolean {
  if (filtres.statut !== '' && demande.statut !== filtres.statut) return false;
  if (filtres.pole !== '' && demande.pole !== filtres.pole) return false;
  if (filtres.recherche !== '') {
    const texte = [demande.nom, demande.telephone, demande.email, demande.objet, demande.description]
      .join(' ')
      .toLowerCase();
    if (!texte.includes(filtres.recherche.toLowerCase())) return false;
  }
  return true;
}

function choix(libelle: string, valeur: string, options: Record<string, string>, tous: string): HTMLSelectElement {
  return el(
    'select',
    { 'aria-label': libelle },
    el('option', { value: '' }, tous),
    ...Object.entries(options).map(([cle, texte]) => el('option', { value: cle, selected: cle === valeur }, texte)),
  );
}

export async function afficherDemandes(zone: HTMLElement): Promise<void> {
  zone.replaceChildren(el('p', { class: 'admin-chargement' }, 'Chargement…'));
  const { data, error } = await supabase
    .from('demandes')
    .select('*')
    .order('cree_le', { ascending: false })
    .limit(2000);
  if (error) {
    zone.replaceChildren(el('p', { class: 'admin-alerte' }, messageErreur(error)));
    return;
  }
  const demandes = (data ?? []) as Demande[];

  const filtreStatut = choix('Filtrer par statut', filtres.statut, STATUTS, 'Tous les statuts');
  const filtrePole = choix('Filtrer par pôle', filtres.pole, NOM_POLE, 'Tous les pôles');
  const recherche = el('input', {
    type: 'search',
    class: 'admin-recherche',
    placeholder: 'Rechercher (nom, téléphone, objet…)',
    'aria-label': 'Rechercher dans les demandes',
    value: filtres.recherche,
  });
  const exporter = el('button', { class: 'bouton bouton--contour bouton--compact', type: 'button' }, 'Exporter (Excel)');
  const compte = el('p', { class: 'admin-rubrique__compte', 'aria-live': 'polite' });
  const liste = el('ul', { class: 'admin-liste' });

  const afficherListe = () => {
    const visibles = demandes.filter(correspond);
    const nouvelles = demandes.filter((demande) => demande.statut === 'nouvelle').length;
    compte.textContent = `${visibles.length} demande${visibles.length > 1 ? 's' : ''} affichée${
      visibles.length > 1 ? 's' : ''
    } · ${nouvelles} nouvelle${nouvelles > 1 ? 's' : ''} au total`;
    liste.replaceChildren(
      ...visibles.map((demande) => {
        const ouvrir = el(
          'button',
          { class: 'admin-element', type: 'button' },
          el(
            'span',
            { class: 'admin-element__texte' },
            el('span', { class: 'admin-element__titre' }, `${demande.nom} — ${demande.objet}`),
            el('span', { class: 'admin-element__detail' }, `${dateHeure(demande.cree_le)} · ${NOM_POLE[demande.pole]}`),
            el(
              'span',
              { class: 'admin-element__detail' },
              [demande.telephone, demande.piece_jointe_path ? 'pièce jointe' : ''].filter(Boolean).join(' · '),
            ),
          ),
          el('span', { class: `admin-etat admin-etat--${TON_STATUT[demande.statut]}` }, STATUTS[demande.statut]),
        );
        ouvrir.addEventListener('click', () => afficherDetail(zone, demande));
        return el('li', {}, ouvrir);
      }),
    );
    if (visibles.length === 0) liste.append(el('li', { class: 'admin-vide' }, 'Aucune demande.'));
    exporter.disabled = visibles.length === 0;
  };

  filtreStatut.addEventListener('change', () => {
    filtres.statut = filtreStatut.value;
    afficherListe();
  });
  filtrePole.addEventListener('change', () => {
    filtres.pole = filtrePole.value;
    afficherListe();
  });
  recherche.addEventListener('input', () => {
    filtres.recherche = recherche.value.trim();
    afficherListe();
  });
  exporter.addEventListener('click', () => exporterCsv(demandes.filter(correspond)));

  zone.replaceChildren(
    el(
      'div',
      { class: 'admin-rubrique__entete' },
      el('div', {}, el('h2', { tabindex: '-1' }, 'Demandes'), compte),
      exporter,
    ),
    el(
      'p',
      { class: 'admin-rubrique__aide' },
      'Demandes reçues par les formulaires de contact et de devis. L’export s’ouvre dans Excel et reprend les filtres choisis.',
    ),
    el('div', { class: 'admin-filtres' }, filtreStatut, filtrePole, recherche),
    liste,
  );
  afficherListe();
}

function afficherDetail(zone: HTMLElement, demande: Demande): void {
  const retour = el('button', { class: 'admin-lien', type: 'button' }, '← Retour aux demandes');
  retour.addEventListener('click', () => void afficherDemandes(zone));

  const statut = el(
    'select',
    { id: 'demande-statut' },
    ...Object.entries(STATUTS).map(([cle, texte]) => el('option', { value: cle, selected: cle === demande.statut }, texte)),
  );
  const note = el('textarea', { id: 'demande-note', rows: '4', maxlength: '2000' });
  note.value = demande.note_interne ?? '';
  const alerte = el('p', { class: 'admin-alerte', role: 'alert', hidden: true });

  const enregistrer = el('button', { class: 'bouton', type: 'button' }, 'Enregistrer');
  enregistrer.addEventListener('click', async () => {
    enregistrer.disabled = true;
    alerte.hidden = true;
    const { error } = await supabase
      .from('demandes')
      .update({ statut: statut.value, note_interne: note.value.trim() === '' ? null : note.value.trim() })
      .eq('id', demande.id);
    enregistrer.disabled = false;
    if (error) {
      alerte.textContent = messageErreur(error);
      alerte.hidden = false;
      return;
    }
    annoncer('Demande mise à jour.');
    await afficherDemandes(zone);
  });

  let pieceJointe: HTMLElement | null = null;
  if (demande.piece_jointe_path) {
    const chemin = demande.piece_jointe_path;
    const ouvrir = el('button', { class: 'bouton bouton--contour bouton--compact', type: 'button' }, 'Ouvrir la pièce jointe');
    ouvrir.addEventListener('click', async () => {
      // Fenêtre ouverte tout de suite (sinon bloquée par le navigateur), adresse fournie ensuite
      const fenetre = window.open('', '_blank');
      const { data, error } = await supabase.storage.from('pieces-jointes').createSignedUrl(chemin, 300);
      if (error || !data) {
        fenetre?.close();
        annoncer(messageErreur(error), 'erreur');
        return;
      }
      if (fenetre) {
        fenetre.opener = null;
        fenetre.location.href = data.signedUrl;
      } else {
        window.location.href = data.signedUrl;
      }
    });
    pieceJointe = ouvrir;
  }

  const ligne = (libelle: string, ...contenu: (Node | string | null)[]) =>
    el('div', { class: 'admin-fiche__ligne' }, el('dt', { class: 'etiquette' }, libelle), el('dd', {}, ...contenu));

  const entete = el('h2', { tabindex: '-1' }, demande.objet);
  zone.replaceChildren(
    retour,
    entete,
    el(
      'dl',
      { class: 'admin-fiche' },
      ligne('Reçue le', dateHeure(demande.cree_le)),
      ligne('Pôle', NOM_POLE[demande.pole]),
      ligne('Nom / entreprise', demande.nom),
      ligne(
        'Téléphone',
        el('a', { href: `tel:+${telephoneInternational(demande.telephone)}` }, demande.telephone),
        ' · ',
        el(
          'a',
          {
            href: `https://wa.me/${telephoneInternational(demande.telephone)}`,
            target: '_blank',
            rel: 'noopener',
          },
          'WhatsApp',
        ),
      ),
      ligne('Email', demande.email ? el('a', { href: `mailto:${demande.email}` }, demande.email) : 'non renseigné'),
      ligne('Page d’origine', demande.page_origine ?? 'non renseignée'),
      ligne('Description', el('span', { class: 'admin-fiche__texte' }, demande.description)),
      ligne('Pièce jointe', pieceJointe ?? 'aucune'),
    ),
    el(
      'div',
      { class: 'admin-champs' },
      el('div', { class: 'champ' }, el('label', { for: 'demande-statut' }, 'Statut'), statut),
      el(
        'div',
        { class: 'champ' },
        el('label', { for: 'demande-note' }, 'Note interne'),
        note,
        el('p', { class: 'champ__aide' }, 'Visible uniquement dans l’administration.'),
      ),
    ),
    alerte,
    el('div', { class: 'admin-actions' }, enregistrer),
  );
  entete.focus();
  window.scrollTo({ top: 0 });
}
