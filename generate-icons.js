// Script to generate PNG icons from SVG
// This creates data URLs that can be used as placeholders

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the SVG file
const svgContent = fs.readFileSync('./public/icon.svg', 'utf8');

// Function to create a resized SVG
const createResizedSVG = (size) => {
  return svgContent.replace('width="512"', `width="${size}"`).replace('height="512"', `height="${size}"`);
};

// Icon sizes needed
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create the icons directory if it doesn't exist
const iconsDir = './public/icons';
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generating icon files...');

sizes.forEach(size => {
  const resizedSVG = createResizedSVG(size);
  const fileName = `icon-${size}x${size}.svg`;
  const filePath = path.join(iconsDir, fileName);
  
  fs.writeFileSync(filePath, resizedSVG);
  console.log(`✅ Created ${fileName}`);
});

console.log('\n🎉 All icons generated!');
console.log('\nNote: These are SVG files. For better compatibility, you might want to:');
console.log('1. Convert to PNG using online tools or ImageMagick');
console.log('2. Or use the SVG files directly (modern browsers support this)');
console.log('\nThe manifest.json will work with these SVG files for now.');

// Update manifest to use SVG files
const manifestPath = './public/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.icons = sizes.map(size => ({
  src: `/icons/icon-${size}x${size}.svg`,
  sizes: `${size}x${size}`,
  type: "image/svg+xml",
  purpose: "maskable any"
}));

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Updated manifest.json with new icons');