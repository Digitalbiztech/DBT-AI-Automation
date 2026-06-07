
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Edit, Calendar, Tag, ExternalLink, Plus } from "lucide-react";

export const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Marketing Automation: AI-Driven Strategies",
      excerpt: "Explore how artificial intelligence is revolutionizing marketing automation and what it means for businesses in 2024.",
      status: "published",
      publishDate: "2024-01-10",
      tags: ["AI", "Marketing", "Automation", "Strategy"],
      readTime: "8 min",
      views: 2847,
      cta: "Learn More"
    },
    {
      id: 2,
      title: "10 Content Marketing Trends That Will Dominate 2024",
      excerpt: "Stay ahead of the curve with these emerging content marketing trends that are reshaping how brands connect with audiences.",
      status: "draft",
      publishDate: "2024-01-15",
      tags: ["Content Marketing", "Trends", "2024", "Strategy"],
      readTime: "6 min",
      views: 0,
      cta: "Read Full Article"
    },
    {
      id: 3,
      title: "Email Marketing ROI: How We Achieved 300% Growth",
      excerpt: "A detailed case study of our email marketing optimization process and the strategies that tripled our ROI.",
      status: "draft",
      publishDate: "2024-01-20",
      tags: ["Email Marketing", "ROI", "Case Study", "Growth"],
      readTime: "10 min",
      views: 0,
      cta: "Download Case Study"
    },
    {
      id: 4,
      title: "Social Media Automation: Tools and Best Practices",
      excerpt: "Discover the best tools and practices for automating your social media workflow without losing authenticity.",
      status: "published",
      publishDate: "2024-01-05",
      tags: ["Social Media", "Automation", "Tools", "Best Practices"],
      readTime: "7 min",
      views: 1623,
      cta: "Try Our Tools"
    },
    {
      id: 5,
      title: "Building a Content Calendar That Actually Works",
      excerpt: "Learn how to create and maintain a content calendar that aligns with your marketing goals and drives results.",
      status: "scheduled",
      publishDate: "2024-01-25",
      tags: ["Content Planning", "Calendar", "Organization", "Strategy"],
      readTime: "5 min",
      views: 0,
      cta: "Get Template"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePublish = async (postId: number) => {
    // This would trigger n8n workflow
    console.log(`Publishing post ${postId} via n8n workflow`);
    // await fetch('/api/n8n/publish-blog', { method: 'POST', body: JSON.stringify({ postId }) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600 mt-1">Create, edit, and publish your blog content</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={`text-xs ${getStatusColor(post.status)}`}>
                      {post.status}
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.publishDate}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-6 text-gray-900 mb-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 line-clamp-2">
                    {post.excerpt}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{post.readTime} read</span>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views.toLocaleString()} views</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-blue-600">
                  {post.cta}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  {post.status === 'draft' && (
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handlePublish(post.id)}
                    >
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {blogPosts.filter(p => p.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Published</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
              {blogPosts.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Drafts</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {blogPosts.filter(p => p.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600 mt-1">Scheduled</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              {blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Views</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
