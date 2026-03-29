/**
 * List all files in UploadThing account.
 * Run: npx tsx scripts/list-assets.ts
 */

import { UTApi } from 'uploadthing/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^(\w+)=['\"]?(.+?)['\"]?$/);
    if (match) process.env[match[1]] = match[2];
  }
} catch {
  console.error('.env.local not found');
}

const utapi = new UTApi();

async function main() {
  console.log('=== UploadThing Files ===\n');

  const files = await utapi.listFiles({ limit: 100 });

  console.log(`Total files: ${files.files.length}\n`);
  console.log('KEY'.padEnd(50) + 'NAME'.padEnd(40) + 'SIZE'.padEnd(10) + 'STATUS');
  console.log('-'.repeat(110));

  for (const f of files.files) {
    const sizeKB = f.size ? `${Math.round(f.size / 1024)}KB` : '?';
    console.log(
      f.key.padEnd(50) +
      f.name.padEnd(40) +
      sizeKB.padEnd(10) +
      f.status
    );
  }
}

main().catch(console.error);
