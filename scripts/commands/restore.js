/**
 * Restore Command - 恢复命令
 * 
 * 功能：
 * - 检查备份是否存在
 * - 恢复备份文件
 * - 清理备份目录
 * - 输出操作结果
 */

import { hasBackup, getBackupInfo, restoreBackup, cleanBackup } from '../core/backupManager.js';
import logger from '../core/logger.js';

export default async function restore(args) {
  try {
    logger.newLine();
    logger.title('🔄 恢复正常状态');
    logger.newLine();

    // 检查备份是否存在
    if (!hasBackup()) {
      logger.warn('未找到备份文件');
      logger.tip('请先使用 "npm run chaos inject" 注入故障');
      logger.newLine();
      process.exit(0);
    }

    // 获取备份信息
    const backupInfo = getBackupInfo();
    
    logger.info(`备份时间: ${new Date(backupInfo.timestamp).toLocaleString('zh-CN')}`);
    logger.info(`故障类型: ${backupInfo.faultType}`);
    logger.info(`备份文件: ${backupInfo.files.length} 个`);
    logger.newLine();

    // 询问确认
    logger.warn('此操作将覆盖当前的修改，确定要继续吗？');
    logger.tip('如果您已经手动修改了代码，建议先提交或备份');
    logger.newLine();

    const confirmed = await logger.confirm('确定要恢复备份吗？');
    
    if (!confirmed) {
      logger.info('操作已取消');
      logger.newLine();
      process.exit(0);
    }

    logger.newLine();

    // 步骤1: 恢复文件
    logger.step('步骤 1/2: 恢复备份文件...');
    const result = await restoreBackup();
    
    result.files.forEach(file => {
      logger.success(`已恢复: ${file}`);
    });

    if (result.removedFiles && result.removedFiles.length > 0) {
      result.removedFiles.forEach(file => {
        logger.success(`已删除: ${file}`);
      });
    }
    logger.newLine();

    // 步骤2: 清理备份
    logger.step('步骤 2/2: 清理备份目录...');
    await cleanBackup();
    logger.success('备份已清理');
    logger.newLine();

    logger.divider();
    logger.newLine();

    // 显示成功消息
    logger.box(`✅ 已恢复正常状态！\n\n恢复文件: ${result.files.length} 个\n故障类型: ${result.faultType}`, 'success');
    logger.newLine();

    // 显示下一步操作
    logger.title('💡 下一步操作');
    logger.newLine();
    
    logger.log('1️⃣  查看恢复的变更:');
    logger.code(`   git diff`);
    logger.newLine();
    
    logger.log('2️⃣  提交修复:');
    logger.code(`   git add .`);
    logger.code(`   git commit -m "fix: 修复故障，恢复正常"`);
    logger.newLine();
    
    logger.log('3️⃣  推送到远程仓库:');
    logger.code(`   git push origin main`);
    logger.newLine();
    
    logger.log('4️⃣  验证 Vercel 部署成功');
    logger.newLine();

    logger.divider();
    logger.newLine();

  } catch (error) {
    logger.newLine();
    logger.error(`恢复失败: ${error.message}`);
    logger.newLine();
    
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

