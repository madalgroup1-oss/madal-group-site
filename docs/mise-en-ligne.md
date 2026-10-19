# Mise en ligne — procédure (phase 6)

À suivre dans l'ordre. Les étapes marquées **(MADAL GROUP)** se font dans les comptes de l'entreprise ; les autres sont réalisées par Claude Code.

## 1. Cloudflare Pages

1. **(MADAL GROUP)** Créer un compte sur https://dash.cloudflare.com/sign-up avec madalgroup1@gmail.com.
2. **(MADAL GROUP)** Workers & Pages → **Create** → **Pages** → **Connect to Git** → autoriser GitHub sur le dépôt `madalgroup1-oss/madal-group-site`.
3. Réglages du projet `madal-group-site` :

   | Réglage | Valeur |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Variables d'environnement | `NODE_VERSION` = `22`, `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `PUBLIC_SITE_URL` = `https://www.madalgroup.ci`, `PUBLIC_WHATSAPP` = `2250787457618` (valeurs du fichier `.env`) |

4. Premier déploiement : le site est visible sur `https://madal-group-site.pages.dev`.
5. **(MADAL GROUP)** Settings → Builds → **Deploy hooks** → **Add deploy hook** (nom `admin`, branche `main`). Copier l'URL **sans la coller dans une conversation**, puis l'enregistrer :
   - dans Supabase : `npx supabase secrets set CLOUDFLARE_DEPLOY_HOOK=URL --project-ref qiteiwtezuswcojhughs`
   - dans GitHub : dépôt → Settings → Secrets and variables → Actions → **New repository secret** `CLOUDFLARE_DEPLOY_HOOK`.
6. Ajouter `https://madal-group-site.pages.dev` à `ORIGINE_AUTORISEE` le temps des tests.

## 2. Domaine madalgroup.ci (registraire : MTN Côte d'Ivoire)

Méthode recommandée : confier la zone DNS à Cloudflare (gratuit), ce qui permet de servir `madalgroup.ci` et `www.madalgroup.ci` et de rediriger l'un vers l'autre.

1. **(MADAL GROUP)** Cloudflare → **Add a domain** → `madalgroup.ci` → offre **Free**. Cloudflare reprend les enregistrements DNS existants : vérifier en particulier les enregistrements **MX** si une messagerie utilise le domaine.
2. Cloudflare indique deux serveurs de noms (`xxx.ns.cloudflare.com`).
3. **(MADAL GROUP)** Demander à MTN CI (espace client ou support) de remplacer les serveurs de noms de `madalgroup.ci` par ceux de Cloudflare. Délai : de quelques heures à 48 h.
4. Pages → projet → **Custom domains** : ajouter `www.madalgroup.ci`, puis `madalgroup.ci`.
5. Règle de redirection `madalgroup.ci` → `https://www.madalgroup.ci` (Rules → Redirect Rules, code 301, en conservant le chemin).
6. Activer **Web Analytics** pour le site (sans cookie).

Si MTN CI refuse le changement de serveurs de noms : ajouter chez MTN un enregistrement `CNAME www → madal-group-site.pages.dev` et une redirection de `madalgroup.ci` vers `https://www.madalgroup.ci` dans leur interface.

## 3. Resend : envoi depuis noreply@madalgroup.ci

1. **(MADAL GROUP)** Resend → **Domains** → **Add Domain** → `madalgroup.ci` (région la plus proche proposée).
2. Ajouter dans la zone DNS (Cloudflare) les enregistrements affichés par Resend (SPF, DKIM, éventuellement MX de retour), puis **Verify**.
3. `npx supabase secrets set "EMAIL_EXPEDITEUR=MADAL GROUP <noreply@madalgroup.ci>"`
4. Tester un envoi avec une adresse email autre que madalgroup1@gmail.com : l'accusé de réception doit arriver.

## 4. Supabase

1. Authentication → **URL Configuration** : Site URL `https://www.madalgroup.ci`, Redirect URLs `https://www.madalgroup.ci/admin/`.
2. Authentication → **Sign In / Providers** : **Allow new users to sign up** désactivé.
3. `ORIGINE_AUTORISEE` = `https://www.madalgroup.ci` uniquement (retirer `localhost` et `pages.dev`).

## 5. Vérifications finales

Dérouler `docs/recette.md` sur le site en ligne, puis :

- Google Search Console : ajouter le domaine, envoyer `https://www.madalgroup.ci/sitemap-index.xml`.
- Google Business Profile : créer ou mettre à jour la fiche et y indiquer le site.
