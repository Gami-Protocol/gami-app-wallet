import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(107,78,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(107,78,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-up">
          {/* Logo placeholder - will add image later */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary animate-glow" />
          
          {/* Hero headline with mixed typography */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl font-display">
            <span className="text-foreground">The Modular</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              On-Chain
            </span>{" "}
            <span className="text-foreground">Gamification Engine</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
            Unify XP, rewards, and AI-driven engagement across apps, games, and blockchains.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="hero" size="lg" className="text-lg">
              Launch App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="lg" className="text-lg">
              <FileText className="mr-2 h-5 w-5" />
              View Litepaper
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating orbs animation */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </section>
  );
};
