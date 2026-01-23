/**
 * File Manager - File Manager
 * 
 * Provides file read, write, copy and other operations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory
export const PROJECT_ROOT = path.resolve(__dirname, '../..');

/**
 * Read file content
 */
export function readFile(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Write file content
 */
export function writeFile(filePath, content) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  
  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf-8');
}

/**
 * Copy file
 */
export function copyFile(source, dest) {
  const sourcePath = path.isAbsolute(source) ? source : path.join(PROJECT_ROOT, source);
  const destPath = path.isAbsolute(dest) ? dest : path.join(PROJECT_ROOT, dest);
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file does not exist: ${source}`);
  }
  
  // Ensure destination directory exists
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.copyFileSync(sourcePath, destPath);
}

/**
 * Delete file
 */
export function deleteFile(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

/**
 * Check if file exists
 */
export function fileExists(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  return fs.existsSync(fullPath);
}

/**
 * Create directory
 */
export function createDirectory(dirPath) {
  const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(PROJECT_ROOT, dirPath);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

/**
 * Delete directory
 */
export function deleteDirectory(dirPath) {
  const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(PROJECT_ROOT, dirPath);
  
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

/**
 * List files in directory
 */
export function listFiles(dirPath, recursive = false) {
  const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(PROJECT_ROOT, dirPath);
  
  if (!fs.existsSync(fullPath)) {
    return [];
  }
  
  const files = [];
  const items = fs.readdirSync(fullPath);
  
  items.forEach(item => {
    const itemPath = path.join(fullPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isFile()) {
      files.push(path.relative(PROJECT_ROOT, itemPath));
    } else if (stat.isDirectory() && recursive) {
      files.push(...listFiles(itemPath, true));
    }
  });
  
  return files;
}

/**
 * Get file information
 */
export function getFileInfo(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const stat = fs.statSync(fullPath);
  
  return {
    path: filePath,
    fullPath,
    size: stat.size,
    created: stat.birthtime,
    modified: stat.mtime,
    isFile: stat.isFile(),
    isDirectory: stat.isDirectory()
  };
}

/**
 * Calculate file hash (simple version)
 */
export function getFileHash(filePath) {
  const content = readFile(filePath);
  let hash = 0;
  
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(36);
}

/**
 * Read JSON file
 */
export function readJSON(filePath) {
  const content = readFile(filePath);
  return JSON.parse(content);
}

/**
 * Write JSON file
 */
export function writeJSON(filePath, data, pretty = true) {
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  writeFile(filePath, content);
}

export default {
  PROJECT_ROOT,
  readFile,
  writeFile,
  copyFile,
  deleteFile,
  fileExists,
  createDirectory,
  deleteDirectory,
  listFiles,
  getFileInfo,
  getFileHash,
  readJSON,
  writeJSON
};
