# ALIGNMENT - React混沌工程演练

## 📋 原始需求

用户需要构建一个React混沌工程演练Demo项目，具备以下核心要求：

1. **独立React测试项目**：不依赖后端服务的完整React应用
2. **故障类型总结**：梳理常见的React启动/运行错误类型
3. **故障注入控制**：用户通过简单配置即可注入对应类型的故障

---

## 🎯 项目上下文分析

### 现有项目结构
- **项目名称**：castrel-webhook-demo
- **当前状态**：简单的静态HTML项目
- **技术栈**：Node.js构建脚本 + 静态HTML
- **构建方式**：通过`build.js`复制文件到`public`目录
- **现有故障注入**：在`build.js`中硬编码了构建错误注入

### 技术栈决策
基于项目现状和需求，推荐技术栈：
- **React框架**：React 18.x（最新稳定版）
- **构建工具**：Vite（快速、现代化）
- **包管理器**：npm（与现有package.json保持一致）
- **样式方案**：TailwindCSS（符合前端规范）
- **状态管理**：React Hooks + Context API（轻量级，无需MobX）
- **路由**：React Router v6（标准路由方案）

---

## 🔍 需求理解

### 1. React测试项目范围
**目标**：创建一个功能完整的React应用作为混沌工程演练的载体

**包含内容**：
- 多页面路由结构（首页、列表页、详情页等）
- 组件化架构（Header、Footer、Card等可复用组件）
- 状态管理示例（本地状态 + Context）
- 异步数据加载模拟（使用Mock数据）
- 样式系统（TailwindCSS）
- 错误边界处理

**不包含**：
- 真实后端API调用
- 用户认证系统
- 数据持久化
- 国际化（i18n）

### 2. 常见React错误类型分类

基于行业经验和React生态，常见错误类型包括：

#### A. 构建阶段错误
- **依赖安装失败**：npm install错误、版本冲突
- **编译错误**：语法错误、类型错误、导入路径错误
- **构建工具配置错误**：Vite/Webpack配置问题
- **环境变量缺失**：.env文件问题

#### B. 运行时错误
- **组件渲染错误**：JSX语法错误、未定义变量
- **生命周期错误**：useEffect无限循环、内存泄漏
- **状态管理错误**：状态更新错误、异步状态竞态
- **路由错误**：404、路由配置错误、导航失败
- **异步请求错误**：API调用失败、超时、网络错误
- **第三方库错误**：依赖库崩溃、API不兼容

#### C. 性能问题
- **内存泄漏**：未清理的订阅、定时器
- **无限循环渲染**：依赖数组配置错误
- **大数据渲染卡顿**：列表渲染性能问题

#### D. 资源加载错误
- **静态资源404**：图片、字体、CSS文件缺失
- **代码分割失败**：动态导入错误
- **CDN资源加载失败**：外部依赖不可用

### 3. 故障注入控制机制（重新设计）

**核心理念**：注入真实的错误代码，而非配置开关

**实现方案**：CLI工具 + 错误代码模板

#### 故障注入CLI工具
```bash
# 注入故障
npm run chaos inject --type <fault-type>

# 恢复正常
npm run chaos restore

# 列出所有可用的故障类型
npm run chaos list
```

#### 错误代码模板库结构
```
chaos-templates/
├── build-errors/
│   ├── syntax-error.js          # 语法错误模板
│   ├── import-error.js          # 导入路径错误
│   └── dependency-missing.js    # 依赖缺失
├── runtime-errors/
│   ├── component-crash.js       # 组件崩溃
│   ├── infinite-loop.js         # 无限循环
│   ├── state-error.js           # 状态管理错误
│   └── route-error.js           # 路由错误
├── resource-errors/
│   ├── image-404.js             # 图片资源404
│   └── chunk-load-fail.js       # 代码分割失败
└── performance-issues/
    ├── memory-leak.js           # 内存泄漏
    └── slow-render.js           # 渲染卡顿
```

