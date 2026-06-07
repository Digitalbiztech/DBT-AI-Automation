import fs from 'fs';
import path from 'path';

const INPUT_FILE = 'public/dataset/sales_data.json';
const OUTPUT_DIR = 'public/dataset/chunks';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function chunkData() {
  console.log('Reading sales_data.json...');
  const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
  const data = JSON.parse(rawData);
  
  if (!Array.isArray(data)) {
    console.error('Error: sales_data.json is not an array.');
    return;
  }

  console.log(`Total records: ${data.length}`);
  
  // We need to keep chunks under 50MB. 
  // 120MB / 3 = 40MB which is safe.
  const numChunks = 3;
  const chunkSize = Math.ceil(data.length / numChunks);

  for (let i = 0; i < numChunks; i++) {
    const chunk = data.slice(i * chunkSize, (i + 1) * chunkSize);
    const fileName = `sales_part_${i + 1}.json`;
    const outputPath = path.join(OUTPUT_DIR, fileName);
    
    fs.writeFileSync(outputPath, JSON.stringify(chunk));
    const stats = fs.statSync(outputPath);
    console.log(`Created ${fileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  }
}

chunkData();
