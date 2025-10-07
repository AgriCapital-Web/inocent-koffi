const Footer = () => {
  return (
    <footer className="py-8 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-sm opacity-90">
            © {new Date().getFullYear()} Inocent KOFFI. Tous droits réservés.
          </p>
          <p className="text-xs opacity-75 mt-2">
            Transformation Agricole · Partenariats Stratégiques · Afrique Prospère
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
