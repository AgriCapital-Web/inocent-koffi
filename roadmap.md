# Roadmap — Finalisation de la refonte

- [x] Réserver Autres projets à AgriCapital et présenter site officiel, CRM équipe et portail client avec liens adaptés.
- [x] Intégrer les médias publiés du Studio dans Réalisations.
- [ ] Vérifier que les fiches des sites clients sont renseignées, publiées et correctement illustrées dans `portfolio_projects`.
- [x] Harmoniser la navigation et le pied de page ; conserver les composants et la typographie existants.
- [x] Retirer les anciennes redirections serveur qui masquaient les pages actives `/services`, `/partenariat`, `/evolution` et `/studio`.
- [ ] Vérifier visuellement toutes les pages et confirmer les anciennes adresses par des tests de navigation.
- [ ] Vérifier Services et Actualités, leurs médias et les métadonnées ; améliorer les traductions avec le glossaire existant sans inventer de validation linguistique.
- [x] Vérifier le favicon : le fichier PNG existe déjà dans `public/` et est référencé dans `index.html`.
- [ ] Vérifier les pages et les contrôles aux différentes largeurs, sans débordement.

## Contrôles restant à effectuer avant mise en production
- [ ] Exécuter `npm run build` et `npm run lint` dans l'environnement du projet.
- [ ] Tester les parcours, les liens externes et les pages à différentes largeurs d'écran.
- [ ] Vérifier les médias réellement présents dans le bucket public `blog-media/studio` et les autorisations de lecture.
- [ ] Contrôler les métadonnées et les traductions page par page ; faire relire le baoulé et le dioula par des locuteurs.

## Dépendances externes
- Paiements réels KKiaPay/Stripe : clés et configuration marchande requises ; ne pas simuler de paiement confirmé.
- Validation des traductions baoulé/dioula : relecture par un locuteur et sources linguistiques vérifiables requises.
