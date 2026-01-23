#!/usr/bin/env node

/**
 * Automated testing for all fault type injection functions
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// All fault types
const faultTypes = [
  // Syntax compilation errors
  'syntax-error',
  'import-error',
  'typescript-error',
  'undefined-variable',
  // Dependency configuration errors
  'dependency-missing',
  'dependency-version-conflict',
  'env-variable-missing',
  'vite-config-error',
  // Resource packaging errors
  'css-syntax-error',
  'circular-dependency',
  'build-out-of-memory',
  'asset-size-exceeded',
];

const results = {
  success: [],
  failed: [],
  total: faultTypes.length,
};

console.log('\n🧪 Starting to test all fault type injection functions...\n');
console.log('=' .repeat(60));

for (const faultType of faultTypes) {
  console.log(`\n📝 Testing: ${faultType}`);
  console.log('-'.repeat(60));
  
  try {
    // Test injection
    console.log('  ⏳ Injecting fault...');
    execSync(`node scripts/chaos-cli.js inject --type ${faultType}`, {
      cwd: process.cwd(),
      stdio: 'pipe',
    });
    
    // Check if there are file changes
    const gitStatus = execSync('git status --porcelain', {
      cwd: process.cwd(),
      encoding: 'utf-8',
    });
    
    if (gitStatus.trim()) {
      console.log('  ✅ Injection successful - file changes detected');
      results.success.push(faultType);
      
      // Display changed files
      const changedFiles = gitStatus.trim().split('\n').map(line => line.trim());
      console.log(`  📁 Changed files: ${changedFiles.length}`);
      changedFiles.forEach(file => {
        console.log(`     ${file}`);
      });
    } else {
      console.log('  ⚠️  Warning - no file changes detected');
      results.failed.push({ type: faultType, reason: 'No file changes detected' });
    }
    
    // Restore
    console.log('  ⏳ Restoring to normal state...');
    
    // Check if there is a backup
    const backupDir = path.join(process.cwd(), '.chaos-backup');
    if (fs.existsSync(backupDir)) {
      execSync('node scripts/chaos-cli.js restore', {
        cwd: process.cwd(),
        input: 'y\n',
        stdio: 'pipe',
      });
      console.log('  ✅ Restore successful');
    } else {
      console.log('  ⚠️  No restore needed (no backup)');
    }
    
  } catch (error) {
    console.log(`  ❌ Test failed`);
    console.log(`  Error: ${error.message}`);
    results.failed.push({ 
      type: faultType, 
      reason: error.message.split('\n')[0] 
    });
  }
}

// Generate test report
console.log('\n');
console.log('='.repeat(60));
console.log('\n📊 Test Report\n');
console.log('='.repeat(60));

console.log(`\n✅ Success: ${results.success.length}/${results.total}`);
if (results.success.length > 0) {
  results.success.forEach((type, index) => {
    console.log(`   ${index + 1}. ${type}`);
  });
}

if (results.failed.length > 0) {
  console.log(`\n❌ Failed: ${results.failed.length}/${results.total}`);
  results.failed.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.type}`);
    console.log(`      Reason: ${item.reason}`);
  });
}

const successRate = ((results.success.length / results.total) * 100).toFixed(1);
console.log(`\n📈 Success Rate: ${successRate}%`);

// Save test report
const report = {
  timestamp: new Date().toISOString(),
  total: results.total,
  success: results.success.length,
  failed: results.failed.length,
  successRate: `${successRate}%`,
  details: {
    success: results.success,
    failed: results.failed,
  },
};

const reportPath = path.join(process.cwd(), 'test-results.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n💾 Test report saved: ${reportPath}`);

console.log('\n' + '='.repeat(60));

// Exit code
process.exit(results.failed.length > 0 ? 1 : 0);

