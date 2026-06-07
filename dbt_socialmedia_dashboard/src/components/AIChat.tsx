
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Settings,
  Zap,
  Loader2,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Social Media Assistant. I can help you with content creation, strategy planning, competitor analysis, and workflow automation. How can I assist you today?",
      timestamp: new Date(),
      status: 'sent'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('ai_webhook_url') || '');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (webhookUrl) {
      setIsConnected(true);
    }
  }, []);

  const connectWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Connection Error",
        description: "Please provide your n8n webhook URL",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('ai_webhook_url', webhookUrl);
    setIsConnected(true);
    toast({
      title: "Connected Successfully",
      description: "AI agent webhook connected",
    });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect your AI agent webhook first",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send to n8n webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          timestamp: new Date().toISOString(),
          user_id: 'user_' + Date.now(),
          context: {
            dashboard: 'social_media',
            previous_messages: messages.slice(-5) // Send last 5 messages for context
          }
        }),
      });

      // Simulate AI response for demo
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateAIResponse(inputMessage),
          timestamp: new Date(),
          status: 'sent'
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      toast({
        title: "Message Failed",
        description: "Unable to send message to AI agent",
        variant: "destructive",
      });
    }
  };

  const generateAIResponse = (input: string): string => {
    // Demo AI responses based on input
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('content') || lowerInput.includes('post')) {
      return "I can help you create engaging content! Here are some suggestions:\n\n• **Trending Topics**: Focus on industry news and current events\n• **User-Generated Content**: Encourage audience participation\n• **Behind-the-Scenes**: Show your team and processes\n• **Educational Content**: Share tips and tutorials\n\nWould you like me to generate specific content ideas for any platform?";
    }
    
    if (lowerInput.includes('analytics') || lowerInput.includes('performance')) {
      return "Based on your recent performance data:\n\n📈 **Key Insights**:\n• Your engagement rate increased by 15% this week\n• Best posting time: 10 AM - 12 PM\n• Top performing content type: Educational posts\n\n**Recommendations**:\n1. Increase educational content frequency\n2. Post during peak engagement hours\n3. Use more interactive elements like polls\n\nWould you like a detailed analytics report?";
    }
    
    if (lowerInput.includes('competitor') || lowerInput.includes('analysis')) {
      return "🔍 **Competitor Analysis Summary**:\n\n**Top Performers in Your Niche**:\n• Competitor A: 45K followers, 4.2% engagement\n• Competitor B: 38K followers, 3.8% engagement\n\n**Opportunities**:\n• They're not using video content effectively\n• Limited engagement with audience comments\n• Missing trending hashtags\n\n**Actionable Strategies**:\n1. Increase video content production\n2. Improve community engagement\n3. Leverage trending topics faster\n\nShall I run a deeper competitive analysis?";
    }
    
    if (lowerInput.includes('schedule') || lowerInput.includes('time')) {
      return "📅 **Optimal Posting Schedule**:\n\n**Platform-Specific Timing**:\n• **Instagram**: 11 AM, 2 PM, 5 PM\n• **Twitter**: 9 AM, 1 PM, 3 PM\n• **LinkedIn**: 8 AM, 12 PM, 6 PM\n• **Facebook**: 10 AM, 3 PM, 7 PM\n\n**Weekly Strategy**:\n• Monday: Industry insights\n• Wednesday: Educational content\n• Friday: Engaging/Fun content\n\nWould you like me to auto-schedule your content using these optimal times?";
    }
    
    return "I understand you're asking about " + input + ". As your AI social media assistant, I can help with:\n\n• Content creation and optimization\n• Analytics and performance insights\n• Competitor analysis\n• Posting schedule optimization\n• Engagement strategies\n• Trend identification\n\nWhat specific area would you like to explore further?";
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Connection Setup */}
      <Card className="bg-white border-gray-200 hover:shadow-lg hover:shadow-purple-200/30 transition-all duration-200">
        <CardHeader className="bg-white">
          <CardTitle className="flex items-center space-x-2 text-gray-800">
            <Bot className="h-5 w-5 text-purple-600" />
            <span>AI Agent Connection</span>
            {isConnected && <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>}
          </CardTitle>
          <CardDescription className="text-gray-600">
            Connect to your n8n AI agent webhook for intelligent assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-white">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">n8n AI Agent Webhook URL</label>
            <Input
              placeholder="https://your-n8n-instance.com/webhook/ai-agent"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isConnected}
              className="bg-white border-gray-200 focus:border-purple-500"
            />
          </div>
          <Button 
            onClick={connectWebhook} 
            disabled={isConnected}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isConnected ? "Connected" : "Connect AI Agent"}
          </Button>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col bg-white border-gray-200">
        <CardHeader className="bg-white border-b border-gray-100">
          <CardTitle className="flex items-center justify-between text-gray-800">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span>AI Assistant Chat</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
              <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 bg-white">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 bg-white">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white ml-12'
                        : 'bg-gray-100 text-gray-900 mr-12'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`p-1 rounded-full ${
                        message.role === 'user' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-3 w-3 text-white" />
                        ) : (
                          <Bot className="h-3 w-3 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.role === 'assistant' && (
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-gray-200"
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-xl p-4 mr-12">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-gray-600" />
                      <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-100 bg-white p-4">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Ask me anything about your social media strategy..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isConnected || isLoading}
                className="flex-1 bg-white border-gray-200 focus:border-blue-500"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || !isConnected || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>Powered by n8n AI Agent</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
