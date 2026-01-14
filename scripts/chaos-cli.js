#!/usr/bin/env node

/**
 * Chaos Engineering CLI - 混沌工程命令行工具
 * 
 * 功能：
 * - 注入故障代码
 * - 恢复正常状态
 * - 列出所有故障类型
 * - 查看故障详情
 * 
 * 使用方法：
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

// 导入命令处理器
const commandsDir = join(__dirname, 'commands');

// 解析命令行参数
const args = process.argv.slice(2);
const command = args[0];

// 命令映射
const commands = {
  inject: 'inject.js',
  restore: 'restore.js',
  list: 'list.js',
  info: 'info.js',
  help: 'help.js'
};

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║         Chaos Engineering CLI - 混沌工程命令行工具          ║
╚══════════════════════════════════════════════════════════════╝

使用方法:
  npm run chaos <command> [options]

可用命令:
  inject    注入故障代码
  restore   恢复正常状态
  list      列出所有故障类型
  info      查看故障详情
  help      显示帮助信息

示例:
  npm run chaos inject --type component-crash
  npm run chaos restore
  npm run chaos list
  npm run chaos info --type component-crash

更多信息请查看文档: docs/CLI_USAGE.md
`);
}

/**
 * 主函数
 */
async function main() {
  // 如果没有命令或命令是help，显示帮助
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  // 检查命令是否存在
  if (!commands[command]) {
    console.error(`\n❌ 错误: 未知命令 "${command}"\n`);
    console.log('💡 使用 "npm run chaos help" 查看可用命令\n');
    process.exit(1);
  }

  // 动态导入并执行命令
  try {
    const commandPath = join(commandsDir, commands[command]);
    
    if (!existsSync(commandPath)) {
      console.error(`\n❌ 错误: 命令文件不存在 ${commandPath}\n`);
      process.exit(1);
    }

    const commandModule = await import(commandPath);
    const commandHandler = commandModule.default || commandModule;
    
    if (typeof commandHandler !== 'function') {
      console.error(`\n❌ 错误: 命令处理器无效\n`);
      process.exit(1);
    }

    // 执行命令
    await commandHandler(args.slice(1));
  } catch (error) {
    console.error(`\n❌ 执行命令时发生错误:\n`);
    console.error(error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// 执行主函数
main().catch((error) => {
  console.error('\n❌ 未捕获的错误:\n');
  console.error(error);
  process.exit(1);
});

