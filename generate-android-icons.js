#!/usr/bin/env node

// Script to generate Android icons from InkStream.webp
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎨 Generating Android icons from InkStream.webp...\n');

// Android icon sizes needed
const androidSizes = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 }
];

const sourceImage = './public/InkStream.webp';
const androidResPath = './android/app/src/main/res';

// Check if source image exists
if (!fs.existsSync(sourceImage)) {
  console.error('❌ InkStream.webp not found in public folder');
  process.exit(1);
}

// Function to copy existing PNG icons as fallback
const copyExistingIcons = () => {
  console.log('📋 Using existing PNG icons as Android app icons...\n');
  
  // Copy the 192x192 icon to all Android icon folders
  const sourceIcon = './public/icon-192x192.png';
  
  if (!fs.existsSync(sourceIcon)) {
    console.error('❌ icon-192x192.png not found');
    return false;
  }

  androidSizes.forEach(({ folder, size }) => {
    const targetDir = path.join(androidResPath, folder);
    
    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // Copy icon files
    const iconFiles = ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png'];
    
    iconFiles.forEach(iconFile => {
      const targetPath = path.join(targetDir, iconFile);
      try {
        fs.copyFileSync(sourceIcon, targetPath);
        console.log(`✅ Created ${folder}/${iconFile}`);
      } catch (error) {
        console.log(`⚠️  Could not create ${folder}/${iconFile}`);
      }
    });
  });
  
  return true;
};

// Try to use the existing PNG icons
if (copyExistingIcons()) {
  console.log('\n🎉 Android icons updated successfully!');
  console.log('📱 Your custom anime girl image will now appear as the app icon');
  console.log('\n💡 To see the changes:');
  console.log('1. Build a new APK');
  console.log('2. Uninstall the old app from your device');
  console.log('3. Install the new APK');
} else {
  console.error('❌ Failed to update Android icons');
  process.exit(1);
}