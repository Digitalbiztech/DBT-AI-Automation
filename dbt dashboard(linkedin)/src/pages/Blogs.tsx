import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper,
  Search,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  url: string;
  page_type: string;
}

interface BlogsProps {
  onMakePost: (title: string, summary: string) => void;
}

const Blogs: React.FC<BlogsProps> = ({ onMakePost }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const fetchFromDB = async () => {
    console.log('Fetching blogs from pages_data...');
    const { data, error } = await supabase
      .from('pages_data')
      .select('*')
      .eq('page_type', 'Blog');

    if (error) {
      console.error('Error fetching blogs:', error);
      alert('Error fetching blogs: ' + error.message);
    } else {
      console.log('Fetched blogs data:', data);
      // Once we know the correct date field from the console log, we can add sorting.
      // For now, we will set the blogs without sorting.
      setBlogs(data || []);
    }
  };

  useEffect(() => {
    fetchFromDB();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    ((blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
     (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <motion.div 
      className="flex-1 flex flex-col h-screen overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Blogs</h1>
          <p className="text-gray-600 mt-1">Browse the latest blog posts.</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Dialog key={blog.id} onOpenChange={(isOpen) => !isOpen && setSelectedBlog(null)}>
              <DialogTrigger asChild>
                <Card 
                  className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                  onClick={() => setSelectedBlog(blog)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">{blog.title || 'No Title'}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 text-sm mb-4">{blog.summary}</p>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setSelectedBlog(blog); }}>
                        View
                      </Button>
                      <a href={blog.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline">
                          Link <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                    <Button 
                      size="sm" 
                      variant="default" 
                      onClick={async (e) => { 
                        e.stopPropagation(); 
                        const message = `Create a social media post about the following blog:\n\n**Title:** ${blog.title || 'No Title'}\n**Summary:** ${blog.summary || 'No summary available'}\n**URL:** ${blog.url || 'No URL available'}`;
                        
                        if (onMakePost) {
                          onMakePost(message, '');
                          // Simulate pressing Enter to send the message
                          const sendMessageEvent = new KeyboardEvent('keydown', {
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13,
                            bubbles: true,
                            cancelable: true
                          });
                          document.dispatchEvent(sendMessageEvent);
                        }
                      }}
                    >
                      Make Post
                    </Button>
                  </div>
                </Card>
              </DialogTrigger>
            </Dialog>
          ))}
        </div>

        {selectedBlog && (
          <Dialog open={!!selectedBlog} onOpenChange={(isOpen) => !isOpen && setSelectedBlog(null)}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{selectedBlog.title}</DialogTitle>
              </DialogHeader>
              <div className="py-4 overflow-y-auto">
                <div className="prose max-w-none">
                  {selectedBlog.content}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </motion.div>
  );
};

export default Blogs;
