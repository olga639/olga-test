# 故障测试操作手册

## 📖 使用说明

本手册详细说明如何测试每种**启动失败**的故障类型，包括操作步骤、预期结果和验证方法。

**⚠️ 重要说明**：
- 本手册只包含**构建阶段失败**的错误类型
- 所有故障都会导致**Vercel部署失败**，应用无法启动
- 不包含运行时错误（启动成功但访问失败的情况）

---

## 🔨 构建错误类型总览

### 错误分类

| 分类 | 故障类型 | 严重程度 | 预期结果 |
|------|---------|---------|---------|
| 语法编译 | syntax-error | 高 | 编译失败 |
| 语法编译 | import-error | 高 | 模块找不到 |
| 语法编译 | typescript-error | 高 | 类型检查失败 |
| 语法编译 | undefined-variable | 高 | 变量未定义 |
| 依赖配置 | dependency-missing | 高 | 依赖安装失败 |
| 依赖配置 | dependency-version-conflict | 高 | 版本冲突 |
| 依赖配置 | env-variable-missing | 中 | 环境变量缺失 |
| 依赖配置 | vite-config-error | 高 | 配置错误 |
| 资源打包 | css-syntax-error | 中 | CSS编译失败 |
| 资源打包 | circular-dependency | 中 | 循环依赖 |
| 资源打包 | build-out-of-memory | 高 | 内存溢出 |
| 资源打包 | asset-size-exceeded | 中 | 文件过大 |

---

## 📋 详细测试步骤

### 1. JSX语法错误 (syntax-error)

**故障描述**：JSX语法错误，缺少闭合标签导致编译失败

**错误原因**：
- 缺少闭合标签 `</div>`
- JSX标签不匹配
- 括号、花括号不配对

**操作步骤**：

```bash
# 步骤1：注入故障
npm run chaos inject --type syntax-error

# 步骤2：查看变更
git diff src/pages/Home.jsx

# 步骤3：提交代码
git add .
git commit -m "feat: update home page layout"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Expected closing tag
  
  src/pages/Home.jsx:XX:X:
    XX │     </div>
       │     ^
    XX │   {/* Missing closing tag */}
       │
  
  error: Build failed with 1 error
  ```
- ✅ 部署状态：Failed
- ✅ 应用无法访问

**验证方法**：
1. 打开Vercel部署页面
2. 查看Build Logs
3. 确认错误信息包含 "Expected closing tag" 或 "Unexpected token"
4. 确认构建在编译阶段失败
5. 确认部署状态为 "Failed"

**故障分析平台应获取**：
- Commit SHA和消息
- 错误文件：`src/pages/Home.jsx`
- 错误行号
- 错误类型：Syntax Error
- 完整的Build日志

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: correct JSX syntax error"
git push origin main
```

---

### 2. 导入路径错误 (import-error)

**故障描述**：错误的import路径，导致模块无法找到

**错误原因**：
- 文件路径拼写错误
- 文件不存在
- 大小写不匹配
- 相对路径错误

**操作步骤**：

```bash
# 步骤1：注入故障
npm run chaos inject --type import-error

# 步骤2：查看变更
git diff src/App.jsx

# 步骤3：提交代码
git add .
git commit -m "refactor: reorganize imports"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Could not resolve "./pages/HomePage"
  
  src/App.jsx:X:XX:
    X │ import Home from './pages/HomePage';
      │                   ~~~~~~~~~~~~~~~~~~
      │
  
  error: Cannot find module './pages/HomePage'
  ```
- ✅ 部署状态：Failed

**验证方法**：
1. 检查Build Logs中的错误堆栈
2. 确认提示 "Cannot find module" 或 "Could not resolve"
3. 确认错误的导入路径被标记出来
4. 确认构建在模块解析阶段失败

**故障分析平台应获取**：
- 错误的导入路径
- 目标文件名
- 实际存在的文件名（对比）
- 建议的修复方案

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: correct import paths"
git push origin main
```

---

### 3. TypeScript类型错误 (typescript-error)

