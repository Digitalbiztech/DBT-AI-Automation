import { useCallback, useState } from "react";
import { Upload, FileText, X, Loader2, Database, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Papa from "papaparse";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  onDataLoaded?: (data: RealEstateRow[]) => void;
  isProcessing: boolean;
  uploadedFiles: string[];
}

interface RealEstateRow {
  date: string;
  region: string;
  state: string;
  city: string;
  zip: string;
  value: number;
  type: "home_value" | "rent";
}

interface ArchiveFile {
  name: string;
  path: string;
  type: "home_value" | "rent";
  description: string;
}

const ARCHIVE_FILES: ArchiveFile[] = [
  { name: "Metro - Home Value index (Mid-tier)", path: "/dataset/Metro_zhvi_uc_sfrcondo_tier_0.33_0.67_month.csv", type: "home_value", description: "Standard metro Home Value Index (ZHVI)" },
  { name: "City - Home Value (Bottom Tier)", path: "/dataset/City_zhvi_uc_sfrcondo_tier_0.0_0.33_sm_sa_month.csv", type: "home_value", description: "Bottom 33% tier home values by city" },
  { name: "City - Home Value (Top Tier)", path: "/dataset/City_zhvi_uc_sfrcondo_tier_0.67_1.0_sm_sa_month.csv", type: "home_value", description: "Top 33% tier home values by city" },
  { name: "Zip - Home Value index (Mid-tier)", path: "/dataset/Zip_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv", type: "home_value", description: "ZIP-level Home Value Index (ZHVI)" },
  { name: "Metro - Home Value Forecast", path: "/dataset/Metro_zhvf_growth_uc_sfrcondo_tier_0.33_0.67_month.csv", type: "home_value", description: "Metro-level ZHVI growth forecasts" },
  { name: "Metro - Sales Count", path: "/dataset/Metro_sales_count_now_uc_sfrcondo_month.csv", type: "home_value", description: "Number of homes sold in metro areas" },
  { name: "Metro - Transaction Value", path: "/dataset/Metro_total_transaction_value_now_uc_sfrcondo_month.csv", type: "home_value", description: "Total value of transactions in metro areas" },
  { name: "Metro - New Construction Sales", path: "/dataset/Metro_new_con_sales_count_raw_uc_sfrcondo_month.csv", type: "home_value", description: "Sales count of new construction homes" },
  { name: "Metro - Market Temperature", path: "/dataset/Metro_market_temp_index_uc_sfrcondo_month_1.csv", type: "home_value", description: "Index of market heat (Buyer vs Seller)" },
  { name: "Metro - Median Sale Price", path: "/dataset/Metro_median_sale_price_now_uc_sfrcondo_month.csv", type: "home_value", description: "Median price of homes sold in metro areas" },
  { name: "Metro - Inventory (For Sale)", path: "/dataset/Metro_invt_fs_uc_sfrcondo_sm_month.csv", type: "home_value", description: "Active listings for sale in metro areas" },
  { name: "Metro - Pct Sold Above List", path: "/dataset/Metro_pct_sold_above_list_uc_sfrcondo_sm_month.csv", type: "home_value", description: "Percentage of homes sold above listing price" },
  { name: "Zip - Home Value Forecast (SA)", path: "/dataset/Zip_zhvf_growth_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv", type: "home_value", description: "ZIP-level ZHVI growth forecasts (Seasonally Adj)" },
];


function isWideFormat(headers: string[]): boolean {
  const datePattern = /^\d{4}-\d{2}(-\d{2})?$/;
  const dateColumns = headers.filter((h) => datePattern.test(h));
  return dateColumns.length > 1;
}

function detectRegionColumns(headers: string[]): { region: string; state: string; city: string; zip: string } {
  const lower = headers.map((h) => h.toLowerCase());
  return {
    region: headers[lower.findIndex((h) => h.includes("regionname") || h.includes("region") || h === "name")] || headers[0],
    state: headers[lower.findIndex((h) => h.includes("statename") || h.includes("state") || h === "st" || h === "statecodefi")] || "",
    city: headers[lower.findIndex((h) => h.includes("city") || h.includes("metro") || h.includes("cbsa"))] || "",
    zip: headers[lower.findIndex((h) => h.includes("zip") || h.includes("postal") || h === "regionid")] || "",
  };
}

