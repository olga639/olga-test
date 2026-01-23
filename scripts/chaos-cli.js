#!/usr/bin/env node

/**
 * Chaos Engineering CLI - Chaos Engineering Command Line Tool
 * 
 * Features:
 * - Inject fault code
 * - Restore normal state
 * - List all fault types
 * - View fault details
 * 
 * Usage:
 * npm run chaos inject --type <fault-type>
 * npm run chaos restore
 * npm run chaos list
 * npm run chaos info --type <fault-type>
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import command handlers
const commandsDir = join(__dirname, 'commands');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Command mapping
const commands = {
  inject: 'inject.js',
  restore: 'restore.js',
  list: 'list.js',
  info: 'info.js',
  help: 'help.js'
};

/**
 * Show help information
 */
function showHelp() {
  console.log(`
+==============================================================+
|         Chaos Engineering CLI - Command Line Tool            |
+==============================================================+

Usage:
  npm run chaos <command> [options]

Available Commands:
  inject    Inject fault code
  restore   Restore normal state
  list      List all fault types
  info      View fault details
  help      Show help information

Examples:
  npm run chaos inject --type component-crash
  npm run chaos restore
  npm run chaos list
  npm run chaos info --type component-crash

For more information, see documentation: docs/CLI_USAGE.md
`);
}

/**
 * Main function
 */
async function main() {
  // If no command or command is help, show help
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  // Check if command exists
  if (!commands[command]) {
    console.error(`\n[ERROR] Unknown command "${command}"\n`);
    console.log('[TIP] Use "npm run chaos help" to view available commands\n');
    process.exit(1);
  }

  // Dynamically import and execute command
  try {
    const commandPath = join(commandsDir, commands[command]);
    
    if (!existsSync(commandPath)) {
      console.error(`\n[ERROR] Command file does not exist ${commandPath}\n`);
      process.exit(1);
    }

    const commandModule = await import(commandPath);
    const commandHandler = commandModule.default || commandModule;
    
    if (typeof commandHandler !== 'function') {
      console.error(`\n[ERROR] Invalid command handler\n`);
      process.exit(1);
    }

    // Execute command
    await commandHandler(args.slice(1));
  } catch (error) {
    console.error(`\n[ERROR] Error occurred while executing command:\n`);
    console.error(error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Execute main function
main().catch((error) => {
  console.error('\n[ERROR] Uncaught error:\n');
  console.error(error);
  process.exit(1);
});
