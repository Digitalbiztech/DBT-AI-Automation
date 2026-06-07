import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle,
  Share2,
  Clock,
  CheckCircle
} from "lucide-react";

export const ClientDashboard = () => {
  const stats = [
    {
      title: "Total Reach",
      value: "127.4K",
      change: "+12.3% vs last month",
      icon: Eye,
      color: "text-violet-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-100"
    },
    {
      title: "Engagement Rate",
      value: "4.7%",
      change: "+0.8% this week",
      icon: Heart,
      color: "text-rose-600",
      bgColor: "bg-gradient-to-br from-rose-50 to-pink-100"
    },
    {
      title: "New Followers",
      value: "2,847",
      change: "+18.2% this month",
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-100"
    },
    {
      title: "Posts Published",
      value: "42",
      change: "This month",
      icon: CheckCircle,
      color: "text-indigo-600",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-100"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      content: "Keeping up with social media trends is one of the top marketing challenges...",
      platform: "LinkedIn",
      publishTime: "2 hours ago",
      engagement: { likes: 127, comments: 23, shares: 8 },
      status: "published"
    },
    {
      id: 2,
      content: "Your favorite flavors are back! Check out our new seasonal menu...",
      platform: "Instagram", 
      publishTime: "5 hours ago",
      engagement: { likes: 892, comments: 45, shares: 12 },
      status: "published"
    },
    {
      id: 3,
      content: "It's a smoothie kinda day. What's your go-to healthy drink?",
      platform: "Twitter",
      publishTime: "1 day ago",
      engagement: { likes: 234, comments: 67, shares: 34 },
      status: "published"
    }
  ];

  const upcomingPosts = [
    {
      id: 1,
      content: "Behind the scenes: Team collaboration tips for remote work",
      platform: "LinkedIn",
      scheduledTime: "Tomorrow at 9:00 AM",
      status: "approved"
    },
    {
      id: 2,
      content: "Weekend vibes! What's everyone up to this Saturday?",
      platform: "Instagram",
      scheduledTime: "Saturday at 11:30 AM", 
      status: "pending"
    }
  ];

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'LinkedIn': return 'bg-gradient-to-r from-blue-600 to-blue-700';
      case 'Twitter': return 'bg-gradient-to-r from-sky-500 to-cyan-600';
      case 'Instagram': return 'bg-gradient-to-r from-pink-500 to-rose-600';
      case 'Facebook': return 'bg-gradient-to-r from-blue-700 to-indigo-700';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs font-medium ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} shadow-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts Performance */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-violet-900">
              <TrendingUp className="h-5 w-5" />
              <span>Recent Posts Performance</span>
            </CardTitle>
            <CardDescription className="text-violet-700">
              Your latest published content and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 border border-violet-100 rounded-lg hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-violet-50/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                      <span className="text-sm font-medium text-gray-800">{post.platform}</span>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-600 bg-emerald-50">
                        Published
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{post.publishTime}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>{post.engagement.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span>{post.engagement.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="h-4 w-4 text-purple-500" />
                      <span>{post.engagement.shares}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Posts */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-amber-900">
              <Clock className="h-5 w-5" />
              <span>Upcoming Posts</span>
            </CardTitle>
            <CardDescription className="text-amber-700">
              Content scheduled for publishing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {upcomingPosts.map((post) => (
                <div key={post.id} className="p-4 border border-amber-100 rounded-lg bg-gradient-to-r from-white to-amber-50/30">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                      <span className="text-sm font-medium text-gray-800">{post.platform}</span>
                      <Badge 
                        variant="outline" 
                        className={post.status === 'approved' 
                          ? 'text-emerald-600 border-emerald-600 bg-emerald-50' 
                          : 'text-amber-600 border-amber-600 bg-amber-50'
                        }
                      >
                        {post.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1 text-violet-500" />
                    {post.scheduledTime}
                  </div>
                </div>
              ))}
              
              <div className="text-center py-4 border-2 border-dashed border-violet-200 rounded-lg bg-gradient-to-r from-violet-50/50 to-purple-50/50">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-violet-400" />
                <p className="text-sm text-violet-600">More posts coming soon...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance Overview */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
          <CardTitle className="text-emerald-900">Content Performance Overview</CardTitle>
          <CardDescription className="text-emerald-700">Weekly breakdown of your content strategy</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
              <div className="text-sm text-gray-600 mb-3">Posting Consistency</div>
              <Progress value={87} className="h-3 bg-blue-100" />
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.2x</div>
              <div className="text-sm text-gray-600 mb-3">Avg. Engagement Growth</div>
              <Progress value={84} className="h-3 bg-emerald-100" />
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-fuchsia-100 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
              <div className="text-sm text-gray-600 mb-3">Content Approval Rate</div>
              <Progress value={92} className="h-3 bg-purple-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
