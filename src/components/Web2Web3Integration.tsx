import { ArrowRight, Shield, Zap, Layers, Globe, Lock } from "lucide-react";
import web2web3Bridge from "@/assets/web2-web3-bridge.jpg";
import defiNetwork from "@/assets/defi-network.jpg";
import walletInterface from "@/assets/wallet-interface.jpg";

export const Web2Web3Integration = () => {
  const integrationFeatures = [
    {
      icon: Globe,
      title: "Web2 Foundation",
      description: "Traditional business tools and familiar interfaces that companies already know and trust.",
      items: ["Easy dashboard access", "Standard APIs", "Cloud infrastructure", "Traditional payments"]
    },
    {
      icon: Layers,
      title: "Seamless Bridge",
      description: "Our SDK connects both worlds, allowing businesses to leverage blockchain without complexity.",
      items: ["One-line integration", "No crypto knowledge needed", "Automatic conversions", "Unified analytics"]
    },
    {
      icon: Lock,
      title: "Web3 Power",
      description: "Unlock the benefits of decentralized technology, true ownership, and token economics.",
      items: ["On-chain rewards", "Token ownership", "DeFi integration", "Transparent transactions"]
    }
  ];

  const comparisonData = [
    {
      aspect: "User Experience",
      web2: "Familiar, simple interfaces",
      bridge: "Best of both worlds",
      web3: "True ownership & control"
    },
    {
      aspect: "Technology",
      web2: "Centralized servers",
      bridge: "Hybrid architecture",
      web3: "Decentralized blockchain"
    },
    {
      aspect: "Value",
      web2: "Points & discounts",
      bridge: "Instant conversion",
      web3: "Real crypto assets"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      <div className="container px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Bridging Web2 & Web3
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Seamlessly connect traditional business models with blockchain innovation
          </p>
        </div>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto mb-20 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl">
            <img 
              src={web2web3Bridge} 
              alt="Web2 and Web3 Integration Bridge" 
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        </div>

        {/* Integration Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {integrationFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6">{feature.description}</p>
              <ul className="space-y-2">
                {feature.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto mb-20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">
            The Perfect Balance
          </h3>
          <div className="rounded-3xl border border-border overflow-hidden bg-card">
            <div className="grid grid-cols-4 gap-4 p-6 bg-muted/30 font-semibold">
              <div className="text-muted-foreground">Aspect</div>
              <div className="text-center">Web2</div>
              <div className="text-center text-primary">Gami Bridge</div>
              <div className="text-center">Web3</div>
            </div>
            {comparisonData.map((row, index) => (
              <div 
                key={index} 
                className="grid grid-cols-4 gap-4 p-6 border-t border-border hover:bg-muted/20 transition-colors"
              >
                <div className="font-medium">{row.aspect}</div>
                <div className="text-center text-sm text-muted-foreground">{row.web2}</div>
                <div className="text-center text-sm font-semibold text-primary flex items-center justify-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  {row.bridge}
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="text-center text-sm text-muted-foreground">{row.web3}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DeFi & Wallet Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card p-8 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="mb-6">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-2xl font-bold mb-3">DeFi Integration</h3>
              <p className="text-muted-foreground mb-6">
                Connect to decentralized finance protocols for staking, yield farming, and more
              </p>
            </div>
            <img 
              src={defiNetwork} 
              alt="DeFi Network Architecture" 
              className="w-full h-auto rounded-xl"
            />
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-border bg-card p-8 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="mb-6">
              <Zap className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-2xl font-bold mb-3">Universal Wallet</h3>
              <p className="text-muted-foreground mb-6">
                One wallet for all your digital assets - crypto, tokens, and loyalty rewards
              </p>
            </div>
            <img 
              src={walletInterface} 
              alt="Universal Wallet Interface" 
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
