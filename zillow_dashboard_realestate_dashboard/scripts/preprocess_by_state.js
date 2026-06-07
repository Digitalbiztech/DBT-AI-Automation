import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const ZHVI_FILE = 'd:/backup/home-insights-ai-main/dataset_zillow/zhvi/Zip_zhvi_uc_sfrcondo_tier_0.33_0.67_sm_sa_month (1).csv';
const SALES_DIR = 'd:/backup/home-insights-ai-main/dataset_zillow/sales';
const FORECAST_DIR = 'd:/backup/home-insights-ai-main/dataset_zillow/forecast';
const OUTPUT_DIR = './public/dataset/by-state';
const MANIFEST_FILE = './public/dataset/manifest.json';

const START_DATE = '2024-01-01';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const stateData = {};

function addRow(row) {
  if (!row.s) return;
  if (!stateData[row.s]) {
    stateData[row.s] = [];
  }
  stateData[row.s].push(row);
}

async function processZHVI() {
  console.log('Processing ZHVI...');
  const content = fs.readFileSync(ZHVI_FILE, 'utf8');
  const { data, meta } = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true
  });

  const headers = meta.fields || [];
  const dateColumns = headers.filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h) && h >= START_DATE);

  data.forEach(row => {
    const state = row.StateName;
    const city = row.City;
    const zip = String(row.RegionName);
    const region = zip;

    dateColumns.forEach(date => {
      const val = row[date];
      if (val != null && val !== "" && !isNaN(val)) {
        addRow({
          d: date,
          r: region,
          s: state,
          c: city,
          z: zip,
          v: val,
          t: 'home_value',
          m: 'ZHVI'
        });
      }
    });
  });
}

async function processSales() {
  console.log('Processing Sales...');
  const files = fs.readdirSync(SALES_DIR).filter(f => f.endsWith('.csv'));
  
  for (const file of files) {
    const filePath = path.join(SALES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Standardize metric naming to match UI expectations
    let metric = 'Value';
    const lower = file.toLowerCase();
    if (lower.includes("sales_count")) metric = "Sales Count";
    else if (lower.includes("total_transaction_value")) metric = "Total Trans. Value";
    else if (lower.includes("median_sale_price")) metric = "Median Sale Price";
    else if (lower.includes("pct_sold_above_list")) metric = "Sold Above List %";
    else if (lower.includes("sale_to_list")) metric = "Sale-to-List Ratio";
    else if (lower.includes("invt")) metric = "Inventory";
    else if (lower.includes("new_listings")) metric = "New Listings";
    else if (lower.includes("pending")) metric = "Pending Listings";
    
    const { data, meta } = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    const headers = meta.fields || [];
    const dateColumns = headers.filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h) && h >= START_DATE);

    data.forEach(row => {
      let state = row.StateName;
      if (!state && row.RegionType === 'country') state = 'US';
      if (!state) return;

      const region = row.RegionName;
      const city = region ? region.split(',')[0].trim() : '';

      dateColumns.forEach(date => {
        const val = row[date];
        if (val != null && val !== "" && !isNaN(val)) {
          addRow({
            d: date,
            r: region,
            s: state,
            c: city,
            z: '',
            v: val,
            t: 'home_value',
            m: metric
          });
        }
      });
    });
  }
}

async function processForecast() {
  console.log('Processing Forecast...');
  const files = fs.readdirSync(FORECAST_DIR).filter(f => f.endsWith('.csv'));
  
  for (const file of files) {
    const filePath = path.join(FORECAST_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const { data, meta } = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    const headers = meta.fields || [];
    const dateColumns = headers.filter(h => /^\d{4}-\d{2}-\d{2}$/.test(h) && h >= START_DATE);

    data.forEach(row => {
      let state = row.StateName;
      if (!state && row.RegionType === 'country') state = 'US';
      if (!state) return;
      
      const region = String(row.RegionName || '');
      const city = row.City || (region && region.includes(',') ? region.split(',')[0].trim() : '');
      const zip = row.RegionType === 'zip' ? region : '';

      dateColumns.forEach(date => {
        const val = row[date];
        if (val != null && val !== "" && !isNaN(val)) {
          addRow({
            d: date,
            r: region,
            s: state,
            c: city,
            z: zip,
            v: val,
            t: 'home_value',
            m: 'Forecast Growth'
          });
        }
      });
    });
  }
}

async function run() {
  await processZHVI();
  await processSales();
  await processForecast();

  const states = Object.keys(stateData).sort();
  console.log(`Found ${states.length} states.`);
  if (states.length === 0) {
    console.log('Sample stateData keys:', Object.keys(stateData));
  }

  const manifest = {
    states: states,
    lastUpdated: new Date().toISOString(),
    startDate: START_DATE
  };

  states.forEach(state => {
    const filePath = path.join(OUTPUT_DIR, `${state}.json`);
    fs.writeFileSync(filePath, JSON.stringify(stateData[state]));
    console.log(`Saved ${state} data (${stateData[state].length} rows).`);
  });

  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
  console.log(`Saved manifest to ${MANIFEST_FILE}`);
}

run().catch(console.error);
