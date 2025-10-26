import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "🧩",
    title: "Universal Rewards Layer",
    text: "Turn any action—purchase, post, or play—into on-chain XP and tradable rewards.",
  },
  {
    icon: "🤖",
    title: "AI-Driven Engagement",
    text: "Adaptive AI agents craft personalized quests, challenges, and bonuses in real time.",
  },
  {
    icon: "🔗",
    title: "Cross-Chain + Cross-App",
    text: "A unified layer compatible with Ethereum, Solana, Polygon, and Web2 APIs.",
  },
  {
    icon: "💰",
    title: "$GAMI Token Utility",
    text: "Stake for XP multipliers, govern policies, and unlock premium partner tiers.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-transparent bg-clip-text bg-gradient-primary">Gami?</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] group animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="text-5xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
