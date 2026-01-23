/**
 * Fault Registry - Fault Type Registry
 * 
 * Defines all supported fault types and their configuration information
 * 
 * IMPORTANT: This registry only contains error types that cause startup failures
 * i.e.: Build phase failures, errors that prevent successful deployment
 */

export const faultRegistry = {
  // ==================== Build Errors - Syntax and Compilation Errors ====================
  
  'syntax-error': {
    name: 'JSX Syntax Error',
    category: 'build-errors',
    description: 'JSX syntax error, missing closing tag causes compilation failure',
    targetFiles: ['src/pages/Home.jsx'],
    templateFile: 'chaos-templates/build-errors/syntax-error.template.jsx',
    expectedError: 'Unexpected token',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'import-error': {
    name: 'Import Path Error',
    category: 'build-errors',
    description: 'Wrong import path causes module not found, compilation fails',
    targetFiles: ['src/App.jsx'],
    templateFile: 'chaos-templates/build-errors/import-error.template.jsx',
    expectedError: 'Cannot find module',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'typescript-error': {
    name: 'TypeScript Type Error',
    category: 'build-errors',
    description: 'Type definition error causes TypeScript compilation failure (if using TS)',
    targetFiles: ['src/App.jsx'],
    templateFile: 'chaos-templates/build-errors/typescript-error.template.jsx',
    expectedError: 'Type error',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'undefined-variable': {
    name: 'Undefined Variable',
    category: 'build-errors',
    description: 'Using undefined variable or function causes compilation failure',
    targetFiles: ['src/pages/TaskListPage.jsx'],
    templateFile: 'chaos-templates/build-errors/undefined-variable.template.jsx',
    expectedError: 'is not defined',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  // ==================== Build Errors - Dependency and Configuration Errors ====================

  'dependency-missing': {
    name: 'Missing Dependency',
    category: 'build-errors',
    description: 'Missing required dependency in package.json, npm install fails',
    targetFiles: ['package.json'],
    templateFile: 'chaos-templates/build-errors/dependency-missing.template.json',
    expectedError: 'Cannot find package',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'dependency-version-conflict': {
    name: 'Dependency Version Conflict',
    category: 'build-errors',
    description: 'Incompatible dependency versions cause installation or compilation failure',
    targetFiles: ['package.json'],
    templateFile: 'chaos-templates/build-errors/dependency-version-conflict.template.json',
    expectedError: 'ERESOLVE unable to resolve dependency tree',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  'env-variable-missing': {
    name: 'Missing Environment Variable',
    category: 'build-errors',
    description: 'Required environment variable missing during build, causes build failure',
    targetFiles: ['vite.config.js'],
    templateFile: 'chaos-templates/build-errors/env-variable-missing.template.js',
    expectedError: 'Environment variable is not defined',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  },

  'vite-config-error': {
    name: 'Vite Config Error',
    category: 'build-errors',
    description: 'vite.config.js configuration error, build tool cannot start',
    targetFiles: ['vite.config.js'],
    templateFile: 'chaos-templates/build-errors/vite-config-error.template.js',
    expectedError: 'Invalid configuration',
    severity: 'high',
    buildFails: true,
    deployFails: true
  },

  // ==================== Build Errors - Resource and Bundling Errors ====================

  'css-syntax-error': {
    name: 'CSS Syntax Error',
    category: 'build-errors',
    description: 'CSS or TailwindCSS configuration error causes style compilation failure',
    targetFiles: ['src/styles/index.css'],
    templateFile: 'chaos-templates/build-errors/css-syntax-error.template.css',
    expectedError: 'CssSyntaxError',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  },

  'circular-dependency': {
    name: 'Circular Dependency',
    category: 'build-errors',
    description: 'Circular dependency between modules causes build failure or infinite loop',
    targetFiles: ['src/utils/helpers.js', 'src/utils/validators.js', 'src/App.jsx', 'vite.config.js'],
    templateFile: 'chaos-templates/build-errors/circular-dependency.template.jsx',
    additionalTemplates: {
      'src/utils/validators.js': 'chaos-templates/build-errors/circular-dependency-validators.template.js',
      'src/App.jsx': 'chaos-templates/build-errors/circular-dependency-app.template.jsx',
      'vite.config.js': 'chaos-templates/build-errors/circular-dependency-vite.template.js'
    },
    expectedError: 'Circular dependency detected',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  },

  'build-out-of-memory': {
    name: 'Build Out of Memory',
    category: 'build-errors',
    description: 'Insufficient memory during build process causes build failure',
    targetFiles: ['src/utils/largeData.js', 'src/App.jsx'],
    templateFile: 'chaos-templates/build-errors/build-out-of-memory.template.js',
    additionalTemplates: {
      'src/App.jsx': 'chaos-templates/build-errors/build-out-of-memory-app.template.jsx'
    },
    expectedError: 'JavaScript heap out of memory',
    severity: 'high',
    buildFails: true,
    deployFails: true,
    note: 'WARNING: This fault requires creating large data file and importing in App.jsx'
  },

  'asset-size-exceeded': {
    name: 'Asset Size Exceeded',
    category: 'build-errors',
    description: 'Bundled file exceeds size limit, causes deployment failure',
    targetFiles: ['src/pages/Home.jsx'],
    templateFile: 'chaos-templates/build-errors/asset-size-exceeded.template.jsx',
    expectedError: 'Asset exceeds size limit',
    severity: 'medium',
    buildFails: true,
    deployFails: true
  }
};

/**
 * Get all fault types
 */
export function getAllFaults() {
  return Object.keys(faultRegistry);
}

/**
 * Get fault config by type
 */
export function getFaultConfig(type) {
  return faultRegistry[type];
}

/**
 * Get faults by category
 */
export function getFaultsByCategory() {
  const categories = {
    'build-errors': []
  };

  Object.entries(faultRegistry).forEach(([type, config]) => {
    if (categories[config.category]) {
      categories[config.category].push({ type, ...config });
    }
  });

  return categories;
}

/**
 * Get fault statistics
 */
export function getFaultStats() {
  const stats = {
    total: 0,
    byCategory: {},
    bySeverity: {
      high: 0,
      medium: 0,
      low: 0
    }
  };

  Object.values(faultRegistry).forEach((config) => {
    stats.total++;
    stats.byCategory[config.category] = (stats.byCategory[config.category] || 0) + 1;
    stats.bySeverity[config.severity]++;
  });

  return stats;
}

export default faultRegistry;
