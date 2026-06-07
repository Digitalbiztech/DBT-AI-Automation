import { useState, useMemo } from "react";
import { Database, Settings, Home, Bolt, BarChart3, Search, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterPanel } from "@/components/FilterPanel";
import { StatsCards } from "@/components/StatsCards";
import { PriceChart } from "@/components/PriceChart";
import { GrowthChart } from "@/components/GrowthChart";
import { ComparisonChart } from "@/components/ComparisonChart";
import { AIQueryPanel } from "@/components/AIQueryPanel";
import { SettingsModal } from "@/components/SettingsModal";
import {
  filterRows,
  calculateGrowth,
} from "@/lib/dataProcessing";
import { useData } from "@/contexts/DataContext";
import { PremiumSidebar } from "@/components/premium/PremiumSidebar";
import { PremiumTopBar } from "@/components/premium/PremiumTopBar";
import { AssetVelocityChart } from "@/components/premium/charts/AssetVelocityChart";
import { BedroomAffinityRadar } from "@/components/premium/charts/BedroomAffinityRadar";
import { MarketMap } from "@/components/premium/MarketMap";

export default function Index() {
  const { 
    allRows, 
    filteredRows, 
    processedData,
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    selectedZip,
    setSelectedZip,
    selectedRegion,
    setSelectedRegion,
    selectedYear,
    setSelectedYear,
    granularity,
    setGranularity,
    availableStates,
    isProcessing
  } = useData();
  const navigate = useNavigate();

  const [showSettings, setShowSettings] = useState(false);

  const growthData = useMemo(() => {
    return calculateGrowth(filteredRows, allRows);
  }, [filteredRows, allRows]);

  const filteredCities = useMemo(() => {
    if (selectedState.length === 0) return processedData?.cities || [];
    return [
      ...new Set(
        allRows.filter((r) => selectedState.includes(r.state)).map((r) => r.city)
      ),
    ]
      .filter(Boolean)
      .sort();
  }, [selectedState, allRows, processedData]);

  const filteredZips = useMemo(() => {
    let subset = allRows;
    if (selectedState.length > 0)
      subset = subset.filter((r) => selectedState.includes(r.state));
    if (selectedCity.length > 0)
      subset = subset.filter((r) => selectedCity.includes(r.city));
    return [...new Set(subset.map((r) => r.zip))].filter(Boolean).sort();
  }, [selectedState, selectedCity, allRows]);

  const hasData = allRows.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PremiumSidebar />
      <PremiumTopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-8 min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          {!hasData ? (
            /* Empty state / Initial State Selection */
            <div className="flex items-center justify-center min-h-[70vh]">
              <div className="max-w-md w-full space-y-6 text-center animate-fade-in">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold headline-font text-foreground">
                    Select a State to Begin
                  </h2>
                  <p className="text-sm text-muted-foreground pb-4">
                    Choose a state to load market intelligence data for the last 2 years.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <FilterPanel
                    states={availableStates}
                    cities={[]}
                    zips={[]}
                    regions={[]}
                    years={[]}
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
                    layout="vertical"
                    showOnlyState={true}
                  />
                  {isProcessing && (
                    <div className="flex items-center justify-center gap-2 text-sm text-primary animate-pulse">
                       <Database className="h-4 w-4" />
                       Loading State Data...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Dashboard */
            <div className="space-y-6">
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-extrabold headline-font text-foreground tracking-tight">ZHVI Insights</h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Real-time analysis of housing market indicators
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-muted/20 px-3 py-1.5 rounded-full border border-border/10">
                    <Database className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold">{allRows.length.toLocaleString()} <span className="text-muted-foreground font-medium">records</span></span>
                  </div>
                  <Link to="/data-workspace">
                    <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary/5">
                      <Settings className="h-3.5 w-3.5" />
                      Manage Data
                    </Button>
                  </Link>
                </div>
              </div>

              {/* First Row of Cards (Stats) */}
              <StatsCards data={growthData} />

              {/* Horizontal Filters Bar */}
              <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
                <FilterPanel
                  states={availableStates}
                  cities={filteredCities}
                  zips={filteredZips}
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
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
                <PriceChart
                  data={filteredRows}
                  type="home_value"
                  title="Home Values Over Time"
                />
                <AssetVelocityChart />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ComparisonChart data={filteredRows} />
                <GrowthChart data={growthData} />
              </div>
              {/* Segment Analytics */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 h-[750px]">
                  <MarketMap type="sales" mode="zhvi" defaultMetric="ZHVI" title="ZHVI Market Heatmap" />
                </div>
                <div>
                  <BedroomAffinityRadar />
                </div>
              </div>

              <AIQueryPanel data={filteredRows} />
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      {hasData && (
        <button className="fixed bottom-8 right-8 w-12 h-12 rounded-full primary-gradient text-primary-foreground shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50">
          <Bolt className="h-5 w-5" />
        </button>
      )}

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
}
