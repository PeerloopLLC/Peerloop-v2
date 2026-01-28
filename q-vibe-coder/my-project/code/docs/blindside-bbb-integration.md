# Blindside Networks BigBlueButton Integration Guide

## Overview
This document details how to integrate Blindside Networks BBB into a React app using Supabase Edge Functions. Based on real implementation and debugging experience.

---

## Credentials & Configuration

**API URL:** `https://peerloop.api.rna1.blindsidenetworks.com/bigbluebutton/api/`

**Shared Secret:** `s0M7I97lXEMLFl2uYJk8WgEJsY8qaaeXoyf1amKMetfEWa4Kl9I8v0YIBOTKycw1OGSz0jA3Lpd3hk21HM6ywA`

---

## Critical Implementation Details

### 1. URL Format - MUST include `/api/`

Blindside Networks provided this URL:
```
https://peerloop.api.rna1.blindsidenetworks.com/bigbluebutton/
```

**You MUST append `/api/` to make API calls work:**
```
https://peerloop.api.rna1.blindsidenetworks.com/bigbluebutton/api/
```

- Without `/api/` → 404 Not Found on create/join calls
- With `/api/` → API calls succeed

Both URLs return SUCCESS on a health check (hitting the base URL), but actual API methods (create, join) require the `/api/` path.

### 2. MUST Open in New Tab - NO IFRAME

**Critical:** Blindside Networks does NOT support iframe embedding. The meeting will show "Oops, something went wrong" if loaded in an iframe.

**Solution:** Always use `window.open(joinUrl, '_blank')` to open in a new tab.

### 3. Multi-Tenant Server Architecture

When you call the API at `peerloop.api.rna1.blindsidenetworks.com`, the join URL will redirect to a different meeting server like:
- `myda412331.rna1.blindsidenetworks.com`
- `myda412332.rna1.blindsidenetworks.com`

This is normal behavior - the API endpoint and meeting servers are different in their infrastructure.

---

## Supabase Edge Function Implementation

**File:** `supabase/functions/bbb-join/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Blindside Networks BBB credentials
const BBB_URL = "https://peerloop.api.rna1.blindsidenetworks.com/bigbluebutton/api/";
const BBB_SECRET = "s0M7I97lXEMLFl2uYJk8WgEJsY8qaaeXoyf1amKMetfEWa4Kl9I8v0YIBOTKycw1OGSz0jA3Lpd3hk21HM6ywA";

// Generate SHA-1 checksum for BBB API calls
// BBB requires all API calls to be signed with a checksum
async function generateChecksum(callName: string, queryString: string): Promise<string> {
  // Format: methodName + queryString + secret (no separators)
  const data = callName + queryString + BBB_SECRET;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-1", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Build URL-encoded query string
// Important: BBB requires ! to be encoded as %21
function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => {
      const encodedValue = encodeURIComponent(value).replace(/!/g, "%21");
      return `${encodeURIComponent(key)}=${encodedValue}`;
    })
    .join("&");
}

// CORS headers - adjust origin for production
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

    // Validate required fields
    if (!courseId || !courseName || !userName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: courseId, courseName, userName" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create persistent meeting ID based on course
    // Same courseId = same meeting room (participants can rejoin)
    const meetingID = `peerloop-course-${courseId}`;
    const meetingName = `${courseName} - Live Session`;

    // Step 1: Create meeting (or get existing)
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

    // Check for success - BBB returns XML
    // SUCCESS = new meeting created
    // duplicateWarning = meeting already exists (still valid)
    if (!createText.includes("<returncode>SUCCESS</returncode>") &&
        !createText.includes("duplicateWarning")) {
      console.error("BBB create failed:", createText);
      return new Response(
        JSON.stringify({ error: "Failed to create meeting", details: createText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Generate join URL
    const joinParams = {
      meetingID,
      fullName: userName,
      password: "moderator", // Use "attendee" for non-moderators
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
```

---

## Client-Side Implementation (React)

**Calling the edge function and opening in new tab:**

```javascript
const handleJoinSession = async (session) => {
  try {
    const response = await fetch('https://YOUR_PROJECT.supabase.co/functions/v1/bbb-join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`, // If auth required
      },
      body: JSON.stringify({
        courseId: session.courseId,
        courseName: session.courseName,
        userName: currentUser.name,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create meeting');
    }

    // CRITICAL: Must open in new tab - iframe will NOT work
    window.open(data.joinUrl, '_blank');

  } catch (error) {
    console.error('Failed to join session:', error);
    alert('Failed to join session. Please try again.');
  }
};
```

---

## Checksum Calculation Details

BBB uses SHA-1 checksums to validate API calls. The format is:

```
SHA1(methodName + queryString + sharedSecret)
```

**Example for create:**
```
Input: "createmeetingID=test123&name=Test%20Meeting&attendeePW=ap&moderatorPW=mp&welcome=Hello&record=falseYOUR_SECRET_HERE"
Output: SHA-1 hash (40 hex characters)
```

**Important:**
- No separators between method name, query string, and secret
- Query string must be URL-encoded
- Use the SAME encoded query string for checksum calculation AND the actual URL
- `!` must be encoded as `%21` (encodeURIComponent doesn't do this by default)

---

## Deployment

### Deploy Edge Function via Supabase CLI:
```bash
supabase functions deploy bbb-join --project-ref YOUR_PROJECT_REF
```

### Or via Supabase Dashboard:
1. Go to Edge Functions → bbb-join
2. Click "Deploy new version"
3. Paste the code
4. Deploy

---

## What Worked vs What Didn't

### What Worked
- URL with `/api/` suffix: `https://peerloop.api.rna1.blindsidenetworks.com/bigbluebutton/api/`
- Opening meeting in new tab via `window.open()`
- SHA-1 checksum generation using Web Crypto API
- Supabase Edge Function for server-side API calls

### What Didn't Work
- URL without `/api/` → 404 errors
- Iframe embedding → "Oops, something went wrong" (Blindside blocks this)
- Initially tried client-side BBB calls (secret would be exposed - bad)

---

## Troubleshooting

### 404 Not Found on create/join
- Check that URL ends with `/api/`

### "Oops, something went wrong" in meeting
- You're probably using an iframe
- Switch to `window.open()` in new tab

### 401 Unauthorized
- Verify the shared secret is correct
- Check checksum calculation
- Ensure query string encoding matches between checksum and URL

### Checksum errors
- Verify method name is prepended (e.g., "create", "join")
- Ensure no separators between parts
- Check URL encoding consistency

---

## Security Notes

1. **Never expose the shared secret on the client side**
2. Use a server-side function (Edge Function, API route) for BBB API calls
3. Validate user authentication before allowing meeting joins
4. Consider adding rate limiting to the edge function

---

## Useful BBB API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `create` | Create a new meeting |
| `join` | Generate join URL |
| `end` | End a meeting |
| `isMeetingRunning` | Check if meeting is active |
| `getMeetingInfo` | Get meeting details |

Full API docs: https://docs.bigbluebutton.org/development/api

---

## Contact

For Blindside Networks support:
- Email: support@blindsidenetworks.com
- Phone: 613-695-0264
- Hours: Monday-Friday, 9:00-17:00 ET
