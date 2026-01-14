/**
 * @fault-type: build-out-of-memory
 * @category: build-errors
 * @description: 构建过程中内存不足
 * @expected-error: JavaScript heap out of memory
 * @target-file: src/utils/largeData.js
 * @severity: high
 * 
 * ⚠️ 重要：此文件需要在 App.jsx 中导入才会触发内存溢出
 */

// 🚨 故障注入：构建内存溢出
// 错误类型：生成超大数据导致内存不足
// 预期结果：构建过程中内存溢出，进程崩溃

console.log('⚠️ 开始生成大量数据，可能导致内存溢出...');

/**
 * 生成超大数据集
 * 这会在模块加载时立即执行，消耗大量内存
 */
const generateLargeDataset = () => {
  const data = [];
  
  // 🔴 错误：生成超大数组（5M个元素，每个元素包含大量数据）
  console.log('生成 5,000,000 个复杂对象...');
  for (let i = 0; i < 5000000; i++) {
    data.push({
      id: i,
      name: `Item ${i}`,
      // 每个描述重复200次，约20KB
      description: `This is a very long description for item ${i} with lots of text content. `.repeat(200),
      metadata: {
        created: new Date().toISOString(),
        // 1000个标签
        tags: Array(1000).fill(0).map((_, j) => `tag-${i}-${j}`),
        // 1000个属性
        properties: Object.fromEntries(
          Array(1000).fill(0).map((_, j) => [`prop${j}`, `value-${i}-${j}`])
        ),
      },
      // 深度嵌套的大量数据
      nested: {
        level1: {
          level2: {
            level3: {
              // 每个元素10000个字符串
              data: Array(10000).fill(0).map((_, j) => `nested-data-${i}-${j}`),
            },
          },
        },
      },
    });
    
    // 每10万次打印进度（用于调试）
    if (i % 100000 === 0 && i > 0) {
      console.log(`已生成 ${i} 个对象...`);
    }
  }
  
  return data;
};

// 🔴 错误：在模块加载时就生成数据（立即执行）
console.log('开始生成 LARGE_CONSTANT_DATA...');
export const LARGE_CONSTANT_DATA = generateLargeDataset();
console.log('LARGE_CONSTANT_DATA 生成完成，大小:', LARGE_CONSTANT_DATA.length);

// 🔴 错误：生成超大字符串（约100MB）
console.log('开始生成 HUGE_STRING...');
export const HUGE_STRING = 'x'.repeat(100000000);
console.log('HUGE_STRING 生成完成，长度:', HUGE_STRING.length);

// 🔴 错误：创建大量对象（约2M个对象）
console.log('开始生成 MANY_OBJECTS...');
export const MANY_OBJECTS = Array(2000000).fill(0).map((_, i) => ({
  id: i,
  // 每个对象包含1000个元素的数组
  data: Array(1000).fill(0).map((_, j) => `data-${i}-${j}`),
  // 额外的大字符串
  content: `Content for object ${i}`.repeat(1000),
}));
console.log('MANY_OBJECTS 生成完成，大小:', MANY_OBJECTS.length);

// 🔴 错误：创建更多的全局数据
console.log('开始生成 MORE_DATA...');
export const MORE_DATA = {
  // 10个大数组
  arrays: Array(10).fill(0).map((_, i) => 
    Array(1000000).fill(0).map((_, j) => ({
      index: j,
      value: `value-${i}-${j}`,
      timestamp: Date.now(),
    }))
  ),
  // 大量字符串
  strings: Array(1000000).fill(0).map((_, i) => 
    `This is a long string number ${i}`.repeat(100)
  ),
};
console.log('MORE_DATA 生成完成');

/**
 * 递归函数（虽然会栈溢出，但主要目的是内存溢出）
 */
export function recursiveFunction(n = 100000) {
  if (n <= 0) return [];
  // 每次递归都创建大数组
  const data = Array(1000).fill(`data-${n}`);
  return [data, ...recursiveFunction(n - 1)];
}

// 🔴 错误：在模块加载时执行递归
console.log('开始执行递归函数...');
try {
  export const RECURSIVE_RESULT = recursiveFunction(10000);
  console.log('递归完成');
} catch (e) {
  console.error('递归失败:', e.message);
}

console.log('✅ 所有数据生成完成（如果能看到这条消息说明内存足够）');

// 导出一个函数供外部调用
export const getTotalDataSize = () => {
  return {
    largeData: LARGE_CONSTANT_DATA.length,
    hugeString: HUGE_STRING.length,
    manyObjects: MANY_OBJECTS.length,
    moreData: MORE_DATA.arrays.length,
  };
};

