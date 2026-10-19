// Coordonnées officielles de MADAL GROUP SARL (cahier des charges, section 4.8)

export const RAISON_SOCIALE = 'MADAL GROUP SARL';
// Espaces insécables avant les puces : une puce ne commence jamais une ligne
export const SIGNATURE = 'STRUCTURER • DISTRIBUER • INNOVER';
export const ACCROCHE = 'Un groupe, trois expertises, une même ambition.';

/** Locaux où recevoir les clients (contact, carte, pied de page). */
export const ADRESSE = 'Yopougon Camp Militaire – Abidjan';
export const PAYS = "Côte d'Ivoire";

export const TELEPHONES = [
  { affiche: '07 87 45 76 18', lien: 'tel:+2250787457618' },
  { affiche: '05 44 82 05 83', lien: 'tel:+2250544820583' },
] as const;

export const EMAIL = 'madalgroup1@gmail.com';

// Informations légales (en-tête officiel de MADAL GROUP SARL, fourni le 19/10/2026).
// Le siège social diffère des locaux : il n'apparaît que dans les mentions légales.
export const FORME_JURIDIQUE = 'Société à responsabilité limitée (SARL)';
export const CAPITAL = '1 000 000 FCFA';
export const SIEGE_SOCIAL = 'Yopougon Petit Toit Rouge, carrefour ancienne pharmacie Noya – Abidjan';
export const BOITE_POSTALE = '05 BP 2008 Abidjan 05';
export const RCCM = 'CI-ABJ-03-2024-B13-00374';
export const COMPTE_CONTRIBUABLE = '240 0148 C';

// Carte et itinéraire : recherche de l'adresse en attendant le lien Google Maps exact
// des locaux (docs/contenus-en-attente.md).
const RECHERCHE_CARTE = encodeURIComponent(`${ADRESSE}, ${PAYS}`);
export const CARTE_INTEGREE = `https://www.google.com/maps?q=${RECHERCHE_CARTE}&output=embed`;
export const ITINERAIRE = `https://www.google.com/maps/dir/?api=1&destination=${RECHERCHE_CARTE}`;

/** Numéro WhatsApp au format international, sans « + » ni espace. */
export const WHATSAPP = import.meta.env.PUBLIC_WHATSAPP || '2250787457618';

/**
 * Lien WhatsApp avec un message pré-rempli indiquant la page d'origine.
 * @param page nom lisible de la page (ex. « Accueil », « Madal Consulting »)
 * @param demande précision ajoutée au message (ex. « Je souhaite commander : Lapin frais. »)
 */
export function lienWhatsApp(page: string, demande?: string): string {
  const message = `Bonjour MADAL GROUP, je vous écris depuis la page « ${page} » du site madalgroup.ci.${
    demande ? ` ${demande}` : ''
  }`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/** Lien vers la demande de devis, pôle pré-sélectionné (formulaire de la phase 4). */
export function lienDevis(pole: 'consulting' | 'distribution' | 'technologie' | 'groupe', objet?: string): string {
  const parametres = new URLSearchParams({ pole });
  if (objet) parametres.set('objet', objet);
  return `/devis?${parametres.toString()}`;
}
