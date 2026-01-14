/**
 * Backup Manager - 备份管理器
 * 
 * 负责文件备份和恢复
 */

import path from 'path';
import fileManager from './fileManager.js';
import logger from './logger.js';

// 备份目录
const BACKUP_DIR = '.chaos-backup';
const METADATA_FILE = path.join(BACKUP_DIR, 'metadata.json');

/**
 * 创建备份
 */
export async function createBackup(files, faultType) {
  try {
    // 确保备份目录存在
    fileManager.createDirectory(BACKUP_DIR);
    
    // 生成备份ID（时间戳）
    const backupId = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, backupId);
    
    // 备份文件
    const backedUpFiles = [];
    const fileHashes = {};
    
    for (const file of files) {
      if (!fileManager.fileExists(file)) {
        logger.warn(`文件不存在，跳过备份: ${file}`);
        continue;
      }
      
      const backupFilePath = path.join(backupPath, file);
      fileManager.copyFile(file, backupFilePath);
      
      backedUpFiles.push(file);
      fileHashes[file] = fileManager.getFileHash(file);
    }
    
    // 保存备份元数据
    const metadata = {
      backupId,
      timestamp: new Date().toISOString(),
      faultType,
      files: backedUpFiles,
      fileHashes
    };
    
    fileManager.writeJSON(METADATA_FILE, metadata);
    
    return {
      backupId,
      files: backedUpFiles,
      path: backupPath
    };
  } catch (error) {
    throw new Error(`创建备份失败: ${error.message}`);
  }
}

/**
 * 恢复备份
 */
export async function restoreBackup() {
  try {
    // 检查备份是否存在
    if (!hasBackup()) {
      throw new Error('未找到备份文件');
    }
    
    // 读取备份元数据
    const metadata = fileManager.readJSON(METADATA_FILE);
    const backupPath = path.join(BACKUP_DIR, metadata.backupId);
    
    // 恢复文件
    const restoredFiles = [];
    
    for (const file of metadata.files) {
      const backupFilePath = path.join(backupPath, file);
      
      if (!fileManager.fileExists(backupFilePath)) {
        logger.warn(`备份文件不存在，跳过恢复: ${file}`);
        continue;
      }
      
      fileManager.copyFile(backupFilePath, file);
      restoredFiles.push(file);
    }
    
    return {
      files: restoredFiles,
      faultType: metadata.faultType,
      timestamp: metadata.timestamp
    };
  } catch (error) {
    throw new Error(`恢复备份失败: ${error.message}`);
  }
}

/**
 * 清理备份
 */
export async function cleanBackup() {
  try {
    if (fileManager.fileExists(BACKUP_DIR)) {
      fileManager.deleteDirectory(BACKUP_DIR);
    }
  } catch (error) {
    throw new Error(`清理备份失败: ${error.message}`);
  }
}

/**
 * 检查备份是否存在
 */
export function hasBackup() {
  return fileManager.fileExists(METADATA_FILE);
}

/**
 * 获取备份信息
 */
export function getBackupInfo() {
  if (!hasBackup()) {
    return null;
  }
  
  try {
    return fileManager.readJSON(METADATA_FILE);
  } catch (error) {
    return null;
  }
}

/**
 * 列出所有备份
 */
export function listBackups() {
  if (!fileManager.fileExists(BACKUP_DIR)) {
    return [];
  }
  
  const backups = [];
  const items = fileManager.listFiles(BACKUP_DIR);
  
  items.forEach(item => {
    if (item.endsWith('metadata.json')) {
      return;
    }
    
    const info = fileManager.getFileInfo(item);
    if (info && info.isDirectory) {
      backups.push({
        id: path.basename(item),
        path: item,
        created: info.created
      });
    }
  });
  
  return backups;
}

export default {
  createBackup,
  restoreBackup,
  cleanBackup,
  hasBackup,
  getBackupInfo,
  listBackups
};

