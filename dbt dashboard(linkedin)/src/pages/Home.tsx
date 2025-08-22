import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Zap, FileText, PenLine, BookOpen, File as FileIcon } from 'lucide-react';

type HomeProps = {
  setActivePage?: (page: string) => void;
};

const Home: React.FC<HomeProps> = ({ setActivePage = () => {} }) => {
  const cards = [
    { title: 'Chat', desc: 'Start a guided conversation with the AI to create posts.', icon: <MessageCircle className="h-6 w-6 text-blue-600" />, page: 'Chat' },
    { title: 'Approval', desc: 'Review and approve scheduled content.', icon: <Zap className="h-6 w-6 text-amber-500" />, page: 'Automate' },
    { title: 'Templates', desc: 'Reuse post templates for consistent messaging.', icon: <FileText className="h-6 w-6 text-green-600" />, page: 'Templates' },
    { title: 'Articles', desc: 'Create posts based on curated articles and resources.', icon: <BookOpen className="h-6 w-6 text-indigo-600" />, page: 'Articles' },
    { title: 'Blogs', desc: "Craft social media posts using your company's blog content.", icon: <PenLine className="h-6 w-6 text-pink-600" />, page: 'Blogs' },
    { title: 'Help', desc: 'Open the Quick Start guide and walkthroughs.', icon: <FileIcon className="h-6 w-6 text-gray-600" />, page: 'Help' },
  ];

  return (
    <div className="flex-1 p-6">
  <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome to DBT Social</h1>
          <p className="mt-2 text-gray-600">Your AI-powered content workspace — quick actions and shortcuts to create, approve, and publish social content.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <Card key={c.title} className="hover:shadow-lg transition-shadow bg-white border h-full min-h-[160px] box-border overflow-visible">
              <CardContent className="flex flex-col h-full justify-between overflow-visible pl-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded bg-white border flex-shrink-0 ml-1">{c.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black">{c.title}</h3>
                    <p className="text-sm text-black mt-1">{c.desc}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setActivePage(c.page)}>{c.title === 'Help' ? 'Open Help' : 'Open'}</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
