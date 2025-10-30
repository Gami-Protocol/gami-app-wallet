import { Wallet, ArrowLeftRight, Lock, Sparkles } from "lucide-react";

export const UseCases = () => {
  const features = [
    {
      icon: Wallet,
      title: "Multi-Chain Support",
      description: "Manage assets across Bitcoin, Ethereum, and other major blockchains from a single interface",
    },
    {
      icon: ArrowLeftRight,
      title: "Instant Transactions",
      description: "Send and receive crypto with lightning-fast processing and minimal fees",
    },
    {
      icon: Lock,
      title: "Bank-Grade Security",
      description: "Your private keys are encrypted and stored securely on your device. Never on our servers",
    },
    {
      icon: Sparkles,
      title: "Smart Features",
      description: "Advanced trading tools, portfolio tracking, and market insights at your fingertips",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need in one place
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Experience the most comprehensive crypto wallet designed for modern users
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