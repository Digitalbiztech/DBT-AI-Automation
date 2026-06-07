
import React from "react";
import { 
  Mail,
  Send,
  Users,
  Eye,
  TrendingUp,
  Settings,
  Activity
} from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const NewsletterPage = () => {
  const metrics = [
    {
      title: "Total Subscribers",
      value: "0",
      change: "+0 this month",
      icon: Users,
      color: "text-violet-600",
      bgGradient: "from-violet-400/20 via-purple-300/10 to-fuchsia-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(139,69,196,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(139,69,196,0.3)]",
      trend: "up"
    },
    {
      title: "Emails Sent",
      value: "0",
      change: "+0 this week",
      icon: Send,
      color: "text-blue-600",
      bgGradient: "from-blue-400/20 via-indigo-300/10 to-sky-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]",
      trend: "up"
    },
    {
      title: "Open Rate",
      value: "0%",
      change: "+0% vs last month",
      icon: Eye,
      color: "text-emerald-600",
      bgGradient: "from-emerald-400/20 via-teal-300/10 to-cyan-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]",
      trend: "up"
    },
    {
      title: "Click Rate",
      value: "0%",
      change: "+0% improvement",
      icon: TrendingUp,
      color: "text-rose-600",
      bgGradient: "from-rose-400/20 via-pink-300/10 to-red-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(244,63,94,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(244,63,94,0.3)]",
      trend: "up"
    }
  ];

  const newsletters = [
    {
      id: 1,
      subject: "No newsletters created",
      status: "draft",
      scheduledDate: "Not scheduled",
      subscribers: 0,
      openRate: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-violet-200/15 to-purple-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 space-y-6 p-6">
        {/* Premium Header */}
        <DashboardHeader
          title="Newsletter"
          subtitle="Center"
          description="Create and manage your email newsletter campaigns"
          primaryColor="from-violet-900 via-purple-800 to-fuchsia-900"
          secondaryColor="text-violet-700/80"
        />

        {/* Sophisticated Metrics Grid */}
        <MetricsGrid 
          metrics={metrics} 
          showSettings={false}
        />

        {/* Newsletter Campaigns */}
        <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(139,69,196,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="relative p-6 pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl font-bold text-violet-800">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 shadow-xl">
                <Mail className="h-5 w-5 text-violet-600" />
              </div>
              <span>Newsletter Campaigns</span>
            </CardTitle>
            <CardDescription className="text-sm text-violet-700/80 font-medium mt-1">
              Manage your email marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 pt-2">
            <div className="space-y-3">
              {newsletters.map((newsletter) => (
                <div key={newsletter.id} className="group/item flex items-start space-x-3 p-4 rounded-2xl bg-violet-50/80 backdrop-blur-sm border-l-4 border-l-violet-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102 transition-all duration-400">
                  <div className="p-2 rounded-xl bg-white/90 shadow-lg group-hover/item:scale-115 group-hover/item:rotate-6 transition-all duration-400">
                    <Mail className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-purple-800">{newsletter.subject}</p>
                    <p className="text-xs text-purple-600/80 font-medium mt-1">{newsletter.scheduledDate}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{newsletter.subscribers} subscribers</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{newsletter.openRate}% open rate</span>
                      </span>
                    </div>
                  </div>
                  <Badge className={newsletter.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {newsletter.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
