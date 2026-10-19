// Bandeau « Site public » de /admin : état de la dernière publication, modifications en attente
// et bouton « Publier sur le site » (Edge Function rebuild → deploy hook Cloudflare Pages).

import { messageErreur, supabase } from './client';
import { dateHeure } from './dom';

const TABLES_CONTENU = ['produits', 'promotions', 'offres_consulting', 'solutions', 'articles'];
// Suppressions : aucune date de modification à comparer, on retient l'information localement
const CLE_EN_ATTENTE = 'madal-admin-a-publier';

interface Publication {
  demandee_le: string;
  reussie: boolean;
  message: string | null;
}

let derniereReussie: string | null = null;

function lireDrapeau(): boolean {
  try {
    return window.localStorage.getItem(CLE_EN_ATTENTE) === 'oui';
  } catch {
    return false;
  }
}

function ecrireDrapeau(valeur: boolean): void {
  try {
    if (valeur) window.localStorage.setItem(CLE_EN_ATTENTE, 'oui');
    else window.localStorage.removeItem(CLE_EN_ATTENTE);
  } catch {
    // Stockage indisponible (navigation privée) : l'état reposera sur les dates
  }
}

function zones() {
  return {
    bloc: document.querySelector<HTMLElement>('[data-publication]'),
    etat: document.querySelector<HTMLElement>('[data-publication-etat]'),
    bouton: document.querySelector<HTMLButtonElement>('[data-publier]'),
  };
}

/** Date de la modification de contenu la plus récente. */
async function derniereModification(): Promise<string | null> {
  const dates = await Promise.all(
    TABLES_CONTENU.map(async (table) => {
      const { data } = await supabase
        .from(table)
        .select('modifie_le')
        .order('modifie_le', { ascending: false })
        .limit(1)
        .maybeSingle();
      return (data?.modifie_le as string | undefined) ?? null;
    }),
  );
  return dates.filter((date): date is string => date !== null).sort().pop() ?? null;
}

function afficher(enAttente: boolean, derniere: Publication | null): void {
  const { bloc, etat } = zones();
  if (!bloc || !etat) return;
  bloc.dataset.enAttente = String(enAttente);
  const parties: string[] = [];
  if (enAttente) parties.push('Des modifications ne sont pas encore en ligne.');
  else parties.push('Le site est à jour.');
  if (derniere) {
    parties.push(
      derniere.reussie
        ? `Dernière publication : ${dateHeure(derniere.demandee_le)}.`
        : `Dernière tentative (${dateHeure(derniere.demandee_le)}) : ${derniere.message ?? 'échec'}`,
    );
  } else {
    parties.push('Aucune publication depuis l’espace d’administration.');
  }
  etat.textContent = parties.join(' ');
}

/** Relit l'état (au chargement et après chaque publication). */
export async function actualiserPublication(): Promise<void> {
  const { data, error } = await supabase
    .from('publications')
    .select('demandee_le, reussie, message')
    .order('demandee_le', { ascending: false })
    .limit(10);
  if (error) {
    const { etat } = zones();
    if (etat) etat.textContent = messageErreur(error);
    return;
  }
  const publications = (data ?? []) as Publication[];
  derniereReussie = publications.find((publication) => publication.reussie)?.demandee_le ?? null;
  const modification = await derniereModification();
  const enAttente =
    lireDrapeau() || (modification !== null && (derniereReussie === null || modification > derniereReussie));
  afficher(enAttente, publications[0] ?? null);
}

/** Appelée après chaque enregistrement ou suppression. */
export function signalerModification(): void {
  ecrireDrapeau(true);
  void actualiserPublication();
}

export function initialiserPublication(): void {
  const { bouton, etat } = zones();
  if (!bouton || !etat) return;
  bouton.addEventListener('click', async () => {
    bouton.disabled = true;
    etat.textContent = 'Publication en cours…';
    const { data, error } = await supabase.functions.invoke('rebuild', { method: 'POST' });
    bouton.disabled = false;
    if (error) {
      // Message renvoyé par la fonction (refus, hook absent…) si disponible
      let message = 'Publication impossible, réessayez dans quelques minutes.';
      const contexte = (error as { context?: Response }).context;
      if (contexte && typeof contexte.json === 'function') {
        const corps = (await contexte.json().catch(() => null)) as { message?: string } | null;
        if (corps?.message) message = corps.message;
      }
      await actualiserPublication();
      // Les échecs enregistrés par la fonction figurent déjà dans « Dernière tentative »
      if (!(etat.textContent ?? '').includes(message)) etat.textContent = `${message} ${etat.textContent ?? ''}`;
      return;
    }
    ecrireDrapeau(false);
    await actualiserPublication();
    const message = (data as { message?: string } | null)?.message;
    if (message) etat.textContent = `${message} ${etat.textContent ?? ''}`;
  });
  void actualiserPublication();
}
