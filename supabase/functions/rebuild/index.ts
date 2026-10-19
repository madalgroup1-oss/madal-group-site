// Edge Function rebuild : bouton « Publier sur le site » de /admin.
//
// 1. CORS limité aux origines de ORIGINE_AUTORISEE.
// 2. Jeton de session vérifié (Supabase Auth) puis appartenance à la table admins.
// 3. Une publication au plus par minute.
// 4. Appel du deploy hook Cloudflare Pages (secret CLOUDFLARE_DEPLOY_HOOK, jamais exposé
//    au navigateur) et enregistrement du résultat dans la table publications.

import { createClient } from 'npm:@supabase/supabase-js@2';

const DELAI_MINIMUM_MS = 60 * 1000;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const ORIGINES = (Deno.env.get('ORIGINE_AUTORISEE') ?? '')
  .split(',')
  .map((origine) => origine.trim())
  .filter((origine) => origine !== '');

function entetesCors(origine: string | null): Record<string, string> {
  const entetes: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origine !== null && ORIGINES.includes(origine)) {
    entetes['Access-Control-Allow-Origin'] = origine;
  }
  return entetes;
}

function repondre(statut: number, corps: unknown, origine: string | null): Response {
  return new Response(JSON.stringify(corps), {
    status: statut,
    headers: { ...entetesCors(origine), 'Content-Type': 'application/json; charset=utf-8' },
  });
}

async function enregistrer(utilisateur: string, reussie: boolean, message: string): Promise<void> {
  const { error } = await supabase
    .from('publications')
    .insert({ demandee_par: utilisateur, reussie, message });
  if (error) console.error('Enregistrement de la publication impossible :', error.message);
}

Deno.serve(async (requete) => {
  const origine = requete.headers.get('origin');

  if (requete.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: entetesCors(origine) });
  }
  if (requete.method !== 'POST') {
    return repondre(405, { ok: false, message: 'Méthode non autorisée.' }, origine);
  }
  if (origine === null || !ORIGINES.includes(origine)) {
    return repondre(403, { ok: false, message: 'Origine non autorisée.' }, origine);
  }

  // ---------- Administrateur connecté ----------
  const jeton = (requete.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (jeton === '') {
    return repondre(401, { ok: false, message: 'Connexion requise.' }, origine);
  }
  const { data: session, error: erreurSession } = await supabase.auth.getUser(jeton);
  if (erreurSession || !session.user) {
    return repondre(401, { ok: false, message: 'Session expirée : reconnectez-vous.' }, origine);
  }
  const utilisateur = session.user.id;

  const { data: admin, error: erreurAdmin } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', utilisateur)
    .maybeSingle();
  if (erreurAdmin) {
    console.error('Lecture des administrateurs impossible :', erreurAdmin.message);
    return repondre(500, { ok: false, message: 'Erreur du serveur, réessayez plus tard.' }, origine);
  }
  if (!admin) {
    return repondre(403, { ok: false, message: 'Ce compte n’est pas administrateur.' }, origine);
  }

  // ---------- Une publication par minute au plus ----------
  const { data: derniere } = await supabase
    .from('publications')
    .select('demandee_le')
    .eq('reussie', true)
    .order('demandee_le', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (derniere && Date.now() - new Date(derniere.demandee_le).getTime() < DELAI_MINIMUM_MS) {
    return repondre(
      429,
      { ok: false, message: 'Une publication vient d’être lancée : attendez une minute avant de recommencer.' },
      origine,
    );
  }

  // ---------- Deploy hook Cloudflare Pages ----------
  const hook = Deno.env.get('CLOUDFLARE_DEPLOY_HOOK');
  if (!hook) {
    const message = 'Publication non configurée (deploy hook Cloudflare absent).';
    await enregistrer(utilisateur, false, message);
    return repondre(503, { ok: false, message }, origine);
  }

  try {
    const reponse = await fetch(hook, { method: 'POST' });
    if (!reponse.ok) {
      const message = `Cloudflare a refusé la publication (code ${reponse.status}).`;
      console.error(message, await reponse.text());
      await enregistrer(utilisateur, false, message);
      return repondre(502, { ok: false, message }, origine);
    }
  } catch (erreur) {
    const message = 'Cloudflare injoignable, réessayez dans quelques minutes.';
    console.error(message, erreur);
    await enregistrer(utilisateur, false, message);
    return repondre(502, { ok: false, message }, origine);
  }

  const message = 'Publication lancée : le site sera à jour dans quelques minutes.';
  await enregistrer(utilisateur, true, message);
  return repondre(200, { ok: true, message }, origine);
});
