import Papa from "papaparse";

export interface RealEstateRow {
  date: string;
  region: string;
  state: string;
  city: string;
  zip: string;
  value: number;
  type: "home_value" | "rent";
  metric?: string;
  granularity?: "weekly" | "monthly";
}


export interface ProcessedData {
  rows: RealEstateRow[];
  states: string[];
  cities: string[];
  zips: string[];
  regions: string[];
  years: string[];
  dateRange: { min: string; max: string };
}

export interface GrowthRow extends RealEstateRow {
  yoyGrowth: number | null;
  momGrowth: number | null;
  rentalYield: number | null;
}

// Detect if CSV is wide format (dates as columns)
function isWideFormat(headers: string[]): boolean {
  const datePattern = /^\d{4}-\d{2}(-\d{2})?$/;
  const dateColumns = headers.filter((h) => datePattern.test(h));
  return dateColumns.length > 1;
}

function detectRegionColumns(headers: string[]): {
  region: string;
  state: string;
  city: string;
  zip: string;
} {
  const lower = headers.map((h) => h.toLowerCase());
  const stateIdx = lower.findIndex((h) => h.includes("statename") || h.includes("state") || h === "st" || h === "statecodefi");
  const regionIdx = lower.findIndex((h) => h.includes("regionname") || h.includes("region") || h === "name");
  const cityIdx = lower.findIndex((h) => h.includes("city") || h.includes("metro") || h.includes("cbsa"));
  const zipIdx = lower.findIndex((h) => h.includes("zip") || h.includes("postal") || h === "regionid");

  let stateCol = stateIdx !== -1 ? headers[stateIdx] : "";
  let regionCol = regionIdx !== -1 ? headers[regionIdx] : headers[0];

  // If it's a state-level file, RegionName is often the State
  if (!stateCol && regionCol.toLowerCase().includes("regionname")) {
    stateCol = regionCol;
  }

  return {
    region: regionCol,
    state: stateCol,
    city: cityIdx !== -1 ? headers[cityIdx] : "",
    zip: zipIdx !== -1 ? headers[zipIdx] : "",
  };
}

function detectDataType(filename: string): { type: "home_value" | "rent"; metric: string } {
  const lower = filename.toLowerCase();
  let type: "home_value" | "rent" = "home_value";
  let metric = "Value";

  if (lower.includes("zori") || lower.includes("rent")) {
    type = "rent";
    metric = "Rent";
  }

  if (lower.includes("sales_count")) metric = "Sales Count";
  else if (lower.includes("total_transaction_value")) metric = "Total Trans. Value";
  else if (lower.includes("new_con_sales")) metric = "New Con. Sales";
  else if (lower.includes("market_temp")) metric = "Market Temp";
  else if (lower.includes("median_sale_price")) metric = "Median Sale Price";
  else if (lower.includes("median_list_price")) metric = "Median List Price";
  else if (lower.includes("pct_sold_above_list")) metric = "Sold Above List %";
  else if (lower.includes("sale_to_list")) metric = "Sale-to-List Ratio";
  else if (lower.includes("invt")) metric = "Inventory";
  else if (lower.includes("new_listings")) metric = "New Listings";
  else if (lower.includes("pending")) metric = "Pending Listings";
  else if (lower.includes("zhvf")) metric = "Forecast Growth";

  return { type, metric };
}


export function parseCSV(
  file: File
): Promise<{ data: RealEstateRow[]; filename: string }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rawData = results.data as Record<string, unknown>[];
        const dataType = detectDataType(file.name);

        if (isWideFormat(headers)) {
          const cols = detectRegionColumns(headers);
          const datePattern = /^\d{4}-\d{2}(-\d{2})?$/;
          const dateColumns = headers.filter((h) => datePattern.test(h));
          const rows: RealEstateRow[] = [];

          for (const row of rawData) {
            for (const dateCol of dateColumns) {
              const val = row[dateCol];
              if (val != null && val !== "" && !isNaN(Number(val))) {
                rows.push({
                  date: dateCol.length === 7 ? `${dateCol}-01` : dateCol,
                  region: String(row[cols.region] || ""),
                  state: String(row[cols.state] || ""),
                  city: String(row[cols.city] || ""),
                  zip: String(row[cols.zip] || ""),
                  value: Number(val),
                  type: dataType.type,
                  metric: dataType.metric,
                });
              }
            }
          }
          resolve({ data: rows, filename: file.name });
        } else {
          // Long format
          const dateCol =
            headers.find((h) =>
              /date|period|time|month|year/i.test(h)
            ) || headers[0];
          const valueCol =
            headers.find((h) =>
              /value|price|amount|zhvi|zori/i.test(h)
            ) || headers[headers.length - 1];
          const cols = detectRegionColumns(headers);

          const rows: RealEstateRow[] = rawData
            .filter((row) => row[valueCol] != null && !isNaN(Number(row[valueCol])))
            .map((row) => ({
              date: String(row[dateCol] || ""),
              region: String(row[cols.region] || ""),
              state: String(row[cols.state] || ""),
              city: String(row[cols.city] || ""),
              zip: String(row[cols.zip] || ""),
              value: Number(row[valueCol]),
              type: dataType.type,
              metric: dataType.metric,
            }));
          resolve({ data: rows, filename: file.name });
        }

      },
      error: (err) => reject(err),
    });
  });
}

