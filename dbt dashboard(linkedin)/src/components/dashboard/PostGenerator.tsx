import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Link, Sparkles, Upload, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PostGenerator = () => {
  const [postContent, setPostContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const generateAICaption = () => {
    const suggestions = [
      "🚀 Excited to share insights on professional growth and networking strategies...",
      "💡 Key lessons learned from building successful professional relationships...",
      "🎯 Sharing my thoughts on career development and industry trends..."
    ];
    setPostContent(suggestions[Math.floor(Math.random() * suggestions.length)]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Post Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create">Create Post</TabsTrigger>
              <TabsTrigger value="carousel">Carousel</TabsTrigger>
              <TabsTrigger value="link">Link Post</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content">Post Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your LinkedIn post here..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-[120px] mt-1"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={generateAICaption} variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Suggest
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button onClick={() => setShowPreview(!showPreview)} variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>

                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border rounded-2xl p-4 bg-muted/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                        YOU
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Your Name</p>
                        <p className="text-sm text-muted-foreground">Your Role • Now</p>
                        <p className="mt-2 whitespace-pre-wrap">{postContent || "Your post content will appear here..."}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Schedule Post
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="carousel" className="space-y-4">
              <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-2xl">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Drag & drop images to create a carousel</p>
                <Button variant="outline" className="mt-4">Upload Images</Button>
              </div>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <div>
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button variant="outline" className="w-full">
                <Link className="h-4 w-4 mr-2" />
                Fetch Preview
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};