// Supabase Edge Function for BigBlueButton integration
// This function creates a BBB meeting and returns the join URL

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// BBB credentials - hardcoded for testing
const BBB_URL = "https://biggerbluebutton.com/bigbluebutton/peerloop/api/";
const BBB_SECRET = "yi97Xfc4CusF0VvNRuwL7WopWakRCwXRebpD2aficA8";

// Generate SHA-1 checksum for BBB API calls
async function generateChecksum(callName: string, queryString: string): Promise<string> {
  const data = callName + queryString + BBB_SECRET;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-1", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Build URL-encoded query string - encodes ! as %21 for BBB compatibility
function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => {
      // encodeURIComponent doesn't encode !, but BBB requires it
      const encodedValue = encodeURIComponent(value).replace(/!/g, "%21");
      return `${encodeURIComponent(key)}=${encodedValue}`;
    })
    .join("&");
}

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { courseId, courseName, userName } = await req.json();

    if (!courseId || !courseName || !userName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: courseId, courseName, userName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build meeting parameters
    const meetingID = `peerloop-course-${courseId}`;
    const meetingName = `${courseName} - Live Session`;

    // Create meeting parameters
    const createParams = {
      meetingID,
      name: meetingName,
      attendeePW: "attendee",
      moderatorPW: "moderator",
      welcome: `Welcome to ${meetingName}!`,
      record: "false",
    };

    const createQueryString = buildQueryString(createParams);
    const createChecksum = await generateChecksum("create", createQueryString);
    const createUrl = `${BBB_URL}create?${createQueryString}&checksum=${createChecksum}`;

    // Call BBB create API
    const createResponse = await fetch(createUrl);
    const createText = await createResponse.text();

    // Check if create was successful (look for SUCCESS in XML response)
    if (!createText.includes("<returncode>SUCCESS</returncode>") &&
        !createText.includes("duplicateWarning")) {
      console.error("BBB create failed:", createText);
      return new Response(
        JSON.stringify({ error: "Failed to create meeting", details: createText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build join URL
    const joinParams = {
      meetingID,
      fullName: userName,
      password: "moderator", // Everyone joins as moderator
      redirect: "true",
    };

    const joinQueryString = buildQueryString(joinParams);
    const joinChecksum = await generateChecksum("join", joinQueryString);
    const joinUrl = `${BBB_URL}join?${joinQueryString}&checksum=${joinChecksum}`;

    return new Response(
      JSON.stringify({
        success: true,
        joinUrl,
        meetingID
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
