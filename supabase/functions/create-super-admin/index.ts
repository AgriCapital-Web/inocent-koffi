import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const superAdminEmail = "Inocent.koffi@agricapital.ci";
    const superAdminPassword = "@Massa29012020";

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === superAdminEmail);

    let userId: string;

    if (existingUser) {
      console.log("Super admin user already exists, updating role...");
      userId = existingUser.id;
    } else {
      // Create the super admin user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: superAdminEmail,
        password: superAdminPassword,
        email_confirm: true,
        user_metadata: {
          full_name: "Inocent KOFFI",
          role: "super_admin",
        },
      });

      if (createError) {
        console.error("Error creating user:", createError);
        throw createError;
      }

      userId = newUser.user.id;
      console.log("Super admin user created:", userId);
    }

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!existingProfile) {
      // Create profile
      const { error: profileError } = await supabaseAdmin.from("profiles").insert({
        user_id: userId,
        email: superAdminEmail,
        full_name: "Inocent KOFFI",
      });

      if (profileError && profileError.code !== "23505") {
        console.error("Error creating profile:", profileError);
      }
    }

    // Check if super_admin role exists
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", "super_admin")
      .single();

    if (!existingRole) {
      // Assign super_admin role
      const { error: roleError } = await supabaseAdmin.from("user_roles").upsert({
        user_id: userId,
        role: "super_admin",
      }, {
        onConflict: "user_id,role"
      });

      if (roleError) {
        console.error("Error assigning role:", roleError);
        throw roleError;
      }
    }

    console.log("Super admin setup complete for:", superAdminEmail);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Super admin created/updated successfully",
        email: superAdminEmail 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
