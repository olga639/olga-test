/**
 * Mock API - 模拟后端API
 * 
 * 功能：
 * - 模拟异步请求
 * - 提供CRUD操作
 * - 模拟网络延迟
 * - 模拟错误场景
 */

// 模拟数据存储
let mockTasks = [
  {
    id: '1',
    title: '完成项目文档',
    description: '编写项目的技术文档和用户手册，包括架构设计、API文档和部署指南。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-01-20',
    tags: ['文档', '重要'],
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-14T10:30:00Z'
  },
  {
    id: '2',
    title: '修复登录页面bug',
    description: '用户反馈登录页面在某些浏览器上无法正常显示，需要排查并修复兼容性问题。',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-01-16',
    tags: ['bug', '前端'],
    createdAt: '2026-01-12T09:15:00Z',
    updatedAt: '2026-01-12T09:15:00Z'
  },
  {
    id: '3',
    title: '优化数据库查询性能',
    description: '分析慢查询日志，优化数据库索引和查询语句，提升系统整体性能。',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-01-25',
    tags: ['性能', '后端', '数据库'],
    createdAt: '2026-01-11T14:20:00Z',
    updatedAt: '2026-01-11T14:20:00Z'
  },
  {
    id: '4',
    title: '设计新功能UI',
    description: '为即将上线的新功能设计用户界面，包括交互流程和视觉设计。',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-01-22',
    tags: ['设计', 'UI'],
    createdAt: '2026-01-13T11:00:00Z',
    updatedAt: '2026-01-14T15:45:00Z'
  },
  {
    id: '5',
    title: '代码审查',
    description: '审查团队成员提交的代码，确保代码质量和规范性。',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-01-15',
    tags: ['代码审查', '团队'],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z'
  },
  {
    id: '6',
    title: '准备技术分享',
    description: '准备下周的技术分享会议，主题是React性能优化最佳实践。',
    status: 'pending',
    priority: 'low',
    dueDate: '2026-01-28',
    tags: ['分享', '学习'],
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z'
  },
  {
    id: '7',
    title: '更新依赖包',
    description: '检查并更新项目中的npm依赖包，修复安全漏洞。',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-01-14',
    tags: ['维护', '安全'],
    createdAt: '2026-01-08T13:30:00Z',
    updatedAt: '2026-01-14T11:00:00Z'
  },
  {
    id: '8',
    title: '实现用户权限系统',
    description: '开发基于角色的权限控制系统，支持多种用户角色和权限配置。',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-01-30',
    tags: ['功能', '后端', '安全'],
    createdAt: '2026-01-09T08:45:00Z',
    updatedAt: '2026-01-14T14:20:00Z'
  }
];

// 模拟网络延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// 生成唯一ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

/**
 * Mock API对象
 */
export const mockApi = {
  /**
   * 获取所有任务
   * 
   * @param {Object} options - 查询选项
   * @param {string} options.status - 按状态筛选
   * @param {string} options.priority - 按优先级筛选
   * @param {string} options.sortBy - 排序字段
   * @param {string} options.order - 排序顺序 (asc/desc)
   * @returns {Promise<Array>} 任务列表
   */
  async getTasks(options = {}) {
    await delay(300);

    let result = [...mockTasks];

    // 按状态筛选
    if (options.status) {
      result = result.filter(task => task.status === options.status);
    }

    // 按优先级筛选
    if (options.priority) {
      result = result.filter(task => task.priority === options.priority);
    }

    // 排序
    if (options.sortBy) {
      result.sort((a, b) => {
        const aVal = a[options.sortBy];
        const bVal = b[options.sortBy];
        const order = options.order === 'desc' ? -1 : 1;
        return aVal > bVal ? order : aVal < bVal ? -order : 0;
      });
    }

    return result;
  },

  /**
   * 根据ID获取任务
   * 
   * @param {string} id - 任务ID
   * @returns {Promise<Object>} 任务对象
   * @throws {Error} 任务不存在时抛出错误
   */
  async getTaskById(id) {
    await delay(200);

    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`任务 ID ${id} 不存在`);
    }

    return { ...task };
  },

  /**
   * 创建新任务
   * 
   * @param {Object} taskData - 任务数据
   * @returns {Promise<Object>} 创建的任务对象
   */
  async createTask(taskData) {
    await delay(400);

    const newTask = {
      id: generateId(),
      title: taskData.title || '未命名任务',
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockTasks.unshift(newTask);
    return { ...newTask };
  },

  /**
   * 更新任务
   * 
   * @param {string} id - 任务ID
   * @param {Object} updates - 更新的数据
   * @returns {Promise<Object>} 更新后的任务对象
   * @throws {Error} 任务不存在时抛出错误
   */
  async updateTask(id, updates) {
    await delay(300);

    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`任务 ID ${id} 不存在`);
    }

    const updatedTask = {
      ...mockTasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    mockTasks[index] = updatedTask;
    return { ...updatedTask };
  },

  /**
   * 删除任务
   * 
   * @param {string} id - 任务ID
   * @returns {Promise<void>}
   * @throws {Error} 任务不存在时抛出错误
   */
  async deleteTask(id) {
    await delay(300);

    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`任务 ID ${id} 不存在`);
    }

    mockTasks.splice(index, 1);
  },

  /**
   * 批量删除任务
   * 
   * @param {Array<string>} ids - 任务ID数组
   * @returns {Promise<number>} 删除的任务数量
   */
  async batchDeleteTasks(ids) {
    await delay(500);

    const initialLength = mockTasks.length;
    mockTasks = mockTasks.filter(task => !ids.includes(task.id));
    return initialLength - mockTasks.length;
  },

  /**
   * 搜索任务
   * 
   * @param {string} query - 搜索关键词
   * @returns {Promise<Array>} 搜索结果
   */
  async searchTasks(query) {
    await delay(250);

    if (!query.trim()) {
      return [...mockTasks];
    }

    const lowerQuery = query.toLowerCase();
    return mockTasks.filter(
      task =>
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  /**
   * 获取任务统计信息
   * 
   * @returns {Promise<Object>} 统计信息
   */
  async getTaskStats() {
    await delay(200);

    return {
      total: mockTasks.length,
      byStatus: {
        pending: mockTasks.filter(t => t.status === 'pending').length,
        inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
        completed: mockTasks.filter(t => t.status === 'completed').length
      },
      byPriority: {
        high: mockTasks.filter(t => t.priority === 'high').length,
        medium: mockTasks.filter(t => t.priority === 'medium').length,
        low: mockTasks.filter(t => t.priority === 'low').length
      }
    };
  }
};

export default mockApi;

