import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Zap,
  FileText,
  Layers,
  Calendar as CalendarIcon,
  Settings,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Bot,
  User,
  Send,
  Loader2,
  BookOpen,
  PenLine,
  BarChart3,
  LogOut,
  Paperclip,
  Image as ImageIcon,
  File as FileIcon,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import Templates from '@/components/dashboard/Templates';
import Analytics from './Analytics';
import Automate from './Automate';
import Help from './Help';
import Home from './Home';
import Articles from './Articles';
import Blogs from './Blogs';
import EditSources from './EditSources';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown';
import { uploadFileToStorage } from '@/lib/storage';
import CalendarPage from './Calendar';
import { Textarea } from '@/components/ui/textarea';

const menuItems = [
  { icon: BookOpen, text: 'Home', page: 'Home' },
  { icon: MessageCircle, text: 'Chat', page: 'Chat' },
  { icon: Zap, text: 'Approval', page: 'Automate' },
  { icon: BarChart3, text: 'Analytics', page: 'Analytics' },
  { icon: CalendarIcon, text: 'Calendar', page: 'Calendar' },
  { icon: BookOpen, text: 'Articles', page: 'Articles' },
  { icon: PenLine, text: 'Blogs', page: 'Blogs' },
  { icon: FileText, text: 'Templates', page: 'Templates' },
];

