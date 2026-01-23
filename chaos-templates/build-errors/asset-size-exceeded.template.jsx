/**
 * @fault-type: asset-size-exceeded
 * @category: build-errors
 * @description: Bundled file exceeds size limit
 * @expected-error: Asset exceeds recommended size limit
 * @target-file: src/utils/heavyAssets.js
 * @severity: medium
 */

// FAULT INJECTION: Asset size exceeded
// Error Type: Single file bundle exceeds size limit
// Expected Result: Vite warning or build failure

/**
 * Oversized static data
 * This causes the bundled file to be too large
 */

// ERROR: Contains oversized Base64 image data
export const LARGE_IMAGE_DATA = `data:image/png;base64,${'A'.repeat(5000000)}`;

// ERROR: Contains large amounts of static configuration data
export const MASSIVE_CONFIG = {
  // Generate 10000 config items
  ...Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `config_${i}`,
      {
        id: i,
        name: `Configuration ${i}`,
        description: `This is a very detailed description for configuration ${i}`.repeat(50),
        settings: Object.fromEntries(
          Array(100).fill(0).map((_, j) => [`setting_${j}`, `value_${i}_${j}`])
        ),
        metadata: {
          created: new Date().toISOString(),
          tags: Array(100).fill(`tag-${i}`),
          permissions: Array(100).fill(`permission-${i}`),
        },
      },
    ])
  ),
};

// ERROR: Contains large amounts of translation data
export const TRANSLATIONS = {
  en: Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `key_${i}`,
      `This is translation ${i} in English with a very long text`.repeat(20),
    ])
  ),
  zh: Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `key_${i}`,
      `This is translation ${i} in Chinese with very long text`.repeat(20),
    ])
  ),
  ja: Object.fromEntries(
    Array(10000).fill(0).map((_, i) => [
      `key_${i}`,
      `This is translation ${i} in Japanese with very long text`.repeat(20),
    ])
  ),
};

// ERROR: Contains large amounts of mock data
export const MOCK_DATA = Array(50000).fill(0).map((_, i) => ({
  id: i,
  title: `Item ${i}`,
  description: `This is a detailed description for item ${i}`.repeat(30),
  content: `This is the main content for item ${i}`.repeat(100),
  metadata: {
    author: `Author ${i}`,
    created: new Date().toISOString(),
    tags: Array(50).fill(`tag-${i}`),
    categories: Array(20).fill(`category-${i}`),
    comments: Array(100).fill(0).map((_, j) => ({
      id: j,
      text: `Comment ${j} for item ${i}`.repeat(10),
      author: `Commenter ${j}`,
    })),
  },
  relatedItems: Array(100).fill(i),
  statistics: {
    views: i * 1000,
    likes: i * 100,
    shares: i * 10,
    history: Array(365).fill(0).map((_, d) => ({
      date: new Date(Date.now() - d * 86400000).toISOString(),
      views: Math.floor(Math.random() * 1000),
    })),
  },
}));

// ERROR: Import entire third-party library (if tree-shaking not used)
// This increases bundle size
export { default as _ } from 'lodash'; // Entire lodash library
