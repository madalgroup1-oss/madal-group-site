# Plan de développement

Sept phases. Une phase = une branche = une PR. Ne pas commencer une phase avant que la précédente soit validée.

| Phase | Contenu | Terminé quand |
| --- | --- | --- |
| 0 | Socle : projet Astro, styles, layout, en-tête, pied de page | `npm run build` passe, page d'accueil vide avec en-tête et pied de page conformes aux maquettes |
| 1 | Accueil et page Le Groupe | Accueil identique aux maquettes à 360 px et 1 440 px |
| 2 | Supabase : schéma, client, données lues au build | Les solutions de la base s'affichent sur l'accueil |
| 3 | Landings Consulting, Distribution, Technologie ; Solutions ; Le Mag | Les 11 gabarits sont navigables |
| 4 | Formulaires, Edge Function `submit-demande`, emails, WhatsApp, page Contact | Une demande de test arrive en base et par email |
| 5 | Espace `/admin` et Edge Function `rebuild` | Un prix modifié dans `/admin` apparaît sur le site en moins de 5 minutes |
| 6 | SEO, performance, accessibilité, pages légales, 404, mise en ligne | Critères de recette du cahier des charges tous cochés |

## Phase 0 — Socle

- Initialiser Astro (gabarit minimal, TypeScript strict) à la racine, **sans écraser** `CLAUDE.md`, `docs/`, `supabase/`, `src/assets/`, `src/styles/tokens.css`.
- Ajouter `@astrojs/sitemap` et `@astrojs/check`. `site: 'https://www.madalgroup.ci'` dans `astro.config.mjs`.
- Auto-héberger Barlow (400, 600, 700) via `@fontsource/barlow`.
- `src/styles/global.css` : reset léger, typographie, classes utilitaires (`.conteneur`, `.bouton`, `.bouton--contour`, `.etiquette`, `.carte`), à partir de `tokens.css`.
- `layouts/Base.astro` : `<head>` complet (titre, description, Open Graph, favicon), lien d'évitement, en-tête, pied de page, bouton WhatsApp flottant.
- `components/Header.astro` : logo, menu à 6 entrées, sous-menu « Nos expertises », bouton « Demander un devis », menu hamburger plein écran sous 900 px (accessible au clavier, `aria-expanded`).
- `components/Footer.astro`, `components/BoutonWhatsApp.astro`, `components/BlocCTA.astro`.
- `public/_headers` (en-têtes de sécurité), `public/robots.txt`.
- Dépôt GitHub `madalgroup1-oss/madal-group-site`, premier commit, première PR.

## Phase 1 — Accueil et Le Groupe

- `pages/index.astro` : les 8 sections du cahier des charges (4.1), mises en page selon `docs/maquettes/accueil-ordinateur.html` et `accueil-mobile.html`.
- `pages/le-groupe.astro` : sections 4.2, textes du brief (À propos, vision, valeurs, méthode).
- Composants : `CartePole`, `Argument`, `EtapeMethode`, `CarteSolution`, `CarteArticle`.
- Solutions et articles en données fictives locales **marquées provisoires**, remplacées en phase 2.

## Phase 2 — Supabase

- L'utilisateur crée le projet Supabase et fournit l'URL et la clé anonyme (`.env`).
- Appliquer `supabase/migrations/0001_init.sql`.
- `src/lib/supabase.ts` : client de lecture pour le build ; fonctions typées `listerProduits()`, `listerOffres()`, `listerSolutions()`, `listerArticles()`, `promotionsEnCours()`.
- Générer les types TypeScript de la base (`supabase gen types`).
- Brancher l'accueil sur les données réelles.

## Phase 3 — Pages de contenu

