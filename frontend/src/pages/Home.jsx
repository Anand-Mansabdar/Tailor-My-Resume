import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/layout/PageTransition";
import Hero from "../components/landing/Hero";
import ProductPreview from "../components/landing/ProductPreview";
import HowItWorks from "../components/landing/HowItWorks";
import WhatYouGet from "../components/landing/WhatYouGet";
import TrustSection from "../components/landing/TrustSection";
import FinalCTA from "../components/landing/FinalCTA";

export default function Home() {
  return (
    <PageTransition>
      <Navbar />
      <main>
        <Hero />
        <ProductPreview />
        <HowItWorks />
        <WhatYouGet />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </PageTransition>
  );
}