import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import TestimonialsDisplay from "@/components/TestimonialsDisplay";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Inocent KOFFI - Fondateur & DG AGRICAPITAL SARL | Transformation Agricole</title>
        <meta name="description" content="Inocent KOFFI, Fondateur et Directeur Général d'AGRICAPITAL SARL. 12 ans d'expérience terrain auprès des producteurs agricoles en Côte d'Ivoire." />
        <link rel="canonical" href="https://www.ikoffi.agricapital.ci/" />
      </Helmet>
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <TestimonialsDisplay />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
};

export default Home;
