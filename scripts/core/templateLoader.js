/**
 * Template Loader - Template Loader
 * 
 * Responsible for loading and processing error code templates
 */

import fileManager from './fileManager.js';
import logger from './logger.js';

/**
 * Load template
 */
export function loadTemplate(templatePath) {
  try {
    if (!fileManager.fileExists(templatePath)) {
      throw new Error(`Template file does not exist: ${templatePath}`);
    }
    
    const content = fileManager.readFile(templatePath);
    
    // Parse template metadata (extract from comments)
    const metadata = parseMetadata(content);
    
    return {
      content,
      metadata,
      path: templatePath
    };
  } catch (error) {
    throw new Error(`Failed to load template: ${error.message}`);
  }
}

/**
 * Parse template metadata
 */
function parseMetadata(content) {
  const metadata = {
    faultType: null,
    category: null,
    description: null,
    expectedError: null,
    targetFile: null
  };
  
  // Match metadata in comments
  const metaRegex = /@(\w+):\s*(.+)/g;
  let match;
  
  while ((match = metaRegex.exec(content)) !== null) {
    const key = match[1].replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    metadata[key] = match[2].trim();
  }
  
  return metadata;
}

/**
 * Apply template to target file
 */
export function applyTemplate(template, targetFile) {
  try {
    // Write template content directly to target file
    fileManager.writeFile(targetFile, template.content);
    
    return {
      file: targetFile,
      success: true
    };
  } catch (error) {
    throw new Error(`Failed to apply template: ${error.message}`);
  }
}

/**
 * Validate template
 */
export function validateTemplate(templatePath) {
  try {
    const template = loadTemplate(templatePath);
    
    const errors = [];
    
    // Check required metadata
    if (!template.metadata.faultType) {
      errors.push('Missing @fault-type metadata');
    }
    
    if (!template.metadata.category) {
      errors.push('Missing @category metadata');
    }
    
    if (!template.metadata.description) {
      errors.push('Missing @description metadata');
    }
    
    // Check if content is empty
    if (!template.content || template.content.trim().length === 0) {
      errors.push('Template content is empty');
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
 * List all templates
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
        logger.warn(`Cannot load template ${file}: ${error.message}`);
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