export function processData(rows: RealEstateRow[]): ProcessedData {
  const states = [...new Set(rows.map((r) => r.state).filter(Boolean))].sort();
  const cities = [...new Set(rows.map((r) => r.city).filter(Boolean))].sort();
  const zips = [...new Set(rows.map((r) => r.zip).filter(Boolean))].sort();
  const regions = [...new Set(rows.map((r) => r.region).filter(Boolean))].sort();
  const years = [...new Set(rows.map((r) => r.date.split("-")[0]).filter(Boolean))].sort();
  const dates = rows.map((r) => r.date).sort();

  return {
    rows,
    states,
    cities,
    zips,
    regions,
    years,
    dateRange: {
      min: dates[0] || "",
      max: dates[dates.length - 1] || "",
    },
  };
}

export function calculateGrowth(
  rows: RealEstateRow[],
  allRows: RealEstateRow[]
): GrowthRow[] {
  // Sort by region, metric, then date
  const sorted = [...rows].sort((a, b) => {
    if (a.region !== b.region) return a.region.localeCompare(b.region);
    if (a.metric !== b.metric) return (a.metric || "").localeCompare(b.metric || "");
    return a.date.localeCompare(b.date);
  });

  // Pre-build maps for fast lookup
  const rentMap = new Map<string, number>();
  const homeMap = new Map<string, number>();
  
  for (const r of allRows) {
    if (r.type === "rent") rentMap.set(`${r.region}-Rent-${r.date}`, r.value);
    if (r.type === "home_value") homeMap.set(`${r.region}-${r.metric}-${r.date}`, r.value);
  }

  // Map to track the last seen value for each (region, metric) to calculate MoM
  const lastValueMap = new Map<string, number>();
  // Map to track all values for each (region, metric, date) for YoY
  const historicalMap = new Map<string, number>();
  for (const r of sorted) {
    historicalMap.set(`${r.region}-${r.metric}-${r.date.slice(0, 7)}`, r.value);
  }

  return sorted.map((row) => {
    let yoyGrowth: number | null = null;
    let momGrowth: number | null = null;

    const groupKey = `${row.region}-${row.metric}`;
    const prevValue = lastValueMap.get(groupKey);
    
    if (prevValue !== undefined && prevValue > 0) {
      momGrowth = ((row.value - prevValue) / prevValue) * 100;
    }
    lastValueMap.set(groupKey, row.value);

    const yoyDate = new Date(row.date);
    yoyDate.setFullYear(yoyDate.getFullYear() - 1);
    const yoyMonthKey = yoyDate.toISOString().slice(0, 7);
    const prevYearValue = historicalMap.get(`${row.region}-${row.metric}-${yoyMonthKey}`);
    
    if (prevYearValue !== undefined && prevYearValue > 0) {
      yoyGrowth = ((row.value - prevYearValue) / prevYearValue) * 100;
    }

    // Rental yield (specific to home values vs rents)
    let rentalYield: number | null = null;
    // This part is tricky because rent might not be the same metric. 
    // Usually it's comparing a home value metric to a rent metric.
    const rent = rentMap.get(`${row.region}-Rent-${row.date}`);
    if (rent && row.value > 0) {
      rentalYield = ((rent * 12) / row.value) * 100;
    }

    return { ...row, yoyGrowth, momGrowth, rentalYield };
  });
}


export function filterRows(
  rows: RealEstateRow[],
  filters: { state?: string; city?: string; zip?: string }
): RealEstateRow[] {
  return rows.filter((r) => {
    if (filters.state && r.state !== filters.state) return false;
    if (filters.city && r.city !== filters.city) return false;
    if (filters.zip && r.zip !== filters.zip) return false;
    return true;
  });
}

export function getChartData(
  rows: RealEstateRow[],
  type: "home_value" | "rent",
  metric?: string
) {
  const filtered = rows.filter((r) => r.type === type && (!metric || r.metric === metric));

  const byDate = new Map<string, { date: string; [key: string]: number | string }>();

  for (const row of filtered) {
    const key = row.date;
    if (!byDate.has(key)) {
      byDate.set(key, { date: key });
    }
    const entry = byDate.get(key)!;
    // Average values for same date
    const regionKey = row.region || "Value";
    entry[regionKey] = row.value;
  }

  return Array.from(byDate.values()).sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );
}

export function getTopRegions(
  rows: RealEstateRow[],
  limit = 5
): string[] {
  const regionCounts = new Map<string, number>();
  rows.forEach((r) => {
    regionCounts.set(r.region, (regionCounts.get(r.region) || 0) + 1);
  });
  return [...regionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([region]) => region);
}