**故障描述**：类型定义错误导致TypeScript编译失败

**错误原因**：
- 类型不匹配
- 缺少类型定义
- 接口定义错误
- 泛型使用错误

**操作步骤**：

```bash
npm run chaos inject --type typescript-error
git add .
git commit -m "refactor: add type definitions"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Type 'string' is not assignable to type 'number'
  
  src/App.jsx:XX:X:
    XX │   const count: number = "123";
       │         ^^^^^
  ```

**验证方法**：
1. 确认错误信息包含类型相关描述
2. 确认指出了具体的类型冲突
3. 确认构建在类型检查阶段失败

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: correct type definitions"
git push origin main
```

---

### 4. 未定义变量 (undefined-variable)

**故障描述**：使用未定义的变量或函数

**错误原因**：
- 变量名拼写错误
- 忘记导入
- 作用域错误
- 函数未声明

**操作步骤**：

```bash
npm run chaos inject --type undefined-variable
git add .
git commit -m "feat: add new filtering feature"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败
- ✅ Build日志显示：
  ```
  ✘ [ERROR] 'unknownFunction' is not defined
  
  src/pages/TaskListPage.jsx:XX:X:
    XX │   const result = unknownFunction(data);
       │                  ^^^^^^^^^^^^^^^^^
  ```

**验证方法**：
1. 确认错误信息包含 "is not defined"
2. 确认指出了未定义的变量名
3. 确认构建在编译阶段失败

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: define missing variable"
git push origin main
```

---

### 5. 依赖包缺失 (dependency-missing)

**故障描述**：package.json中缺少必要的依赖包

**错误原因**：
- 忘记添加依赖
- 依赖被误删除
- package.json损坏

**操作步骤**：

```bash
npm run chaos inject --type dependency-missing
git add .
git commit -m "chore: update dependencies"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Install阶段）
- ✅ Build日志显示：
  ```
  npm ERR! code ERESOLVE
  npm ERR! ERESOLVE could not resolve
  npm ERR! 
  npm ERR! While resolving: castrel-webhook-demo@2.0.0
  npm ERR! Found: react@18.3.1
  npm ERR! Could not resolve dependency:
  npm ERR! peer react-router-dom@"*" from castrel-webhook-demo@2.0.0
  ```

**验证方法**：
1. 查看Build Logs的依赖安装阶段
2. 确认缺少的包名
3. 确认构建在 npm install 时就失败了
4. 确认没有进入编译阶段

**故障分析平台应获取**：
- 缺失的依赖包名
- package.json的diff
- 依赖安装日志

**恢复步骤**：
```bash
npm run chaos restore
npm install  # 重新安装依赖
git add .
git commit -m "fix: add missing dependency"
git push origin main
```

---

### 6. 依赖版本冲突 (dependency-version-conflict)

**故障描述**：依赖包版本不兼容

**错误原因**：
- 主依赖和子依赖版本冲突
- Peer dependency不满足
- 版本范围不兼容

**操作步骤**：

```bash
npm run chaos inject --type dependency-version-conflict
git add .
git commit -m "chore: upgrade dependencies"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Install阶段）
- ✅ Build日志显示：
  ```
  npm ERR! ERESOLVE unable to resolve dependency tree
  npm ERR! 
  npm ERR! While resolving: castrel-webhook-demo@2.0.0
  npm ERR! Found: react@18.3.1
  npm ERR! 
  npm ERR! Could not resolve dependency:
  npm ERR! peer react@"^17.0.0" from some-package@1.0.0
  ```

**验证方法**：
1. 确认错误信息包含版本冲突描述
2. 确认指出了冲突的包和版本
3. 确认构建在依赖解析阶段失败

**恢复步骤**：
```bash
npm run chaos restore
npm install
git add .
git commit -m "fix: resolve dependency conflicts"
git push origin main
```

---

### 7. 环境变量缺失 (env-variable-missing)

**故障描述**：构建时必需的环境变量缺失

**错误原因**：
- Vercel环境变量未配置
- .env文件未上传
- 环境变量名错误

**操作步骤**：

```bash
npm run chaos inject --type env-variable-missing
git add .
git commit -m "feat: add environment configuration"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Environment variable 'VITE_REQUIRED_VAR' is not defined
  
  vite.config.js:X:X:
    X │   const requiredVar = process.env.VITE_REQUIRED_VAR;
      │                       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ```

**验证方法**：
1. 确认错误信息包含环境变量名
2. 确认指出了缺失的变量
3. 检查Vercel项目设置中的环境变量配置

**故障分析平台应获取**：
- 缺失的环境变量名
- 在哪个文件中被引用
- 建议配置的位置

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: remove required env variable"
git push origin main

# 或者在Vercel中配置环境变量
```

