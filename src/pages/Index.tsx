import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Architecture } from "@/components/Architecture";
import { Web2Web3Integration } from "@/components/Web2Web3Integration";
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
        <Web2Web3Integration />
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
