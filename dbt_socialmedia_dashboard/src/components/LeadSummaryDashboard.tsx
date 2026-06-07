
import React from "react";
import { 
  Users,
  UserCheck,
  TrendingUp,
  Mail,
  ArrowUpRight,
  Activity,
  Settings
} from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeadSummaryDashboardProps {
  onConfigureSupabase: (tableName: string) => void;
}

export const LeadSummaryDashboard = ({ onConfigureSupabase }: LeadSummaryDashboardProps) => {
  const metrics = [
    {
      title: "Total Leads",
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
      title: "Qualified Leads",
      value: "0",
      change: "+0 this week",
      icon: UserCheck,
      color: "text-emerald-600",
      bgGradient: "from-emerald-400/20 via-teal-300/10 to-cyan-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(16,185,129,0.3)]",
      trend: "up"
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0% vs last month",
      icon: TrendingUp,
      color: "text-blue-600",
      bgGradient: "from-blue-400/20 via-indigo-300/10 to-sky-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]",
      trend: "up"
    },
    {
      title: "Email Contacts",
      value: "0",
      change: "+0 new this week",
      icon: Mail,
      color: "text-rose-600",
      bgGradient: "from-rose-400/20 via-pink-300/10 to-red-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(244,63,94,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(244,63,94,0.3)]",
      trend: "up"
    }
  ];

  const leadActivities = [
    {
      id: 1,
      type: "qualification",
      title: "No leads qualified",
      time: "0 minutes ago",
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50/80",
      accentColor: "border-l-emerald-400"
    },
    {
      id: 2,
      type: "email",
      title: "No emails sent",
      time: "0 hours ago",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50/80",
      accentColor: "border-l-blue-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-200/15 to-violet-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Premium Header */}
        <DashboardHeader
          title="Lead"
          subtitle="Summary"
          description="Track and analyze your lead generation performance"
          primaryColor="from-emerald-900 via-teal-800 to-cyan-900"
          secondaryColor="text-emerald-700/80"
        />

        {/* Sophisticated Metrics Grid */}
        <MetricsGrid 
          metrics={metrics} 
          onConfigureSupabase={onConfigureSupabase}
          showSettings={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Lead Activities */}
          <Card className="lg:col-span-2 group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(16,185,129,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="relative p-8 pb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 text-emerald-400 hover:text-emerald-600 hover:bg-white/60"
                onClick={() => onConfigureSupabase('lead_activities')}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-emerald-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-xl">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
                <span>Recent Lead Activity</span>
              </CardTitle>
              <CardDescription className="text-base text-emerald-700/80 font-medium mt-2">
                Latest updates from your lead pipeline
              </CardDescription>
            </CardHeader>
            <CardContent className="relative p-8 pt-4">
              <div className="space-y-5">
                {leadActivities.map((activity) => (
                  <div key={activity.id} className={`group/item flex items-start space-x-4 p-5 rounded-2xl ${activity.bgColor} backdrop-blur-sm border-l-4 ${activity.accentColor} hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102 transition-all duration-400`}>
                    <div className={`p-3 rounded-xl bg-white/90 shadow-lg group-hover/item:scale-115 group-hover/item:rotate-6 transition-all duration-400`}>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-purple-800">{activity.title}</p>
                      <p className="text-sm text-purple-600/80 font-medium mt-1">{activity.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 hover:bg-purple-50/80 text-purple-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lead Conversion Funnel */}
          <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(59,130,246,0.15)] transition-all duration-700 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <CardHeader className="relative p-8 pb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 text-blue-400 hover:text-blue-600 hover:bg-white/60"
                onClick={() => onConfigureSupabase('lead_funnel')}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <CardTitle className="flex items-center space-x-3 text-xl font-bold text-blue-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-xl">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <span>Conversion Funnel</span>
              </CardTitle>
              <CardDescription className="text-base text-blue-700/80 font-medium mt-2">Lead progression stages</CardDescription>
            </CardHeader>
            <CardContent className="relative p-8 pt-4">
              <div className="space-y-7">
                {[
                  { stage: "Prospects", count: 0, color: "bg-gradient-to-r from-blue-500 to-indigo-600" },
                  { stage: "Qualified", count: 0, color: "bg-gradient-to-r from-emerald-500 to-teal-600" },
                  { stage: "Converted", count: 0, color: "bg-gradient-to-r from-violet-500 to-purple-600" }
                ].map((funnel, index) => (
                  <div key={index} className="group/progress space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-purple-700">{funnel.stage}</span>
                      <span className="text-lg font-black text-purple-800">{funnel.count}</span>
                    </div>
                    <div className="relative w-full bg-purple-100/50 rounded-full h-4 overflow-hidden shadow-inner">
                      <div 
                        className={`h-4 rounded-full ${funnel.color} transition-all duration-1200 ease-out group-hover/progress:animate-pulse`}
                        style={{ 
                          width: `${Math.max(funnel.count, 2)}%`,
                          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4)`
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
