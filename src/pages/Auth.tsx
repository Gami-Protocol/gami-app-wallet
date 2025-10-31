import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import gamiLogo from '@/assets/gami-logo.png';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const BUSINESS_TIERS = {
  starter: {
    name: "Starter",
    price: "$49/month",
    priceId: "price_1SO3fALyzH8oCVgKZZMXQA7Q",
    productId: "prod_TKj78w1nS9wYGQ",
    features: ["Up to 10 quests/month", "Basic analytics", "Email support"],
  },
  growth: {
    name: "Growth",
    price: "$149/month",
    priceId: "price_1SO3fQLyzH8oCVgK5Tshnpwx",
    productId: "prod_TKj7lUhvPzeGc5",
    features: ["Unlimited quests", "Advanced analytics", "Priority support"],
  },
  enterprise: {
    name: "Enterprise",
    price: "$499/month",
    priceId: "price_1SO3fuLyzH8oCVgKZbbOxU3O",
    productId: "prod_TKj8EGDpUaINKq",
    features: ["White-label options", "Dedicated support", "Custom integrations"],
  },
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isBusinessSignup, setIsBusinessSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<keyof typeof BUSINESS_TIERS>("starter");
  
  // Business-specific fields
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome back!");
        
        // Get user role to redirect appropriately
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

        if (roles?.some(r => r.role === "business" || r.role === "admin")) {
          navigate("/business/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        // Sign up user first
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || undefined,
            },
            emailRedirectTo: isBusinessSignup 
              ? `${window.location.origin}/business/dashboard`
              : `${window.location.origin}/user/dashboard`,
          },
        });

        if (error) throw error;

        // Update profile with username if provided
        if (username && data.user) {
          await supabase
            .from("profiles")
            .update({ username })
            .eq("id", data.user.id);
        }

        // If business signup with subscription
        if (isBusinessSignup) {
          if (!businessName || !contactName || !contactEmail) {
            toast.error("Please fill in all required business information");
            return;
          }

          // Create business profile
          const { error: businessError } = await supabase
            .from("business_profiles")
            .insert({
              user_id: data.user!.id,
              business_name: businessName,
              primary_contact_name: contactName,
              primary_contact_email: contactEmail,
              primary_contact_phone: contactPhone || null,
            });

          if (businessError) {
            toast.error("Failed to create business profile");
            console.error(businessError);
            return;
          }

          // Assign business role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: data.user!.id,
              role: 'business'
            });

          if (roleError) {
            console.error("Role assignment error:", roleError);
          }

          // If they have an access code, validate it for free tier
          if (accessCode) {
            const { data: validationData, error: validationError } = await supabase
              .rpc('validate_access_code', {
                p_code: accessCode,
                p_user_id: data.user!.id
              });

            if (validationError || !validationData?.[0]?.valid) {
              toast.error(validationData?.[0]?.error_message || "Invalid access code");
            } else {
              toast.success(`Business account created with access code!`);
              navigate("/business/dashboard");
              return;
            }
          }

          // Otherwise, redirect to checkout for subscription
          toast.success("Account created! Redirecting to checkout...");
          
          const { data: sessionData, error: checkoutError } = await supabase.functions.invoke(
            'create-checkout',
            {
              body: { priceId: BUSINESS_TIERS[selectedTier].priceId }
            }
          );

          if (checkoutError || !sessionData?.url) {
            toast.error("Failed to create checkout session. Please contact support.");
            navigate("/business/dashboard");
            return;
          }

          // Open checkout in new tab
          window.open(sessionData.url, '_blank');
          navigate("/business/dashboard");
        } else {
          toast.success("Account created successfully!");
          navigate("/user/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <img src={gamiLogo} alt="Gami Protocol" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl text-center">
            {isLogin ? "Welcome Back" : isBusinessSignup ? "Business Signup" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Sign in to access your wallet and quests"
              : isBusinessSignup
              ? "Create a business account with your access code"
              : "Join Gami Protocol and start earning rewards"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                {!isBusinessSignup ? (
                  <div className="space-y-2">
                    <Label htmlFor="username">Username (optional)</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can skip this if you prefer not to display a username
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                      <h3 className="font-semibold">Choose Your Plan</h3>
                      <RadioGroup value={selectedTier} onValueChange={(value) => setSelectedTier(value as keyof typeof BUSINESS_TIERS)}>
                        {Object.entries(BUSINESS_TIERS).map(([key, tier]) => (
                          <div key={key} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-background cursor-pointer">
                            <RadioGroupItem value={key} id={key} className="mt-1" />
                            <Label htmlFor={key} className="flex-1 cursor-pointer">
                              <div className="font-semibold">{tier.name} - {tier.price}</div>
                              <ul className="text-sm text-muted-foreground mt-1">
                                {tier.features.map((feature, idx) => (
                                  <li key={idx}>• {feature}</li>
                                ))}
                              </ul>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Primary Contact Name</Label>
                      <Input
                        id="contactName"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Primary Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        required
                        placeholder="john@acme.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Primary Contact Phone (optional)</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accessCode">Access Code (optional)</Label>
                      <Input
                        id="accessCode"
                        type="text"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                        placeholder="ENTER-ACCESS-CODE"
                      />
                      <p className="text-xs text-muted-foreground">
                        Have an access code? Enter it to skip payment
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="mt-4 space-y-2 text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setIsBusinessSignup(false);
              }}
              className="text-primary hover:underline block w-full"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
            {!isLogin && (
              <button
                type="button"
                onClick={() => setIsBusinessSignup(!isBusinessSignup)}
                className="text-primary hover:underline block w-full"
              >
                {isBusinessSignup
                  ? "Switch to user signup"
                  : "Business signup? Enter access code"}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}