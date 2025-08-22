# Code Reference: Queue, Weekly Plan, and Trends Components

## Table of Contents
1. [QueuePage Component](#queuepage-component)
2. [WeeklyPlan Component](#weeklyplan-component)
3. [TrendsPage Component](#trendspage-component)

---

## QueuePage Component

```tsx
import { useState } from "react";
import { Clock, Eye, Edit3, Trash2, Play, CheckCircle, AlertCircle, Calendar, List, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentPlanner } from "./ContentPlanner";
import QueuePlan from "./QueuePlan";
import { PublishingQueue } from "./PublishingQueue";

interface QueuePageProps {
  onConfigureSupabase: (tableName: string) => void;
}

interface Post {
  id: number;
  title: string;
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  type: 'post' | 'story' | 'reel' | 'tweet';
  scheduledTime: string;
  status: 'scheduled' | 'pending' | 'published';
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  content: string;
  imageUrl?: string;
}

export const QueuePage = ({ onConfigureSupabase }: QueuePageProps) => {
  const [activeTab, setActiveTab] = useState("queue");
  const [posts, setPosts] = useState<Post[]>([]);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);

  const updatePostStatus = (postId: number, newStatus: Post['status'], feedback: string = '') => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId 
          ? { ...post, status: newStatus }
          : post
      )
    );
    setRejectDialogOpen(false);
    setRejectFeedback("");
  };

  const openRejectDialog = (postId: number) => {
    setCurrentPostId(postId);
    setRejectDialogOpen(true);
  };

  const handleReject = () => {
    if (currentPostId) {
      updatePostStatus(currentPostId, 'pending', rejectFeedback);
    }
  };

  const getPlatformBadge = (platform: Post['platform']) => {
    const platforms = {
      twitter: { label: 'Twitter', color: 'bg-blue-100 text-blue-800' },
      linkedin: { label: 'LinkedIn', color: 'bg-blue-50 text-blue-700' },
      facebook: { label: 'Facebook', color: 'bg-blue-50 text-blue-600' },
      instagram: { label: 'Instagram', color: 'bg-pink-50 text-pink-600' }
    };
    return platforms[platform] || { label: platform, color: 'bg-gray-100 text-gray-800' };
  };

  const renderQueueItem = (post: Post) => (
    <div key={post.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)}`}></div>
          <span className="font-medium">{post.title}</span>
          <Badge variant="outline" className={getStatusColor(post.status)}>
            {post.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          {post.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-green-700 bg-green-50 hover:bg-green-100 border-green-200"
                onClick={() => updatePostStatus(post.id, 'published')}
              >
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-red-600 bg-red-50 hover:bg-red-100 border-red-200"
                onClick={() => {
                  setCurrentPostId(post.id);
                  setRejectDialogOpen(true);
                }}
              >
                Disapprove
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          {new Date(post.scheduledTime).toLocaleString()}
        </div>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <span className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-1"></span>
            {post.engagement.likes} likes • {post.engagement.comments} comments • {post.engagement.shares} shares
          </span>
        </div>
      </div>
    </div>
  );
  
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'twitter': return 'bg-sky-500';
      case 'linkedin': return 'bg-blue-600';
      case 'facebook': return 'bg-blue-700';
      case 'instagram': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-50 text-green-700 border-green-100';
      case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
        <Button 
          onClick={() => onConfigureSupabase('posts')}
          variant="outline"
          className="border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
        >
          Configure Supabase
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="queue" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Publishing Queue
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Content Planner
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Queue Plan
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="queue" className="mt-6">
          <PublishingQueue />
        </TabsContent>
        
        <TabsContent value="planner" className="mt-6">
          <ContentPlanner />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <QueuePlan />
        </TabsContent>
      </Tabs>

      <Card>
        <Tabs defaultValue="pending" className="w-full">
          <CardHeader className="pb-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Pending ({posts.filter(p => p.status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Scheduled ({posts.filter(p => p.status === 'scheduled').length})
              </TabsTrigger>
              <TabsTrigger value="published" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Published ({posts.filter(p => p.status === 'published').length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent value="pending" className="space-y-4">
              {posts.filter(post => post.status === 'pending').length > 0 ? (
                posts
                  .filter(post => post.status === 'pending')
                  .map(post => renderQueueItem(post))
              ) : (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">No pending posts</div>
              )}
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              {posts.filter(post => post.status === 'scheduled').length > 0 ? (
                posts
                  .filter(post => post.status === 'scheduled')
                  .map(post => renderQueueItem(post))
              ) : (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">No scheduled posts</div>
              )}
            </TabsContent>

            <TabsContent value="published" className="space-y-4">
              {posts.filter(post => post.status === 'published').length > 0 ? (
                posts
                  .filter(post => post.status === 'published')
                  .map(post => renderQueueItem(post))
              ) : (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">No published posts</div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      {/* Reject Feedback Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disapprove Post</DialogTitle>
            <DialogDescription>
              Please provide feedback on why this post was disapproved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="Provide specific feedback on why this post was not approved..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReject} disabled={!rejectFeedback.trim()}>
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
```

---

## WeeklyPlan Component

```tsx
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
```

---

## TrendsPage Component

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bookmark, ExternalLink, Eye, MessageSquare, Heart, Share2 } from "lucide-react";

export const TrendsPage = () => {
  const trendingTopics = [
    {
      id: 1,
      source: "Reddit",
      subreddit: "r/marketing",
      title: "AI-powered personalization is changing email marketing forever",
      excerpt: "Discussion about how AI is being used to create hyper-personalized email campaigns with 40%+ higher open rates.",
      upvotes: 847,
      comments: 123,
      trending: "hot",
      tags: ["AI", "Email Marketing", "Personalization"],
      timeAgo: "3 hours ago",
      saved: false
    },
    {
      id: 2,
      source: "Twitter",
      handle: "@marketingpro",
      title: "Short-form video content is driving 3x more engagement than static posts",
      excerpt: "Data shows that brands using short-form video see significantly higher engagement rates across all platforms.",
      likes: 1243,
      retweets: 387,
      trending: "viral",
      tags: ["Video Marketing", "Social Media", "Engagement"],
      timeAgo: "5 hours ago",
      saved: true
    },
    {
      id: 3,
      source: "LinkedIn",
      company: "MarketingLand",
      title: "B2B companies are shifting 60% of their budget to digital channels",
      excerpt: "New research reveals a major shift in B2B marketing spend, with digital channels taking the lead over traditional methods.",
      likes: 892,
      comments: 67,
      trending: "rising",
      tags: ["B2B Marketing", "Digital Marketing", "Budget"],
      timeAgo: "8 hours ago",
      saved: false
    },
    {
      id: 4,
      source: "Reddit",
      subreddit: "r/entrepreneur",
      title: "Micro-influencers are outperforming mega-influencers in 2024",
      excerpt: "Case studies showing how brands are getting better ROI from micro-influencers compared to celebrity endorsements.",
      upvotes: 634,
      comments: 89,
      trending: "hot",
      tags: ["Influencer Marketing", "ROI", "Social Media"],
      timeAgo: "12 hours ago",
      saved: true
    },
    {
      id: 5,
      source: "Twitter",
      handle: "@contentking",
      title: "Interactive content formats are boosting lead generation by 70%",
      excerpt: "Thread about interactive polls, quizzes, and calculators that are driving significantly more qualified leads.",
      likes: 756,
      retweets: 234,
      trending: "rising",
      tags: ["Interactive Content", "Lead Generation", "Conversion"],
      timeAgo: "1 day ago",
      saved: false
    }
  ];

  const competitorInsights = [
    {
      id: 1,
      competitor: "Marketing Automation Inc.",
      insight: "Launched new AI-powered email sequences",
      impact: "25% increase in customer engagement",
      source: "Company Blog",
      timeAgo: "2 days ago"
    },
    {
      id: 2,
      competitor: "Content Masters",
      insight: "Shifted to video-first content strategy",
      impact: "40% growth in social media followers",
      source: "LinkedIn Post",
      timeAgo: "4 days ago"
    },
    {
      id: 3,
      competitor: "Digital Growth Co.",
      insight: "Introduced interactive product demos",
      impact: "15% improvement in conversion rates",
      source: "Case Study",
      timeAgo: "1 week ago"
    }
  ];

  const getTrendingColor = (trending: string) => {
    switch (trending) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'viral': return 'bg-purple-100 text-purple-800';
      case 'rising': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Reddit': return 'bg-orange-600';
      case 'Twitter': return 'bg-sky-500';
      case 'LinkedIn': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const handleSave = async (trendId: number) => {
    // This would trigger n8n workflow to save trend
    console.log(`Saving trend ${trendId} via n8n workflow`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trends & References</h2>
          <p className="text-gray-600 mt-1">Stay updated with the latest marketing trends and competitor insights</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh Trends
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Trending Topics</h3>
          {trendingTopics.map((trend) => (
            <Card key={trend.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getSourceColor(trend.source)}`}></div>
                    <span className="font-medium text-gray-900">{trend.source}</span>
                    {trend.subreddit && <span className="text-sm text-gray-600">{trend.subreddit}</span>}
                    {trend.handle && <span className="text-sm text-gray-600">{trend.handle}</span>}
                    {trend.company && <span className="text-sm text-gray-600">{trend.company}</span>}
                    <Badge className={`text-xs ${getTrendingColor(trend.trending)}`}>
                      {trend.trending}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">{trend.timeAgo}</span>
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{trend.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{trend.excerpt}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {trend.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {trend.upvotes && (
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{trend.upvotes}</span>
                      </div>
                    )}
                    {trend.likes && (
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{trend.likes}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{trend.comments || trend.retweets}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSave(trend.id)}
                      className={trend.saved ? "text-blue-600" : ""}
                    >
                      <Bookmark className={`h-4 w-4 ${trend.saved ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Competitor Insights</CardTitle>
              <CardDescription>Latest moves from your competitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {competitorInsights.map((insight) => (
                <div key={insight.id} className="p-4 bg-gray-50/70 rounded-lg">
                  <div className="font-medium text-gray-900 mb-1">{insight.competitor}</div>
                  <div className="text-sm text-gray-700 mb-2">{insight.insight}</div>
                  <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded mb-2 inline-block">
                    {insight.impact}
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{insight.source}</span>
                    <span>{insight.timeAgo}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Saved Trends</CardTitle>
              <CardDescription>Your bookmarked insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {trendingTopics.filter(t => t.saved).map((trend) => (
                  <div key={trend.id} className="p-3 bg-blue-50/70 rounded-lg">
                    <div className="text-sm font-medium text-gray-900 mb-1">{trend.title}</div>
                    <div className="text-xs text-gray-600">{trend.source} • {trend.timeAgo}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
```

---

## Summary

This document contains the complete source code for three key components from the Digital Marketing Orchestrator application:

1. **QueuePage**: A content management interface for scheduling and managing social media posts across different platforms.
2. **WeeklyPlan**: A visual content calendar that displays scheduled posts for each day of the week.
3. **TrendsPage**: A dashboard for tracking marketing trends and competitor insights from various sources.

Each component is built with TypeScript and uses modern React patterns with hooks. The UI is implemented using a component library with Tailwind CSS for styling.
