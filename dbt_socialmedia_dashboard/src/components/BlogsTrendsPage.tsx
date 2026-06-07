
import React from "react";
import { 
  FileText,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Settings,
  Activity
} from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogsTrendsPageProps {
  onConfigureSupabase: (tableName: string) => void;
}

export const BlogsTrendsPage = ({ onConfigureSupabase }: BlogsTrendsPageProps) => {
  const metrics = [
    {
      title: "Published Blogs",
      value: "0",
      change: "+0 this month",
      icon: FileText,
      color: "text-blue-600",
      bgGradient: "from-blue-400/20 via-indigo-300/10 to-sky-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]",
      trend: "up"
    },
    {
      title: "Total Views",
      value: "0",
      change: "+0 this week",
      icon: Eye,
      color: "text-emerald-600",
      bgGradient: "from-emerald-400/20 via-teal-300/10 to-cyan-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]",
      trend: "up"
    },
    {
      title: "Engagement Rate",
      value: "0%",
      change: "+0% vs last month",
      icon: Heart,
      color: "text-rose-600",
      bgGradient: "from-rose-400/20 via-pink-300/10 to-red-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(244,63,94,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(244,63,94,0.3)]",
      trend: "up"
    },
    {
      title: "Trending Topics",
      value: "0",
      change: "+0 new trends",
      icon: TrendingUp,
      color: "text-violet-600",
      bgGradient: "from-violet-400/20 via-purple-300/10 to-fuchsia-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(139,69,196,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(139,69,196,0.3)]",
      trend: "up"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "No blog posts available",
      excerpt: "Start creating content to see your blog analytics here.",
      views: 0,
      engagement: 0,
      status: "draft"
    }
  ];

  const trendingTopics = [
    {
      id: 1,
      topic: "No trending topics",
      mentions: 0,
      growth: "+0%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-indigo-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-rose-200/15 to-pink-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Premium Header */}
        <DashboardHeader
          title="Blogs &"
          subtitle="Trends"
          description="Track your content performance and discover trending topics"
          primaryColor="from-blue-900 via-indigo-800 to-violet-900"
          secondaryColor="text-blue-700/80"
        />

        {/* Sophisticated Metrics Grid */}
        <MetricsGrid 
          metrics={metrics} 
          onConfigureSupabase={onConfigureSupabase}
          showSettings={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Recent Blog Posts */}
          <Card className="lg:col-span-2 group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(59,130,246,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="relative p-8 pb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 text-blue-400 hover:text-blue-600 hover:bg-white/60"
                onClick={() => onConfigureSupabase('blog_posts')}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-blue-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-xl">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <span>Recent Blog Posts</span>
              </CardTitle>
              <CardDescription className="text-base text-blue-700/80 font-medium mt-2">
                Your latest published content and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="relative p-8 pt-4">
              <div className="space-y-5">
                {blogPosts.map((post) => (
                  <div key={post.id} className="group/item flex items-start space-x-4 p-5 rounded-2xl bg-blue-50/80 backdrop-blur-sm border-l-4 border-l-blue-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102 transition-all duration-400">
                    <div className="p-3 rounded-xl bg-white/90 shadow-lg group-hover/item:scale-115 group-hover/item:rotate-6 transition-all duration-400">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-purple-800">{post.title}</p>
                      <p className="text-sm text-purple-600/80 font-medium mt-1">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs">
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.engagement}</span>
                        </span>
                      </div>
                    </div>
                    <Badge className={post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(244,63,94,0.15)] transition-all duration-700 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 to-pink-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="relative p-8 pb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 text-rose-400 hover:text-rose-600 hover:bg-white/60"
                onClick={() => onConfigureSupabase('trending_topics')}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <CardTitle className="flex items-center space-x-3 text-xl font-bold text-rose-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 shadow-xl">
                  <TrendingUp className="h-6 w-6 text-rose-600" />
                </div>
                <span>Trending Topics</span>
              </CardTitle>
              <CardDescription className="text-base text-rose-700/80 font-medium mt-2">Popular content themes</CardDescription>
            </CardHeader>
            <CardContent className="relative p-8 pt-4">
              <div className="space-y-5">
                {trendingTopics.map((trend) => (
                  <div key={trend.id} className="group/item flex items-center justify-between p-4 rounded-2xl bg-rose-50/80 backdrop-blur-sm hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:scale-102 transition-all duration-400">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-purple-800">{trend.topic}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-purple-800">{trend.mentions}</div>
                      <div className="text-xs text-rose-600">{trend.growth}</div>
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
