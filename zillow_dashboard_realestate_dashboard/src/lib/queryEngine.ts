import type { RealEstateRow } from "./dataProcessing";

export type AnalysisType = 
  | "overview"
  | "time_series"
  | "comparative"
  | "investment"
  | "risk"
  | "geographic"
  | "custom";

export type MetricType = 
  | "avg_value"
  | "median_value"
  | "total_value"
  | "count"
  | "yoy_growth"
  | "mom_growth"
  | "cagr"
  | "rental_yield"
  | "price_to_rent"
  | "volatility"
  | "momentum"
  | "market_score";

export interface AnalysisOperation {
  analysisType: AnalysisType;
  metrics: MetricType[];
  groupBy?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  timeRange?: { start: string; end: string };
  compareRegions?: string[];
  insightLevel?: "summary" | "detailed" | "comprehensive";
}

export interface AnalysisMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AnalysisResult {
  data: Record<string, any>[];
  operation: AnalysisOperation;
  insights: string[];
  reasoningSteps?: string[];
  chartType: "bar" | "line" | "pie" | "table" | "comparison" | "heatmap" | "radar";
  chartData?: Record<string, any>[];
  metrics?: Record<string, number>;
  recommendations?: string[];
}

const SYSTEM_PROMPT = `You are a high-end Real Estate AI Analyst. Your goal is to provide deep, actionable insights from housing market data.

DATA SCHEMA:
{
  date: string (YYYY-MM-DD),
  region: string (city or market area),
  state: string (2-letter code),
  city: string,
  zip: string,
  value: number (home value or rent),
  type: "home_value" | "rent"
}

ANALYSIS MODES:
1. overview: General summary of markets
2. time_series: Trend lines, momentum, and growth trajectories
3. comparative: Side-by-side performance analysis
4. investment: Yield, ROI, Price-to-Rent ratios
5. risk: Volatility, market health, stability metrics
6. geographic: Regional distributions

REASONING GUIDELINES:
- First, analyze the user's intent and identify the required data transformation.
- Define a step-by-step reasoning plan (3-4 steps) to achieve the result.
- Select the most appropriate metrics and chart types (use "radar" for multi-dimensional comparisons).
- provide actionable insights and strategic recommendations.

OUTPUT FORMAT (JSON):
{
  "reasoningSteps": ["Step 1...", "Step 2...", "Step 3..."],
  "analysisOperation": {
    "analysisType": "...",
    "metrics": ["..."],
    "groupBy": "...",
    "filters": {...},
    "sortBy": "...",
    "sortOrder": "desc|asc",
    "limit": 10,
    "compareRegions": ["..."]
  },
  "suggestedFollowUps": ["Question 1?", "Question 2?"]
}

IMPORTANT: Keep reasoning steps professional and data-focused.`;

