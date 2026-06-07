
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SocialDashboard } from "@/components/SocialDashboard";
import { LeadSummaryDashboard } from "@/components/LeadSummaryDashboard";
import { LeadProfileDashboard } from "@/components/LeadProfileDashboard";
import { QueuePage } from "@/components/QueuePage";
import { BlogsTrendsPage } from "@/components/BlogsTrendsPage";
import { NewsletterPage } from "@/components/NewsletterPage";
import { AIChat } from "@/components/AIChat";
import { WorkflowManager } from "@/components/WorkflowManager";
import { AnalyticsCenter } from "@/components/AnalyticsCenter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupabaseConfigModal } from "@/components/SupabaseConfigModal";

const Index = () => {
  const [activeTab, setActiveTab] = useState("social-dashboard");
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [currentTable, setCurrentTable] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "social-dashboard":
        return <SocialDashboard onConfigureSupabase={(table) => { setCurrentTable(table); setShowSupabaseModal(true); }} />;
      case "lead-summary":
        return <LeadSummaryDashboard onConfigureSupabase={(table) => { setCurrentTable(table); setShowSupabaseModal(true); }} />;
      case "lead-profile":
        return <LeadProfileDashboard onConfigureSupabase={(table) => { setCurrentTable(table); setShowSupabaseModal(true); }} />;
      case "queue":
        return <QueuePage onConfigureSupabase={(table) => { setCurrentTable(table); setShowSupabaseModal(true); }} />;
      case "blogs-trends":
        return <BlogsTrendsPage onConfigureSupabase={(table) => { setCurrentTable(table); setShowSupabaseModal(true); }} />;
      case "newsletters":
        return <NewsletterPage />;
      case "chat":
        return <AIChat />;
      case "workflows":
        return <WorkflowManager />;
      case "analytics":
        return <AnalyticsCenter />;
      default:
        return <SocialDashboard onConfigureSupabase={(table) => { setCurrentTable(table); setShowSupabaseModal(true); }} />;
    }
  };

  return (
    <div className="h-screen bg-white overflow-hidden" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
      <div className="flex h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 ml-64 flex flex-col h-full">
          {/* Premium Header */}
          <header className="bg-white border-b border-gray-100 flex-shrink-0 z-50 shadow-sm">
            <div className="px-6 py-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                      MarketingHub
                    </h1>
                  </div>
                  <p className="text-purple-700 mt-1 font-medium text-sm">AI-powered content & campaign automation</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <Button variant="ghost" size="sm" className="relative hover:bg-gray-100 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-200 rounded-xl text-purple-600">
                    <Bell className="h-4 w-4" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse"></div>
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-100 hover:shadow-lg hover:shadow-purple-200/50 transition-all duration-200 rounded-xl text-purple-600 bg-white">
                    <Settings className="h-4 w-4 mr-2 text-purple-600" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-white overflow-auto">
            <div className="animate-in fade-in-0 duration-300 h-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      
      <SupabaseConfigModal 
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        tableName={currentTable}
      />
    </div>
  );
};

export default Index;
