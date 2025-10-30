import { Button } from "@/components/ui/button";
import { Apple, Chrome } from "lucide-react";

export const WalletShowcase = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Launch your gamification program in three simple steps. No technical expertise required.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border text-center animate-fade-up hover:border-primary/30 transition-all" style={{ animationDelay: "0.1s" }}>
              <div className="mb-6 mx-auto p-4 rounded-2xl bg-primary/10 w-fit">
                <Apple className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Create Quests</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Design challenges tailored to your business goals. Set rewards, difficulty, and participation limits in minutes.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border text-center animate-fade-up hover:border-primary/30 transition-all" style={{ animationDelay: "0.2s" }}>
              <div className="mb-6 mx-auto p-4 rounded-2xl bg-primary/10 w-fit">
                <Chrome className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Customers Engage</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Users discover and complete quests through your mobile app or web platform. Watch engagement soar.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border text-center animate-fade-up hover:border-primary/30 transition-all" style={{ animationDelay: "0.3s" }}>
              <div className="mb-6 mx-auto p-4 rounded-2xl bg-primary/10 w-fit">
                <Chrome className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Track & Optimize</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Monitor real-time analytics, measure ROI, and issue token rewards. Optimize your strategy based on data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}