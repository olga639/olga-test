/**
 * List Command - 列表命令
 * 
 * 功能：
 * - 列出所有可用的故障类型
 * - 按分类显示
 * - 显示统计信息
 */

import { getFaultsByCategory, getFaultStats } from '../config/faultRegistry.js';
import logger from '../core/logger.js';

export default async function list(args) {
  try {
    logger.newLine();
    logger.title('📋 可用的故障类型');
    logger.newLine();

    // 获取故障列表和统计
    const faultsByCategory = getFaultsByCategory();
    const stats = getFaultStats();

    // 显示统计信息
    logger.info(`总计: ${stats.total} 种故障类型`);
    logger.newLine();

    // 分类显示
    const categoryNames = {
      'build-errors': '🔨 构建错误',
      'runtime-errors': '⚡ 运行时错误',
      'resource-errors': '📦 资源加载错误',
      'performance-issues': '🐌 性能问题'
    };

    const severityColors = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };

    Object.entries(faultsByCategory).forEach(([category, faults]) => {
      if (faults.length === 0) return;

      logger.title(categoryNames[category] || category);
      logger.newLine();

      faults.forEach((fault, index) => {
        const severityIcon = severityColors[fault.severity] || '⚪';
        logger.log(`  ${index + 1}. ${severityIcon} ${fault.type}`);
        logger.log(`     名称: ${fault.name}`);
        logger.log(`     描述: ${fault.description}`);
        logger.log(`     严重程度: ${fault.severity}`);
        logger.log(`     构建失败: ${fault.buildFails ? '是' : '否'}`);
        logger.log(`     运行时失败: ${fault.runtimeFails ? '是' : '否'}`);
        logger.newLine();
      });
    });

    logger.divider();
    logger.newLine();

    // 显示使用说明
    logger.title('💡 使用方法');
    logger.newLine();
    
    logger.log('注入故障:');
    logger.code('  npm run chaos inject --type <fault-type>');
    logger.newLine();
    
    logger.log('查看故障详情:');
    logger.code('  npm run chaos info --type <fault-type>');
    logger.newLine();
    
    logger.log('示例:');
    logger.code('  npm run chaos inject --type component-crash');
    logger.newLine();

    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`列出故障类型失败: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

