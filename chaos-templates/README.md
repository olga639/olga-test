# 错误模板库

本目录包含用于混沌工程演练的错误代码模板。

## 📁 目录结构

```
chaos-templates/
├── build-errors/          # 构建错误模板
│   ├── syntax-error.template.jsx
│   ├── import-error.template.jsx
│   └── dependency-missing.template.json
├── runtime-errors/        # 运行时错误模板
│   ├── component-crash.template.jsx
│   ├── infinite-loop.template.jsx
│   ├── state-error.template.jsx
│   ├── route-error.template.jsx
│   └── api-timeout.template.js
├── resource-errors/       # 资源加载错误模板
│   ├── image-404.template.jsx
│   └── chunk-load-fail.template.jsx
└── performance-issues/    # 性能问题模板
    ├── memory-leak.template.jsx
    └── slow-render.template.jsx
```

## 📝 模板格式

每个模板文件包含元数据注释：

```javascript
/**
 * @fault-type: 故障类型ID
 * @category: 故障分类
 * @description: 故障描述
 * @expected-error: 预期错误信息
 * @target-file: 目标文件路径
 * @severity: 严重程度 (high/medium/low)
 */
```

## 🚀 使用方法

通过CLI工具注入故障：

```bash
npm run chaos inject --type <fault-type>
```

查看所有可用的故障类型：

```bash
npm run chaos list
```

## ⚠️ 注意事项

- 模板文件仅用于演练，不应在生产环境使用
- 注入故障前会自动备份原始文件
- 使用 `npm run chaos restore` 可以恢复正常状态

