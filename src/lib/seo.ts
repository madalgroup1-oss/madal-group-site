// Données structurées JSON-LD (schema.org)
import { ACCROCHE, ADRESSE, EMAIL, RAISON_SOCIALE, TELEPHONES } from './coordonnees';

const URL_SITE = 'https://www.madalgroup.ci';

/** Organization : page d'accueil. `urlLogo` est l'URL absolue du logo optimisé. */
export function organisation(urlLogo: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MADAL GROUP',
    legalName: RAISON_SOCIALE,
    url: URL_SITE,
    logo: urlLogo,
    slogan: ACCROCHE,
    email: EMAIL,
    telephone: TELEPHONES.map((telephone) => telephone.lien.replace('tel:', '')),
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADRESSE.split(' – ')[0],
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    department: [
      { '@type': 'Organization', name: 'Madal Consulting', url: `${URL_SITE}/consulting` },
      { '@type': 'Organization', name: 'Madal Distribution', url: `${URL_SITE}/distribution` },
      { '@type': 'Organization', name: 'Madal Technologie', url: `${URL_SITE}/technologie` },
    ],
  };
}

/** Sérialise un objet JSON-LD sans permettre de fermer la balise <script>. */
export function jsonLd(donnees: Record<string, unknown>): string {
  return JSON.stringify(donnees).replace(/</g, '\\u003c');
}
