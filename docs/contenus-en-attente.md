# Contenus en attente et points ouverts

Tant qu'une ligne n'est pas cochée, le site affiche `[À FOURNIR : …]` à l'endroit concerné. Ne rien inventer.

## Contenus à fournir

| Fait | Contenu | Utilisé sur | Format attendu |
| --- | --- | --- | --- |
| [ ] | Logo officiel à plat | Toutes les pages | SVG ou PNG fond transparent, versions fond clair et fond foncé |
| [ ] | Logo Madal RH sans filigrane | Accueil, /consulting, fiche Madal RH | SVG ou PNG |
| [ ] | Textes des 5 services Consulting | /consulting | 2 lignes par service |
| [ ] | Offres Consulting : nom, prestations, tarif, périodicité | /consulting | Saisie dans /admin |
| [ ] | Textes des 9 services Technologie | /technologie | 2 lignes par service |
| [ ] | Catalogue Distribution : conditionnements et prix des 10 produits pré-remplis le 19/10/2026 (migration `0004`, « Prix sur demande »), autres produits | /distribution | Saisie dans /admin |
| [ ] | Texte et visuel Allô Lapins & Volailles by MG | /distribution | Logo + 3 lignes |
| [ ] | Fiche BMVT GESTION PRO : problème traité, fonctionnalités, captures | /solutions/bmvt-gestion-pro | Texte + 3 captures |
| [ ] | Fiche Madal RH : problème traité, fonctionnalités, captures | /solutions/madal-rh | Texte + 3 captures |
| [ ] | 3 premiers articles du Mag (un par pôle) | /mag | Saisie dans /admin |
| [ ] | Nom du gérant (directeur de la publication) ; RCCM, compte contribuable, capital et siège social reçus le 19/10/2026 | /mentions-legales | Texte |
| [ ] | Position exacte des locaux (lien Google Maps) ; en attendant, carte et itinéraire cherchent l'adresse « Yopougon Camp Militaire – Abidjan » (`src/lib/coordonnees.ts`) | /contact | URL |

## Points ouverts

| N° | Question | Valeur utilisée en attendant |
| --- | --- | --- |
| 1 | Signature officielle : « STRUCTURER • DISTRIBUER • INNOVER » (brief) ou « Plus qu'une entreprise, une référence » (enseigne) ? | La première dans le hero et le pied de page ; la seconde en titre de la section « Pourquoi MADAL GROUP » |
| 2 | Quelle version du symbole fait foi (blanc et vert, ou deux verts) ? | `src/assets/images/logo-disque.jpg`, recadrage provisoire du sceau |
| 3 | Les visuels fournis (façade, bureaux, équipe) sont-ils les photos définitives ? | Utilisés tels quels |
| 4 | Ordre des sections de /consulting : le bloc « Nos offres » a été déplacé tout en haut dans la maquette en ligne | Ordre du cahier des charges (offres après la méthode) |
| 5 | /distribution : le bandeau « Promotions » est 5e dans le cahier des charges ; un bandeau se lit mieux en haut de page | Placé juste sous le hero (masqué tant qu'aucune promotion n'est en cours) |
| 6 | Textes des méthodes : /technologie n'a que les noms des 5 étapes (cadrage, maquette, développement, déploiement, maintenance) | Descriptions affichées en `[À FOURNIR]` |
| 7 | Photos de banque d'images (`src/assets/images/poles/`) utilisées pour illustrer les services et les familles de produits | Hors hero uniquement ; heros Distribution et Technologie typographiques, hero Consulting avec la photo réelle de l'équipe |
| 8 | Siège social (« Yopougon Petit Toit Rouge, carrefour ancienne pharmacie Noya ») différent des locaux (Camp Militaire) | Siège dans les mentions légales et la politique de confidentialité ; Camp Militaire partout ailleurs (décision du 19/10/2026) |
| 9 | Politique de confidentialité : durée de conservation des demandes et délai de réponse aux demandes d'accès | 3 ans après le dernier échange ; réponse sous un mois (à valider) |
| 10 | Déclaration du traitement « demandes de contact » auprès de l'ARTCI (loi n° 2013-450) | À vérifier par MADAL GROUP avant la mise en ligne |

## Images disponibles

| Fichier (`src/assets/images/`) | Contenu | Usage dans les maquettes |
| --- | --- | --- |
| `logo-disque.jpg` | Symbole MADAL GROUP sur disque gris (provisoire) | En-tête, pied de page (affiché en rond) |
| `logo-sceau.jpg` | Sceau complet avec slogan | Non utilisé ; réserve pour la page Le Groupe |
| `facade.jpg` | Façade du siège avec les bâtiments voisins (original) | Non utilisé |
| `facade-madal.jpg` | Façade recadrée sur le seul bâtiment MADAL GROUP | Hero de l'accueil |
| `partage-accueil.jpg` | Enseigne du siège au format 1200 × 630 | Image de partage par défaut (WhatsApp, Facebook) |
| `equipe.jpg` | Bureau, deux collaboratrices | Section Pourquoi, hero Consulting |
| `bureau-direction.jpg` | Bureau de direction | Réserve pour la page Le Groupe |
| `accueil-reception.jpg` | Banque d'accueil | Réserve pour la page Contact |
| `abidjan.jpg` | Vue aérienne d'Abidjan | Fond du bloc d'appel à l'action |
| `madal-rh.jpg` | Logo Madal RH (recadré, provisoire) | Carte solution, encart /consulting |

### Photos des pôles (`src/assets/images/poles/`, reçues le 17/10/2026)

Photos de banque d'images, de faible définition (≈ 600 px de large). Le cahier des charges exclut la banque d'images du hero : elles servent aux cartes et aux sections intérieures. Demander si possible les originaux en haute définition et des photos réelles des activités.

| Dossier | Fichiers | Usage |
| --- | --- | --- |
| `consulting/` | 13 photos : réunions, comptabilité, analyse financière, entretien conseil, dirigeants sous pression | `conseillere-entretien.jpg` : carte du pôle (accueil, Le Groupe) ; le reste pour /consulting (phase 3) |
| `distribution/` | 11 photos produits : lapin, poulets de chair, pondeuses, ailes, blancs, gésiers, caille, canard, dinde, viande de bœuf, rôti | `poules-pondeuses.jpg` : carte du pôle ; le reste pour /distribution et le catalogue. `dinde.jpg` est très petite (250 px) |
| `technologie/` | 17 photos : développeurs, maintenance, réseaux, fibre, serveurs, électronique, IA | `developpeurs.jpg` : carte du pôle ; le reste pour /technologie (phase 3) |

Écartées (restées dans le dossier `image/`, non versionné) :

- `Consulting/images (1).jpg` : filigrane 123RF (photo sous licence payante).
- `Consulting/images (2).jpg` : image générée contenant du texte inventé (« Dakar », pourcentages).
- `Technologie/images.jpg` : image générée avec des chiffres inventés (score de crédit, montant en euros).
- `distribution/WhatsApp Image … 10.35.37 (3).jpeg` : doublon de `lapin frais.jpeg`.
- `Technologie/WhatsApp Image … 10.35.45.jpeg` : quasi-doublon de `appareils-connectes.jpg`.

Droits : vérifier que chaque photo peut être utilisée commercialement (licence achetée ou libre de droits) avant la mise en ligne.
