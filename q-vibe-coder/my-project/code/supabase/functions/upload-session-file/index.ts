import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the form data with the file
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const filename = formData.get("filename") as string || file.name;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    const isPpt = file.name.toLowerCase().endsWith(".ppt") || file.name.toLowerCase().endsWith(".pptx");

    if (!allowedTypes.includes(file.type) && !isPdf && !isPpt) {
      return new Response(
        JSON.stringify({ error: "Only PDF and PowerPoint files are allowed" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file size (30MB max)
    if (file.size > 30 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "File size must be under 30MB" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Clean filename
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "-");

    // Upload to storage
    const { data, error } = await supabase.storage
      .from("session-files")
      .upload(cleanFilename, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("session-files")
      .getPublicUrl(cleanFilename);

    return new Response(
      JSON.stringify({
        success: true,
        filename: cleanFilename,
        url: urlData.publicUrl,
        name: file.name.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
