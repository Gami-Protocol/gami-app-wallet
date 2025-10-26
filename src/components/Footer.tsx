export const Footer = () => {
  const footerLinks = {
    About: ["Vision", "Team", "Docs"],
    Developers: ["SDK", "API", "GitHub"],
    Community: ["Discord", "X (Twitter)", "Mirror Blog"],
  };
  
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Gami Protocol</h3>
            <p className="text-sm text-muted-foreground">
              The modular on-chain gamification engine
            </p>
          </div>
          
          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 Gami Protocol. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
