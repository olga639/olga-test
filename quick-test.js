#!/usr/bin/env node

/**
 * Quick test for remaining fault types
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Remaining fault types to test
const faultTypes = [
  'dependency-version-conflict',
  'env-variable-missing',
  'vite-config-error',
  'css-syntax-error',
  'circular-dependency',
  'build-out-of-memory',
  'asset-size-exceeded',
];

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: __dirname,
      stdio: 'inherit',
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
    
    proc.on('error', reject);
  });
}

async function testFault(faultType) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Testing: ${faultType}`);
  console.log('='.repeat(60));
  
  try {
    // Inject fault
    console.log('⏳ Injecting fault...');
    await runCommand('node', ['scripts/chaos-cli.js', 'inject', '--type', faultType]);
    console.log('✅ Injection successful\n');
    
    return { type: faultType, success: true };
  } catch (error) {
    console.log(`❌ Injection failed: ${error.message}\n`);
    return { type: faultType, success: false, error: error.message };
  }
}

async function main() {
  console.log('\n🧪 Quick test for remaining fault types\n');
  
  const results = [];
  
  for (const faultType of faultTypes) {
    const result = await testFault(faultType);
    results.push(result);
    
    // If successful, wait 1 second before continuing
    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summarize results
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`\n✅ Success: ${successful.length}/${results.length}`);
  successful.forEach(r => console.log(`   - ${r.type}`));
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
    failed.forEach(r => console.log(`   - ${r.type}: ${r.error}`));
  }
  
  console.log('\n');
}

main().catch(console.error);

