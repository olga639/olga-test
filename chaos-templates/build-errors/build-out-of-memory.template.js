/**
 * @fault-type: build-out-of-memory
 * @category: build-errors
 * @description: Out of memory during build process
 * @expected-error: JavaScript heap out of memory
 * @target-file: src/utils/largeData.js
 * @severity: high
 * 
 * IMPORTANT: This file needs to be imported in App.jsx to trigger memory overflow
 */

// FAULT INJECTION: Build out of memory
// Error Type: Generating huge data causes memory shortage
// Expected Result: Memory overflow during build, process crashes

console.log('WARNING: Starting to generate large data, may cause memory overflow...');

/**
 * Generate huge dataset
 * This executes immediately when module loads, consuming large amounts of memory
 */
const generateLargeDataset = () => {
  const data = [];
  
  // ERROR: Generate huge array (5M elements, each element contains lots of data)
  console.log('Generating 5,000,000 complex objects...');
  for (let i = 0; i < 5000000; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      // Each description repeated 200 times, about 20KB
      description: `This is a very long description for item ${i} with lots of text content. `.repeat(200),
      metadata: {
        created: new Date().toISOString(),
        // 1000 tags
        tags: Array(1000).fill(0).map((_, j) => `tag-${i}-${j}`),
        // 1000 properties
        properties: Object.fromEntries(
          Array(1000).fill(0).map((_, j) => [`prop${j}`, `value-${i}-${j}`])
        ),
      },
      // Deep nested large data
      nested: {
        level1: {
          level2: {
            level3: {
              // 10000 strings per element
              data: Array(10000).fill(0).map((_, j) => `nested-data-${i}-${j}`),
            },
          },
        },
      },
    });
    
    // Print progress every 100k iterations (for debugging)
    if (i % 100000 === 0 && i > 0) {
      console.log(`Generated ${i} objects...`);
    }
  }
  
  return data;
};

// ERROR: Generate data at module load time (immediate execution)
console.log('Starting to generate LARGE_CONSTANT_DATA...');
export const LARGE_CONSTANT_DATA = generateLargeDataset();
console.log('LARGE_CONSTANT_DATA generation complete, size:', LARGE_CONSTANT_DATA.length);

// ERROR: Generate huge string (about 100MB)
console.log('Starting to generate HUGE_STRING...');
export const HUGE_STRING = 'x'.repeat(100000000);
console.log('HUGE_STRING generation complete, length:', HUGE_STRING.length);

// ERROR: Create many objects (about 2M objects)
console.log('Starting to generate MANY_OBJECTS...');
export const MANY_OBJECTS = Array(2000000).fill(0).map((_, i) => ({
  id: i,
  // Each object contains array of 1000 elements
  data: Array(1000).fill(0).map((_, j) => `data-${i}-${j}`),
  // Extra large string
  content: `Content for object ${i}`.repeat(1000),
}));
console.log('MANY_OBJECTS generation complete, size:', MANY_OBJECTS.length);

// ERROR: Create more global data
console.log('Starting to generate MORE_DATA...');
export const MORE_DATA = {
  // 10 large arrays
  arrays: Array(10).fill(0).map((_, i) => 
    Array(1000000).fill(0).map((_, j) => ({
      index: j,
      value: `value-${i}-${j}`,
      timestamp: Date.now(),
    }))
  ),
  // Many strings
  strings: Array(1000000).fill(0).map((_, i) => 
    `This is a long string number ${i}`.repeat(100)
  ),
};
console.log('MORE_DATA generation complete');

/**
 * Recursive function (will stack overflow, but main purpose is memory overflow)
 */
export function recursiveFunction(n = 100000) {
  if (n <= 0) return [];
  // Create large array each recursion
  const data = Array(1000).fill(`data-${n}`);
  return [data, ...recursiveFunction(n - 1)];
}

// ERROR: Execute recursive function at module load
console.log('Starting recursive function execution...');
try {
  export const RECURSIVE_RESULT = recursiveFunction(10000);
  console.log('Recursion complete');
} catch (e) {
  console.error('Recursion failed:', e.message);
}

console.log('All data generation complete (if you see this message, memory is sufficient)');

// Export a function for external use
export const getTotalDataSize = () => {
  return {
    largeData: LARGE_CONSTANT_DATA.length,
    hugeString: HUGE_STRING.length,
    manyObjects: MANY_OBJECTS.length,
    moreData: MORE_DATA.arrays.length,
  };
};
