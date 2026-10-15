// Coordonnées officielles de MADAL GROUP SARL (cahier des charges, section 4.8)

export const RAISON_SOCIALE = 'MADAL GROUP SARL';
// Espaces insécables avant les puces : une puce ne commence jamais une ligne
export const SIGNATURE = 'STRUCTURER • DISTRIBUER • INNOVER';
export const ACCROCHE = 'Un groupe, trois expertises, une même ambition.';

export const ADRESSE = 'Yopougon Camp Militaire – Abidjan';
export const PAYS = "Côte d'Ivoire";

export const TELEPHONES = [
  { affiche: '07 87 45 76 18', lien: 'tel:+2250787457618' },
  { affiche: '05 44 82 05 83', lien: 'tel:+2250544820583' },
] as const;

export const EMAIL = 'madalgroup1@gmail.com';

/** Numéro WhatsApp au format international, sans « + » ni espace. */
export const WHATSAPP = import.meta.env.PUBLIC_WHATSAPP || '2250787457618';

/**
 * Lien WhatsApp avec un message pré-rempli indiquant la page d'origine.
 * @param page nom lisible de la page (ex. « Accueil », « Madal Consulting »)
 */
export function lienWhatsApp(page: string): string {
  const message = `Bonjour MADAL GROUP, je vous écris depuis la page « ${page} » du site madalgroup.ci.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
