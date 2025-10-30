import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Architecture } from "@/components/Architecture";
import { WalletShowcase } from "@/components/WalletShowcase";
import { UseCases } from "@/components/UseCases";
import { Tokenomics } from "@/components/Tokenomics";
import { Roadmap } from "@/components/Roadmap";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Architecture />
        <WalletShowcase />
        <UseCases />
        <Tokenomics />
        <Roadmap />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
