
import React from "react";
import { 
  Workflow,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Settings,
  Activity
} from "lucide-react";
import { MetricsGrid } from "@/components/shared/MetricsGrid";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const WorkflowManager = () => {
  const metrics = [
    {
      title: "Active Workflows",
      value: "0",
      change: "+0 this week",
      icon: Workflow,
      color: "text-indigo-600",
      bgGradient: "from-indigo-400/20 via-blue-300/10 to-cyan-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(99,102,241,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(99,102,241,0.3)]",
      trend: "up"
    },
    {
      title: "Executions Today",
      value: "0",
      change: "+0 vs yesterday",
      icon: Play,
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
      icon: CheckCircle,
      color: "text-green-600",
      bgGradient: "from-green-400/20 via-emerald-300/10 to-teal-200/20",
      shadowColor: "hover:shadow-[0_12px_40px_rgba(34,197,94,0.25)]",
      glowColor: "group-hover:shadow-[0_0_50px_rgba(34,197,94,0.3)]",
      trend: "up"
    },
    {
      title: "Failed Workflows",
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

  const workflows = [
    {
      id: 1,
      name: "No workflows created",
      status: "inactive",
      lastRun: "Never",
      executions: 0,
      success: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/15 to-blue-200/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-green-200/15 to-emerald-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 space-y-12 p-8">
        {/* Premium Header */}
        <DashboardHeader
          title="Workflow"
          subtitle="Manager"
          description="Automate your marketing processes with intelligent workflows"
          primaryColor="from-indigo-900 via-blue-800 to-cyan-900"
          secondaryColor="text-indigo-700/80"
        />

        {/* Sophisticated Metrics Grid */}
        <MetricsGrid 
          metrics={metrics} 
          showSettings={false}
        />

        {/* Workflow List */}
        <Card className="group border-0 bg-white/75 backdrop-blur-xl hover:shadow-[0_25px_70px_rgba(99,102,241,0.12)] transition-all duration-700 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <CardHeader className="relative p-8 pb-6">
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-indigo-800">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 shadow-xl">
                <Workflow className="h-6 w-6 text-indigo-600" />
              </div>
              <span>Active Workflows</span>
            </CardTitle>
            <CardDescription className="text-base text-indigo-700/80 font-medium mt-2">
              Manage your automation workflows and executions
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-8 pt-4">
            <div className="space-y-5">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="group/item flex items-start space-x-4 p-5 rounded-2xl bg-indigo-50/80 backdrop-blur-sm border-l-4 border-l-indigo-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:scale-102 transition-all duration-400">
                  <div className="p-3 rounded-xl bg-white/90 shadow-lg group-hover/item:scale-115 group-hover/item:rotate-6 transition-all duration-400">
                    <Workflow className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-purple-800">{workflow.name}</p>
                    <p className="text-sm text-purple-600/80 font-medium mt-1">Last run: {workflow.lastRun}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className="flex items-center space-x-1">
                        <Play className="h-3 w-3" />
                        <span>{workflow.executions} executions</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>{workflow.success}% success</span>
                      </span>
                    </div>
                  </div>
                  <Badge className={workflow.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {workflow.status}
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
