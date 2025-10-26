import { Button } from "@/components/ui/button";
import { Code2, Users } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
          <h2 className="text-4xl md:text-6xl font-bold">
            Join the <span className="text-transparent bg-clip-text bg-gradient-primary">Universal Rewards Layer</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Developers, creators, and brands — plug in your world and start rewarding engagement instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button variant="hero" size="lg" className="text-lg">
              <Code2 className="mr-2 h-5 w-5" />
              Integrate SDK
            </Button>
            <Button variant="hero-outline" size="lg" className="text-lg">
              <Users className="mr-2 h-5 w-5" />
              Join the Waitlist
            </Button>
          </div>
        </div>
      </div>
      
      {/* Animated orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
    </section>
  );
};
