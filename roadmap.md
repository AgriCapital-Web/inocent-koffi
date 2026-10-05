# Roadmap — Site Inocent KOFFI

## Fait
- Compte admin unique : innocentkoffi1@gmail.com (super_admin), anciens droits admin révoqués.
- Outils de traitement (filigrane, compression, publication) déplacés dans l'onglet « Studio média » de /admin.
- Page publique /studio réduite à une vitrine + galerie des publications.
- Routes /services et /studio déclarées dans App.tsx (pas de 404).

## À faire
1. Commande en ligne : formulaire par service (pré-rempli depuis /services), tables `service_orders` + `payments`, statuts de suivi.
2. Paiement : intégration KKiaPay (clés en attente) + Stripe Checkout via fonctions edge.
3. Espace client : connexion, liste des commandes, statut, factures.
4. Admin : onglets Clients / Commandes / Paiements.
5. Actualités : remplacer les images cassées par les vraies photos de l'inauguration AgriCapital.
6. SEO page par page : title, description, OG, sitemap, hreflang + glossaire baoulé partout.
