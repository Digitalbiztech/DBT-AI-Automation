import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const ARCHIVE_DIR = './public/archive';
const MAIN_ZHVI_ZIP = 'd:/backup/home-insights-ai-main/dataset_zillow/zhvi/Zip_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month (1).csv';
const OUTPUT_FILE = './public/dataset/zhvi_data.json';

const SEGMENTS = [
  { file: 'City_Zhvi_SingleFamilyResidence.csv', metric: 'SFH' },
  { file: 'City_Zhvi_Condominum.csv', metric: 'Condo' },
  { file: 'City_Zhvi_1bedroom.csv', metric: '1BR' },
  { file: 'City_Zhvi_2bedroom.csv', metric: '2BR' },
  { file: 'City_Zhvi_3bedroom.csv', metric: '3BR' },
  { file: 'City_Zhvi_4bedroom.csv', metric: '4BR' },
  { file: 'City_Zhvi_5BedroomOrMore.csv', metric: '5BR' }
];

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processCSV(filePath, metric) {
  console.log(`Processing ${metric} from ${filePath}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, meta } = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });

  const headers = meta.fields || [];
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const dateColumns = headers.filter(h => datePattern.test(h));
  
  const LATEST_DATE = dateColumns[dateColumns.length - 1];
  const START_DATE_STATE = '2020-01-01';
  const START_DATE_CITY = '2023-01-01';

  const rows = [];
  const stateAgg = {};
  const cityAgg = {};

  data.forEach((row) => {
    const state = row.StateName || row.State;
    const city = row.RegionName || row.City;
    const sizeRank = row.SizeRank;

    dateColumns.forEach(date => {
      const val = row[date];
      if (val == null || val === "" || isNaN(val)) return;

      // 1. State Aggregation
      if (date >= START_DATE_STATE && state) {
        if (!stateAgg[state]) stateAgg[state] = {};
        if (!stateAgg[state][date]) stateAgg[state][date] = { sum: 0, count: 0 };
        stateAgg[state][date].sum += val;
        stateAgg[state][date].count += 1;
      }

      // 2. City Aggregation (Limit to Top Cities to save space)
      if (date >= START_DATE_CITY && sizeRank < 500 && state && city) {
        const cityKey = `${city}|${state}`;
        if (!cityAgg[cityKey]) cityAgg[cityKey] = {};
        if (!cityAgg[cityKey][date]) cityAgg[cityKey][date] = { sum: 0, count: 0 };
        cityAgg[cityKey][date].sum += val;
        cityAgg[cityKey][date].count += 1;
      }
      
      // 3. Zip Level: We skip detailed zip-level for segments to keep JSON small
    });
  });

  // Flatten States
  Object.entries(stateAgg).forEach(([state, dates]) => {
    Object.entries(dates).forEach(([date, stats]) => {
      rows.push({ d: date, r: state, s: state, c: '', z: '', v: Math.round(stats.sum / stats.count), m: metric });
    });
  });

  // Flatten Cities
  Object.entries(cityAgg).forEach(([cityKey, dates]) => {
    const [city, state] = cityKey.split('|');
    Object.entries(dates).forEach(([date, stats]) => {
      rows.push({ d: date, r: city, s: state, c: city, z: '', v: Math.round(stats.sum / stats.count), m: metric });
    });
  });

  return rows;
}

async function run() {
  let allProcessedRows = [];

  // 1. Process Main ZHVI Zip Data (for Maps and Base trends)
  // We already have a logic for this, we'll integrate it
  console.log("Processing Main ZHVI Data...");
  const mainContent = fs.readFileSync(MAIN_ZHVI_ZIP, 'utf8');
  const mainParsed = Papa.parse(mainContent, { header: true, skipEmptyLines: true, dynamicTyping: true });
  const mainHeaders = mainParsed.meta.fields || [];
  const mainDateCols = mainHeaders.filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h));
  const LATEST = mainDateCols[mainDateCols.length - 1];

  mainParsed.data.forEach(row => {
    const state = row.StateName;
    const city = row.City;
    const zip = String(row.RegionName);
    
    // Just current month for all Zips
    if (row[LATEST]) {
      allProcessedRows.push({ d: LATEST, r: zip, s: state, c: city, z: zip, v: row[LATEST], m: 'ZHVI' });
    }
  });

  // 2. Process Segments (SFH, Condo, Bedrooms)
  for (const segment of SEGMENTS) {
    const filePath = path.join(ARCHIVE_DIR, segment.file);
    if (fs.existsSync(filePath)) {
      const rows = await processCSV(filePath, segment.metric);
      allProcessedRows = allProcessedRows.concat(rows);
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  }

  console.log(`Final count: ${allProcessedRows.length} rows.`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allProcessedRows));
  console.log(`Saved to ${OUTPUT_FILE}`);
}

run().catch(console.error);
