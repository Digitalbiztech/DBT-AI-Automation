import { MultiSelect } from "@/components/ui/multi-select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar } from "lucide-react";

interface FilterPanelProps {
  states: string[];
  cities: string[];
  zips: string[];
  regions: string[];
  years: string[];
  selectedState: string[];
  selectedCity: string[];
  selectedZip: string[];
  selectedRegion: string[];
  selectedYear: string[];
  granularity: "weekly" | "monthly";
  onStateChange: (v: string[]) => void;
  onCityChange: (v: string[]) => void;
  onZipChange: (v: string[]) => void;
  onRegionChange: (v: string[]) => void;
  onYearChange: (v: string[]) => void;
  onGranularityChange: (v: "weekly" | "monthly") => void;
  layout?: "vertical" | "horizontal";
  showOnlyState?: boolean;
}

export function FilterPanel({
  states,
  cities,
  zips,
  regions,
  years,
  selectedState,
  selectedCity,
  selectedZip,
  selectedRegion,
  selectedYear,
  granularity,
  onStateChange,
  onCityChange,
  onZipChange,
  onRegionChange,
  onYearChange,
  onGranularityChange,
  layout = "vertical",
  showOnlyState = false,
}: FilterPanelProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <div className={isHorizontal ? "flex flex-col xl:flex-row items-center gap-6 bg-surface-container/50 border border-outline-variant/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg min-h-[80px]" : "space-y-3"}>
      <div className="flex items-center gap-2 text-sm font-bold headline-font text-on-surface shrink-0 uppercase tracking-[0.2em] text-[10px]">
        <MapPin className="h-4 w-4 text-primary" />
        Market Filters
      </div>

      <div className={isHorizontal ? "flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full" : "space-y-2"}>
         {/* State Selector */}
         <div className="flex flex-col gap-1.5">
           <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold ml-1">State</span>
           <MultiSelect 
             options={states} 
             selected={selectedState} 
             onChange={onStateChange} 
             placeholder="Select State"
           />
         </div>

         {!showOnlyState && (
           <>
             {/* Granularity Switch */}
             <div className="flex flex-col gap-1.5 min-w-[140px]">
               <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold ml-1">Granularity</span>
               <Tabs value={granularity} onValueChange={(v) => onGranularityChange(v as any)} className="w-full">
                 <TabsList className="grid grid-cols-2 h-10 bg-surface-container-high/50 rounded-xl">
                   <TabsTrigger value="monthly" className="text-[10px] uppercase font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-on-primary">Monthly</TabsTrigger>
                   <TabsTrigger value="weekly" className="text-[10px] uppercase font-bold rounded-lg data-[state=active]:bg-primary data-[state=active]:text-on-primary">Weekly</TabsTrigger>
                 </TabsList>
               </Tabs>
             </div>

             {/* Year Selector */}
             <div className="flex flex-col gap-1.5">
               <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold ml-1">Year</span>
               <MultiSelect 
                 options={years} 
                 selected={selectedYear} 
                 onChange={onYearChange} 
                 placeholder="All Years"
               />
             </div>

             {/* Region Selector */}
             <div className="flex flex-col gap-1.5">
               <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold ml-1">Region</span>
               <MultiSelect 
                 options={regions} 
                 selected={selectedRegion} 
                 onChange={onRegionChange} 
                 placeholder="All Regions"
               />
             </div>

             {/* City Selector */}
             <div className="flex flex-col gap-1.5">
               <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold ml-1">City</span>
               <MultiSelect 
                 options={cities} 
                 selected={selectedCity} 
                 onChange={onCityChange} 
                 placeholder="All Cities"
               />
             </div>

             {/* ZIP Selector */}
             <div className="flex flex-col gap-1.5">
               <span className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold ml-1">ZIP Code</span>
               <MultiSelect 
                 options={zips} 
                 selected={selectedZip} 
                 onChange={onZipChange} 
                 placeholder="All ZIP Codes"
               />
             </div>
           </>
         )}
       </div>
    </div>
  );
}
