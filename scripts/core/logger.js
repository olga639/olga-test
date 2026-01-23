/**
 * Logger - Logging Utility
 * 
 * Provides colorful console output
 */

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

/**
 * Format text
 */
function format(text, color, bold = false) {
  const style = bold ? colors.bright : '';
  return `${style}${color}${text}${colors.reset}`;
}

/**
 * Logger class
 */
class Logger {
  /**
   * Success message
   */
  success(message) {
    console.log(format('[OK] ' + message, colors.green, true));
  }

  /**
   * Error message
   */
  error(message) {
    console.error(format('[ERROR] ' + message, colors.red, true));
  }

  /**
   * Warning message
   */
  warn(message) {
    console.warn(format('[WARN] ' + message, colors.yellow, true));
  }

  /**
   * Info message
   */
  info(message) {
    console.log(format('[INFO] ' + message, colors.blue));
  }

  /**
   * Tip message
   */
  tip(message) {
    console.log(format('[TIP] ' + message, colors.cyan));
  }

  /**
   * Step message
   */
  step(message) {
    console.log(format('[STEP] ' + message, colors.magenta));
  }

  /**
   * Normal log
   */
  log(message) {
    console.log(message);
  }

  /**
   * Title
   */
  title(message) {
    console.log('\n' + format(message, colors.cyan, true));
    console.log(format('-'.repeat(message.length), colors.cyan));
  }

  /**
   * Divider
   */
  divider() {
    console.log(format('-'.repeat(60), colors.dim));
  }

  /**
   * New line
   */
  newLine() {
    console.log('');
  }

  /**
   * Table
   */
  table(data) {
    console.table(data);
  }

  /**
   * Code block
   */
  code(code) {
    console.log(format(code, colors.dim));
  }

  /**
   * List item
   */
  listItem(message, indent = 0) {
    const spaces = ' '.repeat(indent * 2);
    console.log(`${spaces}${format('*', colors.cyan)} ${message}`);
  }

  /**
   * Progress indicator
   */
  progress(current, total, message = '') {
    const percentage = Math.round((current / total) * 100);
    const bar = '#'.repeat(Math.floor(percentage / 5));
    const empty = '-'.repeat(20 - Math.floor(percentage / 5));
    console.log(`${format(bar + empty, colors.green)} ${percentage}% ${message}`);
  }

  /**
   * Boxed message
   */
  box(message, type = 'info') {
    const lines = message.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const border = '-'.repeat(maxLength + 4);
    
    let color = colors.blue;
    if (type === 'success') color = colors.green;
    if (type === 'error') color = colors.red;
    if (type === 'warn') color = colors.yellow;
    
    console.log(format('+' + border + '+', color));
    lines.forEach(line => {
      const padding = ' '.repeat(maxLength - line.length);
      console.log(format('|  ' + line + padding + '  |', color));
    });
    console.log(format('+' + border + '+', color));
  }

  /**
   * Ask for confirmation
   */
  async confirm(message) {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(format(`[?] ${message} (y/n): `, colors.yellow), (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }
}

// Export singleton
export default new Logger();
