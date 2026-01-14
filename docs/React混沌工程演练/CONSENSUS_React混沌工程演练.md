# CONSENSUS - React混沌工程演练

## 📋 需求共识

### 项目目标
构建一个React混沌工程演练Demo系统，用于模拟真实的故障场景，支持故障分析平台的演练和测试。

### 核心价值
- 为故障分析平台提供真实的测试数据（Build日志、Commit信息、错误代码）
- 支持快速、可重复的故障演练
- 模拟真实的开发和部署流程

---

## 🎯 明确的需求描述

### 1. React应用要求
**功能范围**：
- 多页面应用（至少3-4个页面）
- 组件化架构（Header、Footer、Card、List等可复用组件）
- 路由系统（React Router）
- 状态管理（React Hooks + Context API）
- 异步数据加载（Mock数据）
- 样式系统（TailwindCSS）
- 错误边界处理

**技术栈**：
- React 18.x
- Vite（构建工具）
- React Router v6
- TailwindCSS
- npm（包管理）

**应用示例**：一个简单的博客/任务管理/电商展示应用

### 2. 故障类型覆盖

需要支持以下10-12种常见故障类型：

#### A. 构建阶段错误（3-4种）
1. **语法错误**：JSX语法错误、括号不匹配
2. **导入路径错误**：错误的import路径、文件不存在
3. **依赖缺失**：package.json中缺少必要依赖
4. **环境变量错误**：缺少必需的环境变量

#### B. 运行时错误（4-5种）
5. **组件崩溃**：访问undefined属性、null引用
6. **无限循环**：useEffect依赖配置错误导致无限渲染
7. **状态管理错误**：异步状态更新冲突
8. **路由错误**：路由配置错误、404处理
9. **API调用错误**：Mock API超时、返回错误数据

#### C. 资源加载错误（2种）
10. **静态资源404**：图片、字体文件路径错误
11. **代码分割失败**：动态import失败

#### D. 性能问题（1-2种）
12. **内存泄漏**：未清理的定时器、事件监听器

### 3. 故障注入机制

**核心设计**：CLI工具 + 真实错误代码模板

**CLI命令**：
```bash
# 注入故障
npm run chaos inject --type <fault-type>

# 恢复正常
npm run chaos restore

# 列出所有故障类型
npm run chaos list

# 查看故障详情
npm run chaos info --type <fault-type>
```

**工作流程**：
1. 用户执行`npm run chaos inject --type component-crash`
2. CLI工具自动：
   - 备份当前文件到`.chaos-backup/`
   - 将错误代码模板注入到目标文件
   - 显示变更摘要
3. 用户提交代码：`git add . && git commit && git push`
4. Vercel自动部署，触发错误
5. GitHub Webhook通知故障分析平台
6. 平台获取真实的Build日志和Commit Diff
7. 用户执行`npm run chaos restore`恢复正常

**关键特性**：
- ✅ 注入的是真实的错误代码，而非配置开关
- ✅ 每次注入都会产生真实的Git Commit
- ✅ 故障分析平台可以看到真实的错误代码变更
- ✅ 支持快速恢复到正常状态

---

## 🏗️ 技术实现方案

### 系统架构

```
castrel-webhook-demo/
├── src/                          # React应用源码
│   ├── components/               # 可复用组件
│   ├── pages/                    # 页面组件
│   ├── hooks/                    # 自定义Hooks
│   ├── utils/                    # 工具函数
│   ├── App.jsx                   # 应用入口
│   └── main.jsx                  # Vite入口
├── chaos-templates/              # 错误代码模板库
│   ├── build-errors/
│   ├── runtime-errors/
│   ├── resource-errors/
│   └── performance-issues/
├── scripts/                      # CLI工具脚本
│   ├── chaos-cli.js              # CLI主程序
│   ├── inject.js                 # 故障注入逻辑
│   ├── restore.js                # 恢复逻辑
│   └── list.js                   # 列出故障类型
├── .chaos-backup/                # 备份目录（git ignore）
├── package.json
├── vite.config.js
└── README.md
```

### 核心模块设计

#### 1. CLI工具（scripts/chaos-cli.js）
```javascript
// 核心功能
- parseCommand()      // 解析命令行参数
- injectFault()       // 注入故障
- restoreFault()      // 恢复正常
- listFaults()        // 列出所有故障类型
- showFaultInfo()     // 显示故障详情
```

#### 2. 错误模板系统
每个错误模板包含：
- **错误代码**：真实的React错误代码
- **目标文件**：需要注入的文件路径
- **错误描述**：故障类型说明
- **预期结果**：部署后的预期错误信息

#### 3. 备份恢复系统
- 自动备份修改前的文件到`.chaos-backup/`
- 支持一键恢复
- 防止数据丢失

### 技术约束

1. **兼容性**：
   - Node.js >= 16.x
   - 支持现代浏览器（Chrome、Firefox、Safari、Edge）