export function FileUpload({ onFilesSelected, onDataLoaded, isProcessing, uploadedFiles }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showArchivePicker, setShowArchivePicker] = useState(false);
  const [selectedArchives, setSelectedArchives] = useState<Set<string>>(new Set());
  const [isLoadingArchive, setIsLoadingArchive] = useState(false);
  const [isLoadingPreprocessed, setIsLoadingPreprocessed] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.name.endsWith(".csv"));
      if (files.length) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFilesSelected(files);
  };

  const toggleArchive = (path: string) => {
    setSelectedArchives((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const loadSelectedArchives = async () => {
    if (selectedArchives.size === 0) return;

    setIsLoadingArchive(true);
    try {
      const allRows: RealEstateRow[] = [];

      for (const filePath of selectedArchives) {
        try {
          const archiveFile = ARCHIVE_FILES.find((f) => f.path === filePath);
          const dataType = archiveFile?.type || "home_value";

          const response = await fetch(filePath);
          if (!response.ok) continue;

          const csvText = await response.text();

          const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
          });

          const headers = result.meta.fields || [];
          const rawData = result.data as Record<string, unknown>[];

          if (isWideFormat(headers)) {
            const cols = detectRegionColumns(headers);
            const datePattern = /^\d{4}-\d{2}(-\d{2})?$/;
            const dateColumns = headers.filter((h) => datePattern.test(h));

            for (const row of rawData) {
              for (const dateCol of dateColumns) {
                const val = row[dateCol];
                if (val != null && val !== "" && !isNaN(Number(val))) {
                  allRows.push({
                    date: dateCol.length === 7 ? `${dateCol}-01` : dateCol,
                    region: String(row[cols.region] || ""),
                    state: String(row[cols.state] || ""),
                    city: String(row[cols.city] || ""),
                    zip: String(row[cols.zip] || ""),
                    value: Number(val),
                    type: dataType,
                  });
                }
              }
            }
          }
        } catch (err) {
          console.warn(`Failed to load ${filePath}:`, err);
        }
      }

      if (allRows.length > 0 && onDataLoaded) {
        onDataLoaded(allRows);
      }
    } catch (err) {
      console.error("Failed to load archive data:", err);
    } finally {
      setIsLoadingArchive(false);
      setShowArchivePicker(false);
      setSelectedArchives(new Set());
    }
  };

  const selectAllHomeValues = () => {
    const homeValueFiles = ARCHIVE_FILES.filter((f) => f.type === "home_value").map((f) => f.path);
    setSelectedArchives(new Set(homeValueFiles));
  };

  const selectAllRent = () => {
    const rentFiles = ARCHIVE_FILES.filter((f) => f.type === "rent").map((f) => f.path);
    setSelectedArchives(new Set(rentFiles));
  };

  const handleLoadPreprocessed = async () => {
    setIsLoadingPreprocessed(true);
    try {
      const response = await fetch("/dataset/all_data.json");
      if (!response.ok) throw new Error("Pre-processed data file not found");
      const data = await response.json();
      if (onDataLoaded) {
        onDataLoaded(data);
        toast.success("Consolidated Zillow dataset loaded successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Pre-processed data not found. Please ensure the consolidation script has run.");
    } finally {
      setIsLoadingPreprocessed(false);
    }
  };


  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onClick={() => document.getElementById("csv-input")?.click()}
      >
        <input id="csv-input" type="file" accept=".csv" multiple onChange={handleFileInput} className="hidden" />
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Processing CSV...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drop Zillow CSV files here or click to browse</p>
            <p className="text-xs text-muted-foreground/60">Supports ZHVI & ZORI datasets (wide & long format)</p>
          </div>
        )}
      </div>

      {/* Archive Data Button with Popover */}
      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary font-bold uppercase tracking-widest text-[10px] h-11"
          onClick={handleLoadPreprocessed}
          disabled={isLoadingPreprocessed}
        >
          {isLoadingPreprocessed ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          <span>Load All Pre-processed Data</span>
        </Button>

        <Popover open={showArchivePicker} onOpenChange={setShowArchivePicker}>

          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full gap-2 justify-between"
            >
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Load Archive Data</span>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${showArchivePicker ? "rotate-180" : ""}`} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-4rem)] md:w-[450px] p-0 border-border/40 shadow-2xl rounded-xl z-[100]" align="start" sideOffset={8}>
            <div className="p-4 border-b border-border bg-muted/20">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={selectAllHomeValues} className="text-xs h-7">
                  Select All Home Values
                </Button>
                <Button variant="outline" size="sm" onClick={selectAllRent} className="text-xs h-7">
                  Select All Rent
                </Button>
              </div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mt-3">
                {selectedArchives.size} dataset{selectedArchives.size !== 1 ? 's' : ''} selected
              </p>
            </div>

            <div className="overflow-y-auto max-h-[350px] p-2 custom-scrollbar">
              {ARCHIVE_FILES.map((file) => (
                <button
                  key={file.path}
                  onClick={() => toggleArchive(file.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-muted/30 transition-colors mb-1 ${
                    selectedArchives.has(file.path) ? "bg-primary/10" : ""
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedArchives.has(file.path) ? "bg-primary border-primary" : "border-border"
                  }`}>
                    {selectedArchives.has(file.path) && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{file.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{file.description}</p>
                  </div>
                  <Badge variant={file.type === "home_value" ? "default" : "secondary"} className="text-[10px] py-0 h-4 uppercase font-bold tracking-tighter">
                    {file.type === "home_value" ? "Value" : "Rent"}
                  </Badge>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-border bg-muted/5">
              <Button
                onClick={loadSelectedArchives}
                disabled={selectedArchives.size === 0 || isLoadingArchive}
                className="w-full font-bold uppercase tracking-widest text-xs h-10"
              >
                {isLoadingArchive ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ingesting {selectedArchives.size} file(s)...
                  </>
                ) : (
                  `Ingest ${selectedArchives.size} Selected Dataset(s)`
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-1">
          {uploadedFiles.map((name) => (
            <div key={name} className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-1.5">
              <FileText className="h-3 w-3 text-primary" />
              <span className="truncate">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}