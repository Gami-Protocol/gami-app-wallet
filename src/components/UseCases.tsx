import { Card, CardContent } from "@/components/ui/card";

const useCases = [
  {
    title: "E-Commerce",
    text: "Turn purchases into XP and loyalty NFTs redeemable anywhere.",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Fitness & Wellness",
    text: "Gamify health goals with move-to-earn XP and tier rewards.",
    gradient: "from-secondary/20 to-secondary/5",
  },
  {
    title: "Social & DAO Engagement",
    text: "Reward creators and contributors through transparent on-chain logic.",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    title: "DeFi & Web3 Gaming",
    text: "Integrate quests and leaderboards directly into your on-chain app.",
    gradient: "from-primary/20 to-secondary/5",
  },
];

export const UseCases = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative bg-gradient-to-b from-card/30 to-background">
      <div className="container">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Use <span className="text-transparent bg-clip-text bg-gradient-primary">Cases</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {useCases.map((useCase, index) => (
            <Card 
              key={index} 
              className={`bg-gradient-to-br ${useCase.gradient} backdrop-blur border-border hover:border-primary/50 transition-all group animate-fade-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 space-y-3">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-primary transition-all">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {useCase.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
