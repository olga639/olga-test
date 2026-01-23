/**
 * Restore Command - Restore Command
 * 
 * Features:
 * - Check if backup exists
 * - Restore backup files
 * - Clean backup directory
 * - Output operation results
 */

import { hasBackup, getBackupInfo, restoreBackup, cleanBackup } from '../core/backupManager.js';
import logger from '../core/logger.js';

export default async function restore(args) {
  try {
    logger.newLine();
    logger.title('Restore to Normal State');
    logger.newLine();

    // Check if backup exists
    if (!hasBackup()) {
      logger.warn('No backup files found');
      logger.tip('Please use "npm run chaos inject" to inject a fault first');
      logger.newLine();
      process.exit(0);
    }

    // Get backup information
    const backupInfo = getBackupInfo();
    
    logger.info(`Backup Time: ${new Date(backupInfo.timestamp).toLocaleString('en-US')}`);
    logger.info(`Fault Type: ${backupInfo.faultType}`);
    logger.info(`Backup Files: ${backupInfo.files.length}`);
    logger.newLine();

    // Ask for confirmation
    logger.warn('This operation will overwrite current changes, are you sure you want to continue?');
    logger.tip('If you have manually modified the code, it is recommended to commit or backup first');
    logger.newLine();

    const confirmed = await logger.confirm('Are you sure you want to restore the backup?');
    
    if (!confirmed) {
      logger.info('Operation cancelled');
      logger.newLine();
      process.exit(0);
    }

    logger.newLine();

    // Step 1: Restore files
    logger.step('Step 1/2: Restoring backup files...');
    const result = await restoreBackup();
    
    result.files.forEach(file => {
      logger.success(`Restored: ${file}`);
    });

    if (result.removedFiles && result.removedFiles.length > 0) {
      result.removedFiles.forEach(file => {
        logger.success(`Deleted: ${file}`);
      });
    }
    logger.newLine();

    // Step 2: Clean backup
    logger.step('Step 2/2: Cleaning backup directory...');
    await cleanBackup();
    logger.success('Backup cleaned');
    logger.newLine();

    logger.divider();
    logger.newLine();

    // Display success message
    logger.box(`Restored to normal state!\n\nRestored Files: ${result.files.length}\nFault Type: ${result.faultType}`, 'success');
    logger.newLine();

    // Display next steps
    logger.title('Next Steps');
    logger.newLine();
    
    logger.log('1. View restored changes:');
    logger.code(`   git diff`);
    logger.newLine();
    
    logger.log('2. Commit fix:');
    logger.code(`   git add .`);
    logger.code(`   git commit -m "fix: Fixed fault, restored to normal"`);
    logger.newLine();
    
    logger.log('3. Push to remote repository:');
    logger.code(`   git push origin main`);
    logger.newLine();
    
    logger.log('4. Verify Vercel deployment success');
    logger.newLine();

    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`Restore failed: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}