- `/consulting` (référence : `docs/maquettes/consulting-ordinateur.html`), `/distribution`, `/technologie` sur le même gabarit de landing.
- `/distribution` : catalogue avec filtre par famille (JavaScript natif, sans rechargement), bandeau promotions masqué s'il est vide, encart Allô Lapins & Volailles by MG.
- `/solutions` et `/solutions/[slug]` ; `/mag` et `/mag/[slug]` (Markdown converti et assaini, partage WhatsApp et Facebook, fil d'Ariane).

## Phase 4 — Formulaires et contact

- `components/FormulaireDemande.astro` : champs et règles de la section 5 du cahier des charges, pôle pré-sélectionné par propriété, validation navigateur, champ piège, états envoi / succès / erreur.
- `supabase/functions/submit-demande` : validation serveur, limite 3 envois par heure et par IP hachée, dépôt de la pièce jointe (type et taille contrôlés), insertion, email de notification et accusé de réception via Resend, CORS limité au domaine du site.
- `/devis`, `/contact` (4 boutons directs, carte Google Maps chargée au clic).
- Message WhatsApp pré-rempli avec la page d'origine sur toutes les pages.

## Phase 5 — Administration

- `/admin` : connexion email + mot de passe (Supabase Auth), `noindex`, hors sitemap.
- Six rubriques : Produits, Promotions, Offres Consulting, Solutions, Le Mag, Demandes.
- Téléversement d'images dans le bucket `media` (redimensionnement côté navigateur avant envoi, 1 600 px max).
- Éditeur d'article : Markdown avec aperçu, brouillon / publier / dépublier.
- Demandes : liste filtrable, changement de statut, note interne, export Excel (CSV UTF-8 avec BOM, séparateur point-virgule).
- `supabase/functions/rebuild` : vérifie le JWT et l'appartenance à `admins`, appelle le deploy hook Cloudflare. Bouton « Publier sur le site » dans `/admin` avec état de la dernière publication.
- `.github/workflows/rebuild-nocturne.yml` : appel quotidien du deploy hook (retrait des promotions échues).

## Phase 6 — Finition et mise en ligne

- SEO : titres et descriptions par page, JSON-LD, sitemap, image de partage 1200 × 630.
- Performance : audit Lighthouse mobile, poids de l'accueil ≤ 1 Mo, images en AVIF/WebP.
- Accessibilité : parcours clavier complet, contrastes, `alt`, focus visible.
- `/mentions-legales`, `/confidentialite`, `404`.
- Cloudflare Pages : projet relié au dépôt, variables d'environnement, domaine `www.madalgroup.ci` et redirection de `madalgroup.ci`, Web Analytics.
- Resend : vérification du domaine (enregistrements DNS), expéditeur `noreply@madalgroup.ci`.
- Rapport de recette dans `docs/recette.md` avec les critères du cahier des charges.

---

## Premier message à donner à Claude Code

À coller tel quel au premier lancement, dans le dossier du projet :

```
Lis CLAUDE.md, puis docs/cahier-des-charges.md, docs/plan-de-developpement.md,
docs/contenus-en-attente.md et les trois maquettes de docs/maquettes/.

Ensuite, réalise la phase 0 du plan de développement, et seulement elle :
- initialise Astro à la racine sans écraser les fichiers existants ;
- mets en place les styles globaux à partir de src/styles/tokens.css ;
- construis le layout de base, l'en-tête, le pied de page, le bouton WhatsApp
  flottant et le bloc d'appel à l'action, fidèles aux maquettes ;
- vérifie avec npm run build et npm run check.

Avant d'écrire du code, présente-moi ton plan en quelques lignes et pose-moi
tes questions s'il y en a. À la fin, liste ce qui a été fait et ce qui reste.
```

## Messages suivants (un par phase)

```
Phase 0 validée. Réalise la phase 1 du plan (accueil et page Le Groupe).
Compare ton rendu aux maquettes à 360 px et 1 440 px avant de conclure.
```

```
Phase 1 validée. Réalise la phase 2. Voici l'URL et la clé anonyme Supabase,
à placer dans .env : …
```

Même modèle pour les phases 3 à 6.