2. **性能**：
   - 首屏加载 < 2s（无故障时）
   - CLI命令响应 < 1s

3. **安全性**：
   - 备份文件不提交到Git
   - 敏感信息使用.env管理

4. **可维护性**：
   - 代码遵循前端规范
   - 清晰的注释和文档
   - 模块化设计

---

## 🎯 验收标准

### 功能验收

#### 1. React应用
- [ ] 应用可以正常启动和运行
- [ ] 至少包含3个页面，路由正常工作
- [ ] 组件化架构清晰，可复用组件至少5个
- [ ] 样式美观，使用TailwindCSS
- [ ] 包含Mock数据和异步加载
- [ ] 错误边界正常工作

#### 2. 故障注入CLI
- [ ] `npm run chaos inject --type <type>` 正常工作
- [ ] `npm run chaos restore` 可以恢复正常
- [ ] `npm run chaos list` 显示所有故障类型
- [ ] 支持至少10种故障类型
- [ ] 自动备份机制正常工作

#### 3. 错误模板
- [ ] 每种故障类型都有对应的错误代码模板
- [ ] 注入的错误代码是真实的React错误
- [ ] 错误可以在Vercel部署时被触发
- [ ] Build日志包含清晰的错误信息

#### 4. 集成验收
- [ ] 完整的演练流程可以顺利执行
- [ ] Git Commit信息真实反映代码变更
- [ ] Vercel部署可以正常触发错误
- [ ] 错误信息清晰可追溯

### 质量验收

#### 1. 代码质量
- [ ] 遵循前端代码规范
- [ ] 代码可读性良好
- [ ] 无明显的代码异味
- [ ] 关键函数有注释

#### 2. 文档质量
- [ ] README.md 包含完整的使用说明
- [ ] 每种故障类型有详细说明
- [ ] 演练流程有清晰的步骤指引
- [ ] CLI命令有使用示例

#### 3. 用户体验
- [ ] CLI命令输出友好，有清晰的提示
- [ ] 错误提示信息明确
- [ ] 操作步骤简单，易于上手

---

## 🔄 集成方案

### Vercel部署配置

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### GitHub Webhook配置

**Webhook事件**：
- `push` - 代码推送时触发
- `deployment_status` - 部署状态变化时触发

**Payload包含**：
- Commit信息（作者、时间、消息、Diff）
- Build日志（Vercel提供）
- 部署状态（成功/失败）

### 故障分析平台需要的数据

1. **Commit信息**：
   - Commit SHA
   - Commit message
   - 代码变更Diff
   - 作者和时间

2. **Build日志**：
   - 完整的构建输出
   - 错误堆栈信息
   - 失败原因

3. **部署信息**：
   - 部署状态
   - 部署时间
   - 部署URL（如果成功）

---

## 📦 交付物清单

### 代码交付
1. ✅ 完整的React应用源码
2. ✅ CLI工具脚本
3. ✅ 10-12个错误代码模板
4. ✅ Vite配置文件
5. ✅ package.json（包含所有依赖和scripts）
6. ✅ .gitignore（排除备份目录）

### 文档交付
1. ✅ README.md（项目说明和快速开始）
2. ✅ CHAOS_GUIDE.md（故障类型详细说明）
3. ✅ DEMO_WORKFLOW.md（演练流程指南）
4. ✅ CLI_USAGE.md（CLI工具使用手册）

### 配置交付
1. ✅ vercel.json（Vercel部署配置）
2. ✅ .env.example（环境变量示例）

---

## ⚠️ 风险与限制

### 已知限制
1. **不包含故障分析平台**：只提供Demo应用，不包含Webhook接收端
2. **Mock数据**：所有API调用都是Mock的，无真实后端
3. **简化的错误场景**：只覆盖最常见的错误类型
4. **手动Git操作**：需要用户手动提交和推送代码

### 潜在风险
1. **备份丢失**：如果用户手动删除`.chaos-backup/`目录
   - 缓解措施：CLI工具检查备份是否存在
2. **Git冲突**：如果用户在注入故障后修改了其他文件
   - 缓解措施：提示用户先恢复再进行其他操作
3. **Vercel配额**：频繁部署可能超出免费配额
   - 缓解措施：文档中说明注意事项

---

## ✅ 最终确认

### 所有不确定性已解决
- ✅ 故障注入方式：真实错误代码 + CLI工具
- ✅ 故障触发方式：手动修改配置后Git推送
- ✅ 故障恢复方式：CLI工具一键恢复
- ✅ 系统架构：React应用 + CLI工具 + 错误模板库
- ✅ 技术栈：Vite + React 18 + TailwindCSS
- ✅ 交付范围：应用 + CLI + 模板 + 文档

### 准备进入下一阶段
所有关键决策已确认，需求边界清晰，技术方案可行。

**下一步：进入 Architect 阶段，设计详细的系统架构。**

