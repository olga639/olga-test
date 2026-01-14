# Spec-Workflow MCP 使用指南

## 概述

Spec-Workflow MCP 是一个规范驱动的开发工具，通过结构化的四阶段流程，将粗略的想法转化为详细的规范并最终实现。

**工作流程**：需求 → 设计 → 任务 → 实现

**特性名称规则**：使用 kebab-case（例如：user-authentication）

**重要原则**：一次只创建一个规范，必须按顺序完成各阶段

## 四个阶段

### 阶段 1：需求（Requirements）

**目标**：根据用户需求定义要构建什么

**文件路径**：`.spec-workflow/specs/{spec-name}/requirements.md`

**流程**：
1. 检查是否存在指导文档（`.spec-workflow/steering/*.md`）
2. 检查自定义模板（`.spec-workflow/user-templates/requirements-template.md`）
3. 如无自定义模板，使用默认模板
4. 研究市场/用户期望（如果可以使用网络搜索）
5. 生成符合 EARS 标准的用户故事需求
6. 创建 `requirements.md` 文件
7. 使用 `approvals` 工具请求审批（action: 'request'）
8. 轮询审批状态（action: 'status'），直到获批或需要修改
9. 如需修改：根据评论更新文档，创建新审批请求
10. 获批后：使用 `approvals` 删除审批记录（action: 'delete'）
11. 如删除失败：停止，返回轮询状态

### 阶段 2：设计（Design）

**目标**：创建满足所有需求的技术设计

**文件路径**：`.spec-workflow/specs/{spec-name}/design.md`

**流程**：
1. 检查自定义模板（`.spec-workflow/user-templates/design-template.md`）
2. 如无自定义模板，使用默认模板
3. 分析代码库中可复用的模式
4. 研究技术选型（如果可以使用网络搜索）
5. 生成包含所有模板部分的设计文档
6. 创建 `design.md` 文件
7. 使用 `approvals` 工具请求审批
8. 轮询审批状态直到获批或需要修改
9. 如需修改：根据评论更新文档，创建新审批请求
10. 获批后：删除审批记录
11. 如删除失败：停止，返回轮询状态

### 阶段 3：任务（Tasks）

**目标**：将设计分解为原子实现任务

**文件路径**：`.spec-workflow/specs/{spec-name}/tasks.md`

**流程**：
1. 检查自定义模板（`.spec-workflow/user-templates/tasks-template.md`）
2. 如无自定义模板，使用默认模板
3. 将设计转换为原子任务（每个任务涉及 1-3 个文件）
4. 包含文件路径和需求引用
5. **重要**：为每个任务生成 `_Prompt` 字段，包含：
   - Role: 任务的专业开发者角色
   - Task: 清晰的描述和上下文引用
   - Restrictions: 不应做什么、要遵循的约束
   - _Leverage: 要使用的文件/工具
   - _Requirements: 任务实现的需求
   - Success: 具体的完成标准
   - 说明：关于在 tasks.md 中设置任务状态、使用 log-implementation 工具记录实现、完成后标记任务的指令
6. 创建 `tasks.md` 文件
7. 使用 `approvals` 工具请求审批
8. 轮询审批状态直到获批或需要修改
9. 如需修改：根据评论更新文档，创建新审批请求
10. 获批后：删除审批记录
11. 如删除失败：停止，返回轮询状态
12. 成功清理后：显示"规范完成，准备开始实现吗？"

### 阶段 4：实现（Implementation）

**目标**：系统地执行任务

**文件操作**：
- 编辑 `tasks.md` 更新任务状态：
  - `- [ ]` = 待处理任务
  - `- [-]` = 进行中任务
  - `- [x]` = 已完成任务

**使用的工具**：
- `spec-status`: 检查整体进度
- `grep/ripgrep`: **关键** - 实现前搜索现有代码
- `log-implementation`: 任务完成后记录实现详情

