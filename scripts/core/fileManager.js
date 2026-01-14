/**
 * File Manager - 文件管理器
 * 
 * 提供文件读写、复制等操作
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
export const PROJECT_ROOT = path.resolve(__dirname, '../..');

/**
 * 读取文件内容
 */
export function readFile(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }
  
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * 写入文件内容
 */
export function writeFile(filePath, content) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  
  // 确保目录存在
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf-8');
}

/**
 * 复制文件
 */
export function copyFile(source, dest) {
  const sourcePath = path.isAbsolute(source) ? source : path.join(PROJECT_ROOT, source);
  const destPath = path.isAbsolute(dest) ? dest : path.join(PROJECT_ROOT, dest);
  
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`源文件不存在: ${source}`);
  }
  
  // 确保目标目录存在
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  fs.copyFileSync(sourcePath, destPath);
}

/**
 * 删除文件
 */
export function deleteFile(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

/**
 * 检查文件是否存在
 */
export function fileExists(filePath) {
  const fullPath = path.isAbsolute(filePath) ? filePath : path.join(PROJECT_ROOT, filePath);
  return fs.existsSync(fullPath);
}

/**
 * 创建目录
 */
export function createDirectory(dirPath) {
  const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(PROJECT_ROOT, dirPath);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

/**
 * 删除目录
 */
export function deleteDirectory(dirPath) {
  const fullPath = path.isAbsolute(dirPath) ? dirPath : path.join(PROJECT_ROOT, dirPath);
  
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

/**
 * 列出目录中的文件
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
 * 获取文件信息
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
 * 计算文件哈希（简单版本）
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
 * 读取JSON文件
 */
export function readJSON(filePath) {
  const content = readFile(filePath);
  return JSON.parse(content);
}

/**
 * 写入JSON文件
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

