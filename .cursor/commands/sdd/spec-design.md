<meta>
description: Create comprehensive technical design for a specification
argument-hint: <feature-name:$1> [-y:$2]
</meta>

# 技术设计生成器

<background_information>
- **使命**: 生成全面的技术设计文档，将需求（WHAT）转换为架构设计（HOW）
- **成功标准**:
  - 所有需求映射到具有清晰接口的技术组件
  - 完成适当的架构发现和调研
  - 设计与steering上下文和现有模式对齐
  - 为复杂架构包含可视化图表
</background_information>

<instructions>
## 核心任务
基于已批准的需求，为功能 **$1** 生成技术设计文档。

## 执行步骤

### 步骤1：加载上下文

**读取所有必要的上下文**:
- `.cursor/ssd/specs/$1/spec.json`、`requirements.md`、`design.md`（如存在）
- **整个 `.cursor/ssd/steering/` 目录**以获取完整的项目记忆
- `.cursor/ssd/settings/templates/specs/design.md` 以获取文档结构
- `.cursor/ssd/settings/rules/design-principles.md` 以获取设计原则
- `.cursor/ssd/settings/templates/specs/research.md` 以获取发现日志结构

**验证需求批准**:
- 如果提供了 `-y` 标志（$2 == "-y"）: 在spec.json中自动批准需求
- 否则: 验证批准状态（如未批准则停止，参见安全和回退）

### 步骤2：发现和分析

**关键：此阶段确保设计基于完整、准确的信息。**

1. **分类功能类型**:
   - **新功能**（全新开发项目） → 需要完整发现
   - **扩展**（现有系统） → 集成聚焦的发现
   - **简单添加**（CRUD/UI） → 最少或无发现
   - **复杂集成** → 需要全面分析

2. **执行适当的发现流程**:
   
   **对于复杂/新功能**:
   - 读取并执行 `.cursor/ssd/settings/rules/design-discovery-full.md`
   - 使用WebSearch/WebFetch进行全面调研:
     - 最新架构模式和最佳实践
     - 外部依赖验证（API、库、版本、兼容性）
     - 官方文档、迁移指南、已知问题
     - 性能基准和安全考虑
   
   **对于扩展**:
   - 读取并执行 `.cursor/ssd/settings/rules/design-discovery-light.md`
   - 专注于集成点、现有模式、兼容性
   - 使用Grep分析现有代码库模式
   
   **对于简单添加**:
   - 跳过正式发现，仅进行快速模式检查

3. **保留发现结果供步骤3使用**:
   - 外部API契约和约束
   - 技术决策及理由
   - 要遵循或扩展的现有模式
   - 集成点和依赖项
   - 识别的风险和缓解策略
   - 潜在的架构模式和边界选项（在 `research.md` 中记录详细信息）
   - 未来任务的并行化考虑（在 `research.md` 中捕获依赖关系）

4. **将发现结果持久化到调研日志**:
   - 使用共享模板创建或更新 `.cursor/ssd/specs/$1/research.md`
   - 总结发现范围的关键发现（摘要部分）
   - 在调研日志主题中记录调查，包括来源和影响
   - 使用模板章节记录架构模式评估、设计决策和风险
   - 在编写或更新 `research.md` 时使用spec.json中指定的语言

### 步骤3：生成设计文档

1. **加载设计模板和规则**:
   - 读取 `.cursor/ssd/settings/templates/specs/design.md` 以获取结构
   - 读取 `.cursor/ssd/settings/rules/design-principles.md` 以获取原则

2. **生成设计文档**:
   - **严格遵循specs/design.md模板结构和生成说明**
   - **整合所有发现结果**: 在整个组件定义、架构决策和集成点中使用调研的信息（API、模式、技术）
   - 如果在步骤1中找到现有design.md，将其用作参考上下文（合并模式）
   - 应用设计规则：类型安全、可视化沟通、正式语调
   - 使用spec.json中指定的语言
   - 确保章节反映更新的标题（"架构模式和边界图"、"技术栈和对齐"、"组件和接口契约"）并引用 `research.md` 中的支持详细信息

