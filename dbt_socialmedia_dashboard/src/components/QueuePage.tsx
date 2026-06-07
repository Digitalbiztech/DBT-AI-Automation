
import React from "react";
import { 
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings
} from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface QueuePageProps {
  onConfigureSupabase: (tableName: string) => void;
}

export const QueuePage = ({ onConfigureSupabase }: QueuePageProps) => {
  const metrics = [
    {
      title: "Queued Items",
      value: "0",
      change: "+0 this week",
      icon: Clock,
      color: "text-amber-600",
      bgGradient: "from-amber-400/20 via-orange-300/10 to-yellow-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(245,158,11,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]",
      trend: "up"
    },
    {
      title: "Completed Today",
      value: "0",
      change: "+0 vs yesterday", 
      icon: CheckCircle,
      color: "text-emerald-600",
      bgGradient: "from-emerald-400/20 via-teal-300/10 to-cyan-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]",
      trend: "up"
    },
    {
      title: "Success Rate",
      value: "0%",
      change: "+0% this month",
      icon: Calendar,
      color: "text-blue-600",
      bgGradient: "from-blue-400/20 via-indigo-300/10 to-sky-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]",
      trend: "up"
    },
    {
      title: "Failed Items",
      value: "0",
      change: "-0 vs last week",
      icon: AlertTriangle,
      color: "text-red-600",
      bgGradient: "from-red-400/20 via-rose-300/10 to-pink-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(239,68,68,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(239,68,68,0.3)]",
      trend: "down"
    }
  ];

  const queueItems = [
    {
      id: 1,
      title: "No items in queue",
      status: "pending",
      scheduledTime: "0 minutes ago",
      type: "content",
      platform: "None"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-200/15 to-orange-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 space-y-6 p-6">
        {/* Premium Header */}
        <DashboardHeader
          title="Queue &"
          subtitle="Plans"
          description="Manage your content scheduling and automation workflows"
          primaryColor="from-amber-900 via-orange-800 to-yellow-900"
          secondaryColor="text-amber-700/80"
        />

        {/* Sophisticated Metrics Grid */}
        <MetricsGrid 
          metrics={metrics} 
          onConfigureSupabase={onConfigureSupabase}
          showSettings={true}
        />

        {/* Queue Management */}
        <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(245,158,11,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 to-orange-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="relative p-6 pb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 text-amber-400 hover:text-amber-600 hover:bg-white/60"
              onClick={() => onConfigureSupabase('queue_items')}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center space-x-3 text-xl font-bold text-amber-800">
              <div className="p-2 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-xl">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span>Publishing Queue</span>
            </CardTitle>
            <CardDescription className="text-sm text-amber-700/80 font-medium mt-1">
              Scheduled content and automation workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 pt-2">
            <div className="space-y-3">
              {queueItems.map((item) => (
                <div key={item.id} className="group/item flex items-start space-x-3 p-4 rounded-2xl bg-amber-50/80 backdrop-blur-sm border-l-4 border-l-amber-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102 transition-all duration-400">
                  <div className="p-2 rounded-xl bg-white/90 shadow-lg group-hover/item:scale-115 group-hover/item:rotate-6 transition-all duration-400">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-purple-800">{item.title}</p>
                    <p className="text-xs text-purple-600/80 font-medium mt-1">{item.scheduledTime}</p>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                    {item.status}
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
