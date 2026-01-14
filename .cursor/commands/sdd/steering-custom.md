<meta>
description: Create custom steering documents for specialized project contexts
</meta>

# SDD 自定义Steering创建

<background_information>
**角色**: 创建超出核心文件（product、tech、structure）的专门steering文档。

**使命**: 帮助用户为专门的领域创建领域特定的项目记忆。

**成功标准**:
- 自定义steering捕获专门模式
- 遵循与核心steering相同的粒度原则
- 为特定领域提供明确价值
</background_information>

<instructions>
## 工作流

1. **询问用户**自定义steering需求:
   - 领域/主题（例如，"API标准"、"测试方法"）
   - 要记录的具体需求或模式

2. **检查模板是否存在**:
   - 如果可用，从 `.cursor/ssd/settings/templates/steering-custom/{name}.md` 加载
   - 用作起点，根据项目自定义

3. **分析代码库**（JIT）以查找相关模式:
   - **Glob** 查找相关文件
   - **Read** 查找现有实施
   - **Grep** 查找特定模式

4. **生成自定义steering**:
   - 如果可用，遵循模板结构
   - 应用来自 `.cursor/ssd/settings/rules/steering-principles.md` 的原则
   - 专注于模式，而非详尽列表
   - 保持在100-200行（2-3分钟阅读）

5. **创建文件**在 `.cursor/ssd/steering/{name}.md`

## 可用模板

在 `.cursor/ssd/settings/templates/steering-custom/` 中可用的模板：

1. **api-standards.md** - REST/GraphQL约定、错误处理
2. **testing.md** - 测试组织、模拟、覆盖率
3. **security.md** - 认证模式、输入验证、密钥
4. **database.md** - 模式设计、迁移、查询模式
5. **error-handling.md** - 错误类型、日志记录、重试策略
6. **authentication.md** - 认证流程、权限、会话管理
7. **deployment.md** - CI/CD、环境、回滚程序

需要时加载模板，为项目自定义。

## Steering原则

来自 `.cursor/ssd/settings/rules/steering-principles.md`:

- **模式优于列表**: 记录模式，而非每个文件/组件
- **单一领域**: 每个文件一个主题
- **具体示例**: 用代码展示模式
- **可维护大小**: 通常100-200行
- **安全第一**: 永远不要包含秘密或敏感数据

</instructions>

## 工具指南

- **Read**: 加载模板，分析现有代码
- **Glob**: 查找相关文件以进行模式分析
- **Grep**: 搜索特定模式
- **LS**: 理解相关结构

**JIT策略**: 仅在创建该类型steering时加载模板。

## 输出描述

带文件位置的聊天摘要（文件直接创建）。

```
✅ Custom Steering Created

## Created:
- .cursor/ssd/steering/api-standards.md

## Based On:
- Template: api-standards.md
- Analyzed: src/api/ directory patterns
- Extracted: REST conventions, error format

## Content:
- Endpoint naming patterns
- Request/response format
- Error handling conventions
- Authentication approach

Review and customize as needed.
```

## 示例

### 成功: API标准
**Input**: "Create API standards steering"  
**Action**: Load template, analyze src/api/, extract patterns  
**Output**: api-standards.md with project-specific REST conventions

### 成功: 测试策略
**Input**: "Document our testing approach"  
**Action**: Load template, analyze test files, extract patterns  
**Output**: testing.md with test organization and mocking strategies

## 安全和回退

- **无模板**: 基于领域知识从头生成
- **安全**: 永远不要包含秘密（加载原则）
- **验证**: 确保和核心steering内容不重复

## 注意事项

- 模板是起点，为项目自定义
- 遵循与核心steering相同的粒度原则
- 所有steering文件作为项目记忆加载
- 自定义文件与核心文件同等重要
- 避免记录代理特定工具目录（例如 `.cursor/`、`.gemini/`、`.claude/`）
- 对 `.cursor/ssd/specs/` 和 `.cursor/ssd/steering/` 的轻量引用是可以接受的；避免其他 `.cursor/ssd/` 目录

