import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { type RealEstateRow, type ProcessedData, processData, parseCSV } from "@/lib/dataProcessing";
import { toast } from "sonner";
import { normalizeState } from "@/lib/dataNormalization";
import { supabase } from "@/lib/supabase";

interface DataContextType {
  allRows: RealEstateRow[];
  filteredRows: RealEstateRow[];
  processedData: ProcessedData | null;
  uploadedFiles: string[];
  isProcessing: boolean;
  selectedState: string[];
  selectedCity: string[];
  selectedZip: string[];
  selectedRegion: string[];
  selectedYear: string[];
  granularity: "weekly" | "monthly";
  setSelectedState: (s: string[]) => void;
  setSelectedCity: (c: string[]) => void;
  setSelectedZip: (z: string[]) => void;
  setSelectedRegion: (r: string[]) => void;
  setSelectedYear: (y: string[]) => void;
  setGranularity: (g: "weekly" | "monthly") => void;
  availableStates: string[];
  setAllRows: (rows: RealEstateRow[]) => void;
  handleFilesSelected: (files: File[]) => Promise<void>;
  handleArchiveDataLoaded: (data: RealEstateRow[]) => void;
  clearData: () => void;
  loadStateData: (states: string[]) => Promise<void>;
}


const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allRows, setAllRowsState] = useState<RealEstateRow[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedState, setSelectedState] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string[]>([]);
  const [selectedZip, setSelectedZip] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [granularity, setGranularity] = useState<"weekly" | "monthly">("monthly");
  const [loadedStates, setLoadedStates] = useState<Set<string>>(new Set());

  // Load manifest on mount
  useEffect(() => {
    const loadManifest = async () => {
      try {
        const { data, error } = await supabase.storage.from('market-data').download('dataset/manifest.json');
        if (error) throw error;
        if (data) {
          const manifest = JSON.parse(await data.text());
          setAvailableStates(manifest.states);
        }
      } catch (err) {
        console.error("Failed to load manifest from cloud:", err);
        // Fallback to local if needed
        const response = await fetch('/dataset/manifest.json');
        if (response.ok) {
          const manifest = await response.json();
          setAvailableStates(manifest.states);
        }
      }
    };
    loadManifest();
  }, []);

  const loadStateData = useCallback(async (states: string[]) => {
    if (states.length === 0) return;
    
    setIsProcessing(true);
    const newStatesToLoad = states.filter(s => !loadedStates.has(s));
    
    if (newStatesToLoad.length === 0) {
      setIsProcessing(false);
      return;
    }

    try {
      const results = await Promise.all(
        newStatesToLoad.map(async (state) => {
          const { data, error } = await supabase.storage.from('market-data').download(`dataset/by-state/${state}.json`);
          if (error) throw error;
          if (!data) throw new Error(`No data found for ${state}`);
          
          const rawData = JSON.parse(await data.text());
          // Map short keys to full keys
          return rawData.map((item: any) => ({
            date: item.d,
            region: item.r,
            state: item.s,
            city: item.c,
            zip: item.z,
            value: item.v,
            type: item.t === 'rent' ? 'rent' : 'home_value',
            metric: item.m
          }));
        })
      );

      const newRows = results.flat();
      setAllRowsState(prev => [...prev, ...newRows]);
      setLoadedStates(prev => {
        const next = new Set(prev);
        newStatesToLoad.forEach(s => next.add(s));
        return next;
      });
      
      toast.success(`Loaded data for ${newStatesToLoad.join(', ')}`);
    } catch (err) {
      console.error("Failed to load state data:", err);
      toast.error("Failed to load some state data");
    } finally {
      setIsProcessing(false);
    }
  }, [loadedStates]);

  // Effect to load data when selectedState changes
  useEffect(() => {
    loadStateData(selectedState);
  }, [selectedState, loadStateData]);

  // Sync processedData with allRows
  useEffect(() => {
    if (allRows.length > 0) {
      setProcessedData(processData(allRows));
    }
  }, [allRows]);

  // Removed old full-load useEffect


// ... inside the component ...
  const filteredRows = useMemo(() => {
    return allRows.filter((r) => {
      // Normalize row state for matching
      const rStateNorm = normalizeState(r.state);
      
      // 1. State Filter
      if (selectedState.length > 0) {
        const filterStateNorms = selectedState.map(normalizeState);
        if (!filterStateNorms.includes(rStateNorm)) return false;
      }
      
      // 2. City Filter
      if (selectedCity.length > 0 && r.city) {
        if (!selectedCity.includes(r.city)) return false;
      }

      // 3. Zip Filter
      if (selectedZip.length > 0 && r.zip) {
        if (!selectedZip.includes(r.zip)) return false;
      }

      // 4. Region Filter
      if (selectedRegion.length > 0) {
        // Match exact or starts with (to handle "City, ST" variations)
        const regionMatch = selectedRegion.some(sr => 
          r.region === sr || r.region.startsWith(sr) || sr.startsWith(r.region)
        );
        if (!regionMatch) return false;
      }
      
      // 5. Year Filter
      if (selectedYear.length > 0 && !selectedYear.some(y => r.date.startsWith(y))) return false;
      
      // 6. Granularity Filter
      if (r.granularity && r.granularity !== granularity) return false;
      
      return true;
    });
  }, [allRows, selectedState, selectedCity, selectedZip, selectedRegion, selectedYear, granularity]);

  const setAllRows = useCallback((rows: RealEstateRow[]) => {
    setAllRowsState(rows);
    setProcessedData(processData(rows));
  }, []);


  const parseJSON = useCallback(async (file: File): Promise<RealEstateRow[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }, []);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          if (file.name.endsWith(".json")) {
            const data = await parseJSON(file);
            return { data, filename: "Archive Sample Data" };
          }
          return parseCSV(file);
        })
      );
      const newRows = results.flatMap((r) => r.data);
      const combined = [...allRows, ...newRows];
      setAllRowsState(combined);
      setProcessedData(processData(combined));
      setUploadedFiles((prev) => [...prev, ...results.map((r) => r.filename)]);
      toast.success(`Loaded ${newRows.length.toLocaleString()} data points from ${files.length} file(s)`);
    } catch (err) {
      toast.error("Failed to parse file");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }, [allRows, parseJSON]);

  const handleArchiveDataLoaded = useCallback((data: RealEstateRow[]) => {
    const combined = [...allRows, ...data];
    setAllRowsState(combined);
    setProcessedData(processData(combined));
    setUploadedFiles((prev) => [...prev, "Archive Data Selection"]);
    toast.success(`Loaded ${data.length.toLocaleString()} data points from archive`);
  }, [allRows]);

  const clearData = useCallback(() => {
    setAllRowsState([]);
    setProcessedData(null);
    setUploadedFiles([]);
    toast.info("Workspace cleared");
  }, []);

  const value = useMemo(() => ({
    allRows,
    filteredRows,
    processedData,
    uploadedFiles,
    isProcessing,
    availableStates,
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
    setAllRows,
    handleFilesSelected,
    handleArchiveDataLoaded,
    clearData,
    loadStateData
  }), [allRows, filteredRows, processedData, uploadedFiles, isProcessing, selectedState, selectedCity, selectedZip, selectedRegion, selectedYear, granularity, availableStates, setSelectedState, setSelectedCity, setSelectedZip, setSelectedRegion, setSelectedYear, setGranularity, setAllRows, handleFilesSelected, handleArchiveDataLoaded, clearData, loadStateData]);


  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