---

### 8. Vite配置错误 (vite-config-error)

**故障描述**：vite.config.js配置错误

**错误原因**：
- 配置语法错误
- 插件配置错误
- 路径配置错误
- 选项不兼容

**操作步骤**：

```bash
npm run chaos inject --type vite-config-error
git add .
git commit -m "chore: update vite configuration"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  failed to load config from /vercel/path0/vite.config.js
  error during build:
  Error: Invalid configuration option
  ```

**验证方法**：
1. 确认错误信息指向vite.config.js
2. 确认描述了具体的配置错误
3. 确认构建在配置加载阶段失败

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: correct vite configuration"
git push origin main
```

---

### 9. CSS语法错误 (css-syntax-error)

**故障描述**：CSS或TailwindCSS配置错误

**错误原因**：
- CSS语法错误
- TailwindCSS指令错误
- PostCSS配置错误
- 选择器语法错误

**操作步骤**：

```bash
npm run chaos inject --type css-syntax-error
git add .
git commit -m "style: update global styles"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] CssSyntaxError: Unknown word
  
  src/styles/index.css:X:X:
    X │   @apply invalid-class-name;
      │          ^^^^^^^^^^^^^^^^^^
  ```

**验证方法**：
1. 确认错误信息包含CSS相关描述
2. 确认指出了具体的语法错误
3. 确认构建在样式编译阶段失败

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: correct CSS syntax"
git push origin main
```

---

### 10. 循环依赖 (circular-dependency)

**故障描述**：模块间存在循环依赖

**错误原因**：
- A导入B，B又导入A
- 多个模块形成依赖环
- 工具函数互相引用

**操作步骤**：

```bash
npm run chaos inject --type circular-dependency
git add .
git commit -m "refactor: reorganize utility functions"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  ✘ [ERROR] Circular dependency detected
  
  src/utils/helpers.js → src/utils/validators.js → src/utils/helpers.js
  ```

**验证方法**：
1. 确认错误信息包含 "Circular dependency"
2. 确认显示了依赖链路
3. 确认构建在模块解析阶段失败

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: resolve circular dependency"
git push origin main
```

---

### 11. 构建内存溢出 (build-out-of-memory)

**故障描述**：构建过程中内存不足

**错误原因**：
- 打包文件过大
- 内存配置不足
- 无限循环导致内存泄漏
- 构建配置不当

**操作步骤**：

```bash
npm run chaos inject --type build-out-of-memory
git add .
git commit -m "feat: add large dataset"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败（Build阶段）
- ✅ Build日志显示：
  ```
  <--- Last few GCs --->
  
  FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
  ```

**验证方法**：
1. 确认错误信息包含 "out of memory"
2. 确认显示了内存使用情况
3. 确认构建在打包阶段失败

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: optimize build memory usage"
git push origin main
```

---

### 12. 资源文件过大 (asset-size-exceeded)

**故障描述**：打包后的文件超过限制

**错误原因**：
- 单个文件过大
- 未进行代码分割
- 包含大量静态资源
- 未压缩优化

**操作步骤**：

```bash
npm run chaos inject --type asset-size-exceeded
git add .
git commit -m "feat: add rich content"
git push origin main
```

**预期结果**：
- ✅ Vercel构建失败或警告
- ✅ Build日志显示：
  ```
  (!) Some chunks are larger than 500 KBs after minification
  
  dist/assets/index-abc123.js (1.2 MB)
  
  ✘ [ERROR] Asset exceeds recommended size limit
  ```

**验证方法**：
1. 确认错误信息包含文件大小
2. 确认指出了超限的文件
3. 确认构建在打包或部署阶段失败

**恢复步骤**：
```bash
npm run chaos restore
git add .
git commit -m "fix: optimize asset size"
git push origin main
```

---

## 🔄 完整演练流程

### 标准测试流程

```bash
# 1. 选择要测试的故障类型
npm run chaos list

