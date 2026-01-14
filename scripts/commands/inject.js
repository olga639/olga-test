/**
 * Inject Command - 故障注入命令
 * 
 * 功能：
 * - 验证故障类型
 * - 备份原始文件
 * - 加载并应用错误模板
 * - 输出操作结果和下一步指引
 */

import { getFaultConfig } from '../config/faultRegistry.js';
import { createBackup } from '../core/backupManager.js';
import { loadTemplate, applyTemplate } from '../core/templateLoader.js';
import logger from '../core/logger.js';

export default async function inject(args) {
  try {
    // 解析参数
    const typeIndex = args.indexOf('--type');
    if (typeIndex === -1 || !args[typeIndex + 1]) {
      logger.error('缺少参数: --type');
      logger.tip('使用方法: npm run chaos inject --type <fault-type>');
      logger.tip('查看所有故障类型: npm run chaos list');
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
    logger.title(`🔥 故障注入: ${faultConfig.name}`);
    logger.newLine();

    // 显示故障信息
    logger.info(`类别: ${faultConfig.category}`);
    logger.info(`描述: ${faultConfig.description}`);
    logger.info(`严重程度: ${faultConfig.severity}`);
    logger.info(`预期错误: ${faultConfig.expectedError}`);
    logger.newLine();

    // 步骤1: 备份原始文件
    logger.step('步骤 1/3: 备份原始文件...');
    const backup = await createBackup(faultConfig.targetFiles, faultType);
    
    backup.files.forEach(file => {
      logger.success(`已备份: ${file}`);
    });
    logger.newLine();

    // 步骤2: 加载错误模板
    logger.step('步骤 2/3: 加载错误模板...');
    const template = loadTemplate(faultConfig.templateFile);
    logger.success(`已加载模板: ${faultConfig.templateFile}`);
    logger.newLine();

    // 步骤3: 注入错误代码
    logger.step('步骤 3/3: 注入错误代码...');
    
    // 处理主模板
    if (faultConfig.targetFiles.length === 1) {
      // 单文件注入
      applyTemplate(template, faultConfig.targetFiles[0]);
      logger.success(`已注入: ${faultConfig.targetFiles[0]}`);
    } else if (faultConfig.additionalTemplates) {
      // 多文件注入（使用 additionalTemplates）
      for (const targetFile of faultConfig.targetFiles) {
        if (faultConfig.additionalTemplates[targetFile]) {
          // 使用特定的模板
          const specificTemplate = loadTemplate(faultConfig.additionalTemplates[targetFile]);
          applyTemplate(specificTemplate, targetFile);
          logger.success(`已注入: ${targetFile} (使用 ${faultConfig.additionalTemplates[targetFile]})`);
        } else {
          // 使用主模板
          applyTemplate(template, targetFile);
          logger.success(`已注入: ${targetFile}`);
        }
      }
    } else {
      // 多文件使用同一模板
      for (const targetFile of faultConfig.targetFiles) {
        applyTemplate(template, targetFile);
        logger.success(`已注入: ${targetFile}`);
      }
    }
    
    logger.newLine();
    logger.divider();
    logger.newLine();

    // 显示成功消息
    logger.box(`✅ 故障注入成功！\n\n故障类型: ${faultConfig.name}\n修改文件: ${faultConfig.targetFiles.join(', ')}`, 'success');
    logger.newLine();

    // 显示变更摘要
    logger.title('📋 变更摘要');
    logger.listItem(`故障类型: ${faultType}`);
    logger.listItem(`修改文件: ${faultConfig.targetFiles.length} 个`);
    faultConfig.targetFiles.forEach(file => {
      logger.listItem(file, 1);
    });
    logger.listItem(`预期错误: ${faultConfig.expectedError}`);
    logger.listItem(`构建失败: ${faultConfig.buildFails ? '是' : '否'}`);
    logger.listItem(`运行时失败: ${faultConfig.runtimeFails ? '是' : '否'}`);
    logger.newLine();

    // 显示下一步操作
    logger.title('💡 下一步操作');
    logger.newLine();
    logger.log('1️⃣  查看代码变更:');
    logger.code(`   git diff`);
    logger.newLine();
    
    logger.log('2️⃣  提交代码:');
    logger.code(`   git add .`);
    logger.code(`   git commit -m "feat: ${faultConfig.name}"`);
    logger.newLine();
    
    logger.log('3️⃣  推送到远程仓库:');
    logger.code(`   git push origin main`);
    logger.newLine();
    
    logger.log('4️⃣  观察 Vercel 部署结果');
    logger.newLine();
    
    logger.log('5️⃣  恢复正常状态:');
    logger.code(`   npm run chaos restore`);
    logger.newLine();

    // 显示警告信息
    if (faultConfig.buildFails) {
      logger.warn('此故障会导致构建失败，Vercel部署将无法完成');
    }
    
    if (faultConfig.runtimeFails) {
      logger.warn('此故障会导致运行时错误，应用可能无法正常使用');
    }

    logger.newLine();
    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`故障注入失败: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

