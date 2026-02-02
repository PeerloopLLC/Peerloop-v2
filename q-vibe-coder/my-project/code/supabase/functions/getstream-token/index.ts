import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { StreamChat } from "npm:stream-chat@8.14.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { userId, users, channelId, channelName, members, action } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GetStream credentials from environment
    const apiKey = Deno.env.get("GETSTREAM_API_KEY");
    const apiSecret = Deno.env.get("GETSTREAM_API_SECRET");

    if (!apiKey || !apiSecret) {
      console.error("Missing GetStream credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize server-side client (use 'new' for fresh instance, not getInstance which may cache)
    const serverClient = new StreamChat(apiKey, apiSecret);

    // Handle reset action - remove user from ALL channels
    if (action === 'reset') {
      console.log(`🔄 Reset action for user: ${userId}`);

      let removedCount = 0;
      const errors: string[] = [];
      const removedFrom: string[] = [];

      // APPROACH: Delete and recreate the user - this removes them from ALL channels
      try {
        // First, try to delete the user (removes from all channels)
        console.log(`🗑️ Attempting to delete user ${userId} from GetStream...`);
        await serverClient.deleteUsers([userId], {
          user: 'soft', // soft delete preserves messages but removes user
          messages: 'soft',
          conversations: 'soft',
        });
        console.log(`✅ User ${userId} deleted from GetStream`);

        // Small delay to ensure deletion is processed
        await new Promise(resolve => setTimeout(resolve, 500));

        // Recreate the user fresh
        console.log(`🔄 Recreating user ${userId}...`);
        await serverClient.upsertUsers([{ id: userId }]);
        console.log(`✅ User ${userId} recreated in GetStream`);

        removedCount = 1; // Indicate success
        removedFrom.push('all-channels-via-user-delete');
      } catch (deleteErr) {
        const errMsg = (deleteErr as Error).message;
        console.error(`❌ User delete/recreate failed:`, errMsg);
        errors.push(`user-delete: ${errMsg}`);

        // Fallback: try the channel-by-channel approach
        console.log(`📋 Falling back to channel-by-channel removal...`);
        const channelIds = body.channelIds || [];

        for (const chId of channelIds) {
          try {
            const channel = serverClient.channel('messaging', chId);
            await channel.removeMembers([userId]);
            console.log(`✅ Removed ${userId} from channel ${chId}`);
            removedCount++;
            removedFrom.push(chId);
          } catch (removeErr) {
            const rmErrMsg = (removeErr as Error).message;
            if (!rmErrMsg.includes('is not a member')) {
              console.warn(`❌ Could not remove from ${chId}:`, rmErrMsg);
              errors.push(`${chId}: ${rmErrMsg}`);
            }
          }
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Reset complete: removed from ${removedCount} channel(s)`,
          removedCount,
          removedFrom,
          errors: errors.length > 0 ? errors : undefined
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Generate user token
    const token = serverClient.createToken(userId);
    console.log(`✅ Generated token for user: ${userId}`);

    // Upsert users if provided (server-side only operation)
    if (users && Array.isArray(users) && users.length > 0) {
      try {
        await serverClient.upsertUsers(users);
        console.log(`✅ Upserted ${users.length} users:`, users.map(u => u.id));
      } catch (upsertErr) {
        console.error("User upsert error:", upsertErr.message);
      }
    }

    // Create/update channel with members if provided
    if (channelId && members && Array.isArray(members) && members.length > 0) {
      try {
        // First, get or create the channel without members
        const channel = serverClient.channel('messaging', channelId);

        // Query the channel to make sure it exists
        const channelState = await channel.query();
        console.log(`✅ Channel ${channelId} exists, current members:`, channelState.members?.map((m: {user_id?: string}) => m.user_id));

        // Add all members (this is idempotent - won't error if already members)
        const result = await channel.addMembers(members);
        console.log(`✅ Added members to channel ${channelId}:`, members, 'Result:', result);
      } catch (channelErr: unknown) {
        // If channel doesn't exist, create it with members
        if ((channelErr as {code?: number})?.code === 16 || (channelErr as {message?: string})?.message?.includes('does not exist')) {
          try {
            console.log(`Channel ${channelId} doesn't exist, creating with members:`, members);
            const newChannel = serverClient.channel('messaging', channelId, {
              name: channelName || `Channel ${channelId}`,
              members: members,
            });
            await newChannel.create();
            console.log(`✅ Created new channel ${channelId} with members:`, members);
          } catch (createErr) {
            console.error("Channel create error:", (createErr as Error).message);
          }
        } else {
          console.error("Channel error:", (channelErr as Error).message);
        }
      }
    }

    return new Response(
      JSON.stringify({
        token,
        apiKey,
        userId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error generating token:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
