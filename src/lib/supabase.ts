// Lecture des contenus Supabase au moment du build (clé publique, rôle anon).
// La RLS ne renvoie que les lignes publiées ou visibles : aucun filtre de
// publication n'est à refaire ici, seulement l'ordre d'affichage.
//
// Une erreur de lecture fait échouer le build : mieux vaut garder en ligne la
// version précédente du site que publier des pages vides.

import { createClient } from '@supabase/supabase-js';
import type { Database, Tables } from './database.types';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const cle = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !cle) {
  throw new Error(
    'PUBLIC_SUPABASE_URL et PUBLIC_SUPABASE_ANON_KEY doivent être définies (voir .env.example).',
  );
}

export const supabase = createClient<Database>(url, cle, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type Solution = Tables<'solutions'>;
export type Article = Tables<'articles'>;
export type Offre = Tables<'offres_consulting'>;
export type FamilleProduits = Tables<'familles_produits'>;
export type Promotion = Tables<'promotions'>;
export type Produit = Tables<'produits'> & {
  famille: Pick<FamilleProduits, 'nom' | 'slug' | 'ordre'> | null;
};

// Plusieurs pages lisent les mêmes tables pendant un build : une seule requête par lecture.
const cache = new Map<string, Promise<unknown>>();

function memoriser<T>(cleCache: string, lecture: () => Promise<T>): Promise<T> {
  if (!cache.has(cleCache)) cache.set(cleCache, lecture());
  return cache.get(cleCache) as Promise<T>;
}

function verifier<T>(
  reponse: { data: T | null; error: { message: string } | null },
  quoi: string,
): T {
  if (reponse.error) {
    throw new Error(`Supabase : lecture des ${quoi} impossible (${reponse.error.message}).`);
  }
  if (reponse.data === null) {
    throw new Error(`Supabase : lecture des ${quoi} sans résultat.`);
  }
  return reponse.data;
}

/** Solutions publiées, dans l'ordre choisi par l'administrateur. */
export function listerSolutions(options: { miseEnAvant?: boolean } = {}): Promise<Solution[]> {
  return memoriser(`solutions:${options.miseEnAvant === true}`, async () => {
    let requete = supabase.from('solutions').select('*').order('ordre').order('nom');
    if (options.miseEnAvant === true) requete = requete.eq('mise_en_avant', true);
    return verifier(await requete, 'solutions');
  });
}

/** Articles publiés, du plus récent au plus ancien. */
export function listerArticles(limite?: number): Promise<Article[]> {
  return memoriser(`articles:${limite ?? 'tous'}`, async () => {
    let requete = supabase
      .from('articles')
      .select('*')
      .order('publie_le', { ascending: false });
    if (limite !== undefined) requete = requete.limit(limite);
    return verifier(await requete, 'articles');
  });
}

/** Offres Consulting visibles. */
export function listerOffres(): Promise<Offre[]> {
  return memoriser('offres', async () =>
    verifier(await supabase.from('offres_consulting').select('*').order('ordre'), 'offres'),
  );
}

/** Familles de produits, dans l'ordre d'affichage. */
export function listerFamilles(): Promise<FamilleProduits[]> {
  return memoriser('familles', async () =>
    verifier(await supabase.from('familles_produits').select('*').order('ordre'), 'familles'),
  );
}

/** Produits visibles, avec leur famille. */
export function listerProduits(): Promise<Produit[]> {
  return memoriser('produits', async () =>
    verifier(
      await supabase
        .from('produits')
        .select('*, famille:familles_produits(nom, slug, ordre)')
        .order('ordre')
        .order('nom'),
      'produits',
    ),
  );
}

/** Promotions en cours le jour du build (la RLS filtre déjà les dates). */
export function promotionsEnCours(): Promise<Promotion[]> {
  return memoriser('promotions', async () =>
    verifier(
      await supabase.from('promotions').select('*').order('date_fin'),
      'promotions',
    ),
  );
}

/** URL publique d'un fichier du bucket « media ». */
export function urlMedia(chemin: string): string {
  const segments = chemin.split('/').map(encodeURIComponent).join('/');
  return `${url}/storage/v1/object/public/media/${segments}`;
}
