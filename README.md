# MADAL GROUP — Site vitrine

Kit de démarrage du site www.madalgroup.ci, à développer avec Claude Code.

## Contenu du kit

| Élément | Rôle |
| --- | --- |
| `CLAUDE.md` | Instructions lues automatiquement par Claude Code à chaque session |
| `docs/cahier-des-charges.md` | Spécification validée |
| `docs/plan-de-developpement.md` | Les 7 phases et le premier message à donner à Claude Code |
| `docs/brief-strategique.md` | Textes officiels du site |
| `docs/contenus-en-attente.md` | Ce qu'il reste à fournir et à décider |
| `docs/maquettes/` | Maquettes validées, à ouvrir dans un navigateur |
| `src/assets/images/` | Visuels fournis, compressés |
| `src/styles/tokens.css` | Couleurs, typographie, espacements |
| `supabase/migrations/0001_init.sql` | Base de données, droits d'accès, stockage |
| `.env.example` | Variables d'environnement à renseigner |

## Démarrage sous Windows

### 1. Installer les outils (une seule fois)

| Outil | Installation | Vérification |
| --- | --- | --- |
| Git for Windows | https://git-scm.com/downloads/win | `git --version` |
| Node.js 22 LTS | https://nodejs.org | `node --version` |
| Claude Code | Commande PowerShell ci-dessous | `claude --version` (dans une nouvelle fenêtre) |
| GitHub CLI (facultatif) | `winget install GitHub.cli` puis `gh auth login` | `gh --version` |

Installation de Claude Code, dans PowerShell :

```powershell
irm https://claude.ai/install.ps1 | iex
```

Claude Code demande un abonnement Claude payant (Pro, Max, Team ou Enterprise) ou un compte Console.

### 2. Placer le projet

Décompresser le kit, par exemple dans `C:\Projets\madal-group-site`, puis dans PowerShell :

```powershell
cd C:\Projets\madal-group-site
git init -b main
git add .
git commit -m "Kit de démarrage du site vitrine"
```

### 3. Créer le dépôt GitHub

Avec GitHub CLI :

```powershell
gh repo create madalgroup1-oss/madal-group-site --private --source . --push
```

Sans GitHub CLI : créer le dépôt vide `madal-group-site` sur github.com, puis :

```powershell
git remote add origin https://github.com/madalgroup1-oss/madal-group-site.git
git push -u origin main
```

### 4. Lancer Claude Code

```powershell
claude
```

À la première ouverture, se connecter dans le navigateur, puis coller le « Premier message » de `docs/plan-de-developpement.md`.

## Comptes à créer avant les phases concernées

| Compte | Nécessaire pour | Phase | Ce qu'il faudra relever |
| --- | --- | --- | --- |
| Supabase (nouveau projet `madal-group-site`) | Base, authentification, stockage, fonctions | 2 | URL du projet, clé `anon`, clé `service_role` |
| Resend | Emails de notification et d'accusé de réception | 4 | Clé API ; enregistrements DNS à ajouter au domaine |
| Cloudflare | Hébergement (Pages) et mesure d'audience | 6 (ou dès la phase 0 pour une adresse provisoire) | Deploy hook du projet Pages |
| Registraire du domaine madalgroup.ci | Pointer le domaine vers Cloudflare Pages, valider Resend | 6 | Accès à la zone DNS |

Les clés `service_role`, Resend et le deploy hook ne vont jamais dans le dépôt ni dans `.env` côté site : uniquement dans les secrets des fonctions Supabase.

## Commandes (après la phase 0)

| Commande | Effet |
| --- | --- |
| `npm install` | Installe les dépendances |
| `npm run dev` | Site en local sur http://localhost:4321 |
| `npm run build` | Génère le site dans `dist/` |
| `npm run preview` | Aperçu du site généré |
