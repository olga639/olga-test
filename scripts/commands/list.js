/**
 * List Command - List Command
 * 
 * Features:
 * - List all available fault types
 * - Display by category
 * - Display statistics
 */

import { getFaultsByCategory, getFaultStats } from '../config/faultRegistry.js';
import logger from '../core/logger.js';

export default async function list(args) {
  try {
    logger.newLine();
    logger.title('Available Fault Types');
    logger.newLine();

    // Get fault list and statistics
    const faultsByCategory = getFaultsByCategory();
    const stats = getFaultStats();

    // Display statistics
    logger.info(`Total: ${stats.total} fault types`);
    logger.newLine();

    // Display by category
    const categoryNames = {
      'build-errors': 'Build Errors',
      'runtime-errors': 'Runtime Errors',
      'resource-errors': 'Resource Loading Errors',
      'performance-issues': 'Performance Issues'
    };

    const severityColors = {
      high: '[HIGH]',
      medium: '[MEDIUM]',
      low: '[LOW]'
    };

    Object.entries(faultsByCategory).forEach(([category, faults]) => {
      if (faults.length === 0) return;

      logger.title(categoryNames[category] || category);
      logger.newLine();

      faults.forEach((fault, index) => {
        const severityIcon = severityColors[fault.severity] || '[?]';
        logger.log(`  ${index + 1}. ${severityIcon} ${fault.type}`);
        logger.log(`     Name: ${fault.name}`);
        logger.log(`     Description: ${fault.description}`);
        logger.log(`     Severity: ${fault.severity}`);
        logger.log(`     Build Fails: ${fault.buildFails ? 'Yes' : 'No'}`);
        logger.log(`     Runtime Fails: ${fault.runtimeFails ? 'Yes' : 'No'}`);
        logger.newLine();
      });
    });

    logger.divider();
    logger.newLine();

    // Display usage instructions
    logger.title('Usage');
    logger.newLine();
    
    logger.log('Inject fault:');
    logger.code('  npm run chaos inject --type <fault-type>');
    logger.newLine();
    
    logger.log('View fault details:');
    logger.code('  npm run chaos info --type <fault-type>');
    logger.newLine();
    
    logger.log('Example:');
    logger.code('  npm run chaos inject --type component-crash');
    logger.newLine();

    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`Failed to list fault types: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}
