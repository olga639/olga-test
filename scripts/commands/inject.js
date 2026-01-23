/**
 * Inject Command - Fault Injection Command
 * 
 * Features:
 * - Validate fault type
 * - Backup original files
 * - Load and apply error template
 * - Output operation results and next steps
 */

import { getFaultConfig } from '../config/faultRegistry.js';
import { createBackup } from '../core/backupManager.js';
import { loadTemplate, applyTemplate } from '../core/templateLoader.js';
import logger from '../core/logger.js';

export default async function inject(args) {
  try {
    // Parse arguments
    const typeIndex = args.indexOf('--type');
    if (typeIndex === -1 || !args[typeIndex + 1]) {
      logger.error('Missing parameter: --type');
      logger.tip('Usage: npm run chaos inject --type <fault-type>');
      logger.tip('View all fault types: npm run chaos list');
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
    logger.title(`Fault Injection: ${faultConfig.name}`);
    logger.newLine();

    // Display fault information
    logger.info(`Category: ${faultConfig.category}`);
    logger.info(`Description: ${faultConfig.description}`);
    logger.info(`Severity: ${faultConfig.severity}`);
    logger.info(`Expected Error: ${faultConfig.expectedError}`);
    logger.newLine();

    // Step 1: Backup original files
    logger.step('Step 1/3: Backing up original files...');
    const backup = await createBackup(faultConfig.targetFiles, faultType);
    
    backup.files.forEach(file => {
      logger.success(`Backed up: ${file}`);
    });
    logger.newLine();

    // Step 2: Load error template
    logger.step('Step 2/3: Loading error template...');
    const template = loadTemplate(faultConfig.templateFile);
    logger.success(`Loaded template: ${faultConfig.templateFile}`);
    logger.newLine();

    // Step 3: Inject error code
    logger.step('Step 3/3: Injecting error code...');
    
    // Process main template
    if (faultConfig.targetFiles.length === 1) {
      // Single file injection
      applyTemplate(template, faultConfig.targetFiles[0]);
      logger.success(`Injected: ${faultConfig.targetFiles[0]}`);
    } else if (faultConfig.additionalTemplates) {
      // Multi-file injection (using additionalTemplates)
      for (const targetFile of faultConfig.targetFiles) {
        if (faultConfig.additionalTemplates[targetFile]) {
          // Use specific template
          const specificTemplate = loadTemplate(faultConfig.additionalTemplates[targetFile]);
          applyTemplate(specificTemplate, targetFile);
          logger.success(`Injected: ${targetFile} (using ${faultConfig.additionalTemplates[targetFile]})`);
        } else {
          // Use main template
          applyTemplate(template, targetFile);
          logger.success(`Injected: ${targetFile}`);
        }
      }
    } else {
      // Multiple files using same template
      for (const targetFile of faultConfig.targetFiles) {
        applyTemplate(template, targetFile);
        logger.success(`Injected: ${targetFile}`);
      }
    }
    
    logger.newLine();
    logger.divider();
    logger.newLine();

    // Display success message
    logger.box(`Fault injection successful!\n\nFault Type: ${faultConfig.name}\nModified Files: ${faultConfig.targetFiles.join(', ')}`, 'success');
    logger.newLine();

    // Display change summary
    logger.title('Change Summary');
    logger.listItem(`Fault Type: ${faultType}`);
    logger.listItem(`Modified Files: ${faultConfig.targetFiles.length}`);
    faultConfig.targetFiles.forEach(file => {
      logger.listItem(file, 1);
    });
    logger.listItem(`Expected Error: ${faultConfig.expectedError}`);
    logger.listItem(`Build Fails: ${faultConfig.buildFails ? 'Yes' : 'No'}`);
    logger.listItem(`Runtime Fails: ${faultConfig.runtimeFails ? 'Yes' : 'No'}`);
    logger.newLine();

    // Display next steps
    logger.title('Next Steps');
    logger.newLine();
    logger.log('1. View code changes:');
    logger.code(`   git diff`);
    logger.newLine();
    
    logger.log('2. Commit code:');
    logger.code(`   git add .`);
    logger.code(`   git commit -m "feat: ${faultConfig.name}"`);
    logger.newLine();
    
    logger.log('3. Push to remote repository:');
    logger.code(`   git push origin main`);
    logger.newLine();
    
    logger.log('4. Observe Vercel deployment result');
    logger.newLine();
    
    logger.log('5. Restore to normal state:');
    logger.code(`   npm run chaos restore`);
    logger.newLine();

    // Display warning messages
    if (faultConfig.buildFails) {
      logger.warn('This fault will cause build failure, Vercel deployment will not complete');
    }
    
    if (faultConfig.runtimeFails) {
      logger.warn('This fault will cause runtime error, application may not work properly');
    }

    logger.newLine();
    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`Fault injection failed: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}
