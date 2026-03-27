/**
 * One-time script: upload local image assets to UploadThing.
 *
 * Run:  npx tsx scripts/upload-assets.ts
 *
 * Requires UPLOADTHING_TOKEN in .env.local
 */

import { UTApi } from 'uploadthing/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load .env.local manually (no dotenv dependency)
const envPath = join(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^(\w+)=['\"]?(.+?)['\"]?$/);
    if (match) process.env[match[1]] = match[2];
  }
} catch {
  console.error('.env.local not found — set UPLOADTHING_TOKEN manually');
}

const utapi = new UTApi();

const LOCAL_FILES = [
  { path: 'public/images/hunt_logo.png', name: 'hunt_logo.png' },
  { path: 'public/images/mockup_perro_negro.png', name: 'mockup_perro_negro.png' },
  { path: 'public/images/mockup_mha.jpeg', name: 'mockup_mha.jpeg' },
];

async function main() {
  console.log('=== UploadThing Asset Migration ===\n');
  console.log('Uploading 3 local files...\n');

  const results: { name: string; url: string; key: string }[] = [];

  for (const file of LOCAL_FILES) {
    try {
      const buffer = readFileSync(join(process.cwd(), file.path));
      const blob = new Blob([buffer]);
      const utFile = new File([blob], file.name);

      const response = await utapi.uploadFiles([utFile]);
      const r = response[0];

      if (r.error) {
        console.error(`  FAIL: ${file.name} — ${r.error.message}`);
      } else {
        console.log(`  OK: ${file.name}`);
        console.log(`      URL: ${r.data.url}`);
        console.log(`      Key: ${r.data.key}\n`);
        results.push({ name: file.name, url: r.data.url, key: r.data.key });
      }
    } catch (err) {
      console.error(`  ERROR: ${file.name}`, err);
    }
  }

  console.log('\n=== Summary ===\n');
  for (const r of results) {
    console.log(`${r.name}:`);
    console.log(`  key: ${r.key}`);
    console.log(`  url: ${r.url}`);
  }

  console.log(`\n${results.length}/${LOCAL_FILES.length} files uploaded successfully.`);
}

main().catch(console.error);
