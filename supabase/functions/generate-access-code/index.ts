import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Generate cryptographically secure random code
function generateCode(): string {
  // Use 16 random bytes for strong entropy
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  
  // Convert to base62 (alphanumeric) for readability
  const base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  
  for (let i = 0; i < 16; i++) {
    code += base62Chars[randomBytes[i] % 62];
  }
  
  // Format as XXXX-XXXX-XXXX-XXXX for readability
  return `${code.substring(0, 4)}-${code.substring(4, 8)}-${code.substring(8, 12)}-${code.substring(12, 16)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) throw new Error("Unauthorized");

    // Verify admin role server-side
    const { data: hasAdminAccess } = await supabaseClient
      .rpc("has_role", { _user_id: user.id, _role: "admin" });

    if (!hasAdminAccess) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        { status: 403, headers: corsHeaders }
      );
    }

    const { tier, max_uses, expires_in_days } = await req.json();

    // Validate tier
    const validTiers = ["starter", "growth", "enterprise", "free"];
    if (!tier || !validTiers.includes(tier)) {
      throw new Error("Invalid request parameters");
    }

    // Validate max_uses
    const validatedMaxUses = parseInt(String(max_uses || 1));
    if (isNaN(validatedMaxUses) || validatedMaxUses < 1 || validatedMaxUses > 10000) {
      throw new Error("Invalid request parameters");
    }

    // Validate expires_in_days
    let expiresAt = null;
    if (expires_in_days) {
      const validatedExpireDays = parseInt(String(expires_in_days));
      if (isNaN(validatedExpireDays) || validatedExpireDays < 1 || validatedExpireDays > 3650) {
        throw new Error("Invalid request parameters");
      }
      expiresAt = new Date(Date.now() + validatedExpireDays * 24 * 60 * 60 * 1000).toISOString();
    }

    const code = generateCode();

    const { data, error } = await supabaseClient
      .from("access_codes")
      .insert({
        code,
        tier,
        max_uses: validatedMaxUses,
        created_by: user.id,
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ code: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[INTERNAL] Error generating access code:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate access code. Please try again.",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
