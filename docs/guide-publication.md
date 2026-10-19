# Guide de publication — espace d'administration

Ce guide explique comment mettre à jour le site www.madalgroup.ci sans toucher au code.

## Se connecter

1. Ouvrir **www.madalgroup.ci/admin** (l'adresse n'apparaît dans aucun menu : l'ajouter aux favoris).
2. Saisir l'email et le mot de passe du compte administrateur, puis **Se connecter**.
3. Mot de passe oublié : saisir l'email, cliquer sur **Mot de passe oublié ?**, puis suivre le lien reçu par email.

## Le principe : enregistrer, puis publier

- **Enregistrer** range la modification dans la base de données. Elle n'est pas encore visible sur le site.
- **Publier sur le site** (bandeau en haut de l'écran) reconstruit le site avec toutes les modifications enregistrées. Le site est à jour **en moins de 5 minutes**.
- Le bandeau indique « Des modifications ne sont pas encore en ligne » tant qu'il reste quelque chose à publier.
- On peut faire plusieurs modifications, puis publier une seule fois à la fin.
- Chaque nuit, le site est republié automatiquement : les promotions terminées disparaissent d'elles-mêmes.

## Ajouter ou modifier un produit

1. Onglet **Produits**, puis **Ajouter un produit** (ou cliquer sur un produit existant).
2. Renseigner le nom et la famille. L'identifiant se remplit tout seul.
3. **Prix** : un nombre entier sans espace ni « FCFA » (ex. `25000`). Laisser vide pour afficher « Prix sur demande ».
4. **Conditionnement** : ex. « le kilo », « carton de 30 œufs ».
5. **Photo** : **Choisir un fichier**. La photo est réduite automatiquement ; JPG, PNG ou WebP.
6. Décocher **Visible sur le site** pour masquer un produit sans le supprimer (rupture de stock, par exemple).
7. **Ordre** : les plus petits nombres s'affichent en premier.
8. **Enregistrer**, puis **Publier sur le site**.

## Créer une promotion

1. Onglet **Promotions**, puis **Ajouter une promotion**.
2. Titre (ex. « Poulets de chair à prix réduit »), produit concerné (facultatif), prix promotionnel (facultatif).
3. **Date de début** et **date de fin** : la promotion apparaît en haut de la page Distribution pendant cette période, puis disparaît automatiquement.
4. **Enregistrer**, puis **Publier sur le site**.

## Modifier les offres Consulting

1. Onglet **Offres Consulting**.
2. **Prestations incluses** : une prestation par ligne.
3. **Tarif** et **Périodicité** : le site affiche par exemple « 50 000 FCFA / mois ».
4. **Mettre en avant** affiche l'offre sur fond vert foncé (une seule offre recommandée).

## Ajouter une solution (logiciel ou réalisation)

1. Onglet **Solutions**, puis **Ajouter une solution**.
2. **Adresse** : se remplit à partir du nom (ex. `madal-rh` donne www.madalgroup.ci/solutions/madal-rh). Ne plus la modifier une fois la fiche partagée.
3. **Fonctionnalités** : une par ligne.
4. **Logo** (PNG à fond transparent de préférence) et **captures d'écran** (trois recommandées).
5. **Afficher sur la page d'accueil** : la solution apparaît dans la section des solutions de l'accueil.
6. Cocher **Publiée sur le site**, **Enregistrer**, puis **Publier sur le site**.

## Écrire un article du Mag

1. Onglet **Le Mag**, puis **Ajouter un article**.
2. Titre, pôle, rubrique, **résumé** (160 caractères au plus : il apparaît aussi dans les partages WhatsApp et Facebook), image de couverture.
3. **Texte de l'article** : mise en forme simple.

   | Saisir | Résultat |
   | --- | --- |
   | `## Mon intertitre` en début de ligne | un intertitre |
   | `**mot**` | **mot** en gras |
   | `*mot*` | *mot* en italique |
   | `- élément` en début de ligne | une liste à puces |
   | `[texte](https://exemple.ci)` | un lien |

   Laisser une ligne vide entre deux paragraphes. **Voir l'aperçu** montre le résultat.
4. **Enregistrer le brouillon** : l'article reste invisible sur le site.
5. **Publier** : l'article sera en ligne après **Publier sur le site**.
6. Pour retirer un article publié : l'ouvrir, puis **Dépublier**, et enfin **Publier sur le site**.

## Traiter les demandes

Chaque demande envoyée depuis le site arrive par email à madalgroup1@gmail.com et dans l'onglet **Demandes**.

1. Cliquer sur une demande pour l'ouvrir : appeler, écrire sur WhatsApp ou par email en un clic, ouvrir la pièce jointe.
2. Changer le **statut** : Nouvelle → Traitée → Convertie (devenue un client).
3. **Note interne** : visible seulement dans l'administration (ex. « Rappeler lundi, devis envoyé »).
4. **Exporter (Excel)** : télécharge les demandes affichées (selon les filtres) dans un fichier qui s'ouvre avec Excel. À faire chaque mois, comme sauvegarde.

Les demandes et les publications n'ont pas besoin du bouton « Publier sur le site ».

## Supprimer

Le bouton **Supprimer** demande une confirmation : cliquer une deuxième fois sur **Confirmer la suppression** dans les 5 secondes. Une suppression est définitive. Pour retirer temporairement un élément, préférer « Visible sur le site » ou « Publiée sur le site ».

## Ajouter un autre administrateur

1. Supabase → **Authentication** → **Users** → **Add user** → **Create new user** (cocher **Auto Confirm User**).
2. Demander au développeur (ou à Claude Code) d'ajouter ce compte à la table `admins`. Sans cette étape, le compte ne peut rien modifier.
