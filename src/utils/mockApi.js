/**
 * Mock API - Simulated Backend API
 * 
 * Features:
 * - Simulate async requests
 * - Provide CRUD operations
 * - Simulate network delay
 * - Simulate error scenarios
 */

// Mock data storage
let mockTasks = [
  {
    id: '1',
    title: 'Complete Project Documentation',
    description: 'Write technical documentation and user manuals for the project, including architecture design, API documentation, and deployment guide.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-01-20',
    tags: ['Documentation', 'Important'],
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-14T10:30:00Z'
  },
  {
    id: '2',
    title: 'Fix Login Page Bug',
    description: 'Users reported that the login page does not display correctly in some browsers. Need to investigate and fix compatibility issues.',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-01-16',
    tags: ['Bug', 'Frontend'],
    createdAt: '2026-01-12T09:15:00Z',
    updatedAt: '2026-01-12T09:15:00Z'
  },
  {
    id: '3',
    title: 'Optimize Database Query Performance',
    description: 'Analyze slow query logs, optimize database indexes and query statements to improve overall system performance.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-01-25',
    tags: ['Performance', 'Backend', 'Database'],
    createdAt: '2026-01-11T14:20:00Z',
    updatedAt: '2026-01-11T14:20:00Z'
  },
  {
    id: '4',
    title: 'Design New Feature UI',
    description: 'Design user interface for upcoming new features, including interaction flow and visual design.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-01-22',
    tags: ['Design', 'UI'],
    createdAt: '2026-01-13T11:00:00Z',
    updatedAt: '2026-01-14T15:45:00Z'
  },
  {
    id: '5',
    title: 'Code Review',
    description: 'Review code submitted by team members to ensure code quality and standards compliance.',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-01-15',
    tags: ['Code Review', 'Team'],
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-15T16:00:00Z'
  },
  {
    id: '6',
    title: 'Prepare Tech Sharing Session',
    description: 'Prepare for next week\'s tech sharing meeting, topic is React performance optimization best practices.',
    status: 'pending',
    priority: 'low',
    dueDate: '2026-01-28',
    tags: ['Sharing', 'Learning'],
    createdAt: '2026-01-14T09:00:00Z',
    updatedAt: '2026-01-14T09:00:00Z'
  },
  {
    id: '7',
    title: 'Update Dependencies',
    description: 'Check and update npm dependencies in the project, fix security vulnerabilities.',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-01-14',
    tags: ['Maintenance', 'Security'],
    createdAt: '2026-01-08T13:30:00Z',
    updatedAt: '2026-01-14T11:00:00Z'
  },
  {
    id: '8',
    title: 'Implement User Permission System',
    description: 'Develop role-based access control system, support multiple user roles and permission configurations.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-01-30',
    tags: ['Feature', 'Backend', 'Security'],
    createdAt: '2026-01-09T08:45:00Z',
    updatedAt: '2026-01-14T14:20:00Z'
  }
];

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

/**
 * Mock API Object
 */
export const mockApi = {
  /**
   * Get all tasks
   * 
   * @param {Object} options - Query options
   * @param {string} options.status - Filter by status
   * @param {string} options.priority - Filter by priority
   * @param {string} options.sortBy - Sort field
   * @param {string} options.order - Sort order (asc/desc)
   * @returns {Promise<Array>} Task list
   */
  async getTasks(options = {}) {
    await delay(300);

    let result = [...mockTasks];

    // Filter by status
    if (options.status) {
      result = result.filter(task => task.status === options.status);
    }

    // Filter by priority
    if (options.priority) {
      result = result.filter(task => task.priority === options.priority);
    }

    // Sort
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
   * Get task by ID
   * 
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Task object
   * @throws {Error} Throws error if task does not exist
   */
  async getTaskById(id) {
    await delay(200);

    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task ID ${id} does not exist`);
    }

    return { ...task };
  },

  /**
   * Create new task
   * 
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task object
   */
  async createTask(taskData) {
    await delay(400);

    const newTask = {
      id: generateId(),
      title: taskData.title || 'Untitled Task',
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
   * Update task
   * 
   * @param {string} id - Task ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated task object
   * @throws {Error} Throws error if task does not exist
   */
  async updateTask(id, updates) {
    await delay(300);

    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task ID ${id} does not exist`);
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
   * Delete task
   * 
   * @param {string} id - Task ID
   * @returns {Promise<void>}
   * @throws {Error} Throws error if task does not exist
   */
  async deleteTask(id) {
    await delay(300);

    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task ID ${id} does not exist`);
    }

    mockTasks.splice(index, 1);
  },

  /**
   * Batch delete tasks
   * 
   * @param {Array<string>} ids - Array of task IDs
   * @returns {Promise<number>} Number of deleted tasks
   */
  async batchDeleteTasks(ids) {
    await delay(500);

    const initialLength = mockTasks.length;
    mockTasks = mockTasks.filter(task => !ids.includes(task.id));
    return initialLength - mockTasks.length;
  },

  /**
   * Search tasks
   * 
   * @param {string} query - Search keyword
   * @returns {Promise<Array>} Search results
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
   * Get task statistics
   * 
   * @returns {Promise<Object>} Statistics information
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
