/**
 * Logger - 日志输出工具
 * 
 * 提供彩色的控制台输出
 */

// ANSI颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // 前景色
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // 背景色
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

/**
 * 格式化文本
 */
function format(text, color, bold = false) {
  const style = bold ? colors.bright : '';
  return `${style}${color}${text}${colors.reset}`;
}

/**
 * Logger类
 */
class Logger {
  /**
   * 成功消息
   */
  success(message) {
    console.log(format('✅ ' + message, colors.green, true));
  }

  /**
   * 错误消息
   */
  error(message) {
    console.error(format('❌ ' + message, colors.red, true));
  }

  /**
   * 警告消息
   */
  warn(message) {
    console.warn(format('⚠️  ' + message, colors.yellow, true));
  }

  /**
   * 信息消息
   */
  info(message) {
    console.log(format('ℹ️  ' + message, colors.blue));
  }

  /**
   * 提示消息
   */
  tip(message) {
    console.log(format('💡 ' + message, colors.cyan));
  }

  /**
   * 步骤消息
   */
  step(message) {
    console.log(format('🔹 ' + message, colors.magenta));
  }

  /**
   * 普通日志
   */
  log(message) {
    console.log(message);
  }

  /**
   * 标题
   */
  title(message) {
    console.log('\n' + format(message, colors.cyan, true));
    console.log(format('─'.repeat(message.length), colors.cyan));
  }

  /**
   * 分隔线
   */
  divider() {
    console.log(format('─'.repeat(60), colors.dim));
  }

  /**
   * 空行
   */
  newLine() {
    console.log('');
  }

  /**
   * 表格
   */
  table(data) {
    console.table(data);
  }

  /**
   * 代码块
   */
  code(code) {
    console.log(format(code, colors.dim));
  }

  /**
   * 列表项
   */
  listItem(message, indent = 0) {
    const spaces = ' '.repeat(indent * 2);
    console.log(`${spaces}${format('•', colors.cyan)} ${message}`);
  }

  /**
   * 进度指示
   */
  progress(current, total, message = '') {
    const percentage = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 5));
    const empty = '░'.repeat(20 - Math.floor(percentage / 5));
    console.log(`${format(bar + empty, colors.green)} ${percentage}% ${message}`);
  }

  /**
   * 带框的消息
   */
  box(message, type = 'info') {
    const lines = message.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    const border = '─'.repeat(maxLength + 4);
    
    let color = colors.blue;
    if (type === 'success') color = colors.green;
    if (type === 'error') color = colors.red;
    if (type === 'warn') color = colors.yellow;
    
    console.log(format('╭' + border + '╮', color));
    lines.forEach(line => {
      const padding = ' '.repeat(maxLength - line.length);
      console.log(format('│  ' + line + padding + '  │', color));
    });
    console.log(format('╰' + border + '╯', color));
  }

  /**
   * 询问确认
   */
  async confirm(message) {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(format(`❓ ${message} (y/n): `, colors.yellow), (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
      });
    });
  }
}

// 导出单例
export default new Logger();

