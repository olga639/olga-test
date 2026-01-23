/**
 * Info Command - Information Command
 * 
 * Features:
 * - Display detailed information for specified fault type
 * - Display template content preview
 * - Display affected scope
 */

import { getFaultConfig } from '../config/faultRegistry.js';
import { loadTemplate } from '../core/templateLoader.js';
import fileManager from '../core/fileManager.js';
import logger from '../core/logger.js';

export default async function info(args) {
  try {
    // Parse arguments
    const typeIndex = args.indexOf('--type');
    if (typeIndex === -1 || !args[typeIndex + 1]) {
      logger.error('Missing parameter: --type');
      logger.tip('Usage: npm run chaos info --type <fault-type>');
      process.exit(1);
    }

    const faultType = args[typeIndex + 1];

    // Validate fault type
    const faultConfig = getFaultConfig(faultType);
    if (!faultConfig) {
      logger.error(`Fault type does not exist: ${faultType}`);
      logger.tip('Use "npm run chaos list" to view all available fault types');
      process.exit(1);
    }

    logger.newLine();
    logger.title(`Fault Details: ${faultConfig.name}`);
    logger.newLine();

    // Basic information
    logger.log('Basic Information');
    logger.listItem(`Type ID: ${faultType}`);
    logger.listItem(`Name: ${faultConfig.name}`);
    logger.listItem(`Category: ${faultConfig.category}`);
    logger.listItem(`Severity: ${faultConfig.severity}`);
    logger.newLine();

    // Description
    logger.log('Description');
    logger.listItem(faultConfig.description);
    logger.newLine();

    // Affected scope
    logger.log('Affected Scope');
    logger.listItem(`Target Files: ${faultConfig.targetFiles.length}`);
    faultConfig.targetFiles.forEach(file => {
      logger.listItem(file, 1);
    });
    logger.newLine();

    // Expected result
    logger.log('Expected Result');
    logger.listItem(`Expected Error: ${faultConfig.expectedError}`);
    logger.listItem(`Build Fails: ${faultConfig.buildFails ? 'Yes' : 'No'}`);
    logger.listItem(`Runtime Fails: ${faultConfig.runtimeFails ? 'Yes' : 'No'}`);
    logger.newLine();

    // Template information
    logger.log('Template Information');
    logger.listItem(`Template File: ${faultConfig.templateFile}`);
    
    if (fileManager.fileExists(faultConfig.templateFile)) {
      logger.listItem('Template Status: Exists');
      
      // Load and display template preview
      try {
        const template = loadTemplate(faultConfig.templateFile);
        const lines = template.content.split('\n');
        const previewLines = lines.slice(0, 15);
        
        logger.newLine();
        logger.log('Template Preview (first 15 lines):');
        logger.divider();
        previewLines.forEach((line, index) => {
          logger.code(`${(index + 1).toString().padStart(3, ' ')} | ${line}`);
        });
        if (lines.length > 15) {
          logger.code('... (see template file for more)');
        }
        logger.divider();
      } catch (error) {
        logger.listItem(`Template load failed: ${error.message}`, 1);
      }
    } else {
      logger.listItem('Template Status: Not Found');
    }
    logger.newLine();

    // Usage instructions
    logger.title('Usage Instructions');
    logger.newLine();
    
    logger.log('1. Inject this fault:');
    logger.code(`   npm run chaos inject --type ${faultType}`);
    logger.newLine();
    
    logger.log('2. Commit and push code');
    logger.newLine();
    
    logger.log('3. Observe deployment result');
    logger.newLine();
    
    logger.log('4. Restore to normal:');
    logger.code(`   npm run chaos restore`);
    logger.newLine();

    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`Failed to get fault information: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}
