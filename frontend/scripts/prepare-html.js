/**
 * This script prepares the HTML file for production build
 */
const fs = require('fs');
const path = require('path');

try {
  console.log('Starting HTML preparation for production build...');
  
  // Ensure the path exists
  const scriptsDir = path.resolve(__dirname);
  const projectRoot = path.resolve(scriptsDir, '..');
  const indexPath = path.join(projectRoot, 'index.html');
  
  console.log(`Reading HTML file from: ${indexPath}`);
  
  if (fs.existsSync(indexPath)) {
    console.log('HTML file found.');
    // Add additional preprocessing here if needed in the future
    console.log('HTML preparation complete.');
  } else {
    console.error('ERROR: index.html not found!');
    process.exit(1);
  }
} catch (error) {
  console.error('Error in prepare-html script:', error);
  process.exit(1);
}
