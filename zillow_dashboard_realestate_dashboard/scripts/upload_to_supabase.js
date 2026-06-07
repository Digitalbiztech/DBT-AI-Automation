import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://lzqludbiypdwjwyjiwic.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cWx1ZGJpeXBkd2p3eWppd2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzE2NzEsImV4cCI6MjA5MjQ0NzY3MX0.8a_B_LfRSle_-L6fuEFG4Cg7HsDtMouDmF7DdGc7bAM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET_NAME = 'market-data';

async function uploadFile(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const fileBuffer = fs.readFileSync(filePath);
  console.log(`Uploading ${fileName} (${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB)...`);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, fileBuffer, {
      contentType: filePath.endsWith('.json') ? 'application/json' : 'text/csv',
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${fileName}:`, error.message);
  } else {
    console.log(`Successfully uploaded ${fileName}!`);
  }
}

async function run() {
  // 1. Upload the optimized ZHVI data
  await uploadFile('public/dataset/zhvi_data.json', 'zhvi_data.json');
  
  // 2. Upload the Sales chunks
  const chunksDir = 'public/dataset/chunks';
  if (fs.existsSync(chunksDir)) {
    const chunkFiles = fs.readdirSync(chunksDir);
    for (const file of chunkFiles) {
      await uploadFile(path.join(chunksDir, file), file);
    }
  } else {
    await uploadFile('public/dataset/sales_data.json', 'sales_data.json');
  }

  // 3. Upload the Forecast data
  const forecastPath = 'public/archive/zillowsite/Metro_zhvf_growth_uc_sfrcondo_tier_0.33_0.67_month.csv';
  await uploadFile(forecastPath, 'forecast_growth.csv');
}

run();
