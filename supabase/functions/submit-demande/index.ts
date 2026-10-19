// Edge Function submit-demande : réception des formulaires de contact et de devis.
//
// 1. CORS limité aux origines de ORIGINE_AUTORISEE (liste séparée par des virgules).
// 2. Champ piège rempli : réponse « succès » sans rien enregistrer.
// 3. Validation serveur (cahier des charges, section 5 « Champs des formulaires »).
// 4. Limite de 3 envois par heure et par IP (adresse hachée avec IP_HASH_SEL, jamais stockée en clair).
// 5. Pièce jointe : type (déclaré et signature binaire) et taille contrôlés, dépôt dans « pieces-jointes ».
// 6. Insertion dans « demandes » avec la clé service_role (le public n'a aucun droit direct).
// 7. Email de notification et accusé de réception via Resend (un échec d'envoi n'annule pas la demande).

import { createClient } from 'npm:@supabase/supabase-js@2';

const POLES = ['consulting', 'distribution', 'technologie', 'groupe'] as const;
type Pole = (typeof POLES)[number];

const NOM_POLE: Record<Pole, string> = {
  consulting: 'Madal Consulting',
  distribution: 'Madal Distribution',
  technologie: 'Madal Technologie',
  groupe: 'MADAL GROUP',
};

const LIMITE_PAR_HEURE = 3;
const TAILLE_MAX = 5 * 1024 * 1024;

// Types acceptés : type déclaré, extension enregistrée et premiers octets attendus
const TYPES_FICHIER: Record<string, { extension: string; signature: number[] }> = {
  'application/pdf': { extension: 'pdf', signature: [0x25, 0x50, 0x44, 0x46] },
  'image/jpeg': { extension: 'jpg', signature: [0xff, 0xd8, 0xff] },
  'image/png': { extension: 'png', signature: [0x89, 0x50, 0x4e, 0x47] },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    extension: 'docx',
    signature: [0x50, 0x4b, 0x03, 0x04],
  },
};

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

/** Texte d'un champ, espaces de début et de fin retirés. */
function texte(donnees: FormData, nom: string): string {
  const valeur = donnees.get(nom);
  return typeof valeur === 'string' ? valeur.trim() : '';
}

/**
 * Téléphone ivoirien : 10 chiffres, indicatif +225 ou 00225 accepté.
 * Renvoie le numéro normalisé « 07 87 45 76 18 », ou null s'il est invalide.
 */
function normaliserTelephone(saisie: string): string | null {
  let chiffres = saisie.replace(/[\s.\-()]/g, '');
  if (chiffres.startsWith('+225')) chiffres = chiffres.slice(4);
  else if (chiffres.startsWith('00225')) chiffres = chiffres.slice(5);
  if (!/^\d{10}$/.test(chiffres)) return null;
  return chiffres.replace(/(\d{2})(?=\d)/g, '$1 ');
}

const MOTIF_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function longueurEntre(valeur: string, min: number, max: number): boolean {
  const longueur = Array.from(valeur).length;
  return longueur >= min && longueur <= max;
}

