# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# MADAL GROUP — Site vitrine (madalgroup.ci)

Site institutionnel de MADAL GROUP SARL (Abidjan, Côte d'Ivoire) : un groupe, trois pôles.
Objectif : présenter le groupe, orienter vers le bon pôle, générer des demandes de devis.

## État actuel du dépôt

Kit de démarrage, **avant la phase 0** : pas encore de `package.json`, de projet Astro ni de dépôt git (voir `README.md` pour `git init -b main` et la création du dépôt GitHub). Fichiers déjà présents à **ne pas écraser** lors de l'initialisation d'Astro : `CLAUDE.md`, `README.md`, `docs/`, `supabase/`, `src/assets/`, `src/styles/tokens.css`, `.env.example`, `.gitignore`. Poste de développement sous Windows (PowerShell).

## Documents de référence (à lire avant de coder)

| Fichier | Rôle |
| --- | --- |
| `docs/cahier-des-charges.md` | Spécification complète et validée. Fait foi en cas de doute. |
| `docs/plan-de-developpement.md` | Phases, ordre de travail, critères de fin de phase. |
| `docs/brief-strategique.md` | Textes officiels du site (accroches, pôles, valeurs, vision, méthode). |
| `docs/contenus-en-attente.md` | Contenus non encore fournis et points ouverts. |
| `docs/maquettes/*.html` | Maquettes validées (accueil ordinateur, accueil mobile, landing Consulting). Référence visuelle : reproduire la mise en page, pas le code (styles en ligne à ne pas recopier). |
| `src/styles/tokens.css` | Couleurs, typographie, espacements, rayons. |
| `supabase/migrations/0001_init.sql` | Schéma de base, RLS, stockage, données initiales. |

## Stack (décidée, ne pas changer sans demander)

- **Astro** (dernière version stable), sortie **statique**, TypeScript strict.
- **CSS natif** avec les variables de `src/styles/tokens.css`. Pas de Tailwind, pas de framework CSS.
- **Aucun framework d'interface** (pas de React/Vue). JavaScript/TypeScript natif dans des balises `<script>` Astro.
- **Supabase** : Postgres + RLS, Auth (email + mot de passe), Storage, Edge Functions (Deno).
- **Cloudflare Pages** : hébergement, déploiement à chaque push sur `main`, Web Analytics.
- **Resend** : envoi des emails depuis la fonction serveur (expéditeur sur le domaine madalgroup.ci).
- Dépôt GitHub : compte `madalgroup1-oss` (dépôt `madalgroup1-oss/madal-group-site`).

## Architecture

- Les pages publiques sont générées **au build** à partir de Supabase (clé anonyme, lecture des seules lignes publiées/visibles).
- `/admin` est une page statique dont le script s'authentifie via Supabase Auth et écrit directement dans les tables (RLS : écriture réservée aux utilisateurs présents dans `admins`). `noindex`, absente du menu et du sitemap.
- Publier ou modifier un contenu dans `/admin` appelle l'Edge Function `rebuild` (JWT administrateur vérifié), qui déclenche le *deploy hook* Cloudflare Pages. Le site est à jour en moins de 5 minutes. Le hook n'est jamais exposé au navigateur.
- Un workflow GitHub Actions planifié déclenche un rebuild chaque nuit pour retirer les promotions échues.
- Les formulaires (contact, devis) envoient à l'Edge Function `submit-demande` : validation serveur, champ piège, limite de 3 envois par heure et par IP (IP hachée), dépôt de la pièce jointe dans le bucket privé, insertion dans `demandes`, email de notification à `madalgroup1@gmail.com`, accusé de réception au visiteur. Le public n'a **aucun** droit d'insertion direct.
- Modèle de données (`0001_init.sql`) : tables de contenu `familles_produits`, `produits`, `promotions`, `offres_consulting`, `solutions`, `articles` (lecture publique filtrée, écriture admin) ; `demandes` (lecture et mise à jour admin uniquement, insertion par la fonction serveur avec `service_role`) ; `admins` + fonction `est_admin()` utilisée par toutes les politiques d'écriture. Stockage : bucket public `media` (écriture admin) et bucket privé `pieces-jointes` (lecture admin).
- Variables : côté site, uniquement les `PUBLIC_*` de `.env.example` (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_SITE_URL`, `PUBLIC_WHATSAPP`). Secrets des Edge Functions (`supabase secrets set`) : `RESEND_API_KEY`, `EMAIL_NOTIFICATION`, `EMAIL_EXPEDITEUR`, `CLOUDFLARE_DEPLOY_HOOK`, `IP_HASH_SEL`, `ORIGINE_AUTORISEE` (CORS).

## Arborescence cible

```
src/
  assets/images/      images sources (optimisées par astro:assets)
  components/         Header, Footer, BoutonWhatsApp, BlocCTA, CartePole, FormulaireDemande, …
  layouts/            Base.astro (head, SEO, Open Graph, données structurées)
  lib/                supabase.ts, format.ts (prix FCFA), seo.ts
  pages/              index, le-groupe, consulting, consulting/[service], distribution, technologie, technologie/[service],
                      solutions/index, solutions/[slug], mag/index, mag/[slug],
                      contact, devis, mentions-legales, confidentialite, 404, admin/
  styles/             tokens.css, global.css
supabase/
  migrations/         SQL versionné
  functions/          submit-demande/, rebuild/
```

## Règles de contenu

- Langue : **français** uniquement. Code, commentaires et commits en français.
- **Ne jamais inventer** de texte commercial, de prix, de chiffre, de témoignage ni de référence client. Les textes viennent de `docs/brief-strategique.md`. Ce qui manque est listé dans `docs/contenus-en-attente.md` : afficher un texte entre crochets `[À FOURNIR : …]` et le signaler.
- Prix en FCFA, entiers, séparateur de milliers par espace (`25 000 FCFA`). Prix absent : « Prix sur demande ».
- Coordonnées : Yopougon Camp Militaire – Abidjan · 07 87 45 76 18 · 05 44 82 05 83 · madalgroup1@gmail.com.
- WhatsApp : `https://wa.me/2250787457618?text=…` avec un message pré-rempli indiquant la page d'origine.
- Noms exacts : MADAL GROUP SARL, Madal Consulting, Madal Distribution, Madal Technologie, Madal RH, BMVT GESTION PRO, Allô Lapins & Volailles by MG, Le Mag MADAL.

## Règles de design

- Couleurs : uniquement celles de `tokens.css`. `#22C55E` ne porte jamais de texte blanc et n'est jamais une couleur de texte sur fond clair (utiliser `--vert-texte`). Bouton vert = texte `--vert-fonce`.
- Logo : fichiers fournis, **jamais redessinés, déformés ni recolorés**. `logo-disque.jpg` est provisoire (recadrage d'un rendu) en attendant le fichier officiel.
- Mobile d'abord : tout doit fonctionner à 360 px. Cibles tactiles ≥ 44 px. Largeur de contenu ≤ 1 200 px.
- Police Barlow, auto-hébergée (pas d'appel à Google Fonts en production). JetBrains Mono (graisse 500, auto-hébergée) pour les étiquettes et les boutons uniquement.
- Direction visuelle « D — plan technique » validée le 17/10/2026 (remplace l'aspect des maquettes `docs/maquettes/`, dont la structure reste la référence) : en-tête flottant vert foncé, titres serrés, étiquettes en chasse fixe, trame `.trame`, `.grille-technique` à croix « + », photos `.angle-coupe`.
- Icônes au trait, en SVG en ligne, une seule famille. Pas d'emoji.
- Animations légères, désactivées sous `prefers-reduced-motion`.

## Qualité et sécurité

- Lighthouse mobile ≥ 90 (performance, accessibilité, SEO). Page d'accueil ≤ 1 Mo.
- Images via `astro:assets` (WebP/AVIF, `srcset`, `loading="lazy"` hors écran). Attribut `alt` obligatoire.
- HTML sémantique, navigation clavier, contrastes WCAG AA, un seul `<h1>` par page.
- SEO : `<title>` et description uniques par page, Open Graph, sitemap, robots.txt, JSON-LD (Organization, LocalBusiness, Article).
- Secrets : jamais dans le dépôt. La clé `service_role`, la clé Resend et le deploy hook vivent uniquement dans les secrets des Edge Functions. Côté client, seules les variables `PUBLIC_*` (URL et clé anonyme Supabase, URL du site, numéro WhatsApp).
- Toute nouvelle table a RLS activé, ses politiques **et ses droits `grant` explicites** dans une migration : aucun droit n'est accordé automatiquement aux rôles `anon` et `authenticated` (voir `0002_droits_api.sql` et `0003_droits_restreints.sql`). Après une modification du schéma, régénérer `src/lib/database.types.ts` (`npx supabase gen types typescript --linked --schema public`).
- Le corps des articles (Markdown) est converti puis **assaini** avant affichage.
- En-têtes de sécurité dans `public/_headers` (CSP, X-Content-Type-Options, Referrer-Policy, etc.).

## Pièges connus de l'équipe (à vérifier systématiquement)

- Apostrophes françaises dans les chaînes JavaScript (`l'offre`, `d'un`) : utiliser des gabarits `` ` `` ou des guillemets doubles.
- Encodage UTF-8 partout (fichiers, `<meta charset>`, SQL).
- Filtrer par identifiant avec `===`, jamais avec `.includes()`.
- Cache navigateur : les fichiers générés par Astro sont hachés ; ne pas ajouter de ressources non hachées dans `public/` sans raison.
- En-tête flottant : la première section de chaque page passe dessous (`main > :first-child` reçoit `padding-top: var(--decalage-entete)`) et doit être sur fond foncé (`.fond-fonce`).
- Animations pilotées par le défilement : écrire `animation-timeline` dans une règle séparée de `animation`, sinon le minifieur fusionne les deux en un raccourci que Chrome rejette.

## Méthode de travail

- Suivre `docs/plan-de-developpement.md` phase par phase. Une phase = une branche = une PR.
- Avant de déclarer une phase terminée : `npm run build` sans erreur, `npm run check` sans erreur, vérification visuelle à 360 px, 768 px et 1 440 px.
- Code livré complet et fonctionnel, jamais de pseudo-code ni de `…`.
- Commits courts, en français, à l'impératif (`Ajoute la page Consulting`).
- En cas d'ambiguïté fonctionnelle : poser la question plutôt que supposer.

## Commandes

Disponibles après la phase 0. Pas de suite de tests automatisés : la vérification repose sur `build`, `check` et le contrôle visuel aux trois largeurs.

| Commande | Effet |
| --- | --- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Serveur local sur http://localhost:4321 |
| `npm run build` | Génération du site dans `dist/` |
| `npm run preview` | Aperçu du site généré |
| `npm run check` | Vérification des types Astro/TypeScript |
| `supabase db push` | Applique les migrations au projet Supabase lié |
| `supabase functions deploy <nom>` | Déploie une Edge Function |
| `supabase gen types typescript` | Génère les types TypeScript de la base (phase 2) |