#### 注入机制
```javascript
// CLI工具核心逻辑
// chaos-cli.js
const fs = require('fs');
const path = require('path');

function injectFault(faultType) {
  // 1. 读取对应的错误模板
  const template = fs.readFileSync(`chaos-templates/${faultType}.js`, 'utf-8');
  
  // 2. 备份原始文件
  backupOriginalFiles();
  
  // 3. 将错误代码注入到目标文件
  const targetFile = getTargetFile(faultType);
  fs.writeFileSync(targetFile, template);
  
  console.log(`✅ 故障已注入: ${faultType}`);
  console.log(`📝 请提交代码: git add . && git commit -m "your message" && git push`);
}

function restore() {
  // 从备份恢复原始文件
  restoreFromBackup();
  console.log(`✅ 已恢复正常状态`);
}
```

#### 工作流程示例
```bash
# 步骤1：注入组件崩溃错误
npm run chaos inject --type component-crash

# 步骤2：查看变更
git diff

# 步骤3：提交代码
git add .
git commit -m "feat: add user profile component"
git push

# 步骤4：Vercel部署失败，触发Webhook

# 步骤5：在故障分析平台查看真实的错误代码和日志

# 步骤6：修复错误（恢复正常）
npm run chaos restore
git add .
git commit -m "fix: resolve undefined variable issue"
git push
```

**优势**：
- ✅ Commit Diff显示真实的错误代码
- ✅ 故障分析平台可以获取真实的错误信息
- ✅ 符合真实的开发和故障场景
- ✅ 便于演练和教学

---

## ❓ 疑问澄清与决策

### 用户已确认的关键决策

1. **故障注入的控制粒度**
   - ✅ 决策：故障100%触发（简单开关控制）
   - 理由：确保演练效果可预测

2. **故障注入的触发时机**
   - ✅ 决策：手动修改配置文件后推送到仓库，通过Vercel部署触发
   - 理由：符合真实的故障分析场景

3. **故障恢复机制**
   - ✅ 决策：不需要故障恢复机制
   - 理由：通过Git回滚或修改配置文件重新部署即可

### 🎯 核心场景分析

**完整的故障分析流程**：
```
用户推送错误代码 
  ↓
GitHub仓库更新
  ↓
Vercel自动部署
  ↓
部署失败/运行时错误
  ↓
GitHub Webhook通知故障分析平台
  ↓
分析平台获取：
  - Vercel Build日志
  - GitHub Commit信息
  ↓
故障分析与展示
```

### ⚠️ 设计冲突分析

**问题识别**：
如果使用配置文件控制故障注入，会导致：
- Commit信息显示的是"修改配置文件"，而非真实的错误代码
- 无法从Commit Diff中看到实际的错误代码变更
- 故障分析平台难以定位真正的错误原因

**解决方案对比**：

#### 方案A：直接注入错误代码（推荐）✅
- **实现方式**：准备多个包含不同错误的代码分支/文件
- **优点**：
  - Commit信息真实反映错误代码
  - Diff可以清晰看到错误位置
  - 符合真实开发场景
  - 故障分析平台可以直接分析错误代码
- **缺点**：
  - 需要维护多个错误版本
  - 切换故障类型需要Git操作

#### 方案B：配置文件 + 代码注释切换
- **实现方式**：代码中预埋多种错误，通过配置文件激活
- **优点**：
  - 切换方便
  - 所有错误类型集中管理
- **缺点**：
  - Commit显示配置变更，不直观
  - 无法模拟真实的代码错误场景

#### 方案C：混合方案（最佳）⭐
- **实现方式**：
  1. **主分支**：正常运行的React应用
  2. **错误示例分支**：每种故障类型一个独立分支
  3. **快速切换脚本**：提供CLI工具快速制造错误
- **优点**：
  - 兼顾真实性和便捷性
  - Commit信息真实
  - 支持快速演练
- **实现**：
  ```bash
  # 快速注入故障
  npm run inject-fault component-crash
  git add .
  git commit -m "feat: add user profile component"
  git push
  
  # 恢复正常
  npm run restore
  git add .
  git commit -m "fix: resolve component crash issue"
  git push
  ```

### 📋 推荐的Demo系统设计

