import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-12 md:p-16 text-center overflow-hidden border border-primary/20 animate-fade-up">
            <div className="absolute inset-0 bg-gradient-radial opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Start your crypto journey today
              </h2>
              <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of users managing their digital assets securely with Gami Protocol
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="text-lg bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg border-foreground/20 hover:bg-foreground/10">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}