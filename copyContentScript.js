// copyContentScript.js
const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, 'src/content-script.js');
const dest = path.resolve(__dirname, 'dist/content-script.js');

fs.copyFileSync(src, dest);
console.log('content-script.js copied to dist');