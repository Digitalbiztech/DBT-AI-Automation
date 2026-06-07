import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const DATASET_DIR = './public/dataset';
const OUTPUT_FILE = './public/dataset/all_data.json';

function detectDataType(filename) {
  const lower = filename.toLowerCase();
  let type = "home_value";
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
  else if (lower.includes("zhvf")) metric = "Forecast";

  return { type, metric };
}

function detectRegionColumns(headers) {
  const regionNames = ["RegionName", "Region", "Area", "Location"];
  const stateNames = ["StateName", "State", "StateAbbr"];
  const cityNames = ["City", "Municipality"];
  const zipNames = ["RegionName", "Zip", "PostalCode"];

  let regionCol = headers.find(h => regionNames.includes(h)) || headers[0];
  let stateCol = headers.find(h => stateNames.includes(h)) || "";
  let cityCol = headers.find(h => cityNames.includes(h)) || "";
  let zipCol = "";

  if (headers.includes("RegionName") && headers.includes("StateName") && !headers.includes("City")) {
    // Likely Zip level if RegionName is 5 digits
  }

  return { region: regionCol, state: stateCol, city: cityCol, zip: zipCol };
}

async function processFile(filePath) {
  const filename = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const { type, metric } = detectDataType(filename);
  
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
        if (dateColumns.length > 0) {
          // Wide format
          for (const row of rawData) {
            for (const dateCol of dateColumns) {
              const val = row[dateCol];
              if (val != null && val !== "" && !isNaN(Number(val))) {
                rows.push({
                  date: dateCol.length === 7 ? `${dateCol}-01` : dateCol,
                  region: String(row[cols.region] || ""),
                  state: String(row[cols.state] || ""),
                  city: String(row[cols.city] || ""),
                  value: Number(val),
                  type,
                  metric
                });
              }
            }
          }
        } else {
          // Long format (simplified)
          const dateCol = headers.find(h => /date|period|month/i.test(h));
          const valueCol = headers.find(h => /value|price/i.test(h));
          if (dateCol && valueCol) {
            for (const row of rawData) {
              const val = row[valueCol];
              if (val != null && !isNaN(Number(val))) {
                rows.push({
                  date: String(row[dateCol] || ""),
                  region: String(row[cols.region] || ""),
                  state: String(row[cols.state] || ""),
                  city: String(row[cols.city] || ""),
                  value: Number(val),
                  type,
                  metric
                });
              }
            }
          }
        }
        resolve(rows);
      }
    });
  });
}

async function run() {
  const files = fs.readdirSync(DATASET_DIR).filter(f => 
    f.endsWith('.csv') && 
    (f.startsWith('Metro_') || f.includes('zhvf')) // Priority for Metro and Forecasts
  );
  
  console.log(`Processing ${files.length} optimized files...`);
  
  let allData = [];
  const START_DATE = '2019-01-01'; // 5+ years of history

  for (const file of files) {
    if (file === 'all_data.json') continue;
    console.log(`- ${file}`);
    const rows = await processFile(path.join(DATASET_DIR, file));
    const filteredRows = rows.filter(r => r.date >= START_DATE);
    allData = allData.concat(filteredRows);
  }
  
  console.log(`Total rows processed: ${allData.length}`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData));
  console.log(`Saved to ${OUTPUT_FILE}`);
}


run().catch(console.error);
