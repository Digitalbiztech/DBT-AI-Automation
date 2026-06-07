import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sessionId: string;
}

const Chat: React.FC = () => {
  const N8N_WEBHOOK_URL = 'https://n8n.digitalbiz.tech/webhook/7dd3232a-1926-4cef-84a3-7287b72c561a';
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(
    localStorage.getItem('chatSessionId') || uuidv4()
  );

  // Persist session ID to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);

  // Function to send a message
  const sendChatMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim()) return;
    
    const userMessage: ChatMessage = { 
      id: uuidv4(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      sessionId: sessionId
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    // Don't wait for the webhook response
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: messageContent,
        sessionId: sessionId,
        timestamp: new Date().toISOString()
      }),
    }).catch(err => {
      console.error('Error sending message to webhook:', err);
    }).finally(() => {
      setLoading(false);
      setInput('');
    });
  }, [sessionId]);

  // Check for pre-filled messages when component mounts
  useEffect(() => {
    const processPostData = async () => {
      try {
        // Check for any type of post data
        const postDataStr = localStorage.getItem('makePostData');
        if (!postDataStr) return;

        try {
          const postData = JSON.parse(postDataStr);
          console.log('Found post data in localStorage:', postData);
          
          let message = '';
          
          // Handle different post types
          switch (postData.type) {
            case 'article':
              if (!postData.title || !postData.summary) {
                throw new Error('Missing required article fields');
              }
              // Format the message with all available article data
              message = `Create a post about the following article\n\n` +
                       `**Title:** ${postData.title}\n` +
                       `**Summary:** ${postData.summary}` +
                       (postData.url ? `\n**URL:** ${postData.url}` : '');
              break;
              
            case 'blog':
              if (!postData.title || !postData.content) {
                throw new Error('Missing required blog fields');
              }
              message = `Create a social media post about the following blog:\n\n` +
                       `**Title:** ${postData.title}\n` +
                       `**Summary:** ${postData.content.substring(0, 200)}` +
                       (postData.url ? `\n**URL:** ${postData.url}` : '');
              break;
              
            case 'template':
              if (!postData.name) {
                throw new Error('Missing required template name');
              }
              message = `Make post using template: ${postData.name}`;
              break;
              
            default:
              console.warn('Unknown post type:', postData.type);
              return;
          }
          
          console.log('Processing pre-filled message:', message);
          
          // Start a new conversation
          const newSessionId = uuidv4();
          setSessionId(newSessionId);
          setMessages([]);
          
          // Create and add the user message
          const userMessage: ChatMessage = { 
            id: uuidv4(),
            content: message,
            sender: 'user',
            timestamp: new Date(),
            sessionId: newSessionId
          };
          
          setMessages(prev => [userMessage]);
          setLoading(true);
          
          // Send the message to the webhook
          fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: message,
              sessionId: newSessionId,
              timestamp: new Date().toISOString()
            }),
          }).catch(err => {
            console.error('Error sending message to webhook:', err);
          }).finally(() => {
            setLoading(false);
          });
          
        } catch (e) {
          console.error('Error processing post data:', e);
        } finally {
          // Always clean up the storage
          localStorage.removeItem('makePostData');
        }
      } catch (e) {
        console.error('Error in processPostData:', e);
      }
    };
    
    processPostData();
  }, []); // Empty dependency array to run only once on mount

  // Persist session ID to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatSessionId', sessionId);
  }, [sessionId]);

  const startNewChat = () => {
    setMessages([]);
    const newId = uuidv4();
    setSessionId(newId);
    localStorage.setItem('chatSessionId', newId);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: ChatMessage = { 
      id: uuidv4(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      sessionId
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          sessionId,
          timestamp: new Date().toISOString()
        }),
      });
      
      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        content: data?.output || data?.message || JSON.stringify(data),
        sender: 'ai',
        timestamp: new Date(),
        sessionId
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        content: 'Error: Could not reach the server. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        sessionId
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) sendMessage();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 16 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16,
        padding: '8px 12px',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        border: '1px solid #e9ecef'
      }}>
        <div style={{ fontSize: '0.85em', color: '#495057' }}>
          <strong>Session ID:</strong> {sessionId.substring(0, 8)}...
        </div>
        <button 
          onClick={startNewChat}
          style={{
            padding: '6px 12px',
            backgroundColor: '#ffffff',
            color: '#495057',
            border: '1px solid #dee2e6',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: '0.85em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f1f3f5';
            e.currentTarget.style.borderColor = '#ced4da';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
            e.currentTarget.style.borderColor = '#dee2e6';
          }}
        >
          <span>🆕</span> New Chat
        </button>
      </div>
      
      {messages.length === 0 ? (
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 400,
          color: '#adb5bd',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 8,
          border: '1px dashed #e9ecef',
          marginBottom: 16
        }}>
          <div style={{ fontSize: '1.1em', marginBottom: 8 }}>Start a new conversation</div>
          <div style={{ fontSize: '0.9em' }}>Type a message to begin chatting</div>
        </div>
      ) : (
        <div style={{ 
          minHeight: 400,
          maxHeight: '60vh',
          overflowY: 'auto',
          marginBottom: 16,
          padding: 16,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {messages.map((message) => (
            <div 
              key={message.id}
              style={{
                marginBottom: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '85%',
                padding: '10px 16px',
                borderRadius: 12,
                backgroundColor: message.sender === 'user' ? '#e7f5ff' : '#f8f9fa',
                color: message.sender === 'user' ? '#1864ab' : '#343a40',
                border: `1px solid ${message.sender === 'user' ? '#d0ebff' : '#e9ecef'}`,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}>
                {message.content}
                <div style={{
                  fontSize: '0.7em',
                  opacity: 0.7,
                  marginTop: 6,
                  textAlign: 'right',
                  color: message.sender === 'user' ? '#4dabf7' : '#868e96'
                }}>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        
        {loading && (
          <div style={{
            color: '#6c757d',
            fontSize: '0.85em',
            padding: '8px 16px',
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            width: 'fit-content',
            margin: '8px 0',
            border: '1px solid #e9ecef',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            Thinking...
          </div>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 8,
        padding: '12px',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #dee2e6',
            fontSize: '0.95em',
            outline: 'none',
            transition: 'border-color 0.2s',
            backgroundColor: loading ? '#f8f9fa' : '#ffffff',
            cursor: loading ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#339af0';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(13, 110, 253, 0.25)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#dee2e6';
            e.currentTarget.style.boxShadow = 'none';
          }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '0 24px',
            borderRadius: 8,
            backgroundColor: loading || !input.trim() ? '#e9ecef' : '#339af0',
            color: loading || !input.trim() ? '#adb5bd' : 'white',
            border: 'none',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: '0.95em',
            fontWeight: 500,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transform: 'translateY(0)'
          }}
          onMouseOver={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.backgroundColor = '#228be6';
            }
          }}
          onMouseOut={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.backgroundColor = '#339af0';
            }
          }}
          onMouseDown={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.transform = 'translateY(1px)';
            }
          }}
          onMouseUp={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && input.trim()) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.backgroundColor = '#339af0';
            }
          }}
        >
          {loading ? (
            <>
              <span>Sending</span>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <span style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                border: '2px solid',
                borderColor: 'currentColor transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
            </>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </div>
  );
};

export default Chat;