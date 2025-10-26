export const Tokenomics = () => {
  const distribution = [
    { label: "Community Rewards", percentage: "50%", color: "bg-primary" },
    { label: "Team & Advisors", percentage: "20%", color: "bg-secondary" },
    { label: "Partners", percentage: "20%", color: "bg-accent" },
    { label: "Treasury", percentage: "10%", color: "bg-muted" },
  ];
  
  return (
    <section className="py-24 px-4 md:px-6 relative">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-primary">$GAMI</span> Tokenomics
            </h2>
            <p className="text-xl text-muted-foreground">
              Fueling the gamified economy with staking, governance, and universal XP multipliers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {distribution.map((item, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center text-2xl font-bold`}>
                    {item.percentage}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {item.label}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Token utility highlights */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="text-2xl font-bold mb-6 text-center">Token Utility</h3>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-2">🔒</div>
                <div className="font-semibold">Staking</div>
                <div className="text-sm text-muted-foreground mt-1">XP Multipliers</div>
              </div>
              <div>
                <div className="text-4xl mb-2">🗳️</div>
                <div className="font-semibold">Governance</div>
                <div className="text-sm text-muted-foreground mt-1">Policy Voting</div>
              </div>
              <div>
                <div className="text-4xl mb-2">⭐</div>
                <div className="font-semibold">Premium Tiers</div>
                <div className="text-sm text-muted-foreground mt-1">Partner Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
