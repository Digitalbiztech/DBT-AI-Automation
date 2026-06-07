
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Globe,
  Bot,
  Rss,
  FileText,
  BarChart3
} from "lucide-react";

export const WorkflowMonitor = () => {
  const workflows = [
    {
      id: 1,
      name: "Web Scraping Pipeline",
      description: "Firecrawl + MCP based web scraping with company profiling",
      status: "running",
      progress: 78,
      lastRun: "2 hours ago",
      nextRun: "In 4 hours",
      icon: Globe,
      executions: 156,
      successRate: 94
    },
    {
      id: 2,
      name: "Competitor Analysis Agent",
      description: "Tavily MCP agent for competition research based on location",
      status: "running",
      progress: 92,
      lastRun: "1 hour ago", 
      nextRun: "In 5 hours",
      icon: Bot,
      executions: 89,
      successRate: 97
    },
    {
      id: 3, 
      name: "Social Media Content Generator",
      description: "AI agents creating platform-specific content for 7-day plans",
      status: "running",
      progress: 85,
      lastRun: "30 minutes ago",
      nextRun: "In 2 hours",
      icon: Bot,
      executions: 234,
      successRate: 91
    },
    {
      id: 4,
      name: "RSS & News Aggregator", 
      description: "Content aggregation from RSS feeds, Reddit, YouTube for references",
      status: "running",
      progress: 96,
      lastRun: "15 minutes ago",
      nextRun: "In 1 hour",
      icon: Rss,
      executions: 445,
      successRate: 98
    },
    {
      id: 5,
      name: "Blog & Newsletter Creator",
      description: "Automated blog posts and personalized newsletter generation",
      status: "paused",
      progress: 0,
      lastRun: "3 hours ago",
      nextRun: "Paused",
      icon: FileText,
      executions: 67,
      successRate: 89
    },
    {
      id: 6,
      name: "Campaign Planning Agent",
      description: "AI agent for creating comprehensive marketing campaigns",
      status: "running",
      progress: 73,
      lastRun: "45 minutes ago",
      nextRun: "In 3 hours",
      icon: BarChart3,
      executions: 123,
      successRate: 95
    },
    {
      id: 7,
      name: "Data Storage Pipeline",
      description: "Supabase integration for storing scraped data and analytics",
      status: "running",
      progress: 100,
      lastRun: "10 minutes ago",
      nextRun: "Continuous",
      icon: Database,
      executions: 892,
      successRate: 99
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-orange-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-700 border-green-200';
      case 'paused': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'error': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold text-green-600">6</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold">2,006</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">94.8%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Processed</p>
                <p className="text-2xl font-bold">12.4GB</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>n8n Workflow Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <workflow.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="font-medium">{workflow.name}</h4>
                        <Badge variant="outline" className={getStatusColor(workflow.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(workflow.status)}
                            <span className="capitalize">{workflow.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {workflow.status === 'running' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{workflow.progress}%</span>
                    </div>
                    <Progress value={workflow.progress} className="h-2" />
                  </div>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Last Run</p>
                    <p className="font-medium">{workflow.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Next Run</p>
                    <p className="font-medium">{workflow.nextRun}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Executions</p>
                    <p className="font-medium">{workflow.executions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Success Rate</p>
                    <p className="font-medium text-green-600">{workflow.successRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">n8n Server</p>
                  <p className="text-sm text-muted-foreground">All systems operational</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                Healthy
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Supabase Connection</p>
                  <p className="text-sm text-muted-foreground">Database connection stable</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                Connected
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">API Integrations</p>
                  <p className="text-sm text-muted-foreground">Firecrawl, Tavily, and other APIs responsive</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
