
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Bot, 
  Globe, 
  MessageSquare,
  BarChart3,
  Clock,
  Zap
} from "lucide-react";

export const DashboardOverview = () => {
  const stats = [
    {
      title: "Active Campaigns",
      value: "12",
      change: "+3 this month",
      icon: TrendingUp,
      color: "text-emerald-600",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Companies Scraped",
      value: "847",
      change: "+127 this week",
      icon: Globe,
      color: "text-blue-600",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Posts Scheduled",
      value: "156",
      change: "Next 7 days",
      icon: Calendar,
      color: "text-purple-600",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      title: "AI Agents Active",
      value: "8",
      change: "All systems operational",
      icon: Bot,
      color: "text-orange-600",
      gradient: "from-orange-400 to-red-500"
    }
  ];

  const workflows = [
    {
      name: "Web Scraping & Company Profiling",
      status: "Active",
      description: "Firecrawl + MCP integration for company data extraction",
      progress: 85,
      lastRun: "2 hours ago"
    },
    {
      name: "Competitor Analysis",
      status: "Active", 
      description: "Tavily MCP agent finding competition based on location",
      progress: 92,
      lastRun: "4 hours ago"
    },
    {
      name: "Social Media Planning",
      status: "Active",
      description: "AI agents creating 7-day content plans for each platform",
      progress: 78,
      lastRun: "1 hour ago"
    },
    {
      name: "Content Generation",
      status: "Active",
      description: "RSS feeds, Reddit, YouTube content summarization",
      progress: 95,
      lastRun: "30 minutes ago"
    },
    {
      name: "Blog & Newsletter Creation",
      status: "Active",
      description: "Automated blog posts and personalized newsletters",
      progress: 67,
      lastRun: "3 hours ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-200 border-0 shadow-lg bg-white rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700/80">{stat.title}</p>
                  <p className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
                  <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Status */}
      <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-200 bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Zap className="h-5 w-5 text-blue-600" />
            <span>n8n Workflow Status</span>
          </CardTitle>
          <CardDescription className="text-blue-700/80">
            Real-time monitoring of your automated marketing workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-blue-100 rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/30 hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-blue-800">{workflow.name}</h4>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 shadow-sm shadow-emerald-200/50">
                      {workflow.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700/80 mb-3">{workflow.description}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Progress value={workflow.progress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-blue-800">{workflow.progress}%</span>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="flex items-center text-sm text-blue-700/80">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    {workflow.lastRun}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-lg hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-200 bg-white rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100 hover:shadow-lg hover:shadow-emerald-200/30 transition-all duration-200">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full shadow-sm shadow-emerald-300/50"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-emerald-800">Successfully scraped 25 new companies</p>
                <p className="text-xs text-emerald-600/80">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg hover:shadow-blue-200/30 transition-all duration-200">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-sm shadow-blue-300/50"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Generated 14 social media posts for next week</p>
                <p className="text-xs text-blue-600/80">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100 hover:shadow-lg hover:shadow-purple-200/30 transition-all duration-200">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full shadow-sm shadow-purple-300/50"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">Competitor analysis completed for 5 companies</p>
                <p className="text-xs text-purple-600/80">1 hour ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