**流程**：
1. 使用 `spec-status` 检查当前状态
2. 读取 `tasks.md` 查看所有任务
3. 对于每个任务：
   
   a. **编辑 tasks.md**：将 `[ ]` 改为 `[-]` 标记开始
   
   b. **关键步骤：实现前搜索现有实现日志**：
   - 实现日志位于：`.spec-workflow/specs/{spec-name}/Implementation Logs/`
   - **选项 1：使用 grep 快速搜索**：
     - `grep -r "api|endpoint"` - 查找 API 端点
     - `grep -r "component"` - 查找 UI 组件
     - `grep -r "function"` - 查找工具函数
     - `grep -r "integration"` - 查找集成模式
   - **选项 2：直接读取 markdown 文件** - 使用 Read 工具检查特定日志文件
   - 最佳实践：搜索 2-3 个不同术语以全面发现
   - 这可以防止：重复端点、重复实现组件、破坏集成
   - 复用已经解决部分任务的现有代码
   
   c. **读取 _Prompt 字段** 获取角色、方法和成功标准的指导
   
   d. **按照 _Leverage 字段** 使用现有代码/工具
   
   e. **实现代码** 根据任务描述
   
   f. **测试实现**
   
   g. **使用 log-implementation 工具记录详细的实现产物（关键）**：
   - 提供 taskId 和清晰的实现摘要（1-2 句话）
   - 包括修改/创建的文件和代码统计（添加/删除的行数）
   - **必需：包含 artifacts 字段，其中包含结构化的实现数据**：
     - `apiEndpoints`: 所有创建/修改的 API 路由（方法、路径、目的、格式、位置）
     - `components`: 所有创建的 UI 组件（名称、类型、目的、位置、props）
     - `functions`: 所有创建的工具函数（名称、签名、位置）
     - `classes`: 所有创建的类（名称、方法、位置）
     - `integrations`: 前后端连接及数据流描述
   - 示例："创建了 API GET /api/todos/:id 端点和 TodoDetail React 组件，支持 WebSocket 实时更新"
   - 这为未来的 AI 代理创建了可搜索的知识库，以发现现有代码
   - 防止实现细节在聊天历史中丢失
   
   h. **编辑 tasks.md**：完成并记录后将 `[-]` 改为 `[x]`

4. 继续直到所有任务显示 `[x]`

## 工作流规则

- ✅ 在指定的文件路径直接创建文档
- ✅ 从 `.spec-workflow/templates/` 目录读取模板
- ✅ 遵循精确的模板结构
- ✅ 在阶段之间获取明确的用户批准（使用 approvals 工具，action: 'request'）
- ✅ 按顺序完成阶段（不能跳过）
- ✅ 一次只处理一个规范
- ✅ 规范名称使用 kebab-case
- ✅ 审批请求：仅提供 filePath，不提供内容
- ❌ **阻塞**：如果审批删除失败，永远不要继续
- ❌ **关键**：在进入下一阶段之前必须有已批准状态和成功清理
- ❌ **关键**：永远不接受口头批准 - 仅接受仪表板或 VS Code 扩展的批准
- ❌ 永远不要在用户说"已批准"时继续 - 仅检查系统状态
- ℹ️ 指导文档是可选的 - 仅在明确请求时创建

## 文件结构

```
.spec-workflow/
├── templates/           # 服务器启动时自动填充
│   ├── requirements-template.md
│   ├── design-template.md
│   ├── tasks-template.md
│   ├── product-template.md
│   ├── tech-template.md
│   └── structure-template.md
├── specs/
│   └── {spec-name}/
│       ├── requirements.md
│       ├── design.md
│       ├── tasks.md
│       └── Implementation Logs/     # 自动创建
│           ├── task-1_timestamp_id.md
│           ├── task-2_timestamp_id.md
│           └── ...
└── steering/           # 可选的项目指导文档
    ├── product.md      # 产品愿景和目标
    ├── tech.md         # 技术堆栈和原则
    └── structure.md    # 代码组织规范
```

## 可用的 MCP 工具

### 核心工具

1. **spec-workflow-guide**
   - 加载完整的工作流指南
   - 在开始任何规范创建或功能开发之前调用

2. **approvals**
   - 管理审批工作流
   - 操作：
     - `request` - 创建新的审批请求（每个文档创建后）
     - `status` - 检查审批请求的当前状态
     - `delete` - 清理已完成/拒绝/需要修改的审批请求
   - 参数：
     - `action`: 要执行的操作
     - `category`: "spec" 用于规范，"steering" 用于指导文档
     - `categoryName`: 规范名称或"steering"
     - `filePath`: 需要审批的文件路径（仅用于请求）
     - `title`: 描述需要审批内容的简短标题

3. **spec-status**
   - 显示全面的规范进度概览
   - 显示哪些阶段已完成以及任务实现进度
   - 恢复工作或检查整体完成状态时调用

