import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarketHealthCharts } from './charts/MarketHealthCharts';
import { InvestmentPerformanceCharts } from './charts/InvestmentPerformanceCharts';
import { GeographicInsights } from './charts/GeographicInsights';
import { ForecastCharts } from './charts/ForecastCharts';
import { ForecastHeatMap } from './charts/ForecastHeatMap';
import { MarketIntelligenceOverview } from './charts/MarketIntelligenceOverview';
import { MarketDetailedMetrics } from './charts/MarketDetailedMetrics';
import { MarketMap } from './MarketMap';
import { Button } from '@/components/ui/button';



export const ZillowDashboardContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('health');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <TabsList className="bg-surface-container/50 backdrop-blur-md p-1 rounded-2xl border border-outline-variant/10">
          <TabsTrigger 
            value="health" 
            className="rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-on-primary transition-all underline-none"
          >
            SALES
          </TabsTrigger>
          <TabsTrigger 
            value="investment" 
            className="rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-on-primary transition-all underline-none"
          >
            Investment ROI
          </TabsTrigger>
          <TabsTrigger 
            value="geographic" 
            className="rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-on-primary transition-all underline-none"
          >
            Geographic Insights
          </TabsTrigger>
          <TabsTrigger 
            value="forecast" 
            className="rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-on-primary transition-all underline-none"
          >
            FORECAST
          </TabsTrigger>
          <TabsTrigger 
            value="trends" 
            className="rounded-xl px-6 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-on-primary transition-all underline-none"
          >
            Market Velocity
          </TabsTrigger>


        </TabsList>

        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl border-outline-variant/20 bg-surface-container/30 hover:bg-surface-container/50 text-on-surface">
              <span className="material-symbols-outlined text-sm mr-2">upload_file</span>
              Import CSV
           </Button>
           <Button className="rounded-xl primary-gradient text-on-primary shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined text-sm mr-2">refresh</span>
              Sync Data
           </Button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TabsContent value="health" className="mt-0 ring-offset-0 focus-visible:ring-0 space-y-8">
          <MarketHealthCharts />
          <MarketMap type="sales" mode="sales" title="Sales Performance Geography" />
        </TabsContent>
        <TabsContent value="investment" className="mt-0 ring-offset-0 focus-visible:ring-0">
          <InvestmentPerformanceCharts />
        </TabsContent>
        <TabsContent value="geographic" className="mt-0 ring-offset-0 focus-visible:ring-0">
          <GeographicInsights />
        </TabsContent>
        <TabsContent value="forecast" className="mt-0 ring-offset-0 focus-visible:ring-0 space-y-8">
          <MarketIntelligenceOverview />
          <ForecastCharts />
          <MarketMap type="forecast" mode="sales" title="Growth Projection Geography" />
          <ForecastHeatMap />
        </TabsContent>
        <TabsContent value="trends" className="mt-0 ring-offset-0 focus-visible:ring-0">
          <MarketDetailedMetrics />
        </TabsContent>


      </div>
    </Tabs>
  );
};
