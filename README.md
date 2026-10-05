# Inocent KOFFI — site officiel

Site personnel et professionnel d'Inocent KOFFI, agro-entrepreneur ivoirien et fondateur d'AgriCapital SARL.

## Positionnement

Le site présente de façon claire et unifiée :

- le parcours et la vision d'Inocent KOFFI ;
- les expertises et domaines d'intervention ;
- AgriCapital et ses projets agricoles ;
- les réalisations et actualités ;
- les moyens de contact et de collaboration.

Les pages publiques sont organisées pour éviter la répétition d'un même contenu à plusieurs endroits. Les anciennes URL sont conservées uniquement lorsqu'une redirection est nécessaire pour préserver les liens existants.

## Stack

- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS + shadcn/ui
- Supabase pour les fonctionnalités qui nécessitent des données dynamiques
- Déploiement Vercel

## Environnement

Le projet cible Node.js 24.x et npm 11+.

Commandes principales : npm ci, npm run build et npm run dev.

## Principes de maintenance

- Ne jamais versionner de secrets, fichiers .env ou identifiants.
- Toute variable sensible doit être configurée dans l'environnement de déploiement.
- Une information institutionnelle ne doit avoir qu'une source éditoriale principale.
- Les pages publiques ne doivent pas exposer de notes internes, diagnostics techniques, instructions de développement ou données d'administration.
- Avant chaque mise en production : lint, build, vérification des routes principales et contrôle responsive.

## Déploiement

Le déploiement de production est prévu pour Vercel. Les paramètres d'environnement doivent être configurés dans le projet de déploiement et non dans Git.