export async function analyzeWithMistral(
  query: string, 
  apiKey: string, 
  dataSummary?: string, 
  useLargeModel: boolean = true,
  history: AnalysisMessage[] = []
): Promise<{ operation: AnalysisOperation, reasoningSteps: string[], suggestedFollowUps: string[] }> {
  const model = useLargeModel ? "mistral-large-latest" : "mistral-small-latest";
  
  const messages: AnalysisMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: dataSummary ? `CONTEXT:\n${dataSummary}\n\nUSER QUESTION: ${query}` : query }
  ];

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API error: ${response.status}`);
  }

  const result = await response.json();
  const content = result.choices?.[0]?.message?.content;
  
  if (!content) throw new Error("Empty response from AI");

  try {
    const parsed = JSON.parse(content);
    const op = parsed.analysisOperation;
    
    return {
      operation: {
        analysisType: op.analysisType || "custom",
        metrics: op.metrics || ["avg_value"],
        groupBy: op.groupBy,
        filters: op.filters || {},
        sortBy: op.sortBy,
        sortOrder: op.sortOrder || "desc",
        limit: op.limit || 10,
        timeRange: op.timeRange,
        compareRegions: op.compareRegions,
        insightLevel: op.insightLevel || "detailed",
      },
      reasoningSteps: parsed.reasoningSteps || ["Analyzing specific data points", "Calculating key metrics", "Generating strategic insights"],
      suggestedFollowUps: parsed.suggestedFollowUps || []
    };
  } catch (err) {
    throw new Error("Failed to parse analysis strategy");
  }
}

// Calculate Year-over-Year growth
function calculateYoYGrowth(data: RealEstateRow[], groupBy: string): Map<string, number> {
  const groups = new Map<string, RealEstateRow[]>();
  
  for (const row of data) {
    const key = row[groupBy as keyof RealEstateRow] as string;
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  const results = new Map<string, number>();
  const currentYear = new Date().getFullYear();
  
  for (const [key, rows] of groups) {
    const currentData = rows.filter(r => r.date.startsWith(String(currentYear)));
    const yearAgoData = rows.filter(r => r.date.startsWith(String(currentYear - 1)));
    
    if (currentData.length && yearAgoData.length) {
      const currentAvg = currentData.reduce((a, b) => a + b.value, 0) / currentData.length;
      const yearAgoAvg = yearAgoData.reduce((a, b) => a + b.value, 0) / yearAgoData.length;
      const growth = ((currentAvg - yearAgoAvg) / yearAgoAvg) * 100;
      results.set(key, growth);
    }
  }
  
  return results;
}

// Calculate rental yield from data
function calculateRentalYield(homeData: RealEstateRow[], rentData: RealEstateRow[], groupBy: string): Map<string, number> {
  const results = new Map<string, number>();
  
  // Group home values and rent by region
  const homeGroups = new Map<string, number[]>();
  const rentGroups = new Map<string, number[]>();
  
  for (const row of homeData) {
    const key = row[groupBy as keyof RealEstateRow] as string;
    if (!key) continue;
    if (!homeGroups.has(key)) homeGroups.set(key, []);
    homeGroups.get(key)!.push(row.value);
  }
  
  for (const row of rentData) {
    const key = row[groupBy as keyof RealEstateRow] as string;
    if (!key) continue;
    if (!rentGroups.has(key)) rentGroups.set(key, []);
    rentGroups.get(key)!.push(row.value);
  }
  
  for (const [key, homeValues] of homeGroups) {
    const rentValues = rentGroups.get(key);
    if (homeValues.length && rentValues?.length) {
      const avgHome = homeValues.reduce((a, b) => a + b, 0) / homeValues.length;
      const avgRent = rentValues.reduce((a, b) => a + b, 0) / rentValues.length;
      const annualRent = avgRent * 12;
      const yieldPercent = (annualRent / avgHome) * 100;
      results.set(key, yieldPercent);
    }
  }
  
  return results;
}

// Calculate volatility (standard deviation)
function calculateVolatility(data: RealEstateRow[], groupBy: string): Map<string, number> {
  const groups = new Map<string, number[]>();
  
  for (const row of data) {
    const key = row[groupBy as keyof RealEstateRow] as string;
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row.value);
  }

  const results = new Map<string, number>();
  
  for (const [key, values] of groups) {
    if (values.length < 2) {
      results.set(key, 0);
      continue;
    }
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / mean) * 100; // Coefficient of variation as percentage
    results.set(key, cv);
  }
  
  return results;
}

// Calculate CAGR
function calculateCAGR(data: RealEstateRow[], groupBy: string): Map<string, number> {
  const groups = new Map<string, { dates: string[]; values: number[] }>();
  
  for (const row of data) {
    const key = row[groupBy as keyof RealEstateRow] as string;
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, { dates: [], values: [] });
    const g = groups.get(key)!;
    g.dates.push(row.date);
    g.values.push(row.value);
  }

  const results = new Map<string, number>();
  
  for (const [key, g] of groups) {
    // Sort by date
    const sorted = g.dates.map((d, i) => ({ date: d, value: g.values[i] }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    if (sorted.length >= 2) {
      const startValue = sorted[0].value;
      const endValue = sorted[sorted.length - 1].value;
      const startYear = parseInt(sorted[0].date.slice(0, 4));
      const endYear = parseInt(sorted[sorted.length - 1].date.slice(0, 4));
      const years = endYear - startYear;
      
      if (years > 0 && startValue > 0) {
        const cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
        results.set(key, cagr);
      }
    }
  }
  
  return results;
}

export function executeAnalysis(data: RealEstateRow[], operation: AnalysisOperation): AnalysisResult {
  let resultData: Record<string, any>[] = [];
  const insights: string[] = [];
  const metrics: Record<string, number> = {};
  let chartType: AnalysisResult["chartType"] = "table";
  let chartData: Record<string, any>[] = [];

  // Apply time range filter if specified
  let filteredData = data;
  if (operation.timeRange) {
    filteredData = data.filter(r => 
      r.date >= operation.timeRange!.start && r.date <= operation.timeRange!.end
    );
  }

  // Apply other filters
  if (operation.filters) {
    for (const [key, value] of Object.entries(operation.filters)) {
      if (key === "type" || key === "state" || key === "city") {
        filteredData = filteredData.filter(r => r[key as keyof RealEstateRow] === value);
      }
    }
  }

  const homeData = filteredData.filter(r => r.type === "home_value");
  const rentData = filteredData.filter(r => r.type === "rent");

  // Group data
  const groupField = operation.groupBy || "state";
  const groups = new Map<string, RealEstateRow[]>();
  
  for (const row of filteredData) {
    const key = row[groupField as keyof RealEstateRow] as string;
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  // Calculate requested metrics
  const yoyGrowth = calculateYoYGrowth(filteredData, groupField);
  const rentalYield = calculateRentalYield(homeData, rentData, groupField);
  const volatility = calculateVolatility(filteredData, groupField);
  const cagr = calculateCAGR(filteredData, groupField);

  // Build result data
  for (const [key, rows] of groups) {
    const values = rows.map(r => r.value);
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    
    const row: Record<string, any> = {
      [groupField]: key,
      count: rows.length,
      avg_value: avgValue,
      min_value: Math.min(...values),
      max_value: Math.max(...values),
    };

    if (operation.metrics.includes("yoy_growth")) {
      row.yoy_growth = yoyGrowth.get(key) || 0;
    }
    if (operation.metrics.includes("rental_yield")) {
      row.rental_yield = rentalYield.get(key) || 0;
    }
    if (operation.metrics.includes("volatility")) {
      row.volatility = volatility.get(key) || 0;
    }
    if (operation.metrics.includes("cagr")) {
      row.cagr = cagr.get(key) || 0;
    }
    if (operation.metrics.includes("price_to_rent")) {
      row.price_to_rent = row.rental_yield ? (100 / row.rental_yield) : 0;
    }

    resultData.push(row);
  }

  // Apply sort
  const sortField = operation.sortBy || "avg_value";
  resultData.sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    return operation.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  // Apply limit
  if (operation.limit) {
    resultData = resultData.slice(0, operation.limit);
  }

  // Determine chart type
  if (operation.analysisType === "risk" && operation.metrics.length >= 3) {
    chartType = "radar";
  } else if (operation.analysisType === "time_series" || operation.compareRegions) {
    chartType = "line";
  } else if (operation.analysisType === "comparative" || operation.compareRegions) {
    chartType = "comparison";
  } else {
    chartType = "bar";
  }

  // Prepare chart data
  chartData = resultData.map(r => ({
    name: r[groupField],
    value: r.avg_value || 0,
    yoy_growth: r.yoy_growth || 0,
    rental_yield: r.rental_yield || 0,
    volatility: r.volatility || 0,
    cagr: r.cagr || 0,
  }));

  // Generate insights
  if (operation.analysisType === "investment") {
    const bestYield = resultData.find(r => r.rental_yield > 5);
    if (bestYield) {
      insights.push(`${bestYield[groupField]} has the highest rental yield at ${bestYield.rental_yield.toFixed(2)}%`);
    }
    const bestGrowth = resultData.find(r => r.cagr > 5);
    if (bestGrowth) {
      insights.push(`${bestGrowth[groupField]} shows strongest appreciation at ${bestGrowth.cagr.toFixed(1)}% CAGR`);
    }
  }

  if (operation.analysisType === "risk") {
    const highVol = resultData.filter(r => r.volatility > 20);
    if (highVol.length) {
      insights.push(`${highVol.length} markets show high volatility (>20%) - consider these higher risk`);
    }
  }

  if (operation.analysisType === "time_series") {
    const avgGrowth = resultData.reduce((a, b) => a + (b.yoy_growth || 0), 0) / resultData.length;
    insights.push(`Average year-over-year growth across markets: ${avgGrowth.toFixed(1)}%`);
  }

  // Calculate overall metrics
  metrics.totalRecords = filteredData.length;
  metrics.avgPrice = homeData.length ? homeData.reduce((a, b) => a + b.value, 0) / homeData.length : 0;
  metrics.avgRent = rentData.length ? rentData.reduce((a, b) => a + b.value, 0) / rentData.length : 0;

  return {
    data: resultData,
    operation,
    insights,
    chartType,
    chartData,
    metrics,
    recommendations: generateRecommendations(resultData, operation, metrics),
  };
}

function generateRecommendations(
  data: Record<string, any>[], 
  operation: AnalysisOperation,
  metrics: Record<string, number>
): string[] {
  const recs: string[] = [];

  if (operation.analysisType === "investment") {
    const bestYield = data.find(r => r.rental_yield > 6);
    if (bestYield) {
      recs.push(`Strong rental yield opportunity in ${bestYield[operation.groupBy || "state"]}`);
    }
    
    const goodGrowth = data.find(r => r.cagr > 8 && r.volatility < 15);
    if (goodGrowth) {
      recs.push(`Good balance of growth and stability in ${goodGrowth[operation.groupBy || "state"]}`);
    }
  }

  if (operation.analysisType === "risk") {
    const lowVol = data.find(r => r.volatility < 10);
    if (lowVol) {
      recs.push(`Lower risk option: ${lowVol[operation.groupBy || "state"]} with ${lowVol.volatility.toFixed(1)}% volatility`);
    }
  }

  return recs;
}

export function generateDataSummary(data: RealEstateRow[]): string {
  const states = [...new Set(data.map(r => r.state).filter(Boolean))];
  const cities = [...new Set(data.map(r => r.city).filter(Boolean))];
  const types = [...new Set(data.map(r => r.type))];
  const dates = data.map(r => r.date).sort();
  const dateRange = dates.length ? `${dates[0]} to ${dates[dates.length - 1]}` : "N/A";
  
  const homeData = data.filter(r => r.type === "home_value");
  const rentData = data.filter(r => r.type === "rent");
  const avgHomeValue = homeData.length ? homeData.reduce((a, b) => a + b.value, 0) / homeData.length : 0;
  const avgRent = rentData.length ? rentData.reduce((a, b) => a + b.value, 0) / rentData.length : 0;

  return `Available data: ${data.length.toLocaleString()} records
- States: ${states.slice(0, 10).join(", ")}${states.length > 10 ? ` and ${states.length - 10} more` : ""}
- Cities: ${cities.slice(0, 10).join(", ")}${cities.length > 10 ? ` and ${cities.length - 10} more` : ""}
- Property types: ${types.join(", ")}
- Date range: ${dateRange}
- Avg home value: $${avgHomeValue.toLocaleString(undefined, {maximumFractionDigits: 0})}
- Avg rent: $${avgRent.toLocaleString(undefined, {maximumFractionDigits: 0})}/month`;
}