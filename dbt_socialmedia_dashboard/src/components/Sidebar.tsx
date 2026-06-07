
import React from "react";
import { 
  Calendar, 
  FileText, 
  TrendingUp, 
  Mail, 
  Clock, 
  BarChart3, 
  MessageSquare, 
  Home,
  Workflow,
  Sparkles,
  PieChart,
  Users,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { 
      id: "social-dashboard", 
      label: "Social Dashboard", 
      icon: Home, 
      gradient: "from-blue-500 to-indigo-600",
      shadowColor: "shadow-[0_8px_32px_rgba(59,130,246,0.3)]",
      badge: null
    },
    { 
      id: "lead-summary", 
      label: "Lead Summary", 
      icon: Users, 
      gradient: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-[0_8px_32px_rgba(16,185,129,0.3)]",
      badge: "New"
    },
    { 
      id: "lead-profile", 
      label: "Lead Profile", 
      icon: UserCheck, 
      gradient: "from-purple-500 to-violet-600",
      shadowColor: "shadow-[0_8px_32px_rgba(139,69,196,0.3)]",
      badge: null
    },
    { 
      id: "queue", 
      label: "Queue & Plans", 
      icon: Clock, 
      gradient: "from-amber-500 to-orange-600",
      shadowColor: "shadow-[0_8px_32px_rgba(245,158,11,0.3)]",
      badge: "0"
    },
    { 
      id: "blogs-trends", 
      label: "Blogs & Trends", 
      icon: FileText, 
      gradient: "from-rose-500 to-pink-600",
      shadowColor: "shadow-[0_8px_32px_rgba(244,63,94,0.3)]",
      badge: null
    },
    { 
      id: "newsletters", 
      label: "Newsletters", 
      icon: Mail, 
      gradient: "from-cyan-500 to-blue-600",
      shadowColor: "shadow-[0_8px_32px_rgba(6,182,212,0.3)]",
      badge: null
    },
    { 
      id: "analytics", 
      label: "Analytics", 
      icon: PieChart, 
      gradient: "from-indigo-500 to-purple-600",
      shadowColor: "shadow-[0_8px_32px_rgba(99,102,241,0.3)]",
      badge: null
    },
    { 
      id: "workflows", 
      label: "Workflows", 
      icon: Workflow, 
      gradient: "from-slate-500 to-gray-600",
      shadowColor: "shadow-[0_8px_32px_rgba(100,116,139,0.3)]",
      badge: null
    },
    { 
      id: "chat", 
      label: "AI Assistant", 
      icon: MessageSquare, 
      gradient: "from-violet-500 to-purple-600",
      shadowColor: "shadow-[0_8px_32px_rgba(139,69,196,0.3)]",
      badge: null
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white/80 backdrop-blur-xl border-r border-purple-100/50 z-20 shadow-[0_0_40px_rgba(139,69,196,0.08)] flex flex-col overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/20"></div>
      
      <div className="relative flex-1 flex flex-col h-full">
        <div className="p-4 flex-shrink-0">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-[0_12px_40px_rgba(139,69,196,0.4)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div>
              <h2 className="text-lg font-black bg-gradient-to-r from-purple-900 to-blue-900 bg-clip-text text-transparent">MarketingHub</h2>
              <p className="text-xs text-purple-600/60 font-medium uppercase tracking-wider">AI Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation - Compact */}
        <div className="flex-1 px-4 pb-2 overflow-hidden">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "w-full group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-400 relative overflow-hidden text-sm",
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white ${item.shadowColor} transform scale-105`
                      : "text-purple-700/80 hover:bg-purple-50/80 hover:text-purple-900 hover:scale-102 hover:shadow-lg hover:shadow-purple-200/40"
                  )}
                >
                  {/* Subtle glow effect for active items */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-30"></div>
                  )}
                  
                  <div className="flex items-center space-x-2 relative z-10">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-all duration-300",
                      isActive ? "bg-white/20 shadow-lg" : "bg-purple-100/60 group-hover:bg-purple-200/80"
                    )}>
                      <Icon className={cn(
                        "h-4 w-4 transition-all duration-300",
                        isActive ? "text-white" : "text-purple-600 group-hover:text-purple-700"
                      )} />
                    </div>
                    <span className="font-semibold text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge 
                      className={cn(
                        "text-xs rounded-full transition-all duration-300 px-1.5 py-0",
                        isActive 
                          ? "bg-white/25 text-white border-white/40 shadow-lg" 
                          : "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200/50 group-hover:shadow-md"
                      )}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Compact Status Widget - Fixed at bottom */}
        <div className="p-4 flex-shrink-0">
          <div className="p-4 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 backdrop-blur-sm rounded-2xl border border-emerald-100/50 shadow-lg hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] transition-all duration-300">
            <div className="text-sm text-emerald-800 mb-2 font-bold">Supabase Status</div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-40"></div>
              </div>
              <span className="text-xs text-emerald-700 font-bold">Connected & Active</span>
            </div>
            <div className="text-xs text-emerald-600/80 font-medium">
              Last sync: 2 minutes ago
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
