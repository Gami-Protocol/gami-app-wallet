import { Button } from "@/components/ui/button";
import { Download, Globe } from "lucide-react";

export const WalletShowcase = () => {
  return (
    <section className="py-24 px-4 md:px-6 relative">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold">
              The <span className="text-transparent bg-clip-text bg-gradient-primary">Gami Wallet</span> App
            </h2>
            <p className="text-xl text-muted-foreground">
              Your cross-platform rewards wallet — track XP, complete quests, stake $GAMI, 
              and redeem across all partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg" disabled>
                <Download className="mr-2 h-5 w-5" />
                Coming Soon - iOS
              </Button>
              <Button variant="hero-outline" size="lg">
                <Globe className="mr-2 h-5 w-5" />
                Launch Web App
              </Button>
            </div>
          </div>
          
          {/* Wallet mockup placeholder */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative aspect-[9/16] max-w-sm mx-auto">
              {/* Phone frame */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-primary p-1">
                <div className="h-full w-full rounded-[2.8rem] bg-card overflow-hidden">
                  {/* Mock wallet UI */}
                  <div className="p-6 space-y-4">
                    <div className="h-8 w-32 bg-gradient-primary rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                    
                    {/* XP Card */}
                    <div className="mt-6 p-6 rounded-2xl bg-gradient-primary space-y-2">
                      <div className="text-sm opacity-80">Total XP</div>
                      <div className="text-4xl font-bold">12,845</div>
                      <div className="text-sm opacity-80">Tier: Gold ⭐</div>
                    </div>
                    
                    {/* Quest items */}
                    <div className="space-y-3 pt-4">
                      <div className="h-16 bg-muted/50 rounded-xl" />
                      <div className="h-16 bg-muted/50 rounded-xl" />
                      <div className="h-16 bg-muted/50 rounded-xl" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-primary opacity-20 blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
