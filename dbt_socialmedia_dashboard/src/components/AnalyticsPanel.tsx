
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Globe, 
  MessageSquare,
  Heart,
  Share,
  Eye
} from "lucide-react";

export const AnalyticsPanel = () => {
  const performanceData = [
    { name: 'Mon', posts: 4, engagement: 65, reach: 1200 },
    { name: 'Tue', posts: 6, engagement: 78, reach: 1800 },
    { name: 'Wed', posts: 3, engagement: 52, reach: 950 },
    { name: 'Thu', posts: 8, engagement: 85, reach: 2100 },
    { name: 'Fri', posts: 5, engagement: 72, reach: 1650 },
    { name: 'Sat', posts: 7, engagement: 90, reach: 2400 },
    { name: 'Sun', posts: 4, engagement: 68, reach: 1350 }
  ];

  const platformData = [
    { name: 'LinkedIn', value: 35, color: '#0077B5' },
    { name: 'Twitter', value: 28, color: '#1DA1F2' },
    { name: 'Instagram', value: 22, color: '#E4405F' },
    { name: 'Facebook', value: 15, color: '#1877F2' }
  ];

  const contentTypeData = [
    { name: 'Jan', images: 45, videos: 12, text: 23 },
    { name: 'Feb', images: 52, videos: 18, text: 31 },
    { name: 'Mar', images: 38, videos: 15, text: 28 },
    { name: 'Apr', images: 61, videos: 22, text: 35 },
    { name: 'May', images: 55, videos: 19, text: 32 },
    { name: 'Jun', images: 67, videos: 25, text: 38 }
  ];

  const kpis = [
    {
      title: "Total Reach",
      value: "24.8K",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Engagement Rate",
      value: "4.2%",
      change: "+0.8%",
      trend: "up", 
      icon: Heart,
      color: "text-red-600"
    },
    {
      title: "New Followers",
      value: "892",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Share Rate",
      value: "2.1%",
      change: "-0.3%",
      trend: "down",
      icon: Share,
      color: "text-green-600"
    }
  ];

  const topPosts = [
    {
      id: 1,
      platform: "LinkedIn",
      title: "5 Marketing Trends That Will Dominate 2024",
      engagement: 1247,
      reach: 8934,
      likes: 89,
      shares: 23,
      type: "image"
    },
    {
      id: 2,
      platform: "Twitter",
      title: "Quick tip: Use analytics to optimize posting times",
      engagement: 892,
      reach: 5621,
      likes: 156,
      shares: 45,
      type: "text"
    },
    {
      id: 3,
      platform: "Instagram",
      title: "Behind the scenes: Our content creation process",
      engagement: 1456,
      reach: 12340,
      likes: 234,
      shares: 67,
      type: "video"
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                <Badge variant={kpi.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                  <div className="flex items-center space-x-1">
                    {kpi.trend === 'up' ? 
                      <TrendingUp className="h-3 w-3" /> : 
                      <TrendingDown className="h-3 w-3" />
                    }
                    <span>{kpi.change}</span>
                  </div>
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Weekly Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Engagement %"
                />
                <Line 
                  type="monotone" 
                  dataKey="reach" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Reach"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Platform Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5" />
            <span>Content Type Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="images" fill="#8884d8" name="Images" />
              <Bar dataKey="videos" fill="#82ca9d" name="Videos" />
              <Bar dataKey="text" fill="#ffc658" name="Text Posts" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Top Performing Posts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.platform}
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {post.type}
                    </Badge>
                  </div>
                  <h4 className="font-medium mb-2">{post.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.reach.toLocaleString()} reach</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share className="h-4 w-4" />
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{post.engagement}</div>
                  <div className="text-sm text-muted-foreground">total engagement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>AI-Generated Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-900 mb-2">Optimal Posting Time</h4>
              <p className="text-sm text-blue-800">
                Based on your audience data, posting between 9-11 AM on weekdays generates 
                23% higher engagement than other time slots.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-900 mb-2">Content Recommendation</h4>
              <p className="text-sm text-green-800">
                Video content shows 45% better performance than static images. 
                Consider increasing video production for next month's content calendar.
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-medium text-purple-900 mb-2">Trending Topics</h4>
              <p className="text-sm text-purple-800">
                "AI automation" and "digital transformation" are trending in your industry. 
                Content featuring these topics gets 30% more engagement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
