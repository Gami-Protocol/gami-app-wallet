import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import gamiLogo from '@/assets/gami-logo.png';

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={gamiLogo} 
              alt="Gami Protocol" 
              className="h-10 w-auto object-contain opacity-90"
            />
            <span className="font-typewriter text-xl font-bold tracking-wide">
              Gami Protocol
            </span>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm hover:text-primary transition-colors">HOME</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">ABOUT</a>
            <a href="/pricing" className="text-sm hover:text-primary transition-colors">PRICING</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">DOCS</a>
            <Button variant="hero" size="sm" onClick={handleLaunchApp}>
              LAUNCH APP
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};
