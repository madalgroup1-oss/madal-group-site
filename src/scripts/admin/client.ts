// Client Supabase de /admin : clé publique, session de l'administrateur conservée dans le
// navigateur. Les droits d'écriture viennent uniquement de la RLS (fonction est_admin()).
//
// Client volontairement non typé : les rubriques génériques (rubriques.ts) écrivent dans
// plusieurs tables à partir d'une même définition de champs.

import { createClient } from '@supabase/supabase-js';

export const URL_SUPABASE = import.meta.env.PUBLIC_SUPABASE_URL ?? '';

export const supabase = createClient(URL_SUPABASE, import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

/** URL publique d'un fichier du bucket « media » (aperçus dans /admin). */
export function urlMedia(chemin: string): string {
  const segments = chemin.split('/').map(encodeURIComponent).join('/');
  return `${URL_SUPABASE}/storage/v1/object/public/media/${segments}`;
}

/** Message lisible pour une erreur Supabase. */
export function messageErreur(erreur: { message?: string; code?: string } | null | undefined): string {
  if (!erreur) return 'Erreur inconnue.';
  if (erreur.code === '23505') return 'Cette adresse (slug) est déjà utilisée : choisissez-en une autre.';
  if (erreur.code === '42501') return 'Action refusée : ce compte n’a pas les droits d’administration.';
  if (erreur.code === '23503') return 'Élément encore utilisé ailleurs : impossible de le supprimer.';
  if (erreur.code === '23514') return 'Une valeur ne respecte pas les règles (longueur, montant…).';
  if (/fetch|network/i.test(erreur.message ?? '')) return 'Connexion impossible : vérifiez Internet et réessayez.';
  return erreur.message ?? 'Erreur inconnue.';
}
