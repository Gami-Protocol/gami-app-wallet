import { Shield, Zap, Globe, Coins, TrendingUp, Lock } from "lucide-react";

export const Features = () => {
  const mainFeatures = [
    {
      icon: Zap,
      title: "Launch Quests in Minutes",
      description: "Create engaging challenges for your customers with our intuitive quest builder. Set rewards, difficulty levels, and participation limits tailored to your business goals.",
    },
    {
      icon: Coins,
      title: "Token-Based Reward System",
      description: "Issue branded tokens to customers who complete quests. Drive repeat visits, increase customer lifetime value, and build a loyal community around your brand.",
    },
  ];

  const secondaryFeatures = [
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Track quest performance, participant engagement, and ROI with comprehensive business dashboards.",
    },
    {
      icon: Globe,
      title: "Industry-Specific Templates",
      description: "Pre-built quest templates for retail, restaurants, gyms, and hospitality to get started fast.",
    },
    {
      icon: Lock,
      title: "Secure & Scalable",
      description: "Enterprise-grade infrastructure that grows with your business and keeps customer data protected.",
    },
    {
      icon: Shield,
      title: "Customer Wallet Integration",
      description: "Seamless wallet experience for your customers to earn, store, and redeem tokens across all quests.",
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 md:p-12 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6 p-4 rounded-2xl bg-primary/10 w-fit">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bitcoin Icon Section */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
              <Coins className="h-16 w-16 md:h-20 md:w-20 text-white" />
            </div>
          </div>
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryFeatures.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}