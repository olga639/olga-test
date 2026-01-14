/**
 * Template Loader - 模板加载器
 * 
 * 负责加载和处理错误代码模板
 */

import fileManager from './fileManager.js';
import logger from './logger.js';

/**
 * 加载模板
 */
export function loadTemplate(templatePath) {
  try {
    if (!fileManager.fileExists(templatePath)) {
      throw new Error(`模板文件不存在: ${templatePath}`);
    }
    
    const content = fileManager.readFile(templatePath);
    
    // 解析模板元数据（从注释中提取）
    const metadata = parseMetadata(content);
    
    return {
      content,
      metadata,
      path: templatePath
    };
  } catch (error) {
    throw new Error(`加载模板失败: ${error.message}`);
  }
}

/**
 * 解析模板元数据
 */
function parseMetadata(content) {
  const metadata = {
    faultType: null,
    category: null,
    description: null,
    expectedError: null,
    targetFile: null
  };
  
  // 匹配注释中的元数据
  const metaRegex = /@(\w+):\s*(.+)/g;
  let match;
  
  while ((match = metaRegex.exec(content)) !== null) {
    const key = match[1].replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    metadata[key] = match[2].trim();
  }
  
  return metadata;
}

/**
 * 应用模板到目标文件
 */
export function applyTemplate(template, targetFile) {
  try {
    // 直接写入模板内容到目标文件
    fileManager.writeFile(targetFile, template.content);
    
    return {
      file: targetFile,
      success: true
    };
  } catch (error) {
    throw new Error(`应用模板失败: ${error.message}`);
  }
}

/**
 * 验证模板
 */
export function validateTemplate(templatePath) {
  try {
    const template = loadTemplate(templatePath);
    
    const errors = [];
    
    // 检查必要的元数据
    if (!template.metadata.faultType) {
      errors.push('缺少 @fault-type 元数据');
    }
    
    if (!template.metadata.category) {
      errors.push('缺少 @category 元数据');
    }
    
    if (!template.metadata.description) {
      errors.push('缺少 @description 元数据');
    }
    
    // 检查内容是否为空
    if (!template.content || template.content.trim().length === 0) {
      errors.push('模板内容为空');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      template
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error.message],
      template: null
    };
  }
}

/**
 * 列出所有模板
 */
export function listTemplates() {
  const templatesDir = 'chaos-templates';
  
  if (!fileManager.fileExists(templatesDir)) {
    return [];
  }
  
  const templates = [];
  const files = fileManager.listFiles(templatesDir, true);
  
  files.forEach(file => {
    if (file.endsWith('.template.jsx') || 
        file.endsWith('.template.js') || 
        file.endsWith('.template.json')) {
      try {
        const template = loadTemplate(file);
        templates.push({
          path: file,
          metadata: template.metadata
        });
      } catch (error) {
        logger.warn(`无法加载模板 ${file}: ${error.message}`);
      }
    }
  });
  
  return templates;
}

export default {
  loadTemplate,
  applyTemplate,
  validateTemplate,
  listTemplates
};

