import AdminCrud from "@/components/admin/AdminCrud";

const serviceCats = [
  { value: "web", label: "Web & solutions digitales" },
  { value: "ia", label: "IA & automatisation" },
  { value: "video", label: "Vidéo & création digitale" },
  { value: "audio", label: "Audio & musique" },
  { value: "formation", label: "Formation & accompagnement" },
];
const workCats = [
  { value: "web", label: "Web & Digital" }, { value: "ia", label: "IA" }, { value: "video", label: "Vidéo" },
  { value: "audio", label: "Audio" }, { value: "musique", label: "Musique" }, { value: "contenu", label: "Contenu digital" },
];

export const AdminServicesPrices = () => (
  <AdminCrud table="services" heading="Services & prix" subtitle="Les prix modifiés ici s'affichent immédiatement sur la page Services et dans la commande."
    slugFrom="title"
    defaults={{ title: "", slug: "", category: "web", description: "", price: null, price_note: "", bullets: [], is_orderable: true, is_published: true, sort_order: 0 }}
    listColumns={[{ key: "title", label: "Service" }, { key: "category", label: "Catégorie" }, { key: "price", label: "Prix (FCFA)" }, { key: "price_note", label: "Mention" }]}
    fields={[
      { name: "title", label: "Nom du service", type: "text", required: true },
      { name: "slug", label: "Identifiant (URL)", type: "text" },
      { name: "category", label: "Catégorie", type: "select", options: serviceCats },
      { name: "description", label: "Description", type: "textarea" },
      { name: "price", label: "Prix en FCFA (vide = sur devis)", type: "number" },
      { name: "price_note", label: "Mention de prix (ex. « À partir de », « Sur devis »)", type: "text" },
      { name: "bullets", label: "Points inclus (séparés par des virgules)", type: "tags" },
      { name: "is_orderable", label: "Commandable en ligne", type: "switch" },
      { name: "is_published", label: "Publié", type: "switch" },
      { name: "sort_order", label: "Ordre", type: "number" },
    ]} />
);

export const AdminRealisations = () => (
  <AdminCrud table="realisations" heading="Réalisations" subtitle="Projets clients, vidéos, audio, musique et contenus affichés sur la page Réalisations."
    slugFrom="title"
    defaults={{ title: "", slug: "", category: "web", description: "", thumbnail_url: "", tags: [], external_url: "", is_published: true, sort_order: 0 }}
    listColumns={[{ key: "title", label: "Titre" }, { key: "category", label: "Catégorie" }, { key: "external_url", label: "Lien" }]}
    fields={[
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Identifiant (URL)", type: "text" },
      { name: "category", label: "Catégorie", type: "select", options: workCats },
      { name: "description", label: "Description", type: "textarea" },
      { name: "thumbnail_url", label: "Miniature (URL de l'image)", type: "text" },
      { name: "external_url", label: "Lien externe", type: "text" },
      { name: "tags", label: "Tags (séparés par des virgules)", type: "tags" },
      { name: "is_published", label: "Publié", type: "switch" },
      { name: "sort_order", label: "Ordre", type: "number" },
    ]} />
);

export const AdminSites = () => (
  <AdminCrud table="sites" heading="Sites clients" subtitle="Sites développés pour des clients, affichés dans Réalisations."
    defaults={{ name: "", description: "", url: "", logo_url: "", category: "web", status: "en_ligne", is_published: true, sort_order: 0 }}
    listColumns={[{ key: "name", label: "Nom" }, { key: "url", label: "Adresse" }, { key: "status", label: "Statut" }]}
    fields={[
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "url", label: "Adresse du site", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "logo_url", label: "Logo ou capture (URL)", type: "text" },
      { name: "category", label: "Catégorie", type: "select", options: workCats },
      { name: "status", label: "Statut", type: "select", options: [{ value: "en_ligne", label: "En ligne" }, { value: "en_cours", label: "En cours" }] },
      { name: "is_published", label: "Publié", type: "switch" },
      { name: "sort_order", label: "Ordre", type: "number" },
    ]} />
);
