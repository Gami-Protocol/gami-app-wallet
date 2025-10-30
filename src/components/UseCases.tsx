import { Wallet, ArrowLeftRight, Lock, Sparkles, Gamepad2, Coins, ShoppingBag, Dumbbell, Building2, Plane } from "lucide-react";

export const UseCases = () => {
  const features = [
    {
      icon: Coins,
      title: "Crypto Platforms",
      description: "Drive DeFi protocol adoption with staking quests, trading challenges, and liquidity rewards. Increase TVL and user engagement through gamified on-chain activities.",
    },
    {
      icon: Gamepad2,
      title: "Gaming Studios",
      description: "Integrate cross-game quests, achievement systems, and player progression. Build vibrant gaming communities with shared reward pools and competitive leaderboards.",
    },
    {
      icon: Wallet,
      title: "Retail & E-commerce",
      description: "Create in-store treasure hunts, product discovery quests, and loyalty challenges. Increase foot traffic by 40% and boost average transaction value.",
    },
    {
      icon: ArrowLeftRight,
      title: "Restaurants & Cafes",
      description: "Launch menu exploration quests, review challenges, and dining milestones. Build a loyal customer base and drive repeat visits with gamified experiences.",
    },
    {
      icon: Dumbbell,
      title: "Fitness & Wellness",
      description: "Design workout challenges, class attendance quests, and health milestones. Boost member retention and create an engaged fitness community.",
    },
    {
      icon: Plane,
      title: "Hospitality & Travel",
      description: "Engage hotel guests with property exploration, amenity usage quests, and experience rewards. Increase on-site spending and positive reviews.",
    },
    {
      icon: Building2,
      title: "Real Estate",
      description: "Gamify property tours, referral programs, and client engagement. Track milestone achievements and reward successful closings with automated quest systems.",
    },
    {
      icon: ShoppingBag,
      title: "Fashion & Beauty",
      description: "Create style challenges, trend discovery quests, and social sharing rewards. Build brand loyalty through exclusive access and personalized gamified experiences.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Target Industries
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Proven engagement solutions driving measurable results across multiple sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 p-4 rounded-xl bg-primary/10 w-fit">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}