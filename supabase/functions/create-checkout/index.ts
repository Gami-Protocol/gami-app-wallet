import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  const startTime = Date.now();
  const MIN_RESPONSE_TIME = 300; // milliseconds for consistent timing
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Configuration error");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authentication required");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error("Authentication failed");
    const user = userData.user;
    if (!user?.email) throw new Error("Authentication required");
    logStep("User authenticated", { userId: user.id.substring(0, 8) + "..." });

    // Rate limiting check
    const { data: rateLimitCheck } = await supabaseClient.rpc("check_rate_limit", {
      p_endpoint: "create-checkout",
      p_max_requests: 5,
      p_window_minutes: 1,
    });

    if (rateLimitCheck && !rateLimitCheck[0]?.allowed) {
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_RESPONSE_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - elapsed));
      }
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 429 }
      );
    }

    const { priceId } = await req.json();
    if (!priceId) throw new Error("Invalid request parameters");

    logStep("Creating checkout session");

    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2025-08-27.basil" 
    });

    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("Creating new customer");
    }

    const origin = req.headers.get("origin") || "http://localhost:8080";
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/business/dashboard?subscription=success`,
      cancel_url: `${origin}/auth?subscription=cancelled`,
    });

    logStep("Checkout session created", { sessionId: session.id });

    // Ensure consistent response timing
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_RESPONSE_TIME) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - elapsed));
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("[INTERNAL ERROR]", { message: error instanceof Error ? error.message : String(error) });
    
    // Ensure consistent response timing even for errors
    const elapsed = Date.now() - startTime;
    if (elapsed < MIN_RESPONSE_TIME) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - elapsed));
    }
    
    return new Response(JSON.stringify({ 
      error: "Unable to create checkout session. Please try again." 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
