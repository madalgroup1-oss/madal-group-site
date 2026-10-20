# Rapport de recette — www.madalgroup.ci

Critères du cahier des charges (section 8). « Local » : vérifié sur le site généré (`npm run build` puis `npm run preview`) le 19/10/2026. « En ligne » : à refaire sur www.madalgroup.ci après la mise en ligne (`docs/mise-en-ligne.md`).

## Scores Lighthouse (mobile, local, 19/10/2026)

Lighthouse 12.8.2, émulation mobile par défaut (Moto G Power, réseau 4G lent simulé).

| Page | Performance | Accessibilité | Bonnes pratiques | SEO | Poids |
| --- | --- | --- | --- | --- | --- |
| / (accueil) | 97 | 100 | 100 | 100 | 243 Ko |
| /le-groupe | 99 | 100 | 100 | 100 | 189 Ko |
| /consulting | 97 | 100 | 100 | 100 | 271 Ko |
| /distribution | 99 | 100 | 100 | 100 | 306 Ko |
| /technologie | 99 | 100 | 100 | 100 | 364 Ko |
| /solutions | 99 | 100 | 100 | 100 | 202 Ko |
| /solutions/madal-rh | 99 | 100 | 100 | 100 | 194 Ko |
| /mag | 99 | 100 | 100 | 100 | 181 Ko |
| /contact | 99 | 100 | 100 | 100 | 136 Ko |
| /devis | 99 | 100 | 100 | 100 | 118 Ko |
| /mentions-legales | 99 | 100 | 100 | 100 | 180 Ko |
| /confidentialite | 99 | 100 | 100 | 100 | 181 Ko |

Objectifs : ≥ 90 sur chaque catégorie, accueil ≤ 1 Mo. **Atteints.** Le premier passage donnait 96 en accessibilité sur l'accueil : les mots du manifeste encore éteints étaient trop pâles. Ils sont maintenant en gris secondaire (contraste AA).

## Critères de recette

| Critère | Local | En ligne |
| --- | --- | --- |
| Les 11 gabarits s'affichent correctement à 360, 768 et 1 440 px | Fait (captures à chaque phase) | 15 pages en code 200, un seul `<h1>` chacune, aucune erreur console, images chargées (20/10/2026) ; 360 et 768 px à confirmer sur téléphone |
| Chaque formulaire enregistre la demande, envoie l'email et affiche la confirmation | Fait (phase 4 : notification et accusé reçus sur madalgroup1@gmail.com) | Fonction en ligne testée le 20/10/2026 : demande enregistrée, notification et accusé livrés ; à refaire depuis /contact, /devis et une page de pôle sur téléphone |
| Pièce jointe de plus de 5 Mo ou d'un type non autorisé refusée avec un message clair | Fait (navigateur et serveur ; faux PDF refusé) | Fait le 20/10/2026 : faux PDF et fichier de 6 Mo refusés par le serveur |
| Limite de 3 envois par heure et par adresse | Fait (4e envoi refusé, code 429) | — |
| Boutons WhatsApp, Appeler, Email et Itinéraire ouvrent la bonne application sur Android et iPhone | — | À faire sur deux téléphones |
| /admin : connexion, modification d'un prix, brouillon d'article | Fait (recette de MADAL GROUP, 19/10/2026) | Connexion et affichage vérifiés par MADAL GROUP le 20/10/2026 ; modification d'un prix à faire |
| « Publier sur le site » met le site à jour en moins de 5 minutes | — | À faire (deploy hook requis) |
| Promotion échue retirée la nuit suivante | — | À faire (workflow « Republication nocturne ») |
| Formulaires refusés depuis une autre origine que www.madalgroup.ci | — | Fait le 20/10/2026 (`ORIGINE_AUTORISEE`) |
| /admin absent du menu et du sitemap, `noindex` | Fait | Fait : `X-Robots-Tag: noindex, nofollow`, absent du sitemap, `Disallow: /admin` |
| Page 404 personnalisée | Fait (code 404) | Fait (code 404) |
| Données structurées : Organization (accueil), LocalBusiness (contact), Article (Mag), fil d'Ariane | Fait | Tester avec l'outil « Résultats enrichis » de Google |
| En-têtes de sécurité (CSP, HSTS, X-Content-Type-Options…) | Fichier `public/_headers` | En-têtes présents en ligne (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) |
| Emails envoyés depuis noreply@madalgroup.ci, accusé reçu par un visiteur | — | Fait le 20/10/2026 : domaine vérifié, accusé livré à une adresse externe |

## Tests sur téléphones (en ligne)

| Appareil | Navigateur | Résultat |
| --- | --- | --- |
| Android (à préciser) | Chrome | À faire |
| iPhone (à préciser) | Safari | À faire |
