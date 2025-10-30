import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PricingCTA = () => {
  const navigate = useNavigate();

  const plans = [
    {
      icon: Zap,
      name: "Starter",
      price: "$49",
      description: "Perfect for small businesses",
      color: "text-primary"
    },
    {
      icon: Rocket,
      name: "Growth",
      price: "$149",
      description: "For scaling operations",
      color: "text-secondary",
      popular: true
    },
    {
      icon: Crown,
      name: "Enterprise",
      price: "$499",
      description: "Complete solution",
      color: "text-accent"
    }
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-primary">Transform</span> Your Business?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Join businesses using Gami Protocol to drive engagement and growth. Choose the plan that fits your needs.
          </p>
        </div>

        {/* Quick Plan Overview */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative p-6 rounded-2xl bg-card border ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} hover:border-primary/50 transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-primary text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <Icon className={`h-8 w-8 ${plan.color} mb-4`} />
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="gap-2 text-lg px-8"
            onClick={() => navigate('/pricing')}
          >
            View All Plans
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 text-lg px-8"
            onClick={() => navigate('/auth')}
          >
            Start Free Trial
          </Button>
        </div>

        {/* Benefits */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span>Early airdrop access</span>
          </div>
        </div>
      </div>
    </section>
  );
};
