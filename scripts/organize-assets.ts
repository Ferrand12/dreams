/**
 * Organize UploadThing assets:
 * 1. Rename existing WhatsApp files with proper project-prefixed names
 * 2. Upload all Perro Negro brand assets with proper names
 *
 * Run: npx tsx scripts/organize-assets.ts
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

// ── Step 1: Rename existing WhatsApp files ──

const RENAMES: Record<string, string> = {
  '3o5p9iMXPbpY0OBacyDlafsB2OhJ8NIAFebXPinyukm6wZ9d': 'hunt_checkout.jpeg',
  '3o5p9iMXPbpYdi8PNuU1BmI9pOrGgnwTEfkuNZScWhAKX8R4': 'hunt_home.jpeg',
  '3o5p9iMXPbpYhLAaX1QB4eIAl5SunLEmztwofbY09Xj7WqCJ': 'mha_animation.mp4',
  '3o5p9iMXPbpYVCuULmi0XM146kGYQvxOotDdJ5SnFjqI7NuZ': 'hunt_event_detail.jpeg',
  '3o5p9iMXPbpYX7t9aPpuNYutrWogbeUyfcPqs1xTdpDIHK8n': 'mha_logo.jpeg',
  '3o5p9iMXPbpYS48jquv5tWKfSXqsNhkpGnx6dzV3Z8A1MaL2': 'hunt_app_demo.mp4',
  '3o5p9iMXPbpYvirOvvcRkS3JPKt6E9iaqLZNQUeG4FupYA8c': 'hunt_event_tickets.jpeg',
  '3o5p9iMXPbpYLnQIlymHaT7wVJf6ZjcPQgz1etny2RBNXol9': 'hunt_ticket_qr.jpeg',
};

// ── Step 2: Upload Perro Negro assets ──

const PN_DIR = '/Users/nflmac/Desktop/ASSETS PERRO NEGRO';

const PN_FILES: { file: string; name: string }[] = [
  // Icons / Brand illustrations (red)
  { file: 'Asset 1.png', name: 'pn_icon_flames.png' },
  { file: 'Asset 2.png', name: 'pn_icons_row.png' },
  { file: 'Asset 3.png', name: 'pn_icon_flame.png' },
  { file: 'Asset 4.png', name: 'pn_icon_warning.png' },
  { file: 'Asset 5.png', name: 'pn_icon_currency.png' },
  { file: 'Asset 6.png', name: 'pn_icon_wavy_text.png' },

  // Borders / Decorative patterns
  { file: 'Asset 7.png', name: 'pn_border_chain_red.png' },
  { file: 'Asset 8.png', name: 'pn_border_line.png' },
  { file: 'Asset 9.png', name: 'pn_border_braid_black.png' },
  { file: 'Asset 10.png', name: 'pn_border_braid_red.png' },
  { file: 'Asset 11.png', name: 'pn_border_chain_black.png' },
  { file: 'Asset 12.png', name: 'pn_border_crosses.png' },

  // Glitch typography
  { file: 'Asset 13.png', name: 'pn_glitch_square_black.png' },
  { file: 'Asset 14.png', name: 'pn_glitch_wide_black.png' },
  { file: 'Asset 15.png', name: 'pn_daleduro_inline.png' },
  { file: 'Asset 16.png', name: 'pn_daleduro_stacked.png' },

  // Dog illustrations
  { file: 'Asset 17.png', name: 'pn_dogs_action_banner.png' },
  { file: 'Asset 18.png', name: 'pn_dog_head_glitch.png' },
  { file: 'Asset 20.png', name: 'pn_dogs_outline_duo.png' },
  { file: 'Asset 21.png', name: 'pn_dog_jumping_outline.png' },
  { file: 'PvUmXj.png', name: 'pn_dog_silhouette.png' },

  // Logos — horizontal (red, dark, black) × sizes
  { file: 'Asset 22.png', name: 'pn_logo_h_dark_sm.png' },
  { file: 'Asset 24.png', name: 'pn_logo_h_red_sm.png' },
  { file: 'Asset 26.png', name: 'pn_logo_h_black_sm.png' },
  { file: 'Asset 28.png', name: 'pn_logo_h_dark_xs.png' },
  { file: 'Asset 30.png', name: 'pn_logo_h_red_xs.png' },
  { file: 'Asset 32.png', name: 'pn_logo_h_black_xs.png' },

  // Logos — stacked (red, dark, black, gray) × sizes
  { file: 'Asset 23.png', name: 'pn_logo_stacked_dark.png' },
  { file: 'Asset 25.png', name: 'pn_logo_stacked_red.png' },
  { file: 'Asset 27.png', name: 'pn_logo_stacked_black.png' },
  { file: 'Asset 29.png', name: 'pn_logo_stacked_gray.png' },
  { file: 'Asset 31.png', name: 'pn_logo_stacked_red_lg.png' },
  { file: 'Asset 33.png', name: 'pn_logo_stacked_black_lg.png' },
];

async function main() {
  console.log('=== UploadThing Asset Organization ===\n');

  // Step 1: Rename existing WhatsApp files
  console.log('── Renaming 8 existing files ──\n');
  const renameUpdates = Object.entries(RENAMES).map(([key, name]) => ({
    fileKey: key,
    newName: name,
  }));

  try {
    const renameResult = await utapi.renameFiles(renameUpdates);
    console.log(`  Renamed ${renameResult.success ? '8/8' : '?/8'} files\n`);
    for (const [key, name] of Object.entries(RENAMES)) {
      console.log(`  ${name.padEnd(30)} ← ${key.slice(0, 20)}...`);
    }
  } catch (err) {
    console.error('  Rename failed:', err);
  }

  // Step 2: Upload Perro Negro assets
  console.log('\n── Uploading 33 Perro Negro assets ──\n');

  let uploaded = 0;
  let failed = 0;
  const results: { name: string; key: string }[] = [];

  for (const entry of PN_FILES) {
    try {
      const buffer = readFileSync(join(PN_DIR, entry.file));
      const blob = new Blob([buffer]);
      const utFile = new File([blob], entry.name);

      const response = await utapi.uploadFiles([utFile]);
      const r = response[0];

      if (r.error) {
        console.error(`  FAIL: ${entry.name} — ${r.error.message}`);
        failed++;
      } else {
        console.log(`  OK: ${entry.name.padEnd(35)} key: ${r.data.key.slice(0, 25)}...`);
        results.push({ name: entry.name, key: r.data.key });
        uploaded++;
      }
    } catch (err) {
      console.error(`  ERROR: ${entry.name}`, err);
      failed++;
    }
  }

  // Summary
  console.log('\n=== Summary ===\n');
  console.log(`Renamed:  8 existing files`);
  console.log(`Uploaded: ${uploaded}/${PN_FILES.length} Perro Negro assets`);
  if (failed > 0) console.log(`Failed:   ${failed}`);

  console.log('\n── All Perro Negro keys ──\n');
  for (const r of results) {
    console.log(`${r.name}:`);
    console.log(`  ${r.key}`);
  }
}

main().catch(console.error);
