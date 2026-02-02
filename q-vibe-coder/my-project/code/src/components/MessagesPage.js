import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = process.env.REACT_APP_GETSTREAM_API_KEY;

/**
 * MessagesPage - Full-page GetStream messaging view
 * Shows all user's channels with a channel list sidebar
 */
const MessagesPage = ({ currentUser, isDarkMode }) => {
  const [chatClient, setChatClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?.id || !apiKey) {
      setError('Missing user or API key');
      setIsLoading(false);
      return;
    }

    let client = null;

    const initChat = async () => {
      try {
        // Create GetStream client
        client = StreamChat.getInstance(apiKey);

        // Get token from Supabase Edge Function
        const tokenResponse = await fetch(
          `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/getstream-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              userId: currentUser.id,
            }),
          }
        );

        if (!tokenResponse.ok) {
          throw new Error('Failed to get chat token');
        }

        const { token } = await tokenResponse.json();

        // Connect user to GetStream
        await client.connectUser(
          {
            id: currentUser.id,
            name: currentUser.name || currentUser.email,
            image: currentUser.avatar,
          },
          token
        );

        setChatClient(client);
        setIsLoading(false);
      } catch (err) {
        console.error('Chat init error:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initChat();

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 60px)',
        color: isDarkMode ? '#71767b' : '#536471',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
        <p style={{ fontSize: 16 }}>Loading messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 60px)',
        color: isDarkMode ? '#71767b' : '#536471',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <p style={{ fontSize: 18, marginBottom: 8 }}>Unable to load messages</p>
        <p style={{ fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  if (!chatClient) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 60px)',
        color: isDarkMode ? '#71767b' : '#536471',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
        <p style={{ fontSize: 16 }}>Setting up chat...</p>
      </div>
    );
  }

  // Filter to show all channels the user is a member of
  const filters = {
    members: { $in: [currentUser.id] },
    type: 'messaging'
  };
  const sort = { last_message_at: -1 };
  const options = { limit: 10, presence: true, state: true };

  return (
    <div
      className={isDarkMode ? 'str-chat__theme-dark' : 'str-chat__theme-light'}
      style={{
        height: 'calc(100vh - 60px)',
        display: 'flex',
        background: isDarkMode ? '#000' : '#fff',
      }}
    >
      <Chat client={chatClient} theme={isDarkMode ? 'str-chat__theme-dark' : 'str-chat__theme-light'}>
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          {/* Channel list sidebar */}
          <div style={{
            width: 300,
            borderRight: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            height: '100%',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: isDarkMode ? '1px solid #2f3336' : '1px solid #eff3f4',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: isDarkMode ? '#e7e9ea' : '#0f1419',
              }}>
                Messages
              </h2>
            </div>
            <ChannelList
              filters={filters}
              sort={sort}
              options={options}
              showChannelSearch
            />
          </div>

          {/* Message area */}
          <div style={{ flex: 1, height: '100%' }}>
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  );
};

export default MessagesPage;
