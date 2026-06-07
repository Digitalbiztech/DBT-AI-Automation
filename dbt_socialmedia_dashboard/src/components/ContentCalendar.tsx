
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Image, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

export const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentWeek = [];
  
  // Generate current week dates
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    currentWeek.push(day);
  }

  const scheduledPosts = [
    {
      id: 1,
      day: 1,
      time: "09:00 AM",
      platform: "LinkedIn",
      type: "image",
      title: "Industry Insights: Q4 Marketing Trends",
      status: "approved",
      engagement: "345 likes"
    },
    {
      id: 2,
      day: 1,
      time: "02:00 PM", 
      platform: "Twitter",
      type: "text",
      title: "Quick tip: Boosting organic reach with hashtags",
      status: "pending",
      engagement: "Scheduled"
    },
    {
      id: 3,
      day: 2,
      time: "10:30 AM",
      platform: "Instagram",
      type: "image",
      title: "Behind the scenes: Team collaboration",
      status: "approved",
      engagement: "892 likes"
    },
    {
      id: 4,
      day: 3,
      time: "08:15 AM",
      platform: "Facebook",
      type: "video",
      title: "Product demo: New features walkthrough",
      status: "review",
      engagement: "Pending review"
    },
    {
      id: 5,
      day: 4,
      time: "11:00 AM",
      platform: "LinkedIn",
      type: "text",
      title: "Thought leadership: Future of digital marketing",
      status: "approved",
      engagement: "567 likes"
    }
  ];

  const getPostsForDay = (dayIndex) => {
    return scheduledPosts.filter(post => post.day === dayIndex);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'review': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'LinkedIn': return 'bg-blue-600';
      case 'Twitter': return 'bg-sky-500';
      case 'Instagram': return 'bg-pink-500';
      case 'Facebook': return 'bg-blue-700';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <CardTitle>Content Calendar - Week View</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-3">
                {currentWeek[0].toLocaleDateString()} - {currentWeek[6].toLocaleDateString()}
              </span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {currentWeek.map((date, dayIndex) => (
          <Card key={dayIndex} className="min-h-[400px]">
            <CardHeader className="pb-3">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  {weekDays[date.getDay()]}
                </div>
                <div className="text-lg font-bold">
                  {date.getDate()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {getPostsForDay(dayIndex).map((post) => (
                  <div key={post.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getPlatformColor(post.platform)}`}></div>
                        <span className="text-xs font-medium">{post.platform}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {post.time}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <h4 className="text-sm font-medium line-clamp-2">{post.title}</h4>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {post.type === 'image' && <Image className="h-3 w-3 text-muted-foreground" />}
                        {post.type === 'text' && <MessageSquare className="h-3 w-3 text-muted-foreground" />}
                        <span className="text-xs text-muted-foreground capitalize">{post.type}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(post.status)}`}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      {post.engagement}
                    </div>
                  </div>
                ))}
                
                {getPostsForDay(dayIndex).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No posts scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Publishing Queue Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing Queue Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">8</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-muted-foreground">In Review</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