**核心设计原则**：
1. **真实性优先**：错误代码应该是真实的React代码错误，而非配置开关
2. **便捷性保障**：提供工具快速注入和恢复错误
3. **可追溯性**：每次错误都有清晰的Commit历史

**系统组成**：
1. **React应用本体**：一个功能完整的React应用（正常版本）
2. **故障注入CLI工具**：命令行工具快速制造错误
3. **错误代码模板库**：预定义的错误代码片段
4. **恢复脚本**：一键恢复到正常状态

**工作流程**：
```bash
# 1. 用户选择要注入的故障类型
npm run chaos inject --type component-crash

# 2. CLI工具自动修改代码（注入真实错误）
# 例如：在某个组件中引入未定义变量

# 3. 用户提交代码
git add .
git commit -m "feat: add new feature (含有错误)"
git push

# 4. Vercel部署失败或运行时错误

# 5. GitHub Webhook通知故障分析平台

# 6. 分析平台获取真实的错误代码和日志

# 7. 用户恢复正常
npm run chaos restore
git add .
git commit -m "fix: resolve the issue"
git push
```

### 自主决策的技术细节

4. **项目UI设计风格**
   - ✅ 决策：采用简洁现代的卡片式布局，使用TailwindCSS实现
   - 理由：符合前端规范，易于维护

5. **错误展示方式**
   - ✅ 决策：使用Toast通知 + ErrorBoundary全局捕获
   - 理由：用户体验友好，便于调试

6. **Mock数据方案**
   - ✅ 决策：使用本地JSON文件 + setTimeout模拟异步
   - 理由：无需额外依赖，简单直接

7. **故障类型优先级**
   - ✅ 决策：优先实现10-12种最常见的故障类型
   - 理由：覆盖80%的实际场景，避免过度设计

8. **故障注入实现方式**
   - ✅ 决策：采用**混合方案C**
   - 理由：平衡真实性和便捷性，最适合演练场景

---

## 🎯 任务边界确认

### 包含范围
✅ 完整的React应用（多页面、组件化、功能完整）
✅ 10-12种常见故障类型的错误代码模板
✅ CLI工具实现故障注入和恢复
✅ 错误代码模板库（真实的React错误代码）
✅ 备份和恢复机制
✅ 完整的项目文档（README、使用说明、故障类型说明）
✅ Vercel部署配置
✅ 演练操作指南

### 不包含范围
❌ 真实后端服务集成
❌ 用户认证和权限管理
❌ 数据持久化（数据库）
❌ 故障分析平台本身（只提供Demo应用）
❌ GitHub Webhook接收端（假设已存在）
❌ 复杂的性能监控系统
❌ Docker容器化部署
❌ 单元测试和E2E测试
❌ 可视化控制面板（改为CLI工具）

---

## 📊 技术约束

1. **兼容性**：支持现代浏览器（Chrome、Firefox、Safari、Edge最新版）
2. **性能**：首屏加载时间 < 2s（无故障注入时）
3. **代码规范**：遵循项目现有的前端代码规范
4. **依赖管理**：尽量减少第三方依赖，优先使用轻量级库
5. **文件大小**：打包后体积 < 500KB（gzip压缩前）

---

## 🚀 下一步行动

✅ **所有关键决策已确认**，准备进入**Architect阶段**

### 最终确认的设计方案

**系统架构**：
1. **React应用主体**：功能完整的多页面应用
2. **故障注入CLI**：命令行工具快速注入真实错误代码
3. **错误模板库**：10-12种预定义的错误代码模板
4. **备份恢复系统**：自动备份和恢复机制

**工作流程**：
```
用户执行CLI命令 → 注入真实错误代码 → Git提交 → Vercel部署 
→ 部署失败/运行时错误 → GitHub Webhook → 故障分析平台获取真实错误信息
```

**核心优势**：
- ✅ Commit信息真实反映错误代码
- ✅ 故障分析平台可以获取真实的Build日志和错误代码
- ✅ 符合真实的故障分析场景
- ✅ 操作简单，一键注入和恢复

准备进入**阶段2: Architect（架构阶段）**...

