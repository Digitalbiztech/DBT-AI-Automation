
import React from "react";
import { 
  Target,
  PlayCircle,
  TrendingUp,
  CheckCircle,
  ArrowUpRight,
  Activity,
  FileText,
  Mail,
  Calendar,
  Zap,
  BarChart3
} from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DashboardHome = () => {
  const metrics = [
    {
      title: "Active Campaigns",
      value: "0",
      change: "+0 this week",
      icon: Target,
      color: "text-violet-600",
      bgGradient: "from-violet-400/20 via-purple-300/10 to-fuchsia-200/20",
      shadowColor: "hover:shadow-[0_8px_32px_rgba(139,69,196,0.3)]",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(139,69,196,0.4)]",
      trend: "up"
    },
    {
      title: "Running Now",
      value: "0",
      change: "0 finishing today",
      icon: PlayCircle,
      color: "text-emerald-600",
      bgGradient: "from-emerald-400/20 via-teal-300/10 to-cyan-200/20",
      shadowColor: "hover:shadow-[0_8px_32px_rgba(16,185,129,0.3)]",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.4)]",
      trend: "up"
    },
    {
      title: "Success Rate",
      value: "0%",
      change: "+0% vs last month",
      icon: TrendingUp,
      color: "text-blue-600",
      bgGradient: "from-blue-400/20 via-indigo-300/10 to-sky-200/20",
      shadowColor: "hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)]",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]",
      trend: "up"
    },
    {
      title: "Published This Week",
      value: "0",
      change: "+0 vs last week",
      icon: CheckCircle,
      color: "text-rose-600",
      bgGradient: "from-rose-400/20 via-pink-300/10 to-red-200/20",
      shadowColor: "hover:shadow-[0_8px_32px_rgba(244,63,94,0.3)]",
      glowColor: "group-hover:shadow-[0_0_40px_rgba(244,63,94,0.4)]",
      trend: "up"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "blog",
      title: "No recent activity",
      time: "0 minutes ago",
      icon: FileText,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50/80",
      accentColor: "border-l-emerald-400"
    },
    {
      id: 2,
      type: "newsletter",
      title: "No newsletters sent",
      time: "0 hours ago",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50/80",
      accentColor: "border-l-blue-400"
    },
    {
      id: 3,
      type: "social",
      title: "No posts scheduled",
      time: "0 hours ago",
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50/80",
      accentColor: "border-l-purple-400"
    },
    {
      id: 4,
      type: "workflow",
      title: "No workflows completed",
      time: "0 hours ago",
      icon: Zap,
      color: "text-amber-600",
      bgColor: "bg-amber-50/80",
      accentColor: "border-l-amber-400"
    }
  ];

  const campaignPerformance = [
    { 
      name: "Email Campaigns", 
      value: 0, 
      color: "bg-gradient-to-r from-violet-500 to-purple-600",
      glowColor: "shadow-[0_4px_20px_rgba(139,69,196,0.3)]"
    },
    { 
      name: "Social Media", 
      value: 0, 
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
      glowColor: "shadow-[0_4px_20px_rgba(16,185,129,0.3)]"
    },
    { 
      name: "Blog Content", 
      value: 0, 
      color: "bg-gradient-to-r from-blue-500 to-indigo-600",
      glowColor: "shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
    },
    { 
      name: "Newsletters", 
      value: 0, 
      color: "bg-gradient-to-r from-rose-500 to-pink-600",
      glowColor: "shadow-[0_4px_20px_rgba(244,63,94,0.3)]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center">
          <DashboardHeader
            title="Dashboard"
            subtitle="Overview"
            description="Monitor your marketing automation performance with precision"
            primaryColor="from-slate-900 via-blue-900 to-violet-900"
            secondaryColor="text-slate-600"
          />
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              size="lg"
              className="group border-2 border-violet-200/50 bg-white/70 backdrop-blur-sm hover:bg-violet-50/80 hover:border-violet-300 hover:shadow-[0_8px_32px_rgba(139,69,196,0.2)] transition-all duration-300 rounded-2xl text-violet-700 font-semibold"
            >
              <BarChart3 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Analytics
            </Button>
            <Button 
              size="lg"
              className="group bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 hover:shadow-[0_12px_40px_rgba(139,69,196,0.4)] transition-all duration-300 rounded-2xl text-white font-semibold px-8"
            >
              <Activity className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Live View
            </Button>
          </div>
        </div>

        {/* Enhanced Metrics Grid with Glassmorphism */}
        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Enhanced Recent Activities */}
          <Card className="lg:col-span-2 group border-0 bg-white/70 backdrop-blur-xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="relative p-8 pb-6">
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-slate-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 shadow-lg">
                  <Activity className="h-6 w-6 text-violet-600" />
                </div>
                <span>Recent Activities</span>
              </CardTitle>
              <CardDescription className="text-base text-slate-600 font-medium mt-2">
                Latest updates from your automation workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="relative p-8 pt-4">
              <div className="space-y-5">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={`group/item flex items-start space-x-4 p-5 rounded-2xl ${activity.bgColor} backdrop-blur-sm border-l-4 ${activity.accentColor} hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:scale-102 transition-all duration-300`}>
                    <div className={`p-3 rounded-xl bg-white/80 shadow-md group-hover/item:scale-110 group-hover/item:rotate-3 transition-all duration-300`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-800">{activity.title}</p>
                      <p className="text-sm text-slate-600 font-medium mt-1">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 hover:bg-white/60 text-slate-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Campaign Performance */}
          <Card className="group border-0 bg-white/70 backdrop-blur-xl hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)] transition-all duration-500 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardHeader className="relative p-8 pb-6">
              <CardTitle className="flex items-center space-x-3 text-xl font-bold text-slate-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-lg">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <span>Performance</span>
              </CardTitle>
              <CardDescription className="text-base text-slate-600 font-medium mt-2">Success rates by channel</CardDescription>
            </CardHeader>
            <CardContent className="relative p-8 pt-4">
              <div className="space-y-7">
                {campaignPerformance.map((campaign, index) => (
                  <div key={index} className="group/progress space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-slate-700">{campaign.name}</span>
                      <span className="text-lg font-black text-slate-800">{campaign.value}%</span>
                    </div>
                    <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className={`h-3 rounded-full ${campaign.color} ${campaign.glowColor} transition-all duration-1000 ease-out group-hover/progress:animate-pulse`}
                        style={{ 
                          width: `${Math.max(campaign.value, 2)}%`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3)`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
