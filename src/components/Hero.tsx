import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import gamiLogo from '@/assets/gami-logo.png';

export const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLaunchApp = () => {
    navigate('/auth');
  };

  const handleViewLitepaper = () => {
    toast({
      title: "Litepaper Opening Soon",
      description: "Our comprehensive litepaper will be available shortly!",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30" />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-up">
          {/* Logo */}
          <img 
            src={gamiLogo} 
            alt="Gami Protocol Logo" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain opacity-90"
          />
          
          {/* Hero headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-tight">
            Your ultimate crypto wallet.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              Packed with features
            </span>{" "}
            to simplify your crypto journey
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Experience seamless transactions, secure storage, and powerful rewards management 
            all in one place. Built for the future of digital assets.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button variant="hero" size="lg" className="text-lg" onClick={handleLaunchApp}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="hero-outline" size="lg" className="text-lg" onClick={handleViewLitepaper}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
