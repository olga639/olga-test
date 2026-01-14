/**
 * @fault-type: state-error
 * @category: runtime-errors
 * @description: 在渲染过程中更新状态导致错误
 * @expected-error: Cannot update during render
 * @target-file: src/context/TaskContext.jsx
 * @severity: medium
 * 
 * 🚨 简化模板：在getTaskStats中直接调用setState
 */

// 此模板故意简化，实际使用时会在TaskContext中注入错误
// 错误示例：在计算属性或渲染函数中调用setState

export const stateErrorExample = `
// 🚨 错误示例：在计算函数中更新状态
const getTaskStats = useCallback(() => {
  // ❌ 错误：在非事件处理函数中直接更新状态
  setError('计算统计时出错');  // 这会导致 "Cannot update during render"
  
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
}, [tasks]);
`;

