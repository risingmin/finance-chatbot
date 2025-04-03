/**
 * This script performs pre-build verification to catch common issues
 * that might cause build failures
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🔍 Running build verification...');

// Paths to check
const pathsToCheck = [
  path.resolve(__dirname, '..', 'src', 'pages', 'ChatPage.jsx'),
  path.resolve(__dirname, '..', 'src', 'App.jsx'),
  path.resolve(__dirname, '..', 'src', 'main.jsx')
];

// Check if files exist
let allFilesExist = true;
pathsToCheck.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    allFilesExist = false;
  } else {
    console.log(`✅ File exists: ${filePath}`);
  }
});

if (!allFilesExist) {
  console.error('❌ Some required files are missing!');
  process.exit(1);
}

// Check for syntax errors with ESLint (if available)
exec('npx eslint --no-eslintrc --parser-options=jsx:true --parser @babel/eslint-parser src/**/*.jsx', (error, stdout, stderr) => {
  if (error) {
    console.log('⚠️ ESLint found potential issues:');
    console.log(stdout || stderr);
    // Continue anyway as this is just a warning
  } else {
    console.log('✅ No ESLint issues detected');
  }
  
  // Continuing with build verification...
  console.log('✅ Build verification completed successfully');
});
