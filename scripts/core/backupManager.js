/**
 * Backup Manager - Backup Manager
 * 
 * Responsible for file backup and restoration
 */

import path from 'path';
import fileManager from './fileManager.js';
import logger from './logger.js';

// Backup directory
const BACKUP_DIR = '.chaos-backup';
const METADATA_FILE = path.join(BACKUP_DIR, 'metadata.json');

/**
 * Create backup
 */
export async function createBackup(files, faultType) {
  try {
    // Ensure backup directory exists
    fileManager.createDirectory(BACKUP_DIR);
    
    // Generate backup ID (timestamp)
    const backupId = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, backupId);
    
    // Backup files
    const backedUpFiles = [];
    const missingFiles = [];
    const fileHashes = {};
    
    for (const file of files) {
      if (!fileManager.fileExists(file)) {
        logger.warn(`File does not exist, skipping backup: ${file}`);
        missingFiles.push(file);
        continue;
      }
      
      const backupFilePath = path.join(backupPath, file);
      fileManager.copyFile(file, backupFilePath);
      
      backedUpFiles.push(file);
      fileHashes[file] = fileManager.getFileHash(file);
    }
    
    // Save backup metadata
    const metadata = {
      backupId,
      timestamp: new Date().toISOString(),
      faultType,
      files: backedUpFiles,
      missingFiles,
      fileHashes
    };
    
    fileManager.writeJSON(METADATA_FILE, metadata);
    
    return {
      backupId,
      files: backedUpFiles,
      path: backupPath
    };
  } catch (error) {
    throw new Error(`Failed to create backup: ${error.message}`);
  }
}

/**
 * Restore backup
 */
export async function restoreBackup() {
  try {
    // Check if backup exists
    if (!hasBackup()) {
      throw new Error('No backup files found');
    }
    
    // Read backup metadata
    const metadata = fileManager.readJSON(METADATA_FILE);
    const backupPath = path.join(BACKUP_DIR, metadata.backupId);
    
    // Restore files
    const restoredFiles = [];
    const removedFiles = [];
    
    for (const file of metadata.files) {
      const backupFilePath = path.join(backupPath, file);
      
      if (!fileManager.fileExists(backupFilePath)) {
        logger.warn(`Backup file does not exist, skipping restore: ${file}`);
        continue;
      }
      
      fileManager.copyFile(backupFilePath, file);
      restoredFiles.push(file);
    }

    if (metadata.missingFiles && metadata.missingFiles.length > 0) {
      for (const file of metadata.missingFiles) {
        if (fileManager.fileExists(file)) {
          fileManager.deleteFile(file);
          removedFiles.push(file);
        }
      }
    }
    
    return {
      files: restoredFiles,
      removedFiles,
      faultType: metadata.faultType,
      timestamp: metadata.timestamp
    };
  } catch (error) {
    throw new Error(`Failed to restore backup: ${error.message}`);
  }
}

/**
 * Clean backup
 */
export async function cleanBackup() {
  try {
    if (fileManager.fileExists(BACKUP_DIR)) {
      fileManager.deleteDirectory(BACKUP_DIR);
    }
  } catch (error) {
    throw new Error(`Failed to clean backup: ${error.message}`);
  }
}

/**
 * Check if backup exists
 */
export function hasBackup() {
  return fileManager.fileExists(METADATA_FILE);
}

/**
 * Get backup information
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
 * List all backups
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