4. **log-implementation**
   - 记录已完成任务的全面实现详情
   - **产物是必需的** - 创建未来 AI 代理用于发现现有代码的可搜索知识库
   - 参数：
     - `specName`: 规范名称
     - `taskId`: 任务 ID（例如 "1"、"1.2"、"3.1.4"）
     - `summary`: 实现内容的简要摘要
     - `filesModified`: 修改的文件列表
     - `filesCreated`: 创建的文件列表
     - `statistics`: 代码统计（linesAdded、linesRemoved）
     - `artifacts`: **必需** - 关于实现产物的结构化数据
       - `apiEndpoints`: 创建/修改的 API 端点
       - `components`: 创建的可复用 UI 组件
       - `functions`: 创建的工具函数
       - `classes`: 创建的类
       - `integrations`: 前后端集成模式

### 指导文档工具（可选）

5. **steering-guide**
   - 加载创建项目指导文档的指南
   - 仅在用户明确请求指导文档创建或询问项目架构文档时调用
   - 不是标准规范工作流的一部分
   - 提供 product.md、tech.md 和 structure.md 创建的模板和指导

## 启动仪表板

要启动审批仪表板，运行：

```bash
spec-workflow-mcp --dashboard
```

## 使用示例

### 创建新规范

```
用户: 我想创建一个用户认证功能
AI: 
1. 调用 spec-workflow-guide 加载工作流
2. 开始阶段 1（需求）：
   - 读取需求模板
   - 创建 .spec-workflow/specs/user-authentication/requirements.md
   - 使用 approvals 工具请求审批
   - 轮询状态直到批准
   - 删除审批记录
3. 阶段 2（设计）...
4. 阶段 3（任务）...
5. 提示用户："规范完成，准备开始实现吗？"
```

### 实现任务

```
用户: 开始实现任务
AI:
1. 调用 spec-status 检查进度
2. 读取 tasks.md
3. 对于第一个待处理任务：
   - 将 [ ] 改为 [-]
   - 使用 grep 搜索现有实现
   - 读取 _Prompt 字段获取指导
   - 实现代码
   - 测试
   - 使用 log-implementation 记录详细产物
   - 将 [-] 改为 [x]
4. 继续下一个任务...
```

## 最佳实践

1. **始终按顺序完成阶段** - 不要跳过需求、设计或任务阶段
2. **等待审批** - 永远不要在没有系统批准的情况下继续
3. **实现前搜索** - 使用 grep 搜索现有实现日志以避免重复
4. **详细记录** - 在 log-implementation 中包含全面的产物数据
5. **阅读 _Prompt** - 任务中的 _Prompt 字段包含有价值的指导
6. **利用现有代码** - 遵循 _Leverage 字段重用现有工具和模式
7. **一次一个规范** - 在开始新规范之前完成当前规范
8. **使用 kebab-case** - 规范名称应使用 kebab-case（例如：user-auth，不是 UserAuth）

## 常见问题

**Q: 我可以跳过需求阶段直接进入设计吗？**
A: 不可以。必须按顺序完成所有阶段：需求 → 设计 → 任务 → 实现。

**Q: 如果我口头批准文档会怎样？**
A: 口头批准不被接受。必须使用仪表板或 VS Code 扩展通过系统批准。

**Q: 为什么 log-implementation 中的产物如此重要？**
A: 产物创建了未来 AI 代理用于发现现有代码的可搜索知识库。没有它们，代理可能会重新实现已存在的功能，导致代码重复和技术债务。

**Q: 如何找到现有实现？**
A: 在 `.spec-workflow/specs/{spec-name}/Implementation Logs/` 中使用 grep 搜索关键词，如"api"、"component"、"function"、"integration"。

**Q: 什么时候应该创建指导文档？**
A: 指导文档（product.md、tech.md、structure.md）是可选的，仅在明确请求时创建。它们为所有规范提供项目级指导。

**Q: 审批删除失败怎么办？**
A: 如果审批删除失败，停止并返回轮询状态。在成功删除之前不要继续下一阶段。

## 工作流图

```
开始 → 需求 → [审批] → 设计 → [审批] → 任务 → [审批] → 实现 → 完成
         ↓          ↓          ↓          ↓
      需要修改   需要修改   需要修改   记录实现
```

---

**记住**：Spec-Workflow MCP 的目标是通过结构化、审批驱动的流程确保高质量的功能开发。遵循工作流，详细记录实现，你的代码库将保持有组织和可维护。

