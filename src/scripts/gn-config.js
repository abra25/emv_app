const fs = require('fs');
const path = './src/assets/config.json';

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:9192'
};

fs.mkdirSync('./src/assets', { recursive: true });
fs.writeFileSync(path, JSON.stringify(config, null, 2));
console.log('Wrote config to', path, '=>', JSON.stringify(config));
