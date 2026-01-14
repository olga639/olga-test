<meta>
description: Generate comprehensive requirements for a specification
argument-hint: <feature-name:$1>
</meta>

# 需求生成

<background_information>
- **使命**: 基于规范初始化中的项目描述，以EARS格式生成全面、可测试的需求
- **成功标准**:
  - 创建与steering上下文对齐的完整需求文档
  - 遵循项目的EARS模式和约束，用于所有验收标准
  - 专注于核心功能，无实施细节
  - 更新元数据以跟踪生成状态
</background_information>

<instructions>
## 核心任务
基于requirements.md中的项目描述，为功能 **$1** 生成完整需求。

## 执行步骤

1. **加载上下文**:
   - 读取 `.cursor/ssd/specs/$1/spec.json` 以获取语言和元数据
   - 读取 `.cursor/ssd/specs/$1/requirements.md` 以获取项目描述
   - **加载所有steering上下文**: 读取整个 `.cursor/ssd/steering/` 目录，包括:
     - 默认文件: `structure.md`、`tech.md`、`product.md`
     - 所有自定义steering文件（无论模式设置如何）
     - 这提供了完整的项目记忆和上下文

2. **读取指南**:
   - 读取 `.cursor/ssd/settings/rules/ears-format.md` 以获取EARS语法规则
   - 读取 `.cursor/ssd/settings/templates/specs/requirements.md` 以获取文档结构

3. **生成需求**:
   - 基于项目描述创建初始需求
   - 将相关功能分组到逻辑需求领域
   - 对所有验收标准应用EARS格式
   - 使用spec.json中指定的语言

4. **更新元数据**:
   - 设置 `phase: "requirements-generated"`
   - 设置 `approvals.requirements.generated: true`
   - 设置 `approvals.requirements.approved: true`
   - 更新 `updated_at` 时间戳

## 重要约束
- 专注于WHAT，而非HOW（无实施细节）
- 需求必须可测试和可验证
- 为EARS语句选择适当的主体（软件的系统/服务名称）
- 首先生成初始版本，然后根据用户反馈迭代（不预先提出顺序问题）
- requirements.md中的需求标题必须仅包含前导数字ID（例如："Requirement 1"、"1."、"2 Feature ..."）；不要使用字母ID，如"Requirement A"。
</instructions>

## 工具指南
- **先读取**: 在生成之前加载所有上下文（规范、steering、规则、模板）
- **最后写入**: 仅在完全生成后更新requirements.md
- 仅在需要外部领域知识时使用 **WebSearch/WebFetch**

## 输出描述
以spec.json中指定的语言提供输出：

1. **生成的需求摘要**: 主要需求领域的简要概述（3-5个要点）
2. **文档状态**: 确认requirements.md已更新，spec.json元数据已更新
3. **下一步**: 指导用户如何继续（批准并继续，或修改）

**格式要求**:
- 使用Markdown标题以提高清晰度
- 在代码块中包含文件路径
- 保持摘要简洁（少于300个汉字）

## 安全和回退

### 错误场景
- **缺少项目描述**: 如果requirements.md缺少项目描述，请向用户询问功能详细信息
- **模糊需求**: 提出初始版本并根据用户反馈迭代，而不是预先提出许多问题
- **模板缺失**: 如果模板文件不存在，使用内联回退结构并警告
- **语言未定义**: 如果spec.json未指定语言，默认为简体中文（`zh`）
- **不完整需求**: 生成后，明确询问用户需求是否涵盖所有预期功能
- **Steering目录为空**: 警告用户项目上下文缺失，可能影响需求质量
- **非数字需求标题**: 如果现有标题不包含前导数字ID（例如，它们使用"Requirement A"），将它们标准化为数字ID并保持该映射一致（永远不要混合数字和字母标签）。

### 下一阶段：设计生成

**如果需求已批准**:
- 在 `.cursor/ssd/specs/$1/requirements.md` 查看生成的需求
- 然后 `/sdd/spec-design $1` 进入设计阶段

**如果需要修改**:
- 提供反馈并重新运行 `/sdd/spec-requirements $1`

**注意**: 在进入设计阶段之前，批准是强制性的。
