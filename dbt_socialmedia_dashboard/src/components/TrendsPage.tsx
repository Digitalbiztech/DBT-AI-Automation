
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
