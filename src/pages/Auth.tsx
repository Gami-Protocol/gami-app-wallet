import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import gamiLogo from '@/assets/gami-logo.png';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isBusinessSignup, setIsBusinessSignup] = useState(false);
  const [loading, setLoading] = useState(false);
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
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/user/dashboard`,
          },
        });

        if (error) throw error;

        // If business signup, validate access code
        if (isBusinessSignup && accessCode) {
          const { data: validationData, error: validationError } = await supabase
            .rpc('validate_access_code', {
              p_code: accessCode,
              p_user_id: data.user!.id
            });

          if (validationError || !validationData?.[0]?.valid) {
            toast.error(validationData?.[0]?.error_message || "Invalid access code");
            return;
          }

          toast.success(`Business account created with ${validationData[0].tier} tier!`);
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
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>
                {isBusinessSignup && (
                  <div className="space-y-2">
                    <Label htmlFor="accessCode">Business Access Code</Label>
                    <Input
                      id="accessCode"
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      required
                      placeholder="ENTER-ACCESS-CODE"
                    />
                    <p className="text-xs text-muted-foreground">
                      Get your access code from the pricing page or after subscribing
                    </p>
                  </div>
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