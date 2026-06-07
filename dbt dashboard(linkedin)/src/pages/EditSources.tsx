import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface Source {
  id: string;
  platform_name: string;
  name: string | null;
  url: string | null;
  keyword: string | null;
  source_type_id?: string;
}

const EditSources = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    setIsLoading(true);
    try {
      // Get all sources from the database
      const { data, error } = await supabase
        .from('source_ref')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      // If no data found, create default RSS feeds
      if (!data || data.length === 0) {
        const defaultRssFeeds = Array.from({ length: 7 }, (_, i) => ({
          id: `rss${i + 1}`,
          name: `RSS ${i + 1}`,
          platform_name: `rss${i + 1}`,  // This will be rss1, rss2, ..., rss7
          url: '',
          keyword: null,
          created_at: new Date().toISOString()
        }));
        setSources(defaultRssFeeds);
        return;
      }

      // Process the data from the database
      const processedData = data.map((source) => ({
        id: source.id,
        name: source.name || (source.platform_name && source.platform_name.startsWith('rss') 
          ? source.platform_name.toUpperCase() 
          : source.platform_name || 'Source'),
        platform_name: source.platform_name?.toLowerCase() || 'rss',
        url: source.url || '',
        keyword: source.keyword || null,
        created_at: source.created_at || new Date().toISOString()
      }));

      setSources(processedData);
    } catch (error) {
      console.error('Error in fetchSources:', error);
      toast({
        title: 'Error fetching sources',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (id: string, field: 'url' | 'keyword', value: string) => {
    setSources(prevSources =>
      prevSources.map(source =>
        source.id === id ? { ...source, [field]: value } : source
      )
    );
  };

  const handleSaveChanges = async () => {
    const updatePromises = sources.map(source =>
      supabase
        .from('source_ref')
        .update({ url: source.url, keyword: source.keyword })
        .eq('id', source.id)
    );

    const results = await Promise.all(updatePromises);
    
    const hasError = results.some(result => result.error);

    if (hasError) {
        toast({
            title: 'Error saving changes',
            description: 'Some changes could not be saved.',
            variant: 'destructive',
        });
    } else {
        toast({
            title: 'Success!',
            description: 'All changes have been saved.',
        });
    }
  };

  const handleBackToArticles = () => {
    // Navigate back to the Articles page
    window.location.href = '/articles';
  };

  const renderGroup = (platform: string, title: string) => {
    // For RSS, we need to match both 'rss' and 'rss1' through 'rss7'
    const isRssGroup = platform.toLowerCase() === 'rss';
    
    const platformSources = sources.filter(s => {
      if (!s.platform_name) return false;
      
      if (isRssGroup) {
        // Include both 'rss' and 'rss1' through 'rss7' in the RSS group
        return s.platform_name.toLowerCase() === 'rss' || 
               /^rss\d+$/.test(s.platform_name.toLowerCase());
      } else {
        // For non-RSS platforms, do exact match
        return s.platform_name.toLowerCase() === platform.toLowerCase();
      }
    });
    
    if (platformSources.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <div className="space-y-3">
          {platformSources.map((source) => {
            const isRssItem = source.platform_name?.toLowerCase().startsWith('rss');
            
            return (
              <div
                key={source.id}
                className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {isRssItem && (
                    <div className="font-medium text-gray-700">
                      {source.name || source.platform_name?.toUpperCase() || 'RSS Feed'}
                    </div>
                  )}
                  
                  {isRssItem ? (
                    <Input
                      value={source.url || ''}
                      onChange={(e) => handleInputChange(source.id, 'url', e.target.value)}
                      className="bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Enter RSS URL"
                    />
                  ) : (
                    <Input
                      value={source.keyword || ''}
                      onChange={(e) => handleInputChange(source.id, 'keyword', e.target.value)}
                      className="bg-white text-gray-900 placeholder-gray-400"
                      placeholder={
                        source.platform_name?.toLowerCase() === 'reddit' 
                          ? 'Enter subreddit name (e.g., news)' 
                          : 'Enter YouTube channel name or ID'
                      }
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackToArticles}
            className="text-gray-700 hover:bg-gray-100"
            title="Back to Articles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Article Sources</h1>
        </div>
        <Button 
          onClick={handleSaveChanges}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Changes
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Reddit</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {renderGroup('reddit', 'Subreddits')}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">YouTube</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {renderGroup('youtube', 'keywords')}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">RSS Feeds</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {renderGroup('rss', 'RSS Feeds')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSources;