async function hacherIp(ip: string): Promise<string> {
  const sel = Deno.env.get('IP_HASH_SEL') ?? '';
  const empreinte = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${sel}:${ip}`));
  return Array.from(new Uint8Array(empreinte), (octet) => octet.toString(16).padStart(2, '0')).join('');
}

function adresseIp(requete: Request): string {
  return (
    requete.headers.get('cf-connecting-ip') ??
    requete.headers.get('x-real-ip') ??
    requete.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'inconnue'
  );
}

function echapper(valeur: string): string {
  return valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function enBase64(octets: Uint8Array): string {
  let binaire = '';
  for (let i = 0; i < octets.length; i += 0x8000) {
    binaire += String.fromCharCode(...octets.subarray(i, i + 0x8000));
  }
  return btoa(binaire);
}

interface Demande {
  nom: string;
  telephone: string;
  email: string | null;
  pole: Pole;
  objet: string;
  description: string;
  page_origine: string | null;
}

interface PieceJointe {
  nom: string;
  octets: Uint8Array;
}

async function envoyerEmail(message: Record<string, unknown>): Promise<void> {
  const cle = Deno.env.get('RESEND_API_KEY');
  if (!cle) {
    console.warn('RESEND_API_KEY absente : email non envoyé.');
    return;
  }
  const reponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${cle}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: Deno.env.get('EMAIL_EXPEDITEUR'), ...message }),
  });
  if (!reponse.ok) {
    throw new Error(`Resend ${reponse.status} : ${await reponse.text()}`);
  }
}

function emailNotification(demande: Demande, id: string, pieceJointe: PieceJointe | null) {
  const lignes: [string, string][] = [
    ['Nom / entreprise', demande.nom],
    ['Téléphone', demande.telephone],
    ['Email', demande.email ?? 'non renseigné'],
    ['Département', NOM_POLE[demande.pole]],
    ['Objet', demande.objet],
    ['Page d’origine', demande.page_origine ?? 'non renseignée'],
    ['Pièce jointe', pieceJointe ? pieceJointe.nom : 'aucune'],
    ['Référence', id],
  ];
  const tableau = lignes
    .map(
      ([libelle, valeur]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;vertical-align:top">${echapper(libelle)}</th><td style="padding:4px 0">${echapper(valeur)}</td></tr>`,
    )
    .join('');
  const html = `<h2 style="margin:0 0 12px">Nouvelle demande — ${echapper(NOM_POLE[demande.pole])}</h2>
<table style="border-collapse:collapse">${tableau}</table>
<h3 style="margin:16px 0 8px">Description du besoin</h3>
<p style="white-space:pre-wrap;margin:0">${echapper(demande.description)}</p>`;
  const texteBrut = `${lignes.map(([libelle, valeur]) => `${libelle} : ${valeur}`).join('\n')}\n\nDescription du besoin :\n${demande.description}`;

  return {
    to: [Deno.env.get('EMAIL_NOTIFICATION') ?? 'madalgroup1@gmail.com'],
    subject: `[${NOM_POLE[demande.pole]}] ${demande.objet} — ${demande.nom}`,
    html,
    text: texteBrut,
    ...(demande.email ? { reply_to: demande.email } : {}),
    ...(pieceJointe ? { attachments: [{ filename: pieceJointe.nom, content: enBase64(pieceJointe.octets) }] } : {}),
  };
}

