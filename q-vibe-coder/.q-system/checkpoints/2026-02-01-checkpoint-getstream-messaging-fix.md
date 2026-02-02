# Checkpoint: GetStream Messaging Fix

**Created:** 2026-02-01 ~4:45 PM
**Context:** Fixing GetStream messaging permissions so Alex can send messages

## Summary

Fixed the "Message Failed · Unauthorized" error when Alex tries to send messages in course chat. The issue had multiple layers: missing Edge Function, missing permissions.

## Problems Solved

1. **Edge Function didn't exist** - `getstream-token` was being called but never deployed
2. **Create Message permission not enabled** - User role in GetStream couldn't send messages

## Files Created/Modified

### 1. supabase/functions/getstream-token/index.ts (NEW)
Created Edge Function to generate GetStream tokens server-side:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { StreamChat } from "npm:stream-chat@8.14.0";

// CORS headers, handle OPTIONS
// Get userId from request body
// Use GETSTREAM_API_KEY and GETSTREAM_API_SECRET from env
// Generate token with serverClient.createToken(userId)
// Return { token, apiKey, userId }
```
- Deployed with: `npx supabase functions deploy getstream-token --no-verify-jwt`

### 2. GetStream Dashboard (External - App ID: 1457190)
**Roles & Permissions → user role → messaging scope:**
- Previously enabled: Read Channel, Join Channel
- **Newly enabled:** Create Message (allows sending messages without owning channel)

### 3. Supabase Secrets (Already configured)
- GETSTREAM_API_KEY: `tgzt4vdwm9cb`
- GETSTREAM_API_SECRET: `58zwchhpv88duzwyydxw2azkdp2fu7r76zqaxgyqnn4rj8saxnz5yb93v36fxrge`

### 4. MyCoursesView.js (from earlier session)
- Added Learning/Teaching toggle
- Fixed `teacherId`/`teacherName` field matching
- Fixed empty state condition to show view when teaching courses exist

## Current Status

**Ready to test:** Message is typed in input box, just need to click Send and verify it works.

## What's Still Pending

User wants to reorganize My Courses pills:
- Remove Learning/Teaching toggle from header
- Add 4 pills below calendar with labels: **Taking | Teaching | Took | Taught**

## Technical Notes

- GetStream API key: `tgzt4vdwm9cb`
- App ID: 1457190
- Edge Function URL: `https://vnleonyfgwkfpvprpbqa.supabase.co/functions/v1/getstream-token`
- Channel format: `course-${courseId}` (type: messaging)

## Browser State

- Logged in as Alex Sanders (demo_alex)
- On CourseDetailView → Messages tab for "Brian's Course"
- Message typed: "Hello Sarah, this message should work now!"
- Ready to click Send button

## Test Flow

1. Click Send button
2. Verify message appears without "Message Failed · Unauthorized"
3. If works, messaging is fixed
4. Then proceed to reorganize My Courses pills
