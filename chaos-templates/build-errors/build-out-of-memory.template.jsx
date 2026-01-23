/**
 * @fault-type: build-out-of-memory
 * @category: build-errors
 * @description: Out of memory during build process
 * @expected-error: JavaScript heap out of memory
 * @target-file: src/utils/largeData.js
 * @severity: high
 */

// FAULT INJECTION: Build out of memory
// Error Type: Generating huge data causes memory shortage
// Expected Result: Memory overflow during build

/**
 * Generate huge dataset
 * This consumes large amounts of memory during build
 */
export const generateLargeDataset = () => {
  const data = [];
  
  // ERROR: Generate huge array (10M elements)
  for (let i = 0; i < 10000000; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      description: `This is a very long description for item ${i}`.repeat(100),
      metadata: {
        created: new Date().toISOString(),
        tags: Array(1000).fill(`tag-${i}`),
        properties: Object.fromEntries(
          Array(1000).fill(0).map((_, j) => [`prop${j}`, `value${j}`])
        ),
      },
      // Nest large amounts of data
      nested: {
        level1: {
          level2: {
            level3: {
              data: Array(10000).fill(`nested-data-${i}`),
            },
          },
        },
      },
    });
  }
  
  return data;
};

// ERROR: Generate data at module load time
export const LARGE_CONSTANT_DATA = generateLargeDataset();

// ERROR: Generate huge string
export const HUGE_STRING = 'x'.repeat(100000000);

// ERROR: Create many objects
export const MANY_OBJECTS = Array(1000000).fill(0).map((_, i) => ({
  id: i,
  data: Array(1000).fill(`data-${i}`),
}));

/**
 * Recursive function causes stack overflow
 */
export function recursiveFunction(n = 1000000) {
  if (n <= 0) return 0;
  return n + recursiveFunction(n - 1);
}

// ERROR: Execute recursive function at module load
export const RECURSIVE_RESULT = recursiveFunction();
