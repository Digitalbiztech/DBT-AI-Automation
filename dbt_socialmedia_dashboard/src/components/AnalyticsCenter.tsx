
import React from "react";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Heart,
  MessageCircle,
  Share2,
  Target,
  Award,
  Zap,
  Settings,
  Activity
} from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AnalyticsCenter = () => {
  const metrics = [
    {
      title: "Total Impressions",
      value: "0",
      change: "+0%",
      icon: Eye,
      color: "text-blue-600",
      bgGradient: "from-blue-400/20 via-indigo-300/10 to-sky-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]",
      trend: "up"
    },
    {
      title: "Engagement Rate",
      value: "0%",
      change: "+0%", 
      icon: Heart,
      color: "text-red-600",
      bgGradient: "from-red-400/20 via-rose-300/10 to-pink-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(239,68,68,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(239,68,68,0.3)]",
      trend: "up"
    },
    {
      title: "Click-through Rate", 
      value: "0%",
      change: "+0%",
      icon: Target,
      color: "text-orange-600",
      bgGradient: "from-amber-400/20 via-orange-300/10 to-yellow-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(245,158,11,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]",
      trend: "up"
    },
    {
      title: "Follower Growth",
      value: "+0",
      change: "+0%",
      icon: Users,
      color: "text-green-600",
      bgGradient: "from-emerald-400/20 via-teal-300/10 to-cyan-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]",
      trend: "up"
    }
  ];

  const platformStats = [
    {
      platform: "Instagram",
      followers: "0",
      engagement: "0%",
      reach: "0",
      color: "bg-pink-500",
      growth: "+0%"
    },
    {
      platform: "LinkedIn", 
      followers: "0",
      engagement: "0%",
      reach: "0",
      color: "bg-blue-600",
      growth: "+0%"
    },
    {
      platform: "Twitter",
      followers: "0", 
      engagement: "0%",
      reach: "0",
      color: "bg-sky-500",
      growth: "+0%"
    },
    {
      platform: "Facebook",
      followers: "0",
      engagement: "0%", 
      reach: "0",
      color: "bg-blue-700",
      growth: "+0%"
    }
  ];

  const topContent = [
    {
      id: 1,
      content: "No content available for analysis",
      platform: "N/A",
      engagement: 0,
      impressions: 0,
      ctr: "0%",
      type: "none"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-200/15 to-violet-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Premium Header */}
        <DashboardHeader
          title="Analytics"
          subtitle="Center"
          description="Deep insights into your marketing performance and engagement"
          primaryColor="from-blue-900 via-indigo-800 to-purple-900"
          secondaryColor="text-blue-700/80"
        />

        {/* Sophisticated Metrics Grid */}
        <MetricsGrid 
          metrics={metrics} 
          showSettings={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-10">
          {/* Platform Performance */}
          <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(59,130,246,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="relative p-8 pb-6">
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-blue-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-xl">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <span>Platform Performance</span>
              </CardTitle>
              <CardDescription className="text-base text-blue-700/80 font-medium mt-2">
                Comparison across all social media channels
              </CardDescription>
            </CardHeader>
            <CardContent className="relative p-8 pt-4">
              <div className="space-y-5">
                {platformStats.map((platform, index) => (
                  <div key={index} className="group/item flex items-center justify-between p-5 rounded-2xl bg-blue-50/80 backdrop-blur-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102 transition-all duration-400">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded ${platform.color} shadow-lg`}></div>
                      <div>
                        <div className="font-bold text-purple-800 text-base">{platform.platform}</div>
                        <div className="text-sm text-purple-600/80 font-medium">
                          {platform.followers} followers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-purple-800">{platform.engagement}</div>
                      <div className="text-sm text-emerald-600 font-medium">{platform.growth}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Content */}
        <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(139,69,196,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="relative p-8 pb-6">
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-violet-800">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 shadow-xl">
                <Zap className="h-6 w-6 text-violet-600" />
              </div>
              <span>Top Performing Content</span>
            </CardTitle>
            <CardDescription className="text-base text-violet-700/80 font-medium mt-2">
              Your highest-engagement posts from the past 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-8 pt-4">
            <div className="space-y-5">
              {topContent.map((content, index) => (
                <div key={content.id} className="group/item p-5 rounded-2xl bg-violet-50/80 backdrop-blur-sm hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102 transition-all duration-400">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse shadow-lg"></div>
                      <span className="font-bold text-purple-800 text-base">{content.platform}</span>
                      <Badge className="bg-violet-100 text-violet-800 border-violet-200">
                        #{index + 1}
                      </Badge>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {content.type}
                    </Badge>
                  </div>
                  
                  <p className="text-base text-purple-800 font-medium mb-5 line-clamp-2">{content.content}</p>
                  
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50/80 rounded-2xl backdrop-blur-sm">
                      <div className="text-xl font-black text-blue-600">{content.engagement.toLocaleString()}</div>
                      <div className="text-sm text-blue-700/80 font-medium mt-1">Engagements</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50/80 rounded-2xl backdrop-blur-sm">
                      <div className="text-xl font-black text-emerald-600">{content.impressions.toLocaleString()}</div>
                      <div className="text-sm text-emerald-700/80 font-medium mt-1">Impressions</div>
                    </div>
                    <div className="text-center p-4 bg-violet-50/80 rounded-2xl backdrop-blur-sm">
                      <div className="text-xl font-black text-violet-600">{content.ctr}</div>
                      <div className="text-sm text-violet-700/80 font-medium mt-1">CTR</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Timeline */}
        <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(16,185,129,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="relative p-8 pb-6">
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-emerald-800">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-xl">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <span>Weekly Engagement Overview</span>
            </CardTitle>
            <CardDescription className="text-base text-emerald-700/80 font-medium mt-2">
              Daily breakdown of audience interaction
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-8 pt-4">
            <div className="grid grid-cols-7 gap-4 mb-6">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-sm text-purple-700/80 font-bold mb-3">{day}</div>
                  <div className="h-24 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-2xl flex items-end justify-center text-white text-base font-black shadow-xl hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105">
                    0%
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-base text-emerald-700/80 font-medium">
              Average engagement rate across platforms
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
