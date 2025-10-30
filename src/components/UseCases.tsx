import { Wallet, ArrowLeftRight, Lock, Sparkles } from "lucide-react";

export const UseCases = () => {
  const features = [
    {
      icon: Wallet,
      title: "Retail Stores",
      description: "Create in-store treasure hunts, product discovery quests, and loyalty challenges. Increase foot traffic by 40% and boost average transaction value.",
    },
    {
      icon: ArrowLeftRight,
      title: "Restaurants & Cafes",
      description: "Launch menu exploration quests, review challenges, and dining milestones. Build a loyal customer base and drive repeat visits with gamified experiences.",
    },
    {
      icon: Lock,
      title: "Fitness Centers",
      description: "Design workout challenges, class attendance quests, and health milestones. Boost member retention and create an engaged fitness community.",
    },
    {
      icon: Sparkles,
      title: "Hospitality",
      description: "Engage hotel guests with property exploration, amenity usage quests, and experience rewards. Increase on-site spending and positive reviews.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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