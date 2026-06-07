import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Using the same credentials from your existing upload script
const supabaseUrl = 'https://lzqludbiypdwjwyjiwic.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cWx1ZGJpeXBkd2p3eWppd2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzE2NzEsImV4cCI6MjA5MjQ0NzY3MX0.8a_B_LfRSle_-L6fuEFG4Cg7HsDtMouDmF7DdGc7bAM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const BUCKET_NAME = 'market-data';

async function uploadFile(filePath, destinationPath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(destinationPath, fileBuffer, {
      contentType: 'application/json',
      upsert: true
    });

  if (error) {
    console.error(`Error uploading ${destinationPath}:`, error.message);
  } else {
    console.log(`Successfully uploaded ${destinationPath}!`);
  }
}

async function run() {
  console.log('Starting upload of processed data to Supabase...');

  // 1. Upload manifest.json
  await uploadFile('public/dataset/manifest.json', 'dataset/manifest.json');

  // 2. Upload by-state files
  const statesDir = 'public/dataset/by-state';
  if (fs.existsSync(statesDir)) {
    const stateFiles = fs.readdirSync(statesDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${stateFiles.length} state files to upload.`);
    
    for (const file of stateFiles) {
      await uploadFile(path.join(statesDir, file), `dataset/by-state/${file}`);
    }
  }

  console.log('Upload complete!');
}

run().catch(console.error);
