// Supabase Edge Function for BigBlueButton integration
// This function creates a BBB meeting and returns the join URL

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Blindside Networks BBB credentials
const BBB_URL = "https://peerloop.api.rna1.blindsidenetworks.com/bigbluebutton/api/";
const BBB_SECRET = "s0M7I97lXEMLFl2uYJk8WgEJsY8qaaeXoyf1amKMetfEWa4Kl9I8v0YIBOTKycw1OGSz0jA3Lpd3hk21HM6ywA";

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
    const { courseId, courseName, userName, sessionFiles, baseUrl } = await req.json();

    if (!courseId || !courseName || !userName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: courseId, courseName, userName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build meeting parameters
    const meetingID = `peerloop-course-${courseId}`;
    const meetingName = `${courseName} - Live Session`;

    // Build welcome message with file links if files are provided
    let welcomeMessage = `Welcome to ${meetingName}!`;
    if (sessionFiles && sessionFiles.length > 0 && baseUrl) {
      const fileLinks = sessionFiles.map((file: { name: string; url: string }) => {
        const absoluteUrl = file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`;
        return `<br/>• <a href="${absoluteUrl}" target="_blank">${file.name}</a>`;
      }).join('');
      welcomeMessage += `<br/><br/><b>Session Materials:</b>${fileLinks}`;
    }

    // Create meeting parameters
    const createParams = {
      meetingID,
      name: meetingName,
      attendeePW: "attendee",
      moderatorPW: "moderator",
      welcome: welcomeMessage,
      record: "false",
    };

    const createQueryString = buildQueryString(createParams);
    const createChecksum = await generateChecksum("create", createQueryString);
    const createUrl = `${BBB_URL}create?${createQueryString}&checksum=${createChecksum}`;

    // Build XML body for presentations if sessionFiles are provided
    let requestBody: string | undefined;
    let contentType = "application/x-www-form-urlencoded";

    if (sessionFiles && sessionFiles.length > 0 && baseUrl) {
      // Build XML for pre-uploading presentations to BBB
      // BBB requires: current="true" for default, downloadable="true" to show in menu
      const documentXml = sessionFiles.map((file: { name: string; url: string }, index: number) => {
        // Convert relative URL to absolute URL
        const absoluteUrl = file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`;
        // First file is current (default), all are downloadable to appear in + menu
        const currentAttr = index === 0 ? ' current="true"' : '';
        // Ensure filename has extension
        const filename = file.name.includes('.') ? file.name : `${file.name}.pdf`;
        return `<document url="${absoluteUrl}" filename="${filename}" downloadable="true"${currentAttr}/>`;
      }).join('\n        ');

      requestBody = `<?xml version="1.0" encoding="UTF-8"?>
<modules>
  <module name="presentation">
    ${documentXml}
  </module>
</modules>`;
      contentType = "application/xml";
      console.log("Uploading presentations to BBB:", requestBody);
    }

    // Call BBB create API (POST with body if files, GET otherwise)
    const createResponse = sessionFiles && sessionFiles.length > 0
      ? await fetch(createUrl, {
          method: "POST",
          headers: { "Content-Type": contentType },
          body: requestBody
        })
      : await fetch(createUrl);
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

    // If meeting already existed (duplicate) and we have files, use insertDocument API
    // This adds presentations to an existing meeting
    if (createText.includes("duplicateWarning") && sessionFiles && sessionFiles.length > 0 && baseUrl) {
      console.log("Meeting already exists, using insertDocument API to add presentations");

      const insertParams = { meetingID };
      const insertQueryString = buildQueryString(insertParams);
      const insertChecksum = await generateChecksum("insertDocument", insertQueryString);
      const insertUrl = `${BBB_URL}insertDocument?${insertQueryString}&checksum=${insertChecksum}`;

      // Build XML for insertDocument - same format as create
      const documentXml = sessionFiles.map((file: { name: string; url: string }, index: number) => {
        const absoluteUrl = file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`;
        const currentAttr = index === 0 ? ' current="true"' : '';
        const filename = file.name.includes('.') ? file.name : `${file.name}.pdf`;
        return `<document url="${absoluteUrl}" filename="${filename}" downloadable="true"${currentAttr}/>`;
      }).join('\n        ');

      const insertBody = `<?xml version="1.0" encoding="UTF-8"?>
<modules>
  <module name="presentation">
    ${documentXml}
  </module>
</modules>`;

      console.log("Inserting documents:", insertBody);

      const insertResponse = await fetch(insertUrl, {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: insertBody
      });
      const insertText = await insertResponse.text();
      console.log("insertDocument response:", insertText);
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
