
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Globe, 
  MapPin,
  Calendar,
  BarChart3,
  ExternalLink
} from "lucide-react";

export const CompetitorAnalysis = () => {
  const competitors = [
    {
      id: 1,
      name: "TechFlow Solutions",
      website: "techflow.com",
      location: "San Francisco, CA",
      industry: "SaaS",
      employees: "50-100",
      founded: "2019",
      marketShare: 12,
      sentiment: "positive",
      lastAnalyzed: "2 hours ago",
      socialMedia: {
        linkedin: 2400,
        twitter: 1800,
        instagram: 950
      },
      recentPosts: 15,
      avgEngagement: 4.2,
      topKeywords: ["automation", "productivity", "AI"],
      strengths: ["Strong social presence", "Regular content", "Good engagement"],
      threats: ["Growing market share", "Similar target audience"]
    },
    {
      id: 2,
      name: "Digital Dynamics",
      website: "digitaldynamics.co",
      location: "Austin, TX", 
      industry: "Marketing Tech",
      employees: "25-50",
      founded: "2020",
      marketShare: 8,
      sentiment: "neutral",
      lastAnalyzed: "4 hours ago",
      socialMedia: {
        linkedin: 1200,
        twitter: 3200,
        instagram: 1500
      },
      recentPosts: 12,
      avgEngagement: 3.8,
      topKeywords: ["marketing", "analytics", "growth"],
      strengths: ["Twitter presence", "Industry thought leadership"],
      threats: ["Rapid growth", "Competitive pricing"]
    },
    {
      id: 3,
      name: "InnovateCorp",
      website: "innovatecorp.io",
      location: "New York, NY",
      industry: "Enterprise Software",
      employees: "100-200",
      founded: "2017",
      marketShare: 18,
      sentiment: "positive",
      lastAnalyzed: "6 hours ago",
      socialMedia: {
        linkedin: 4500,
        twitter: 2100,
        instagram: 800
      },
      recentPosts: 8,
      avgEngagement: 5.1,
      topKeywords: ["enterprise", "security", "scalability"],
      strengths: ["Established brand", "Enterprise focus", "High engagement"],
      threats: ["Market leader", "Strong resources"]
    }
  ];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'negative': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Competitors Tracked</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Markets Analyzed</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Points</p>
                <p className="text-2xl font-bold">1,847</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Update</p>
                <p className="text-2xl font-bold">2h</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Cards */}
      <div className="space-y-6">
        {competitors.map((competitor) => (
          <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {competitor.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>{competitor.name}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4" />
                        <span>{competitor.website}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{competitor.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getSentimentColor(competitor.sentiment)}>
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(competitor.sentiment)}
                      <span className="capitalize">{competitor.sentiment}</span>
                    </div>
                  </Badge>
                  <Badge variant="outline">
                    {competitor.industry}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Company Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Company Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employees:</span>
                      <span className="font-medium">{competitor.employees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Founded:</span>
                      <span className="font-medium">{competitor.founded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Share:</span>
                      <span className="font-medium">{competitor.marketShare}%</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between mb-1">
                        <span className="text-muted-foreground">Market Position</span>
                      </div>
                      <Progress value={competitor.marketShare * 5} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Social Media Presence</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Li</span>
                        </div>
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <span className="font-medium">{competitor.socialMedia.linkedin.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-sky-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">X</span>
                        </div>
                        <span className="text-sm">Twitter</span>
                      </div>
                      <span className="font-medium">{competitor.socialMedia.twitter.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IG</span>
                        </div>
                        <span className="text-sm">Instagram</span>
                      </div>
                      <span className="font-medium">{competitor.socialMedia.instagram.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recent Posts:</span>
                      <span className="font-medium">{competitor.recentPosts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Engagement:</span>
                      <span className="font-medium">{competitor.avgEngagement}%</span>
                    </div>
                  </div>
                </div>

                {/* Analysis Insights */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Analysis Insights</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Top Keywords</h5>
                      <div className="flex flex-wrap gap-1">
                        {competitor.topKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2 text-green-600">Strengths</h5>
                      <ul className="text-xs space-y-1">
                        {competitor.strengths.map((strength, index) => (
                          <li key={index} className="text-muted-foreground">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2 text-orange-600">Threats</h5>
                      <ul className="text-xs space-y-1">
                        {competitor.threats.map((threat, index) => (
                          <li key={index} className="text-muted-foreground">• {threat}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>Last analyzed: {competitor.lastAnalyzed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analysis Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Add New Competitor
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Run Full Analysis
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
