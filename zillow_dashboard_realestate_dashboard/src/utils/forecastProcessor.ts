import Papa from 'papaparse';

export interface ForecastData {
  regionId: string;
  regionName: string;
  regionType: string;
  stateName: string;
  baseDate: string;
  forecasts: {
    date: string;
    growth: number;
  }[];
}

/**
 * Parses Zillow Home Value Forecast (ZHVF) CSV data.
 * Headers: RegionID, SizeRank, RegionName, RegionType, StateName, BaseDate, [Future Dates...]
 */
export const parseForecastCSV = (csvString: string): ForecastData[] => {
  const { data, meta } = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (!data || data.length === 0) return [];

  // Metadata fields are the headers
  const fields = meta.fields || [];
  
  // Identify date columns (forecast dates are after BaseDate)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const firstRow = data[0] as any;
  const forecastDates = fields.filter(f => datePattern.test(f) && f !== firstRow?.BaseDate);

  return data.map((row: any) => {
    const forecasts = forecastDates.map(date => ({
      date,
      growth: typeof row[date] === 'number' ? row[date] : 0,
    }));

    return {
      regionId: String(row.RegionID),
      regionName: row.RegionName,
      regionType: row.RegionType,
      stateName: row.StateName,
      baseDate: row.BaseDate,
      forecasts,
    };
  });
};

/**
 * Transforms forecast data for a Heatmap component.
 * Usually we pick one specific forecast period (e.g. 1 year out).
 */
export const transformForHeatmap = (forecasts: ForecastData[], dateIndex: number = 2) => {
  return forecasts.map(f => ({
    name: f.regionName,
    value: f.forecasts[dateIndex]?.growth || 0,
    state: f.stateName,
  })).sort((a, b) => b.value - a.value);
};

/**
 * Transforms forecast data for a Line chart.
 * Shows growth over time for multiple regions.
 */
export const transformForForecastChart = (forecasts: ForecastData[], selectedRegions: string[]) => {
  const subset = forecasts.filter(f => selectedRegions.includes(f.regionName));
  const dateMap: Record<string, any> = {};

  subset.forEach(region => {
    // Add base date as 0 growth
    if (!dateMap[region.baseDate]) dateMap[region.baseDate] = { date: region.baseDate };
    dateMap[region.baseDate][region.regionName] = 0;

    region.forecasts.forEach(p => {
      if (!dateMap[p.date]) dateMap[p.date] = { date: p.date };
      dateMap[p.date][region.regionName] = p.growth;
    });
  });

  return Object.values(dateMap).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

/**
 * Parses historical ZHVI data for state appreciation.
 */
export const calculateStateAppreciation = (csvString: string) => {
  const { data, meta } = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (!data || data.length === 0) return [];

  const headers = meta.fields || [];
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const dateColumns = headers.filter(h => datePattern.test(h));
  
  if (dateColumns.length < 13) return []; // Need at least 13 months for YoY

  const latestDate = dateColumns[dateColumns.length - 1];
  const yearAgoDate = dateColumns[dateColumns.length - 13];

  return data.map((row: any) => {
    const currentVal = row[latestDate];
    const pastVal = row[yearAgoDate];
    const appreciation = pastVal ? ((currentVal - pastVal) / pastVal) * 100 : 0;

    return {
      stateId: row.StateName,
      stateName: row.RegionName,
      value: appreciation,
    };
  });
};
