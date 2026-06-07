import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  Tag,
  PenLine
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';

interface Article {
  id: number;
  title: string;
  summary: string;
  url: string;
  category?: string; // optional, since not all rows may have it
  date: string;
  source?: string;
}

interface TrendingTag {
  id: number;
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

interface ArticlesProps {
  onEditSources: () => void;
  onMakePost?: (title: string, summary: string) => void;
}

const Articles: React.FC<ArticlesProps> = ({ onEditSources, onMakePost }) => {
  const [activeTab, setActiveTab] = useState("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSource, setFilterSource] = useState('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isShuffled, setIsShuffled] = useState(false);

  const trendingTags: TrendingTag[] = [
    { id: 1, name: "#DigitalMarketing", count: 1247, trend: 'up' },
    { id: 2, name: "#ContentMarketing", count: 892, trend: 'up' },
    { id: 3, name: "#SocialMedia", count: 756, trend: 'stable' },
    { id: 4, name: "#SEO", count: 634, trend: 'up' },
    { id: 5, name: "#EmailMarketing", count: 523, trend: 'down' },
    { id: 6, name: "#MarketingAutomation", count: 445, trend: 'up' },
    { id: 7, name: "#B2BMarketing", count: 398, trend: 'stable' },
    { id: 8, name: "#InfluencerMarketing", count: 367, trend: 'up' },
    { id: 9, name: "#VideoMarketing", count: 312, trend: 'up' },
    { id: 10, name: "#MarketingAnalytics", count: 289, trend: 'stable' }
  ];

  const filteredArticles = articles.filter(article =>
    (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     article.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  function shuffleArray(array: Article[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  let displayedArticles = sortedArticles;
  if (isShuffled) {
    displayedArticles = shuffleArray(filteredArticles);
  }

  const handleArticleClick = async (article: Article) => {
    const message = `Create a post about the following article\n\n**Title:** ${article.title}\n**Summary:** ${article.summary}\n**URL:** ${article.url}`;
    
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
    } else {
      // Fallback to old behavior if onMakePost is not provided
      const postData = {
        type: 'article',
        message: message,
        shouldSend: true // Add flag to indicate the message should be sent
      };
      localStorage.setItem('makePostData', JSON.stringify(postData));
      window.location.href = '/';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const fetchFromDB = async () => {
    console.log('Fetching articles from ref_article...');
    const { data, error } = await supabase
      .from('ref_article')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      alert('Error fetching articles: ' + error.message);
    } else {
      console.log('Fetched articles data:', data);
      setArticles(data || []);
    }
  };

  useEffect(() => {
    fetchFromDB();
  }, []);

  return (
    <motion.div 
      className="flex-1 flex flex-col h-screen overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Articles & Trends</h1>
          <p className="text-gray-600 mt-1">Browse articles and trending topics for content inspiration</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white text-gray-900 placeholder-gray-500 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48 bg-white border-gray-300 text-black">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-black">All Categories</SelectItem>
                <SelectItem value="AI & Technology" className="text-black">AI & Technology</SelectItem>
                <SelectItem value="Content Marketing" className="text-black">Content Marketing</SelectItem>
                <SelectItem value="Social Media" className="text-black">Social Media</SelectItem>
                <SelectItem value="Email Marketing" className="text-black">Email Marketing</SelectItem>
                <SelectItem value="SEO" className="text-black">SEO</SelectItem>
                <SelectItem value="Analytics" className="text-black">Analytics</SelectItem>
                <SelectItem value="Branding" className="text-black">Branding</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-48 bg-white border-gray-300 text-black">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-black">All Sources</SelectItem>
                <SelectItem value="reddit" className="text-black">Reddit</SelectItem>
                <SelectItem value="rss" className="text-black">RSS</SelectItem>
                <SelectItem value="news" className="text-black">News</SelectItem>
                <SelectItem value="search" className="text-black">Search</SelectItem>
                <SelectItem value="youtube" className="text-black">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger value="articles" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
              <TrendingUp className="h-4 w-4" />
              Trends & Reference
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
                  <p className="text-gray-600 mt-1">Click on any article to generate a LinkedIn post from it</p>
                </div>
                <Button variant="outline" size="sm" onClick={onEditSources}>
                  <PenLine className="mr-2 h-4 w-4" />
                  Edit Sources
                </Button>

              </div>
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm text-gray-600">Sort by date:</label>
                <select
                  value={sortOrder}
                  onChange={e => { setSortOrder(e.target.value as 'desc' | 'asc'); setIsShuffled(false); }}
                  className="border rounded px-2 py-1 text-sm text-black bg-white"
                  style={{ color: 'black' }}
                  title="Sort by date"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 text-xs px-3 py-1 border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition"
                  onClick={() => setIsShuffled(true)}
                >
                  Random
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm text-gray-600">Source:</label>
                <select
                  value={filterSource}
                  onChange={e => setFilterSource(e.target.value)}
                  className="border rounded px-2 py-1 text-sm text-black bg-white"
                  style={{ color: 'black' }}
                  title="Filter by source"
                >
                  <option value="all">All Sources</option>
                  <option value="reddit">Reddit</option>
                  <option value="rss">RSS</option>
                  <option value="news">News</option>
                  <option value="search">Search</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayedArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <Card className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">{(article.source || 'RSS').toUpperCase() === 'YOUTUBE' ? 'YouTube' : (article.source || 'RSS')}</div>
                        <div className="flex items-start justify-between mb-4">
                          {article.category && (
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.summary}</p>
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read more</a>
                        
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-gray-500">
                            {new Date(article.date).toLocaleDateString()}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="ml-2 flex items-center gap-1 text-xs px-2 py-1 group-hover:bg-blue-600 group-hover:text-white transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArticleClick(article);
                            }}
                          >
                            <PenLine className="h-4 w-4 mr-1" /> Make Post
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Trending Tags</h2>
                <p className="text-gray-600 mt-1">Popular hashtags and topics in your industry</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingTags.map((tag) => (
                  <motion.div
                    key={tag.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="group cursor-pointer"
                  >
                    <Card className="border-gray-200 shadow-sm bg-white hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {tag.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">
                              {tag.count.toLocaleString()}
                            </div>
                            <div className={`text-xs ${getTrendColor(tag.trend)}`}>
                              {tag.trend === 'up' ? '↗' : tag.trend === 'down' ? '↘' : '→'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Articles; 