import { Shield, Zap, Globe, Coins, TrendingUp, Lock } from "lucide-react";

export const Features = () => {
  const mainFeatures = [
    {
      icon: Shield,
      title: "Why choose Gami as your ultimate crypto companion?",
      description: "Built with security, simplicity, and innovation at its core. Manage your digital assets with confidence.",
    },
    {
      icon: Zap,
      title: "For newbies",
      description: "User-friendly interface designed for beginners. Start your crypto journey with ease and confidence.",
    },
  ];

  const secondaryFeatures = [
    {
      icon: Globe,
      title: "Blockchain Network",
      description: "Connect to multiple networks seamlessly. Trade, stake, and manage assets across chains.",
    },
    {
      icon: Coins,
      title: "Explore, create, and trade your digital assets",
      description: "Access a complete ecosystem for managing your crypto portfolio with powerful tools.",
    },
    {
      icon: TrendingUp,
      title: "Experience the future",
      description: "Stay ahead with cutting-edge features and real-time market insights.",
    },
    {
      icon: Lock,
      title: "Security first",
      description: "Bank-level encryption and secure storage keep your assets protected 24/7.",
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