# 2. 查看故障详情
npm run chaos info --type syntax-error

# 3. 注入故障
npm run chaos inject --type syntax-error

# 4. 查看代码变更
git diff

# 5. 提交代码
git add .
git commit -m "test: inject syntax error"
git push origin main

# 6. 等待Vercel部署（约1-2分钟）
# 访问 https://vercel.com/your-project/deployments

# 7. 验证构建失败
# - 检查部署状态：Failed
# - 查看Build Logs
# - 确认错误信息

# 8. 故障分析平台验证
# - 确认收到GitHub Webhook
# - 确认获取到Commit信息
# - 确认获取到Build日志
# - 确认错误类型识别正确

# 9. 恢复正常
npm run chaos restore
git add .
git commit -m "fix: restore normal state"
git push origin main

# 10. 验证恢复成功
# - 检查部署状态：Success
# - 访问应用URL确认正常
```

---

## 📊 测试检查清单

### 构建错误测试清单

**语法和编译错误**：
- [ ] syntax-error - JSX语法错误
- [ ] import-error - 导入路径错误
- [ ] typescript-error - TypeScript类型错误
- [ ] undefined-variable - 未定义变量

**依赖和配置错误**：
- [ ] dependency-missing - 依赖包缺失
- [ ] dependency-version-conflict - 依赖版本冲突
- [ ] env-variable-missing - 环境变量缺失
- [ ] vite-config-error - Vite配置错误

**资源和打包错误**：
- [ ] css-syntax-error - CSS语法错误
- [ ] circular-dependency - 循环依赖
- [ ] build-out-of-memory - 构建内存溢出
- [ ] asset-size-exceeded - 资源文件过大

---

## 💡 最佳实践

### 测试前准备
1. ✅ 确保本地代码已提交
2. ✅ 确保Vercel项目已配置
3. ✅ 确保GitHub Webhook已设置
4. ✅ 准备好故障分析平台

### 测试过程中
1. ✅ 每次只测试一种故障
2. ✅ 详细记录Build日志
3. ✅ 截图保存错误信息
4. ✅ 记录部署失败的时间点

### 测试后清理
1. ✅ 使用 `npm run chaos restore` 恢复
2. ✅ 确认恢复后构建成功
3. ✅ 提交恢复的代码
4. ✅ 验证Vercel部署成功

---

## ⚠️ 重要注意事项

1. **所有故障都会导致部署失败**
   - 应用无法启动
   - 无法访问应用URL
   - 只能通过Build日志分析错误

2. **不要在生产环境测试**
   - 仅在测试/演练环境使用
   - 确保使用独立的Vercel项目

3. **及时恢复**
   - 测试完成后立即恢复
   - 避免错误代码长时间存在

4. **监控部署配额**
   - Vercel免费版有部署次数限制
   - 合理安排测试频率

---

## 🆘 故障排查

### 问题：CLI命令无法执行
**解决方案**：
```bash
node --version  # 需要 >= 16.x
rm -rf node_modules
npm install
```

### 问题：备份恢复失败
**解决方案**：
```bash
# 手动恢复
git checkout HEAD -- src/
```

### 问题：Vercel部署卡住
**解决方案**：
1. 登录Vercel控制台
2. 手动取消部署
3. 重新推送代码

---

## 📞 技术支持

如有问题，请查看：
- 项目README.md
- GitHub Issues

**祝测试顺利！** 🎉