3. **更新元数据**在spec.json中:
   - 设置 `phase: "design-generated"`
   - 设置 `approvals.design.generated: true, approved: true`
   - 设置 `approvals.requirements.approved: true`
   - 更新 `updated_at` 时间戳

## 关键约束
 - **类型安全**:
   - 强制执行与项目技术栈对齐的强类型。
   - 对于静态类型语言，定义显式类型/接口并避免不安全转换。
   - 对于TypeScript，永远不要使用 `any`；偏好精确类型和泛型。
   - 对于动态类型语言，在可用时提供类型提示/注释（例如，Python类型提示）并在边界验证输入。
   - 清楚地记录公共接口和契约，以确保跨组件类型安全。
- **最新信息**: 使用WebSearch/WebFetch获取外部依赖和最佳实践
- **Steering对齐**: 尊重steering上下文中的现有架构模式
- **模板遵循**: 严格遵循specs/design.md模板结构和生成说明
- **设计焦点**: 仅架构和接口，无实施代码
- **需求可追溯性ID**: 仅使用数字需求ID（例如"1.1"、"1.2"、"3.1"、"3.3"），完全按照requirements.md中的定义。不要发明新ID或使用字母标签。

### 语言提醒
- Markdown提示内容必须保持英文，即使spec.json为设计输出请求另一种语言。生成的design.md和research.md应使用规范语言。
</instructions>

## 工具指南
- **先读取**: 在采取行动之前加载所有上下文（规范、steering、模板、规则）
- **不确定时调研**: 使用WebSearch/WebFetch获取外部依赖、API和最新最佳实践
- **分析现有代码**: 使用Grep查找代码库中的模式和集成点
- **最后写入**: 仅在所有调研和分析完成后生成design.md

## 输出描述

**命令执行输出**（与design.md内容分开）:

以spec.json中指定的语言提供简要摘要：

1. **状态**: 确认设计文档已在 `.cursor/ssd/specs/$1/design.md` 生成
2. **发现类型**: 执行了哪个发现流程（完整/轻量/最少）
3. **关键发现**: 来自发现的2-3个关键见解，这些见解塑造了设计
4. **下一步**: 批准工作流指导（参见安全和回退）

**格式**: 简洁的Markdown（少于200个汉字）- 这是命令输出，而非设计文档本身

**注意**: 实际设计文档遵循 `.cursor/ssd/settings/templates/specs/design.md` 结构。

## 安全和回退

### 错误场景

**需求未批准**:
- **停止执行**: 没有已批准的需求无法继续
- **用户消息**: "需求尚未批准。设计生成前需要批准。"
- **建议操作**: "运行 `/sdd/spec-design $1 -y` 以自动批准需求并继续"

**缺少需求**:
- **停止执行**: 需求文档必须存在
- **用户消息**: "在 `.cursor/ssd/specs/$1/requirements.md` 未找到requirements.md"
- **建议操作**: "首先运行 `/sdd/spec-requirements $1` 生成需求"

**模板缺失**:
- **用户消息**: "模板文件在 `.cursor/ssd/settings/templates/specs/design.md` 缺失"
- **建议操作**: "检查仓库设置或恢复模板文件"
- **回退**: 使用内联基本结构并警告

**Steering上下文缺失**:
- **警告**: "Steering目录为空或缺失 - 设计可能不符合项目标准"
- **继续**: 继续生成但在输出中注明限制

**发现复杂度不明确**:
- **默认**: 使用完整发现流程（`.cursor/ssd/settings/rules/design-discovery-full.md`）
- **理由**: 过度调研比错过关键上下文更好
- **无效需求ID**:
  - **停止执行**: 如果requirements.md缺少数字ID或使用非数字标题（例如，"Requirement A"），停止并指示用户在继续之前修复requirements.md。

### 下一阶段：任务生成

**如果设计已批准**:
- 在 `.cursor/ssd/specs/$1/design.md` 查看生成的设计
- 然后 `/sdd/spec-tasks $1` 生成实施任务

**如果需要修改**:
- 提供反馈并重新运行 `/sdd/spec-design $1`
- 现有设计用作参考（合并模式）

**注意**: 在进入任务生成之前，设计批准是强制性的。
