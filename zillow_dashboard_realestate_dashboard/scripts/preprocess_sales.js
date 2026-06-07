import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const DATASET_DIR = './dataset_zillow/sales';
const OUTPUT_FILE = './public/dataset/sales_data.json';

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function detectDataType(filename) {
  const lower = filename.toLowerCase();
  let type = "home_value";
  let metric = "Value";
  let granularity = lower.includes("week") ? "weekly" : "monthly";

  if (lower.includes("sales_count")) metric = "Sales Count";
  else if (lower.includes("total_transaction_value")) metric = "Total Trans. Value";
  else if (lower.includes("median_sale_price")) metric = "Median Sale Price";
  else if (lower.includes("pct_sold_above_list")) metric = "Sold Above List %";
  else if (lower.includes("sale_to_list")) metric = "Sale-to-List Ratio";

  return { type, metric, granularity };
}

function detectRegionColumns(headers) {
  const lower = headers.map(h => h.toLowerCase());
  const stateIdx = lower.findIndex(h => h.includes("statename") || h.includes("state") || h === "st");
  const regionIdx = lower.findIndex(h => h.includes("regionname") || h.includes("region") || h === "name");
  const cityIdx = lower.findIndex(h => h.includes("city") || h.includes("metro") || h.includes("cbsa"));
  const zipIdx = lower.findIndex(h => h.includes("zip") || h.includes("postal") || h === "regionid");

  return {
    region: regionIdx !== -1 ? headers[regionIdx] : headers[0],
    state: stateIdx !== -1 ? headers[stateIdx] : "",
    city: cityIdx !== -1 ? headers[cityIdx] : "",
    zip: zipIdx !== -1 ? headers[zipIdx] : ""
  };
}

async function processFile(filePath) {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const { type, metric, granularity } = detectDataType(filename);
  
  return new Promise((resolve) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rawData = results.data;
        const cols = detectRegionColumns(headers);
        
        const datePattern = /^\d{4}-\d{2}(-\d{2})?$/;
        const dateColumns = headers.filter(h => datePattern.test(h));
        
        const rows = [];
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
                type,
                metric,
                granularity
              });
            }
          }
        }
        resolve(rows);
      }
    });
  });
}

async function run() {
  if (!fs.existsSync(DATASET_DIR)) {
    console.error(`Directory not found: ${DATASET_DIR}`);
    return;
  }

  const files = fs.readdirSync(DATASET_DIR).filter(f => f.endsWith('.csv'));
  
  console.log(`Processing ${files.length} sales files...`);
  
  let allData = [];
  const START_DATE = '2018-01-01'; // Include history since 2018

  for (const file of files) {
    console.log(`- ${file}`);
    const rows = await processFile(path.join(DATASET_DIR, file));
    // Filter for recent data to keep file size reasonable
    const filteredRows = rows.filter(r => r.date >= START_DATE);
    allData = allData.concat(filteredRows);
  }
  
  console.log(`Total rows processed: ${allData.length}`);

  // Calculate derived metric: Total Transaction Value = Sales Count * Price
  console.log("Calculating Total Transaction Value...");
  const grouped = new Map();
  allData.forEach(r => {
    const key = `${r.date}|${r.region}|${r.state}|${r.city}|${r.zip}|${r.granularity}`;
    if (!grouped.has(key)) grouped.set(key, {});
    grouped.get(key)[r.metric] = r.value;
  });

  const transactionValueRows = [];
  grouped.forEach((metrics, key) => {
    const [date, region, state, city, zip, granularity] = key.split('|');
    
    // Only derive if NOT already present from source CSVs
    if (metrics['Total Trans. Value'] == null) {
      const salesCount = metrics['Sales Count'];
      const price = metrics['Median Sale Price'];
      
      if (salesCount != null && price != null) {
        transactionValueRows.push({
          date, region, state, city, zip, granularity,
          metric: 'Total Trans. Value',
          type: 'home_value',
          value: salesCount * price
        });
      }
    }
  });

  console.log(`Derived ${transactionValueRows.length} Total Trans. Value rows.`);
  allData = allData.concat(transactionValueRows);
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData));
  console.log(`Saved ${allData.length} rows to ${OUTPUT_FILE}`);
}

run().catch(console.error);
