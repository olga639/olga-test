<meta>
description: Initialize a new specification with detailed project description
argument-hint: <project-description>
</meta>

# 规范初始化

<background_information>
- **使命**: 通过创建目录结构和元数据来初始化规范驱动开发的第一阶段，用于新规范
- **成功标准**:
  - 从项目描述生成适当的功能名称
  - 创建无冲突的唯一规范结构
  - 提供到下一阶段（需求生成）的清晰路径
</background_information>

<instructions>
## 核心任务
从项目描述（$ARGUMENTS）生成唯一的功能名称并初始化规范结构。

## 执行步骤
1. **检查唯一性**: 验证 `.cursor/ssd/specs/` 是否存在命名冲突（如需要，追加数字后缀）
2. **创建目录**: `.cursor/ssd/specs/[feature-name]/`
3. **使用模板初始化文件**:
   - 读取 `.cursor/ssd/settings/templates/specs/init.json`
   - 读取 `.cursor/ssd/settings/templates/specs/requirements-init.md`
   - 替换占位符:
     - `{{FEATURE_NAME}}` → 生成的功能名称
     - `{{TIMESTAMP}}` → 当前ISO 8601时间戳
     - `{{PROJECT_DESCRIPTION}}` → $ARGUMENTS
   - 将 `spec.json` 和 `requirements.md` 写入规范目录

## 重要约束
- 在此阶段不要生成需求/设计/任务
- 遵循分阶段开发原则
- 保持严格的阶段分离
- 在此阶段仅执行初始化
</instructions>

## 工具指南
- 使用 **Glob** 检查现有规范目录以确保名称唯一性
- 使用 **Read** 获取模板: `init.json` 和 `requirements-init.md`
- 使用 **Write** 在替换占位符后创建 spec.json 和 requirements.md
- 在任何文件写入操作之前执行验证

## 输出描述
以 `spec.json` 中指定的语言提供输出，结构如下：

1. **生成的功能名称**: `feature-name` 格式，带1-2句理由，必须使用纯英文，不允许使用中文、日文、韩文等非ASCII字符
2. **项目摘要**: 简要摘要（1句）
3. **创建的文件**: 带完整路径的项目符号列表
4. **下一步**: 显示 `/sdd/spec-requirements <feature-name>` 的命令块
5. **注意事项**: 解释为什么仅执行了初始化（关于阶段分离的2-3句）

**格式要求**:
- 使用Markdown标题（##, ###）
- 将命令包装在代码块中
- 保持总输出简洁（少于250个汉字）
- 根据 `spec.json.language` 使用清晰、专业的语言

## 安全和回退
- **模糊的功能名称**: 如果功能名称生成不明确，提出2-3个选项并让用户选择
- **模板缺失**: 如果模板文件在 `.cursor/ssd/settings/templates/specs/` 中不存在，报告错误并指定缺失的文件路径，建议检查仓库设置
- **目录冲突**: 如果功能名称已存在，追加数字后缀（例如，`feature-name-2`）并通知用户自动冲突解决
- **写入失败**: 报告错误并指定路径，建议检查权限或磁盘空间

