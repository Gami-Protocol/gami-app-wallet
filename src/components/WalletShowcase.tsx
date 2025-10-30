import { Button } from "@/components/ui/button";
import { Apple, Chrome } from "lucide-react";

export const WalletShowcase = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Download the app
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Available on iOS and web. Start managing your crypto portfolio today with our intuitive mobile and desktop experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-base" disabled>
                <Apple className="mr-2 h-5 w-5" />
                Coming Soon - iOS
              </Button>
              <Button variant="hero-outline" size="lg" className="text-base">
                <Chrome className="mr-2 h-5 w-5" />
                Web App
              </Button>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-2xl bg-card border border-border text-center animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-xl font-bold mb-2">Cross-Platform</h3>
              <p className="text-muted-foreground text-sm">
                Access your wallet from any device, anywhere
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
              <p className="text-muted-foreground text-sm">
                Your keys, your crypto. Full control guaranteed
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground text-sm">
                Track your portfolio with live market data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}