function emailAccuse(demande: Demande) {
  const html = `<p>Bonjour ${echapper(demande.nom)},</p>
<p>Nous avons bien reçu votre demande « ${echapper(demande.objet)} » adressée à ${echapper(NOM_POLE[demande.pole])}. Notre équipe vous recontacte dans les meilleurs délais.</p>
<p>Pour toute précision : 07 87 45 76 18 · 05 44 82 05 83 (appel ou WhatsApp).</p>
<p>MADAL GROUP SARL<br>Yopougon Camp Militaire – Abidjan, Côte d'Ivoire</p>`;
  const texteBrut = `Bonjour ${demande.nom},

Nous avons bien reçu votre demande « ${demande.objet} » adressée à ${NOM_POLE[demande.pole]}. Notre équipe vous recontacte dans les meilleurs délais.

Pour toute précision : 07 87 45 76 18 · 05 44 82 05 83 (appel ou WhatsApp).

MADAL GROUP SARL
Yopougon Camp Militaire – Abidjan, Côte d'Ivoire`;

  return {
    to: [demande.email],
    subject: 'Votre demande a bien été reçue — MADAL GROUP',
    html,
    text: texteBrut,
    reply_to: Deno.env.get('EMAIL_NOTIFICATION') ?? 'madalgroup1@gmail.com',
  };
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

  let donnees: FormData;
  try {
    donnees = await requete.formData();
  } catch {
    return repondre(400, { ok: false, message: 'Formulaire illisible.' }, origine);
  }

  // Champ piège : invisible pour un humain, rempli par les robots
  if (texte(donnees, 'site_web') !== '') {
    return repondre(200, { ok: true }, origine);
  }

  // ---------- Validation ----------
  const erreurs: Record<string, string> = {};

  const nom = texte(donnees, 'nom');
  if (!longueurEntre(nom, 2, 100)) erreurs.nom = 'Indiquez votre nom ou celui de votre entreprise (2 à 100 caractères).';

  const telephone = normaliserTelephone(texte(donnees, 'telephone'));
  if (telephone === null) erreurs.telephone = 'Indiquez un numéro ivoirien à 10 chiffres (ex. 07 87 45 76 18).';

  const emailSaisi = texte(donnees, 'email');
  if (emailSaisi !== '' && (emailSaisi.length > 254 || !MOTIF_EMAIL.test(emailSaisi))) {
    erreurs.email = 'Adresse email invalide.';
  }

  const poleSaisi = texte(donnees, 'pole');
  const pole = POLES.find((valeur) => valeur === poleSaisi);
  if (!pole) erreurs.pole = 'Choisissez le département concerné.';

  const objet = texte(donnees, 'objet');
  if (!longueurEntre(objet, 3, 150)) erreurs.objet = 'Indiquez l’objet de votre demande (3 à 150 caractères).';

  const description = texte(donnees, 'description');
  if (!longueurEntre(description, 20, 2000)) {
    erreurs.description = 'Décrivez votre besoin (20 à 2 000 caractères).';
  }

  if (texte(donnees, 'consentement') !== 'oui') {
    erreurs.consentement = 'Votre accord est nécessaire pour traiter la demande.';
  }

  let pieceJointe: (PieceJointe & { type: string; extension: string }) | null = null;
  const fichier = donnees.get('piece_jointe');
  if (fichier instanceof File && fichier.size > 0) {
    const format = TYPES_FICHIER[fichier.type];
    if (fichier.size > TAILLE_MAX) {
      erreurs.piece_jointe = 'Le fichier dépasse 5 Mo.';
    } else if (!format) {
      erreurs.piece_jointe = 'Formats acceptés : PDF, JPG, PNG, DOCX.';
    } else {
      const octets = new Uint8Array(await fichier.arrayBuffer());
      const signatureValide = format.signature.every((octet, index) => octets[index] === octet);
      if (!signatureValide) {
        erreurs.piece_jointe = 'Le contenu du fichier ne correspond pas à son format.';
      } else {
        const nomFichier = fichier.name.replace(/[^\p{L}\p{N}._ -]/gu, '_').slice(0, 120) || `piece-jointe.${format.extension}`;
        pieceJointe = { nom: nomFichier, octets, type: fichier.type, extension: format.extension };
      }
    }
  }

  if (Object.keys(erreurs).length > 0 || !pole || telephone === null) {
    return repondre(422, { ok: false, message: 'Certains champs sont à corriger.', erreurs }, origine);
  }

  // ---------- Limite d'envois ----------
  const ipHash = await hacherIp(adresseIp(requete));
  const depuis = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: erreurComptage } = await supabase
    .from('demandes')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('cree_le', depuis);
  if (erreurComptage) {
    console.error('Comptage des envois impossible :', erreurComptage.message);
    return repondre(500, { ok: false, message: 'Erreur du serveur, réessayez plus tard.' }, origine);
  }
  if ((count ?? 0) >= LIMITE_PAR_HEURE) {
    return repondre(
      429,
      { ok: false, message: 'Vous avez déjà envoyé plusieurs demandes. Réessayez dans une heure ou écrivez-nous sur WhatsApp.' },
      origine,
    );
  }

  // ---------- Pièce jointe ----------
  const id = crypto.randomUUID();
  let cheminPiece: string | null = null;
  if (pieceJointe) {
    const mois = new Date().toISOString().slice(0, 7);
    cheminPiece = `${mois}/${id}.${pieceJointe.extension}`;
    const { error: erreurDepot } = await supabase.storage
      .from('pieces-jointes')
      .upload(cheminPiece, pieceJointe.octets, { contentType: pieceJointe.type, upsert: false });
    if (erreurDepot) {
      console.error('Dépôt de la pièce jointe impossible :', erreurDepot.message);
      return repondre(500, { ok: false, message: 'La pièce jointe n’a pas pu être enregistrée.' }, origine);
    }
  }

  // ---------- Enregistrement ----------
  const pageOrigine = texte(donnees, 'page_origine').slice(0, 300) || null;
  const demande: Demande = {
    nom,
    telephone,
    email: emailSaisi === '' ? null : emailSaisi,
    pole,
    objet,
    description,
    page_origine: pageOrigine,
  };

  const { error: erreurInsertion } = await supabase
    .from('demandes')
    .insert({ id, ...demande, piece_jointe_path: cheminPiece, consentement: true, ip_hash: ipHash });
  if (erreurInsertion) {
    console.error('Insertion de la demande impossible :', erreurInsertion.message);
    if (cheminPiece) await supabase.storage.from('pieces-jointes').remove([cheminPiece]);
    return repondre(500, { ok: false, message: 'Erreur du serveur, réessayez plus tard.' }, origine);
  }

  // ---------- Emails (la demande est déjà enregistrée) ----------
  const envois = [envoyerEmail(emailNotification(demande, id, pieceJointe))];
  if (demande.email) envois.push(envoyerEmail(emailAccuse(demande)));
  const resultats = await Promise.allSettled(envois);
  resultats.forEach((resultat) => {
    if (resultat.status === 'rejected') console.error('Email non envoyé :', resultat.reason);
  });

  return repondre(200, { ok: true }, origine);
});
