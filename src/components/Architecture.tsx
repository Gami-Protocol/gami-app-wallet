import { ArrowRight } from "lucide-react";

export const Architecture = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative bg-gradient-to-b from-background to-card/30">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How It <span className="text-transparent bg-clip-text bg-gradient-primary">Works</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Powered by the Model Context Protocol (MCP), Gami connects AI agents, smart contracts, 
              and SDKs into a single transparent gamification engine. Developers plug in via SDK; 
              users track XP, tiers, and rewards through the Gami Wallet App.
            </p>
          </div>
          
          {/* Architecture flow diagram */}
          <div className="relative py-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Apps */}
              <div className="flex-1 p-6 rounded-xl bg-card border border-border text-center">
                <div className="text-4xl mb-3">📱</div>
                <div className="font-semibold text-lg">Apps & Games</div>
                <div className="text-sm text-muted-foreground mt-2">Web2 & Web3</div>
              </div>
              
              <ArrowRight className="text-primary rotate-90 md:rotate-0" />
              
              {/* SDK */}
              <div className="flex-1 p-6 rounded-xl bg-primary/10 border border-primary text-center">
                <div className="text-4xl mb-3">⚡</div>
                <div className="font-semibold text-lg">Gami SDK</div>
                <div className="text-sm text-muted-foreground mt-2">Integration Layer</div>
              </div>
              
              <ArrowRight className="text-primary rotate-90 md:rotate-0" />
              
              {/* AI Engine */}
              <div className="flex-1 p-6 rounded-xl bg-secondary/10 border border-secondary text-center">
                <div className="text-4xl mb-3">🧠</div>
                <div className="font-semibold text-lg">AI Engine</div>
                <div className="text-sm text-muted-foreground mt-2">MCP-Powered</div>
              </div>
              
              <ArrowRight className="text-primary rotate-90 md:rotate-0" />
              
              {/* Contracts */}
              <div className="flex-1 p-6 rounded-xl bg-card border border-border text-center">
                <div className="text-4xl mb-3">⛓️</div>
                <div className="font-semibold text-lg">On-Chain</div>
                <div className="text-sm text-muted-foreground mt-2">Smart Contracts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
