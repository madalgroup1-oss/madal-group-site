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

/** LocalBusiness : page Contact (locaux où recevoir les clients). */
export function etablissement(urlImage: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'MADAL GROUP',
    legalName: RAISON_SOCIALE,
    url: `${URL_SITE}/contact`,
    image: urlImage,
    email: EMAIL,
    telephone: TELEPHONES[0].lien.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADRESSE.split(' – ')[0],
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    areaServed: { '@type': 'Country', name: "Côte d'Ivoire" },
    parentOrganization: { '@type': 'Organization', name: RAISON_SOCIALE, url: URL_SITE },
  };
}

/** Sérialise un objet JSON-LD sans permettre de fermer la balise <script>. */
export function jsonLd(donnees: Record<string, unknown>): string {
  return JSON.stringify(donnees).replace(/</g, '\\u003c');
}

export interface EtapeAriane {
  libelle: string;
  /** Chemin absolu de la page ; absent pour la page courante. */
  href?: string;
}

/** BreadcrumbList : fil d'Ariane des fiches et articles. */
export function filAriane(etapes: EtapeAriane[], cheminCourant: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: etapes.map((etape, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: etape.libelle,
      item: new URL(etape.href ?? cheminCourant, URL_SITE).href,
    })),
  };
}

/** Article : pages du Mag MADAL. */
export function article(donnees: {
  titre: string;
  resume: string;
  chemin: string;
  publieLe: string | null;
  modifieLe: string;
  urlImage?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: donnees.titre,
    description: donnees.resume,
    mainEntityOfPage: new URL(donnees.chemin, URL_SITE).href,
    ...(donnees.publieLe ? { datePublished: donnees.publieLe } : {}),
    dateModified: donnees.modifieLe,
    ...(donnees.urlImage ? { image: donnees.urlImage } : {}),
    author: { '@type': 'Organization', name: 'MADAL GROUP', url: URL_SITE },
    publisher: { '@type': 'Organization', name: RAISON_SOCIALE, url: URL_SITE },
  };
}
