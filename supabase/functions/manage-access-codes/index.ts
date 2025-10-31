import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const { data: user, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    const { data: hasAdminAccess } = await supabaseClient
      .rpc("has_role", { _user_id: user.user.id, _role: "admin" });

    if (!hasAdminAccess) {
      throw new Error("Access denied");
    }

    const { action, code_id } = await req.json();

    if (action === "list") {
      // List all access codes with usage stats
      const { data: codes, error } = await supabaseClient
        .from("access_codes")
        .select(`
          *,
          user_access_codes(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ codes }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "deactivate") {
      if (!code_id) throw new Error("Invalid request");

      const { error } = await supabaseClient
        .from("access_codes")
        .update({ is_active: false })
        .eq("id", code_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "activate") {
      if (!code_id) throw new Error("Invalid request");

      const { error } = await supabaseClient
        .from("access_codes")
        .update({ is_active: true })
        .eq("id", code_id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error("[INTERNAL] Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500, headers: corsHeaders }
    );
  }
});
