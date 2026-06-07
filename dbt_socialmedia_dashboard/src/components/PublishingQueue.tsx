
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Play
} from "lucide-react";

export const PublishingQueue = () => {
  const queueStats = [
    {
      title: "Approved",
      count: 23,
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: CheckCircle
    },
    {
      title: "Pending Review",
      count: 8,
      color: "text-orange-600", 
      bgColor: "bg-orange-50",
      icon: AlertCircle
    },
    {
      title: "Scheduled",
      count: 12,
      color: "text-blue-600",
      bgColor: "bg-blue-50", 
      icon: Clock
    },
    {
      title: "Draft",
      count: 5,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      icon: Edit3
    }
  ];

  const publishingSchedule = [
    { day: 'Sun', times: ['12:28', '16:26'], posts: 2 },
    { day: 'Mon', times: ['06:21', '14:29'], posts: 3 },
    { day: 'Tue', times: ['03:32', '09:20'], posts: 2 },
    { day: 'Wed', times: ['00:58', '08:56'], posts: 1 },
    { day: 'Thu', times: ['04:05', '11:01'], posts: 4 },
    { day: 'Fri', times: ['01:37', '09:15'], posts: 2 },
    { day: 'Sat', times: [], posts: 0 }
  ];

  const queuedPosts = [
    {
      id: 1,
      content: "Keeping up with social media trends is one of the top marketing challenges churches mention. When you are focused...",
      platform: "LinkedIn",
      scheduledTime: "Today at 09:00 AM",
      status: "approved",
      type: "text",
      engagement: "Expected: 150-200 interactions"
    },
    {
      id: 2,
      content: "One glass of pure liquid watermelon...",
      platform: "Instagram", 
      scheduledTime: "Today at 08:15 PM",
      status: "approved",
      type: "image",
      engagement: "Expected: 300-400 interactions"
    },
    {
      id: 3,
      content: "It's a smoothie kinda day...",
      platform: "Twitter",
      scheduledTime: "Tomorrow at 06:30 PM",
      status: "pending",
      type: "text",
      engagement: "Expected: 80-120 interactions"
    },
    {
      id: 4,
      content: "Vitamin C is yummy and just what you need...",
      platform: "Facebook",
      scheduledTime: "Tomorrow at 09:00 PM",
      status: "scheduled",
      type: "image",
      engagement: "Expected: 200-250 interactions"
    }
  ];

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'LinkedIn': return 'bg-blue-600';
      case 'Twitter': return 'bg-sky-500';
      case 'Instagram': return 'bg-pink-500';
      case 'Facebook': return 'bg-blue-700';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {queueStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publishing Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Multiple Publishing Queues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {publishingSchedule.map((schedule, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded text-sm font-medium ${
                      schedule.posts > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {schedule.day}
                    </div>
                    <div className="text-sm">
                      {schedule.times.length > 0 ? (
                        <div className="space-y-1">
                          {schedule.times.map((time, timeIndex) => (
                            <div key={timeIndex} className="text-muted-foreground">{time}</div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No posts</span>
                      )}
                    </div>
                  </div>
                  {schedule.posts > 0 && (
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Time to Post Heatmap */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Best Time to Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground mb-3">
                Timezone: New York/USA
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 * 12 }, (_, i) => {
                  const intensity = Math.random();
                  let bgColor = 'bg-gray-100';
                  if (intensity > 0.8) bgColor = 'bg-green-600';
                  else if (intensity > 0.6) bgColor = 'bg-green-500';
                  else if (intensity > 0.4) bgColor = 'bg-green-400';
                  else if (intensity > 0.2) bgColor = 'bg-green-200';
                  
                  return (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${bgColor}`}
                      title={`Hour ${i % 24}, Day ${Math.floor(i / 24)}`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                <span>Less engagement</span>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                </div>
                <span>More engagement</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queued Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queuedPosts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                    <span className="font-medium">{post.platform}</span>
                    <Badge variant="outline" className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {post.scheduledTime}
                  </div>
                  <div className="text-muted-foreground">
                    {post.engagement}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
