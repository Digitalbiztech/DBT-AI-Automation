
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Eye, Users, MessageSquare, FileText } from "lucide-react";

export const WeeklyPlan = () => {
  const weeklyData = [
    {
      day: "Monday",
      date: "Dec 25",
      posts: [
        { type: "Blog", platform: "Website", title: "Year-end Marketing Review", cta: "Read More", status: "scheduled" },
        { type: "Social", platform: "LinkedIn", title: "Marketing trends prediction", cta: "Engage", status: "draft" }
      ]
    },
    {
      day: "Tuesday", 
      date: "Dec 26",
      posts: [
        { type: "Newsletter", platform: "Email", title: "Weekly Marketing Digest", cta: "Subscribe", status: "scheduled" },
        { type: "Social", platform: "Twitter", title: "Quick marketing tip", cta: "Retweet", status: "scheduled" }
      ]
    },
    {
      day: "Wednesday",
      date: "Dec 27", 
      posts: [
        { type: "Social", platform: "Instagram", title: "Behind the scenes content", cta: "Like & Share", status: "scheduled" }
      ]
    },
    {
      day: "Thursday",
      date: "Dec 28",
      posts: [
        { type: "Blog", platform: "Website", title: "Content marketing strategies", cta: "Learn More", status: "draft" },
        { type: "Social", platform: "LinkedIn", title: "Industry insights", cta: "Connect", status: "scheduled" }
      ]
    },
    {
      day: "Friday",
      date: "Dec 29",
      posts: [
        { type: "Social", platform: "Twitter", title: "Weekend motivation", cta: "Share", status: "scheduled" },
        { type: "Newsletter", platform: "Email", title: "Best of the week", cta: "Read Now", status: "draft" }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Blog': return FileText;
      case 'Social': return MessageSquare;
      case 'Newsletter': return Users;
      default: return Eye;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Blog': return 'from-emerald-500 to-teal-600';
      case 'Social': return 'from-blue-500 to-indigo-600';
      case 'Newsletter': return 'from-purple-500 to-violet-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-amber-100 text-amber-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Content Plan</h2>
          <p className="text-gray-600 mt-1">Plan and schedule your content across all platforms</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Generate AI Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {weeklyData.map((day, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900">{day.day}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">{day.date}</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {day.posts.map((post, postIndex) => {
                const Icon = getTypeIcon(post.type);
                return (
                  <div key={postIndex} className="p-3 bg-gray-50/70 rounded-lg border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getTypeColor(post.type)}`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <Badge className={`text-xs ${getStatusColor(post.status)}`}>
                        {post.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{post.title}</h4>
                    <p className="text-xs text-gray-600 mb-2">{post.platform}</p>
                    <div className="text-xs text-blue-600 font-medium">{post.cta}</div>
                  </div>
                );
              })}
              {day.posts.length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No posts scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