const SidebarNav = ({ activePage, setActivePage, sidebarCollapsed, setSidebarCollapsed }) => {
  return (
    <aside
      className={`bg-slate-50 border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        {!sidebarCollapsed && <h1 className="font-bold text-2xl text-gray-800">dbt</h1>}
        <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.page}
            variant="ghost"
            className={`w-full justify-start text-gray-800 font-semibold ${activePage === item.page ? 'bg-blue-100 text-blue-700' : ''}`}
            onClick={() => setActivePage(item.page)}
          >
            <item.icon className={`mr-4 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
            {!sidebarCollapsed && item.text}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-gray-800" onClick={() => setActivePage('Settings')}>
          <Settings className={`mr-4 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
          {!sidebarCollapsed && 'Settings'}
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-800" onClick={() => setActivePage('Help')}>
          <Bot className={`mr-4 ${sidebarCollapsed ? 'mx-auto' : ''}`} />
          {!sidebarCollapsed && 'Help'}
        </Button>
      </div>
    </aside>
  );
};

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('Home');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Add a timeout to automatically hide the typing indicator
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showTyping) {
      // Auto-hide after 30 seconds to prevent it from getting stuck
      timeoutId = setTimeout(() => {
        setShowTyping(false);
        setIsLoading(false);
      }, 30000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showTyping]);

  // Reset typing indicator when component unmounts or active page changes
  useEffect(() => {
    return () => {
      setShowTyping(false);
      setIsLoading(false);
    };
  }, [activePage]);

  // Reset states when session changes
  useEffect(() => {
    setShowTyping(false);
    setIsLoading(false);
  }, [sessionId]);

  // Initialize session ID
  useEffect(() => {
    let storedSessionId = sessionStorage.getItem('chatSessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      sessionStorage.setItem('chatSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, showTyping]);

  const handleNewChat = () => {
    // Reset all states first
    setShowTyping(false);
    setIsLoading(false);
    setInputValue('');
    
    // Create new session
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    sessionStorage.setItem('chatSessionId', newSessionId);
    
    // Clear messages last to prevent any race conditions
    setMessages([]);
    
    toast({ 
      title: 'New chat started',
      duration: 1500 // 1.5 seconds
    });
  };

  const handleFileUpload = (type: 'image' | 'document') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt';
      fileInputRef.current.click();
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileUrl = await uploadFileToStorage(file, 'chat-attachments');
      if (!fileUrl) {
        throw new Error('Failed to get public URL for the uploaded file');
      }
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload the file to storage',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setShowTyping(true);
      
      // Use the new Supabase Storage upload function
      const publicUrl = await uploadFileToStorage(file);
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL for the uploaded file');
      }
      
      // Create markdown for the image
      const markdown = `![${file.name}](${publicUrl})`;
      
      // Create a new message with the image
      const userMessage = {
        id: `msg-${Date.now()}`,
        content: markdown,
        sender: 'user' as const,
        timestamp: new Date().toISOString(),
        sessionId: sessionId
      };
      
      // Add the message to the chat
      setMessages(prev => [...prev, userMessage]);
      
      // Send to webhook
      try {
        const response = await fetch('https://n8n.digitalbiz.tech/webhook/7dd3232a-1926-4cef-84a3-7287b72c561a', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: markdown,
            sessionId: sessionId,
            timestamp: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Webhook response:', data);
        
        // Add AI response to the chat if available
        if (data.output || data.message) {
          const aiResponse = {
            id: `msg-${Date.now()}-ai`,
            content: data.output || data.message,
            sender: 'ai' as const,
            timestamp: new Date().toISOString(),
            sessionId: sessionId
          };
          setShowTyping(false);
          setMessages(prev => [...prev, aiResponse]);
        } else {
          setShowTyping(false);
        }
      } catch (error) {
        console.error('Error sending to webhook:', error);
        setShowTyping(false);
        toast({
          title: 'Error',
          description: 'Failed to get response from AI',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error handling file upload:', error);
      setShowTyping(false);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!inputValue.trim() && !fileInputRef.current?.files?.length) || isLoading || isUploading) return;

    const messageContent = inputValue.trim();
    const userMessage = { 
      id: uuidv4(), 
      content: messageContent, 
      sender: 'user',
      timestamp: new Date().toISOString(),
      sessionId
    };
    
    // Clear input and set loading states
    setInputValue('');
    setShowTyping(true);
    setIsLoading(true);
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);

    try {
      console.log('Sending message to n8n webhook...');
      const response = await fetch('https://n8n.digitalbiz.tech/webhook/7dd3232a-1926-4cef-84a3-7287b72c561a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageContent,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Webhook error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Webhook response data:', data);
      
      // Handle different possible response formats from n8n
      const responseText = data.output || data.message || data.response || 'Received an empty response';
      
      // Hide typing indicator before adding the AI message
      setShowTyping(false);
      
      const aiMessage = { 
        id: uuidv4(), 
        content: responseText,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        sessionId
      };
      
      console.log('Created AI message:', aiMessage);
      
      // Add AI message to the chat
      setMessages((prev) => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Fetch error:', error);
      // Ensure typing indicator is hidden on error
      setShowTyping(false);
      
      toast({ 
        title: 'Error', 
        description: 'Failed to get response from the server.', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = (templateContent) => {
    setInputValue(templateContent);
    setActivePage('Chat');
    toast({ title: 'Template loaded into chat.', description: 'You can now edit and send the message.' });
  };

  const handleMakePost = async (title, summary) => {
    // Start a new conversation
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    sessionStorage.setItem('chatSessionId', newSessionId);
    
    // Create the user message
    const userMessage = { 
      id: uuidv4(), 
      content: title, 
      sender: 'user',
      timestamp: new Date().toISOString(),
      sessionId: newSessionId
    };
    
    // Add message to chat and clear input
    setMessages([userMessage]);
    setInputValue('');
    setActivePage('Chat');
    
    // Show appropriate toast
    if (title.startsWith('Make post using template:')) {
      toast({ title: 'Template loaded into chat.', description: 'The template is ready to use.' });
    } else if (title.startsWith('Create a post about the following article')) {
      toast({ title: 'Article loaded into chat.', description: 'The article is ready to use.' });
    } else if (title.startsWith('Create a social media post about the following blog')) {
      toast({ title: 'Blog content loaded into chat.', description: 'A prompt has been created for you.' });
    } else {
      toast({ title: 'Content loaded into chat.', description: 'The content is ready to use.' });
    }
    
    // Send the message to the webhook
    try {
      setIsLoading(true);
      const response = await fetch('https://n8n.digitalbiz.tech/webhook/7dd3232a-1926-4cef-84a3-7287b72c561a', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: title,
          sessionId: newSessionId,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Webhook response:', data);
      
      // Add AI response to the chat
      if (data.output || data.message) {
        const aiMessage = {
          id: uuidv4(),
          content: data.output || data.message,
          sender: 'ai',
          timestamp: new Date().toISOString(),
          sessionId: newSessionId
        };
        setMessages(prev => [...prev, aiMessage]);
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to send message to server', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activePage) {
  case 'Home': return <Home setActivePage={setActivePage} />;
      case 'Automate': return <Automate />;
      case 'Chat': return renderChat();
      case 'Analytics': return <Analytics />;
      case 'Calendar': return <CalendarPage />;
      case 'Articles': return <Articles onEditSources={() => setActivePage('EditSources')} onMakePost={handleMakePost} />;
      case 'Blogs': return <Blogs onMakePost={handleMakePost} />;
      case 'Templates': return <Templates onTemplateSelect={handleTemplateSelect} onMakePost={handleMakePost} />;
  case 'EditSources': return <EditSources />;
  case 'Settings': return <SettingsPanel />;
  case 'Help': return <Help />;
      default: return <Automate />;
    }
  };

  const renderChat = () => {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {activePage === 'Chat' && (
          <div className="flex justify-end items-center w-full px-8 pt-6 gap-4">
            <Button variant="ghost" onClick={() => setActivePage('Help')} className="px-3 py-1 text-sm text-gray-700" title="Help">
              Help
            </Button>
            <Button onClick={() => setActivePage('Templates')} variant="outline">
              <FileText className="mr-2 h-4 w-4" /> Templates
            </Button>
            <Button 
              onClick={handleNewChat} 
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 shadow hover:from-blue-700 hover:to-blue-800"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> New Chat
            </Button>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-y-auto modern-scrollbar px-4 py-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              // Ensure we have a unique key for each message
              const messageKey = msg.id || `msg-${idx}-${Date.now()}`;
              const hasImage = msg.content?.includes('![');
              
              return (
                <motion.div
                  key={messageKey}
                  initial={{ opacity: 0, y: 2, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 2, scale: 0.995 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28, delay: idx * 0.04 }}
                  className={`flex w-full mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={msg.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white border-2 border-blue-400/30 shadow-lg rounded-2xl rounded-br-md px-5 py-3 max-w-[80%] sm:max-w-[60%] text-base font-medium hover:shadow-blue-500/30 transition-all duration-200 hover:scale-105'
                      : 'bg-white text-gray-900 border border-gray-200 shadow-lg rounded-2xl rounded-bl-md px-5 py-3 max-w-[80%] sm:max-w-[60%] text-base font-medium hover:shadow-gray-500/30 transition-all duration-200 hover:scale-105'}
                    style={{
                      boxShadow: msg.sender === 'user' 
                        ? '0 4px 24px 0 rgba(37,99,235,0.15)' 
                        : '0 4px 24px 0 rgba(139,92,246,0.12)',
                      borderBottomRightRadius: msg.sender === 'user' ? 8 : 32,
                      borderBottomLeftRadius: msg.sender === 'ai' ? 8 : 32,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <ReactMarkdown
                      components={{
                        img: ({ node, ...props }) => (
                          <img 
                            {...props} 
                            style={{ 
                              maxWidth: '100%', 
                              height: 'auto',
                              borderRadius: '8px',
                              margin: '8px 0'
                            }} 
                            alt={props.alt || 'Uploaded image'}
                          />
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              );
            })}
            {showTyping ? (
              <div key={`typing-${Date.now()}`} className="flex justify-start">
                <div className="bg-white text-gray-600 border border-gray-200 shadow-lg rounded-2xl rounded-bl-md px-5 py-3 max-w-[80%] sm:max-w-[60%] text-base font-medium">
                  Thinking...
                </div>
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>
        <div className="shrink-0 px-8 py-6 bg-white border-t border-gray-200">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="WELCOME TO DBT AI LINKEDIN POST AUTOMATION JUST TYPE  'MAKE A POST' TO START THE CHAT..."
                className="min-h-[50px] max-h-32 pr-24 resize-none w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="absolute right-12 top-1/2 -translate-y-1/2 flex space-x-1">
                <Popover open={isAttachmentMenuOpen} onOpenChange={setIsAttachmentMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsAttachmentMenuOpen(!isAttachmentMenuOpen);
                      }}
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="end" side="top">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileUpload('image');
                          setIsAttachmentMenuOpen(false);
                        }}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          handleFileUpload('document');
                          setIsAttachmentMenuOpen(false);
                        }}
                      >
                        <FileIcon className="mr-2 h-4 w-4" />
                        Upload Document
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2.5 hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex bg-gray-50">
      <SidebarNav
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
  <main className="flex-1 flex flex-col overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
