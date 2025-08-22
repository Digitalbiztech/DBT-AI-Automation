import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const sampleCommands = [
  'make a post',
  'make post about AI in marketing',
  'create post for this blog: <paste link>',
  'schedule post tomorrow at 10 AM',
  'schedule post now',
  'schedule post for 12 November',
  'generate banner image ',
];
const Help = () => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied', description: 'Command copied to clipboard.' });
    } else {
      toast({ title: 'Copy failed', description: 'Clipboard API not available', variant: 'destructive' });
    }
  };

  
  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto">
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome to Your Content Dashboard: A Quick Start Guide</h1>
        <p className="text-gray-600 mt-1 max-w-3xl">Welcome! This platform is designed to be your all-in-one AI-powered content engine. From finding inspiration and writing engaging posts to scheduling and publishing, this guide will walk you through the key features to help you get started.</p>
  <p className="text-sm mt-2"><a href="https://drive.google.com/drive/folders/1z3w0EYyuCPDNteQYpgBnjP3BWVEMdWAe?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">Walkthrough video (Drive)</a></p>
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <Card className="sticky top-6 border-gray-200 bg-white shadow-sm">
              <CardContent>
                <h3 className="text-sm font-semibold mb-2">Contents</h3>
                <nav className="text-sm space-y-2">
                  <a href="#three-ways" className="block text-blue-600 hover:underline">Three ways to create a post</a>
                  <a href="#finding-inspiration" className="block text-blue-600 hover:underline">Finding inspiration</a>
                  <a href="#crafting" className="block text-blue-600 hover:underline">Crafting the perfect post</a>
                  <a href="#visuals" className="block text-blue-600 hover:underline">Images & Visuals</a>
                  <a href="#automation" className="block text-blue-600 hover:underline">Automation & Scheduling</a>
                </nav>
              </CardContent>
            </Card>
          </aside>

          <main className="lg:col-span-3 space-y-6">
            <section id="three-ways">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent>
                  <h2 className="text-lg font-semibold mb-2">Three Ways to Create a Post</h2>

                  <h3 className="font-medium mt-2">Start with the Chat (The Guided Method)</h3>
                  <p className="text-sm text-gray-600"><strong>Go to the Chat tab.</strong> For a fully guided, conversational experience, <strong>type a command like <code>make post</code></strong>, and our AI assistant will walk you through the entire process step-by-step.</p>

                  <h3 className="font-medium mt-2">Start from Content (The Inspiration-First Method)</h3>
                  <p className="text-sm text-gray-600">If you've already found your topic in the dashboard, <strong>go directly to the Articles & Trends or Blogs tab</strong>. <strong>Click the Make Post button</strong> on any article to begin crafting your social media post with that content as your source.</p>

                  <h3 className="font-medium mt-2">Start from a Template (The Goal-First Method)</h3>
                  <p className="text-sm text-gray-600">If you know your goal (e.g., you want to write a promotional post), <strong>go to the Templates tab</strong>. <strong>Click Use Template</strong> under your chosen style to have the AI guide you in creating content that matches that specific objective.</p>
                </CardContent>
              </Card>
            </section>

            <section id="finding-inspiration">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent>
                  <h2 className="text-lg font-semibold mb-2">Finding Inspiration: Sourcing Your Content</h2>
                  <p className="text-sm text-gray-600">Never run out of ideas. The platform provides multiple ways to source fresh and relevant content.</p>

                  <h3 className="font-medium mt-2">Articles & Trends</h3>
                  <p className="text-sm text-gray-600">This page is your centralized research hub. It automatically pulls in the latest articles from diverse sources like Reddit, RSS feeds, News, YouTube, and general web searches. You can filter these articles by category or source to find exactly what you need. You can customize your content sources by going to Edit Sources.</p>

                  <h3 className="font-medium mt-2">Your Company Blogs</h3>
                  <p className="text-sm text-gray-600">The Blogs tab contains all the articles from your own company's website. This feature is perfect for repurposing your existing long-form content into engaging social media posts.</p>
                </CardContent>
              </Card>
            </section>

            <section id="crafting">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent>
                  <h2 className="text-lg font-semibold mb-2">Crafting the Perfect Post</h2>
                  <p className="text-sm text-gray-600">Once you have a source, the platform provides powerful tools to shape your message.</p>

                  <h3 className="font-medium mt-2">Choosing the Right Template</h3>
                  <p className="text-sm text-gray-600">All posts are not the same. The platform will help you choose a template to match your goal. Your options include:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-4 mt-2">
                    <li><strong>Educational:</strong> To inform, educate, and provide value to your audience.</li>
                    <li><strong>Promotional:</strong> To promote your products or services, focusing on customer benefits.</li>
                    <li><strong>Discussion:</strong> To spark conversation and build community engagement.</li>
                    <li><strong>Case Study & Testimonial:</strong> To build trust by showcasing client success and testimonials.</li>
                    <li><strong>News:</strong> To share relevant industry news and position your brand as an expert.</li>
                    <li><strong>Personal:</strong> To share personal stories and connect with your audience on a human level.</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="visuals">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent>
                  <h2 className="text-lg font-semibold mb-2">Adding Visuals: Your Three Image Options</h2>
                  <p className="text-sm text-gray-600">After the text is generated, you will be prompted about visuals. You have three choices:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-4 mt-2">
                    <li>Generate a Standard Image: The AI will create a standard, square-format image suitable for most posts.</li>
                    <li>Generate a Banner Image: The AI will create a wider, banner-style image for hero or wide-format visuals.</li>
                    <li>Upload Your Own Image: You can provide a link to your own branded graphic or image, and the system will use that instead.</li>
                  </ul>

                  <div className="mt-4">
                    <h3 className="font-medium">Try a sample command</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sampleCommands.map((cmd) => (
                        <button
                          key={cmd}
                          onClick={() => copyToClipboard(cmd)}
                          className="text-left p-3 rounded bg-gray-50 hover:bg-gray-100 border text-black"
                        >
                          <code className="text-sm text-black">{cmd}</code>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section id="automation">
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardContent>
                  <h2 className="text-lg font-semibold mb-2">Automation and Scheduling</h2>
                  <p className="text-sm text-gray-600">The final step is to automate the publishing of your content.</p>

                  <h3 className="font-medium mt-2">Scheduling Your Post</h3>
                  <p className="text-sm text-gray-600">The platform will ask you when you want the post to be published. You can use natural language like <strong>"tomorrow at 10 AM"</strong> or <strong>"post now"</strong>.</p>

                  <h3 className="font-medium mt-2">The Approval Workflow</h3>
                  <p className="text-sm text-gray-600">The Approval tab shows you the status of all your content in the publishing queue. Here, you can see posts that are <strong>Pending</strong>, <strong>Approved</strong>, or <strong>Declined</strong>. This is your final chance to review a scheduled post before it is automatically published.</p>

                  <h3 className="font-medium mt-2">The Content Calendar</h3>
                  <p className="text-sm text-gray-600">Navigate to the Calendar tab to see a weekly or monthly view of all your upcoming, approved posts. This gives you a clear overview of your content schedule at a glance.</p>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Help;
