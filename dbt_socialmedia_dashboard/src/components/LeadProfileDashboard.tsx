
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Settings, Building, Mail, Phone, MapPin, Star, Clock, Send, MessageSquare, Flag, User, ExternalLink } from "lucide-react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";

interface LeadProfileDashboardProps {
  onConfigureSupabase: (tableName: string) => void;
}

export const LeadProfileDashboard = ({ onConfigureSupabase }: LeadProfileDashboardProps) => {
  const leadProfile = {
    company: "",
    logo: "https://via.placeholder.com/60x60?text=",
    contact: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      location: ""
    },
    score: 0,
    status: "Cold",
    tags: [],
    isVip: false
  };

  const leadGenerationEmails = [
    {
      email: "",
      sentToday: 0,
      totalSent: 0,
      status: "active"
    },
    {
      email: "",
      sentToday: 0,
      totalSent: 0,
      status: "active"
    },
    {
      email: "",
      sentToday: 0,
      totalSent: 0,
      status: "pending"
    }
  ];

  const emailHistory = [
    {
      id: 1,
      type: "sent",
      subject: "",
      date: "",
      status: "draft",
      openedAt: null
    }
  ];

  const timeline = [
    {
      id: 1,
      type: "email_sent",
      title: "No activity",
      date: "",
      time: "",
      status: "pending"
    }
  ];

  const vipLeads = [
    {
      company: "",
      email: "",
      score: 0,
      reason: ""
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800 border-red-200';
      case 'Warm': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cold': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'email_sent': return Send;
      case 'email_opened': return Mail;
      case 'reply_received': return MessageSquare;
      case 'follow_up': return Clock;
      default: return Mail;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/15 to-violet-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 space-y-6 p-6">
        {/* Header */}
        <DashboardHeader
          title="Lead Profile"
          subtitle="Intelligence"
          description="Detailed prospect insights and outreach management"
          primaryColor="from-purple-600 via-blue-600 to-emerald-600"
          secondaryColor="text-purple-700"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Profile Panel */}
          <Card className="border-0 shadow-xl hover:shadow-[0_0_25px_rgba(147,51,234,0.2)] transition-all duration-200 bg-white/75 backdrop-blur-xl rounded-3xl group">
            <CardHeader className="bg-white/50 rounded-t-3xl relative p-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 hover:text-purple-600 hover:bg-purple-50"
                onClick={() => onConfigureSupabase('leads')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <CardTitle className="text-purple-800 text-lg">Lead Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 bg-white/50 backdrop-blur-sm">
              {/* Company Info */}
              <div className="flex items-center space-x-3">
                <img 
                  src={leadProfile.logo} 
                  alt=""
                  className="w-12 h-12 rounded-2xl shadow-lg bg-gray-100"
                />
                <div>
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 rounded-full text-xs">
                      {leadProfile.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-purple-600" />
                  <div className="w-20 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-purple-600" />
                  <div className="w-32 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-purple-600" />
                  <div className="w-28 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-4 w-4 text-purple-600" />
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <div className="w-36 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Lead Score */}
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium text-emerald-800 text-sm">Lead Score</span>
                </div>
                <span className="text-xl font-bold text-emerald-800">{leadProfile.score}</span>
              </div>

              {/* Tags */}
              <div>
                <span className="text-sm font-medium text-purple-700 mb-2 block">Tags</span>
                <div className="flex flex-wrap gap-2">
                  <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Generation Email Section */}
          <Card className="lg:col-span-2 border-0 shadow-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-200 bg-white/75 backdrop-blur-xl rounded-3xl group">
            <CardHeader className="bg-white/50 rounded-t-3xl relative p-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                onClick={() => onConfigureSupabase('email_logs')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <CardTitle className="text-emerald-800 text-lg">Lead Generation Emails</CardTitle>
              <CardDescription className="text-emerald-700 text-sm">Active email addresses and today's outreach</CardDescription>
            </CardHeader>
            <CardContent className="p-4 bg-white/50 backdrop-blur-sm">
              <div className="space-y-3">
                {leadGenerationEmails.map((emailData, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-emerald-50/80 to-teal-50/60 rounded-2xl border border-emerald-100/50 hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-emerald-600" />
                        <div>
                          <div className="w-32 h-3 bg-gray-200 rounded mb-1"></div>
                          <p className="text-xs text-emerald-600">Status: {emailData.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-800">Sent Today: {emailData.sentToday}</p>
                        <p className="text-xs text-emerald-600">Total: {emailData.totalSent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Smart Chat Assistant */}
          <Card className="border-0 shadow-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-200 bg-white rounded-2xl group">
            <CardHeader className="bg-white rounded-t-2xl relative p-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                onClick={() => onConfigureSupabase('ai_logs')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <CardTitle className="text-emerald-800 text-lg">Smart Chat Assistant</CardTitle>
              <CardDescription className="text-emerald-700 text-sm">AI-powered lead intelligence</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 bg-white">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-3 space-y-2">
                <div className="bg-white rounded-xl p-2 shadow-sm">
                  <p className="text-xs text-purple-800">Ask about leads or search profiles...</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                  <p className="text-xs text-emerald-800">No recent queries</p>
                </div>
              </div>
              <Input 
                placeholder="Ask about this lead or search for others..." 
                className="border-emerald-200 focus:border-emerald-400 rounded-xl bg-white text-sm"
              />
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Query
              </Button>
            </CardContent>
          </Card>

          {/* VIP Leads Widget */}
          <Card className="border-0 shadow-xl hover:shadow-[0_0_25px_rgba(244,63,94,0.2)] transition-all duration-200 bg-white rounded-2xl group">
            <CardHeader className="bg-white rounded-t-2xl relative p-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                onClick={() => onConfigureSupabase('leads')}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <CardTitle className="text-rose-800 text-lg">VIP Leads</CardTitle>
              <CardDescription className="text-rose-700 text-sm">High-priority prospects requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3 bg-white">
              {[1,2].map((index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    <Badge className="bg-red-100 text-red-800 border-red-200 rounded-full text-xs">
                      Score: 0
                    </Badge>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded mb-2"></div>
                  <div className="w-28 h-2 bg-gray-200 rounded mb-3"></div>
                  <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs">
                    Send Nurturing Message
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
