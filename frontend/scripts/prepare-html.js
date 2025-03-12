const fs = require('fs');
const path = require('path');

// Define potential paths for index.html
const possiblePaths = [
  path.resolve(__dirname, '../index.html'),
  path.resolve(__dirname, '../public/index.html'),
  path.resolve(process.cwd(), 'index.html'),
  path.resolve(process.cwd(), 'public/index.html')
];

// Basic valid HTML template
const basicTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Finance Chatbot</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

// Check if a valid index.html exists, if not create one
let found = false;
let existingPath = null;

for (const htmlPath of possiblePaths) {
  if (fs.existsSync(htmlPath)) {
    existingPath = htmlPath;
    try {
      // Read the existing HTML
      let html = fs.readFileSync(htmlPath, 'utf-8');
      
      // Safety sanitization for URI encoding issues
      html = html.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
      
      // Write sanitized HTML back
      fs.writeFileSync(htmlPath, html);
      console.log(`Sanitized existing index.html at: ${htmlPath}`);
      found = true;
      break;
    } catch (e) {
      console.warn(`Error processing ${htmlPath}:`, e);
    }
  }
}

// If no valid HTML found, create one
if (!found) {
  const targetPath = path.resolve(process.cwd(), 'index.html');
  try {
    // Ensure the directory exists
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(targetPath, basicTemplate);
    console.log(`Created basic index.html at: ${targetPath}`);
  } catch (e) {
    console.error(`Failed to create index.html:`, e);
    process.exit(1);
  }
}

// If we found an existing HTML but couldn't sanitize it, try creating a backup and new one
if (existingPath && !found) {
  try {
    // Create backup of the problematic file
    const backupPath = `${existingPath}.backup`;
    fs.copyFileSync(existingPath, backupPath);
    console.log(`Created backup of problematic index.html at: ${backupPath}`);
    
    // Create a new valid HTML file
    fs.writeFileSync(existingPath, basicTemplate);
    console.log(`Replaced problematic index.html with a valid template at: ${existingPath}`);
  } catch (e) {
    console.error(`Failed to handle problematic index.html:`, e);
    process.exit(1);
  }
}

console.log('HTML preparation completed successfully.');
