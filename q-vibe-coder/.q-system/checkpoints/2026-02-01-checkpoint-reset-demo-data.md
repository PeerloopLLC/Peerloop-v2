# Checkpoint: Reset Demo Data Feature

**Created:** 2026-02-01 ~midnight
**Context:** Implemented Reset Demo Data button to help synchronize browser localStorage with GetStream channels

## Summary

Added a "Reset Demo Data" button to the Profile page that clears localStorage and attempts to remove the user from GetStream chat channels.

## Problem Being Solved

When clearing browser memory, enrollment data in localStorage gets wiped, but GetStream channels persist on their servers. This creates a mismatch where users might see chat channels they shouldn't have access to after a browser reset.

## Implementation

### Files Modified

1. **my-project/code/src/components/Profile.js**
   - Added `isResetting` state and `handleResetDemoData` function
   - Added "Reset Demo Data" button below Log Out button
   - Button styled in orange/yellow to differentiate from logout
   - Helper text: "Clears enrollments, chat channels, and local data"
   - Gathers course channel IDs from multiple localStorage sources before clearing
   - Calls Edge Function to remove user from GetStream channels
   - Preserves user preferences (dark mode, text darkness, etc.) during reset

2. **my-project/code/supabase/functions/getstream-token/index.ts**
   - Added `action: 'reset'` handler
   - Queries all channels where user is a member (server-side)
   - Removes user from each channel found
   - Returns count of channels processed

### Key Code Changes

**Profile.js - Reset Handler:**
```javascript
const handleResetDemoData = async () => {
  // Confirm with user
  // Gather course IDs from localStorage (purchasedCourses, scheduledSessions, etc.)
  // Add fallback known channels (course-1, course-6)
  // Call Edge Function with action: 'reset' and channelIds
  // Clear localStorage (preserving display preferences)
  // Reload page
};
```

**Edge Function - Reset Action:**
```typescript
if (action === 'reset') {
  // Upsert user first
  await serverClient.upsertUsers([{ id: userId }]);

  // Query all channels where user is member
  const filter = { members: { $in: [userId] } };
  const channels = await serverClient.queryChannels(filter, {}, { limit: 30 });

  // Remove user from each channel
  for (const channel of channels) {
    await channel.removeMembers([userId]);
  }
}
```

## Current Status

- ✅ Reset button visible in Profile page (scroll to bottom)
- ✅ localStorage clearing works correctly
- ⚠️ GetStream channel removal inconsistent - server-side queryChannels may be failing
- The Edge Function returns success but channels still appear in Messages

## Known Issue

The GetStream `queryChannels` call from the Edge Function appears to not find the user's channels. This may be due to:
1. User not being properly upserted before query
2. Timing issues with GetStream API
3. Permission issues with server-side queries

For prototype purposes, manual channel cleanup via GetStream Dashboard still works:
- Dashboard: https://dashboard.getstream.io/app/1457190/chat/explorer

## GetStream Configuration

- **App ID:** 1457190
- **API Key:** tgzt4vdwm9cb
- **API Secret:** (stored in Supabase Edge Function secrets)

## Browser State

- App running at localhost:3000/Peerloop-v2
- Logged in as Sarah Miller for testing
- Messages page shows 2 channels that persist after reset

## Session Accomplishments

1. ✅ Added Reset Demo Data button to Profile page
2. ✅ Implemented localStorage clearing with preference preservation
3. ✅ Created Edge Function reset endpoint
4. ⚠️ GetStream channel removal partially working

## Next Steps (if continuing)

1. Debug why queryChannels isn't finding user's channels in Edge Function
2. Consider alternative approach: pass exact channel IDs from client based on Messages page
3. Or accept manual GetStream Dashboard cleanup for prototype
