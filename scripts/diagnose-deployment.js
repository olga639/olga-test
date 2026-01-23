#!/usr/bin/env node

/**
 * Vercel Deployment Diagnostic Tool
 * Used to check if project configuration is correct
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.resolve(projectRoot, filePath);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    log(`✅ ${description}: ${filePath}`, 'green');
    return true;
  } else {
    log(`❌ ${description} does not exist: ${filePath}`, 'red');
    return false;
  }
}

function checkJSON(filePath, checks) {
  try {
    const fullPath = path.resolve(projectRoot, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const json = JSON.parse(content);
    
    let allPassed = true;
    checks.forEach(({ path: checkPath, expected, description }) => {
      const value = checkPath.split('.').reduce((obj, key) => obj?.[key], json);
      const passed = expected ? value === expected : value !== undefined;
      
      if (passed) {
        log(`  ✅ ${description}`, 'green');
      } else {
        log(`  ❌ ${description}`, 'red');
        log(`     Expected: ${expected || 'exists'}, Actual: ${value || 'does not exist'}`, 'yellow');
        allPassed = false;
      }
    });
    
    return allPassed;
  } catch (error) {
    log(`  ❌ Parse failed: ${error.message}`, 'red');
    return false;
  }
}

console.log('\n' + '='.repeat(60));
log('🔍 Vercel Deployment Diagnostic Tool', 'bold');
console.log('='.repeat(60) + '\n');

// 1. Check required files
log('📁 Checking required files...', 'blue');
const hasPackageJson = checkFile('package.json', 'package.json');
const hasVercelJson = checkFile('vercel.json', 'vercel.json');
const hasViteConfig = checkFile('vite.config.js', 'vite.config.js');
const hasIndexHtml = checkFile('index.html', 'index.html');
const hasSrcMain = checkFile('src/main.jsx', 'src/main.jsx');
console.log();

// 2. Check package.json
log('📦 Checking package.json...', 'blue');
checkJSON('package.json', [
  { path: 'scripts.build', description: 'build script exists' },
  { path: 'scripts.dev', description: 'dev script exists' },
  { path: 'dependencies.react', description: 'React dependency exists' },
  { path: 'dependencies.react-router-dom', description: 'React Router dependency exists' },
]);
console.log();

// 3. Check vercel.json
log('⚙️  Checking vercel.json...', 'blue');
const vercelConfig = JSON.parse(fs.readFileSync(path.resolve(projectRoot, 'vercel.json'), 'utf8'));
log(`  ℹ️  Configuration content:`, 'blue');
console.log(JSON.stringify(vercelConfig, null, 2));

// Check key configurations
if (vercelConfig.routes) {
  const hasFilesystemHandler = vercelConfig.routes.some(r => r.handle === 'filesystem');
  const hasCatchAllRoute = vercelConfig.routes.some(r => r.src === '/(.*)' || r.src === '/(.*).html');
  
  if (hasFilesystemHandler) {
    log(`  ✅ Contains filesystem handler`, 'green');
  } else {
    log(`  ⚠️  Missing filesystem handler (may cause static resource loading failure)`, 'yellow');
  }
  
  if (hasCatchAllRoute) {
    log(`  ✅ Contains catch-all route`, 'green');
  } else {
    log(`  ❌ Missing catch-all route (SPA routing will not work)`, 'red');
  }
}
console.log();

// 4. Check vite.config.js
log('⚡ Checking vite.config.js...', 'blue');
const viteConfig = fs.readFileSync(path.resolve(projectRoot, 'vite.config.js'), 'utf8');
if (viteConfig.includes("base: '/'") || viteConfig.includes('base:"/"')) {
  log(`  ✅ base configuration is correct`, 'green');
} else {
  log(`  ⚠️  base: '/' configuration not found`, 'yellow');
}

if (viteConfig.includes("outDir: 'dist'") || viteConfig.includes('outDir:"dist"')) {
  log(`  ✅ outDir configuration is correct`, 'green');
} else {
  log(`  ⚠️  outDir: 'dist' configuration not found`, 'yellow');
}
console.log();

// 5. Check build output
log('🏗️  Checking build output...', 'blue');
const distPath = path.resolve(projectRoot, 'dist');
const distExists = fs.existsSync(distPath);
if (distExists) {
  log(`  ✅ dist directory exists`, 'green');
  
  const distIndexPath = path.resolve(projectRoot, 'dist/index.html');
  const distAssetsPath = path.resolve(projectRoot, 'dist/assets');
  const distIndexExists = fs.existsSync(distIndexPath);
  const distAssetsExists = fs.existsSync(distAssetsPath);
  
  if (distIndexExists) {
    log(`  ✅ dist/index.html exists`, 'green');
    
    // Check index.html content
    const distIndexContent = fs.readFileSync(distIndexPath, 'utf8');
    if (distIndexContent.includes('<div id="root">')) {
      log(`  ✅ index.html contains root element`, 'green');
    }
    if (distIndexContent.includes('type="module"')) {
      log(`  ✅ index.html contains module script`, 'green');
    }
  } else {
    log(`  ❌ dist/index.html does not exist`, 'red');
  }
  
  if (distAssetsExists) {
    log(`  ✅ dist/assets directory exists`, 'green');
    const assets = fs.readdirSync(distAssetsPath);
    log(`  ℹ️  Number of asset files: ${assets.length}`, 'blue');
  } else {
    log(`  ❌ dist/assets directory does not exist`, 'red');
  }
} else {
  log(`  ⚠️  dist directory does not exist (please run npm run build first)`, 'yellow');
}
console.log();

// 6. Check routing configuration
log('🛣️  Checking routing configuration...', 'blue');
const appContent = fs.readFileSync(path.resolve(projectRoot, 'src/App.jsx'), 'utf8');
if (appContent.includes('BrowserRouter')) {
  log(`  ✅ Using BrowserRouter`, 'green');
  log(`  ℹ️  Need to ensure Vercel configuration is correct to support SPA routing`, 'blue');
} else if (appContent.includes('HashRouter')) {
  log(`  ⚠️  Using HashRouter (URL will contain # symbol)`, 'yellow');
} else {
  log(`  ❌ Router configuration not found`, 'red');
}
console.log();

// 7. Summary and recommendations
console.log('='.repeat(60));
log('📋 Diagnostic Summary', 'bold');
console.log('='.repeat(60));

if (hasPackageJson && hasVercelJson && hasViteConfig && distExists) {
  log('\n✅ Basic configuration is correct!', 'green');
  log('\n📝 Next steps:', 'blue');
  log('  1. Commit changes: git add . && git commit -m "fix: update Vercel config"', 'reset');
  log('  2. Push code: git push origin main', 'reset');
  log('  3. Wait for Vercel auto-deployment', 'reset');
  log('  4. Test deployment result', 'reset');
} else {
  log('\n⚠️  Some issues found, please fix according to the above prompts', 'yellow');
}

log('\n💡 If still blank after deployment, please check:', 'blue');
log('  1. Browser Developer Tools Console (F12)', 'reset');
log('  2. Network tab, check resource loading status', 'reset');
log('  3. Vercel deployment logs', 'reset');
log('  4. Run npm run preview locally to test build output', 'reset');

log('\n📚 Detailed documentation: VERCEL_DEPLOYMENT_GUIDE.md\n', 'blue');

