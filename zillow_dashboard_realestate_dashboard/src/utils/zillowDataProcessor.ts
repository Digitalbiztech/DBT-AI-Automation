import Papa from 'papaparse';

export interface ZillowMetric {
  date: string;
  value: number;
  regionName?: string;
  regionType?: string;
  stateName?: string;
}

export interface ZillowTimeSeries {
  metricName: string;
  data: ZillowMetric[];
}

export interface ForecastMetric {
  date: string;
  mom: number;
  qoq: number;
  yoy: number;
}

/**
 * Parses Zillow CSV data into a common format.
 * Zillow CSVs typically have regions in rows and dates in columns starting from a certain index.
 */
export const parseZillowCSV = (csvString: string, metricName: string): ZillowTimeSeries[] => {
  const { data, meta } = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (!data || data.length === 0) return [];

  // Identify date columns (usually YYYY-MM-DD or MM/DD/YYYY)
  const dateColumns = meta.fields?.filter(field => 
    /^\d{4}-\d{2}-\d{2}$/.test(field) || /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(field)
  ) || [];

  return data.map((row: any) => {
    const timeSeriesData: ZillowMetric[] = dateColumns.map(date => ({
      date,
      value: row[date] || 0,
      regionName: row['RegionName'],
      regionType: row['RegionType'],
      stateName: row['StateName'],
    }));

    return {
      metricName,
      data: timeSeriesData,
    };
  });
};

/**
 * Transforms time series data for Recharts components.
 * Groups multiple metrics by date for multi-line charts.
 */
export const transformForCharts = (seriesList: ZillowTimeSeries[]) => {
  const dateMap: Record<string, any> = {};

  seriesList.forEach(series => {
    series.data.forEach(point => {
      if (!dateMap[point.date]) {
        dateMap[point.date] = { date: point.date };
      }
      dateMap[point.date][series.metricName] = point.value;
    });
  });

  return Object.values(dateMap).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// Mock data generator for development if CSVs are missing
export const generateMockZillowData = (metricName: string, startValue: number, volatility: number = 0.02) => {
  const data: ZillowMetric[] = [];
  let currentValue = startValue;
  const startDate = new Date('2023-01-31');

  for (let i = 0; i < 15; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    currentValue = currentValue * (1 + (Math.random() - 0.5) * volatility);
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue),
    });
  }

  return { metricName, data };
};
