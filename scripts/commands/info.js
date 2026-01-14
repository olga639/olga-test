/**
 * Info Command - 信息命令
 * 
 * 功能：
 * - 显示指定故障类型的详细信息
 * - 显示模板内容预览
 * - 显示影响范围
 */

import { getFaultConfig } from '../config/faultRegistry.js';
import { loadTemplate } from '../core/templateLoader.js';
import fileManager from '../core/fileManager.js';
import logger from '../core/logger.js';

export default async function info(args) {
  try {
    // 解析参数
    const typeIndex = args.indexOf('--type');
    if (typeIndex === -1 || !args[typeIndex + 1]) {
      logger.error('缺少参数: --type');
      logger.tip('使用方法: npm run chaos info --type <fault-type>');
      process.exit(1);
    }

    const faultType = args[typeIndex + 1];

    // 验证故障类型
    const faultConfig = getFaultConfig(faultType);
    if (!faultConfig) {
      logger.error(`故障类型不存在: ${faultType}`);
      logger.tip('使用 "npm run chaos list" 查看所有可用的故障类型');
      process.exit(1);
    }

    logger.newLine();
    logger.title(`📖 故障详情: ${faultConfig.name}`);
    logger.newLine();

    // 基本信息
    logger.log('🏷️  基本信息');
    logger.listItem(`类型ID: ${faultType}`);
    logger.listItem(`名称: ${faultConfig.name}`);
    logger.listItem(`分类: ${faultConfig.category}`);
    logger.listItem(`严重程度: ${faultConfig.severity}`);
    logger.newLine();

    // 描述
    logger.log('📝 描述');
    logger.listItem(faultConfig.description);
    logger.newLine();

    // 影响范围
    logger.log('🎯 影响范围');
    logger.listItem(`目标文件: ${faultConfig.targetFiles.length} 个`);
    faultConfig.targetFiles.forEach(file => {
      logger.listItem(file, 1);
    });
    logger.newLine();

    // 预期结果
    logger.log('⚠️  预期结果');
    logger.listItem(`预期错误: ${faultConfig.expectedError}`);
    logger.listItem(`构建失败: ${faultConfig.buildFails ? '是 ❌' : '否 ✅'}`);
    logger.listItem(`运行时失败: ${faultConfig.runtimeFails ? '是 ❌' : '否 ✅'}`);
    logger.newLine();

    // 模板信息
    logger.log('📄 模板信息');
    logger.listItem(`模板文件: ${faultConfig.templateFile}`);
    
    if (fileManager.fileExists(faultConfig.templateFile)) {
      logger.listItem('模板状态: 存在 ✅');
      
      // 加载并显示模板预览
      try {
        const template = loadTemplate(faultConfig.templateFile);
        const lines = template.content.split('\n');
        const previewLines = lines.slice(0, 15);
        
        logger.newLine();
        logger.log('📋 模板预览 (前15行):');
        logger.divider();
        previewLines.forEach((line, index) => {
          logger.code(`${(index + 1).toString().padStart(3, ' ')} | ${line}`);
        });
        if (lines.length > 15) {
          logger.code('... (更多内容请查看模板文件)');
        }
        logger.divider();
      } catch (error) {
        logger.listItem(`模板加载失败: ${error.message}`, 1);
      }
    } else {
      logger.listItem('模板状态: 不存在 ❌');
    }
    logger.newLine();

    // 使用说明
    logger.title('💡 使用说明');
    logger.newLine();
    
    logger.log('1️⃣  注入此故障:');
    logger.code(`   npm run chaos inject --type ${faultType}`);
    logger.newLine();
    
    logger.log('2️⃣  提交并推送代码');
    logger.newLine();
    
    logger.log('3️⃣  观察部署结果');
    logger.newLine();
    
    logger.log('4️⃣  恢复正常:');
    logger.code(`   npm run chaos restore`);
    logger.newLine();

    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`获取故障信息失败: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

