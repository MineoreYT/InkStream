#!/usr/bin/env node

// Simple script to build Android APK
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building InkStream Android APK...\n');

try {
  // Step 1: Build web app
  console.log('📦 Building web app...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web app built successfully!\n');

  // Step 2: Sync with Capacitor
  console.log('🔄 Syncing with Capacitor...');
  execSync('npx cap sync android', { stdio: 'inherit' });
  console.log('✅ Capacitor sync completed!\n');

  // Step 3: Check if Android Studio is available
  console.log('🔍 Checking Android environment...');
  
  const androidDir = './android';
  if (!fs.existsSync(androidDir)) {
    throw new Error('Android project not found. Run "npx cap add android" first.');
  }

  console.log('✅ Android project ready!\n');

  // Step 4: Instructions
  console.log('📱 Next Steps:');
  console.log('1. Open Android Studio:');
  console.log('   npx cap open android');
  console.log('');
  console.log('2. Or build APK via command line:');
  console.log('   cd android');
  console.log('   ./gradlew assembleDebug');
  console.log('');
  console.log('3. Find your APK at:');
  console.log('   android/app/build/outputs/apk/debug/app-debug.apk');
  console.log('');
  console.log('🎉 Your InkStream Android app is ready to build!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('\n💡 Make sure you have:');
  console.log('- Android Studio installed');
  console.log('- Android SDK configured');
  console.log('- Java JDK 11+ installed');
  process.exit(1);
}