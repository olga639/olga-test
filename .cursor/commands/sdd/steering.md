<meta>
description: Manage .cursor/ssd/steering/ as persistent project knowledge
</meta>

# SDD Steering管理

<background_information>
**角色**: 维护 `.cursor/ssd/steering/` 作为持久项目记忆。

**使命**:
- Bootstrap: 从代码库生成核心steering（首次）
- Sync: 保持steering和代码库对齐（维护）
- Preserve: 用户自定义是神圣的，更新是添加式的

**成功标准**:
- Steering捕获模式和原则，而非详尽列表
- 检测并报告代码漂移
- 所有 `.cursor/ssd/steering/*.md` 同等对待（核心+自定义）
</background_information>

<instructions>
## 场景检测

检查 `.cursor/ssd/steering/` 状态：

**Bootstrap模式**: 为空或缺少核心文件（product.md、tech.md、structure.md）  
**Sync模式**: 所有核心文件存在

---

## Bootstrap流程

1. 从 `.cursor/ssd/settings/templates/steering/` 加载模板
2. 分析代码库（JIT）:
   - `glob_file_search` 查找源文件
   - `read_file` 读取README、package.json等
   - `grep` 查找模式
3. 提取模式（非列表）:
   - Product: 目的、价值、核心能力
   - Tech: 框架、决策、约定
   - Structure: 组织、命名、导入
4. 生成steering文件（遵循模板）
5. 从 `.cursor/ssd/settings/rules/steering-principles.md` 加载原则
6. 呈现摘要以供审查

**焦点**: 指导决策的模式，而非文件/依赖项的目录。

---

## Sync流程

1. 加载所有现有steering（`.cursor/ssd/steering/*.md`）
2. 分析代码库的变化（JIT）
3. 检测漂移:
   - **Steering → Code**: 缺失元素 → 警告
   - **Code → Steering**: 新模式 → 更新候选
   - **自定义文件**: 检查相关性
4. 提出更新（添加式，保留用户内容）
5. 报告: 更新、警告、建议

**更新理念**: 添加，不替换。保留用户章节。

---

## 粒度原则

来自 `.cursor/ssd/settings/rules/steering-principles.md`:

> "如果新代码遵循现有模式，steering不应该需要更新。"

记录模式和原则，而非详尽列表。

**不好**: 列出目录树中的每个文件  
**好**: 用示例描述组织模式

</instructions>

## 工具指南

- `glob_file_search`: 查找源/配置文件
- `read_file`: 读取steering、文档、配置
- `grep`: 搜索模式
- `list_dir`: 分析结构

**JIT策略**: 需要时获取，不预先获取。

## 输出描述

仅聊天摘要（文件直接更新）。

### Bootstrap:
```
✅ Steering Created

## Generated:
- product.md: [Brief description]
- tech.md: [Key stack]
- structure.md: [Organization]

Review and approve as Source of Truth.
```

### Sync:
```
✅ Steering Updated

## Changes:
- tech.md: React 18 → 19
- structure.md: Added API pattern

## Code Drift:
- Components not following import conventions

## Recommendations:
- Consider api-standards.md
```

## 示例

### Bootstrap
**Input**: Empty steering, React TypeScript project  
**Output**: 3 files with patterns - "Feature-first", "TypeScript strict", "React 19"

### Sync
**Input**: Existing steering, new `/api` directory  
**Output**: Updated structure.md, flagged non-compliant files, suggested api-standards.md

## 安全和回退

- **安全**: 永远不要包含密钥、密码、秘密（参见原则）
- **不确定性**: 报告两种状态，询问用户
- **保留**: 有疑问时添加而非替换

## 注意事项

- 所有 `.cursor/ssd/steering/*.md` 作为项目记忆加载
- 模板和原则是外部的，用于自定义
- 关注模式，而非目录
- "黄金法则": 遵循模式的新代码不应该需要steering更新
- 避免记录代理特定工具目录（例如 `.cursor/`、`.gemini/`、`.claude/`）
- `.cursor/ssd/settings/` 内容不应记录在steering文件中（设置是元数据，而非项目知识）
- 对 `.cursor/ssd/specs/` 和 `.cursor/ssd/steering/` 的轻量引用是可以接受的；避免其他 `.cursor/ssd/` 目录

