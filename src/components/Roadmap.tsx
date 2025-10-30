import { CheckCircle, Circle, Sparkles } from "lucide-react";

export const Roadmap = () => {
  const phases = [
    {
      title: "Phase 1: Foundation & Launch",
      period: "Q4 2025 - Q2 2026",
      status: "current",
      items: [
        {
          category: "Product",
          points: [
            "Universal Wallet MVP (Mainnet)",
            "Core SDK & API v1.0 Release",
            "Basic MCP Services & Dashboard"
          ]
        },
        {
          category: "Ecosystem",
          points: [
            "Onboard 50+ early developer partners",
            "Secure 2-3 strategic enterprise pilots"
          ]
        },
        {
          category: "Token",
          points: [
            "$GAMI TGE (Token Generation Event)",
            "Initial DEX Listing",
            "Launch Staking Pools"
          ]
        }
      ]
    },
    {
      title: "Phase 2: Scale & Expansion",
      period: "Q3 2026 - Q1 2027",
      status: "upcoming",
      items: [
        {
          category: "Product",
          points: [
            "Cross-chain wallet support",
            "Advanced DeFi integrations",
            "Web2 & Web3 bridge tooling"
          ]
        },
        {
          category: "Ecosystem",
          points: [
            "Expand to 200+ active partners",
            "Launch partner revenue sharing",
            "Multi-chain deployment"
          ]
        },
        {
          category: "Token",
          points: [
            "CEX listings",
            "Enhanced staking rewards",
            "Governance token utilities"
          ]
        }
      ]
    },
    {
      title: "Phase 3: Ecosystem & DAO Governance",
      period: "2027+",
      status: "future",
      items: [
        {
          category: "Product",
          points: [
            "Full decentralized infrastructure",
            "AI-powered quest generation",
            "Enterprise SaaS platform"
          ]
        },
        {
          category: "Ecosystem",
          points: [
            "Community-owned network",
            "Global expansion across industries",
            "1000+ integrated applications"
          ]
        },
        {
          category: "Governance",
          points: [
            "Transition to full DAO",
            "Community proposal system",
            "Decentralized treasury management"
          ]
        }
      ]
    }
  ];

  return (
    <section id="roadmap" className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial opacity-20" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Roadmap: From Launch to Ecosystem Dominance
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Our strategic roadmap bridges Web2 and Web3, integrating DeFi infrastructure to create a fully decentralized community-owned network.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="group relative animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative p-8 md:p-10 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300">
                <div className="absolute top-8 left-8 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  {phase.status === "current" ? (
                    <Sparkles className="h-6 w-6 text-primary" />
                  ) : phase.status === "upcoming" ? (
                    <Circle className="h-6 w-6 text-primary/60" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                <div className="ml-20">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold">{phase.title}</h3>
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                      {phase.period}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {phase.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-3">
                        <h4 className="text-lg font-semibold text-accent">{item.category}</h4>
                        <ul className="space-y-2">
                          {item.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start gap-2 text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-lg">
            <span className="text-primary font-semibold">Bridging Web2 & Web3:</span> Seamlessly connecting traditional businesses with blockchain technology and DeFi infrastructure
          </p>
        </div>
      </div>
    </section>
  );
};
