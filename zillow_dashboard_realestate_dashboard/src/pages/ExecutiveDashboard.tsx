import React from "react";
import { PremiumSidebar } from "@/components/premium/PremiumSidebar";
import { PremiumTopBar } from "@/components/premium/PremiumTopBar";
import { GrowthGraph } from "@/components/premium/GrowthGraph";
import { MarketDeepDive } from "@/components/premium/MarketDeepDive";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { ZillowDashboardContainer } from "@/components/premium/ZillowDashboardContainer";
import { FilterPanel } from "@/components/FilterPanel";

const FilterConfig: React.FC = () => {
  const { 
    processedData,
    selectedState, 
    selectedCity, 
    selectedZip, 
    selectedRegion,
    selectedYear,
    granularity,
    setSelectedState, 
    setSelectedCity, 
    setSelectedZip,
    setSelectedRegion,
    setSelectedYear,
    setGranularity,
    availableStates,
    allRows
  } = useData();

  return (
    <FilterPanel
      states={availableStates}
      cities={processedData?.cities || []}
      zips={processedData?.zips || []}
      regions={processedData?.regions || []}
      years={processedData?.years || []}
      selectedState={selectedState}
      selectedCity={selectedCity}
      selectedZip={selectedZip}
      selectedRegion={selectedRegion}
      selectedYear={selectedYear}
      granularity={granularity}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onZipChange={setSelectedZip}
      onRegionChange={setSelectedRegion}
      onYearChange={setSelectedYear}
      onGranularityChange={setGranularity}
      layout="horizontal"
      showOnlyState={allRows.length === 0}
    />
  );
};


export const ExecutiveDashboard: React.FC = () => {
  return (


    <div className="bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <PremiumSidebar />
      <PremiumTopBar />
      
      <main className="ml-64 mt-16 p-8 min-h-screen">
        {/* Welcome Section */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="animate-fade-in">
            <h1 className="text-4xl lg:text-5xl font-extrabold headline-font tracking-tight text-on-surface mb-2">
              Analytics Dashboard
            </h1>

            <p className="text-on-surface-variant max-w-2xl font-light text-lg">
              Analysis of the Intelligence Engine's housing market indicators and regional performance metrics.
            </p>
          </div>
          <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-surface-container-high border border-outline-variant/10 text-on-surface hover:bg-surface-bright transition-all flex items-center gap-2 uppercase tracking-widest">
              <span className="material-symbols-outlined text-[18px]">download</span> Export PDF
            </button>
            <button className="px-5 py-2.5 rounded-xl text-xs font-bold primary-gradient text-on-primary hover:opacity-90 transition-all flex items-center gap-2 uppercase tracking-widest shadow-lg shadow-primary-container/20">
              <span className="material-symbols-outlined text-[18px]">add_chart</span> Generate Report
            </button>
          </div>
        </header>

        {/* Filters Section */}
        <div className="mb-8">
          <FilterConfig />
        </div>




        {/* Zillow Intelligence Engine Section */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <header className="mb-8">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <h2 className="text-xl font-bold text-on-surface uppercase tracking-[0.3em]">Zillow Intelligence Engine</h2>
             </div>
             <p className="text-on-surface-variant text-sm font-medium">Advanced market indicators, rental indices, and predictive housing forecasts.</p>
          </header>
          
          <ZillowDashboardContainer />
        </section>

        {/* Bottom Section: Table */}
        <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
          <MarketDeepDive />
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full primary-gradient text-on-primary shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform active:scale-95 z-50">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          bolt
        </span>
        <div className="absolute right-20 px-4 py-2 bg-surface-container/80 backdrop-blur-xl rounded-xl border border-outline-variant/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
          <span className="text-xs font-bold text-on-surface uppercase tracking-widest">Quick Insight Gen</span>
        </div>
      </button>
    </div>
  );
};

export default ExecutiveDashboard;
