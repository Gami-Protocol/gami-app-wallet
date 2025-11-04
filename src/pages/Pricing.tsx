import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Rocket, Crown, Bitcoin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';

// Stripe product configuration
const PRICING_TIERS = {
  starter: {
    name: 'Starter',
    price: 49,
    priceId: 'price_1SO3fALyzH8oCVgKZZMXQA7Q',
    productId: 'prod_TKj78w1nS9wYGQ',
    description: 'Perfect for small businesses getting started',
    icon: Zap,
    popular: false,
    features: [
      'Up to 10 quests per month',
      'Basic analytics dashboard',
      'Email support',
      'Community access',
      'Standard XP rewards',
      '100 active users'
    ]
  },
  growth: {
    name: 'Growth',
    price: 149,
    priceId: 'price_1SO3fQLyzH8oCVgK5Tshnpwx',
    productId: 'prod_TKj7lUhvPzeGc5',
    description: 'For growing businesses with advanced needs',
    icon: Rocket,
    popular: true,
    features: [
      'Unlimited quests',
      'Advanced analytics & insights',
      'Priority support',
      'Custom branding',
      'Enhanced XP multipliers',
      '1,000 active users',
      'API access',
      'Webhook integrations'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    priceId: 'price_1SO3fuLyzH8oCVgKZbbOxU3O',
    productId: 'prod_TKj8EGDpUaINKq',
    description: 'Enterprise solution with premium features',
    icon: Crown,
    popular: false,
    features: [
      'Unlimited everything',
      'White-label solution',
      'Dedicated support team',
      'Custom integrations',
      'Early access to new features',
      'Unlimited active users',
      'Priority airdrop allocation',
      'Custom quest templates',
      'Advanced security features',
      'SLA guarantee'
    ]
  }
};

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string, planName: string) => {
    setLoading(priceId);
    try {
      // Prompt for email
      const email = prompt("Please enter your email address to continue:");
      
      if (!email) {
        toast({
          title: "Email Required",
          description: "Please provide your email to continue with checkout",
          variant: "destructive",
        });
        setLoading(null);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please provide a valid email address",
          variant: "destructive",
        });
        setLoading(null);
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, email }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
        toast({
          title: "Redirecting to Checkout",
          description: `Opening Stripe checkout for ${planName} plan`,
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-4 py-24 md:py-32">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4" variant="secondary">
            Flexible Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-primary">Growth Path</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Start free, scale as you grow. All plans include core gamification features.
          </p>
        </div>

        {/* Crypto Payment Notice */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="border-secondary/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Bitcoin className="h-6 w-6 text-secondary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Crypto Payments Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay with $GAMI tokens or major cryptocurrencies. Early subscribers get priority access and bonus airdrop allocation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {Object.entries(PRICING_TIERS).map(([key, tier]) => {
            const Icon = tier.icon;
            return (
              <Card 
                key={key}
                className={`relative ${tier.popular ? 'border-primary shadow-2xl scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button 
                    className="w-full" 
                    size="lg"
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(tier.priceId, tier.name)}
                    disabled={loading === tier.priceId}
                  >
                    {loading === tier.priceId ? 'Loading...' : 'Subscribe Now'}
                  </Button>
                  
                  <div className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Early Access Benefits */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-primary text-white border-0">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold mb-4 text-center">🎁 Early Subscriber Benefits</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">2x</div>
                  <p className="text-sm opacity-90">Airdrop Allocation Multiplier</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Priority</div>
                  <p className="text-sm opacity-90">Feature Access & Support</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">Exclusive</div>
                  <p className="text-sm opacity-90">Beta Features & Tools</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades at the end of your billing cycle.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens to my data if I cancel?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your data is retained for 30 days after cancellation. You can reactivate anytime within this period with no data loss.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">When will crypto payments be available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Crypto payment integration is coming in Q2 2026. Early subscribers will get priority access and bonus allocation when it launches.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
