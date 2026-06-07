
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Image, MessageSquare, Edit3, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export const ContentPlanner = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState(null);
  
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentWeekDates = [];
  
  // Generate current week dates
  const startOfWeek = new Date(currentWeek);
  startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    currentWeekDates.push(day);
  }

  const scheduledContent = [
    {
      id: 1,
      day: 0,
      time: "08:00",
      platform: "Instagram",
      type: "image",
      title: "Monday Morning Motivation",
      content: "Your favorite flavors are back!",
      status: "scheduled",
      image: true
    },
    {
      id: 2,
      day: 1,
      time: "12:00", 
      platform: "LinkedIn",
      type: "text",
      title: "Industry Insights",
      content: "Keeping up with social media trends is one of the top marketing challenges...",
      status: "approved"
    },
    {
      id: 3,
      day: 2,
      time: "15:30",
      platform: "Twitter",
      type: "text",
      title: "Quick Tip Tuesday",
      content: "It's a smoothie kinda day...",
      status: "draft"
    },
    {
      id: 4,
      day: 3,
      time: "10:00",
      platform: "Facebook",
      type: "image",
      title: "Wednesday Wisdom",
      content: "Behind the scenes: Team collaboration",
      status: "pending",
      image: true
    },
    {
      id: 5,
      day: 4,
      time: "14:00",
      platform: "Instagram",
      type: "video",
      title: "Throwback Thursday",
      content: "Remember when we launched our first product?",
      status: "approved"
    }
  ];

  const getPostsForDay = (dayIndex) => {
    return scheduledContent.filter(post => post.day === dayIndex);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const PostComposer = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-green-600" />
            <span>Post Composer</span>
          </div>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
          <div className="text-gray-400 mb-2">
            <MessageSquare className="h-12 w-12 mx-auto mb-3" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Keeping up with social media trends is one of the top marketing challenges churches mention. When you are focused...
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4 mr-2" />
              Add Media
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">When to publish this?</span>
              <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                Post Now
              </Button>
              <Button variant="outline" size="sm">
                Schedule
              </Button>
              <Button variant="outline" size="sm">
                Add to Queue
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PostComposer />
      
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <CardTitle>Content Calendar</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-600">
                {currentWeekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {currentWeekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-3">Today</span>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {currentWeekDates.map((date, dayIndex) => (
          <Card key={dayIndex} className="min-h-[400px]">
            <CardHeader className="pb-3">
              <div className="text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  {weekDays[date.getDay()].slice(0, 3)}
                </div>
                <div className="text-lg font-bold">
                  {date.getDate()}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {getPostsForDay(dayIndex).map((post) => (
                  <Dialog key={post.id}>
                    <DialogTrigger asChild>
                      <div className="p-3 border rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
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
                          <h4 className="text-sm font-medium line-clamp-2">{post.content}</h4>
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
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
                            <span className="font-medium">{post.platform}</span>
                            <Badge variant="outline" className={getStatusColor(post.status)}>
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700">{post.content}</p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline">Edit</Button>
                          <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
                
                {getPostsForDay(dayIndex).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Plus className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No posts scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
