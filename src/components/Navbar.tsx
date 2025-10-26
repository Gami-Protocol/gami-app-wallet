import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { login, authenticated } = useAuth();
  const navigate = useNavigate();

  const handleLaunchApp = () => {
    if (authenticated) {
      navigate('/wallet');
    } else {
      login();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary" />
            <span className="font-bold text-xl">Gami Protocol</span>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm hover:text-primary transition-colors">HOME</a>
            <a href="#" className="text-sm hover:text-primary transition-colors">ABOUT</a>
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
