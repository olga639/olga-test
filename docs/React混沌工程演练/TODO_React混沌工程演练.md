# TODO - 待办事项

## ✅ 已完成

- [x] React应用完整实现
- [x] CLI工具完整实现
- [x] 错误模板库（12种构建失败错误）
- [x] 完整文档编写
- [x] 故障测试操作手册
- [x] README和快速开始指南

---

## 📝 待配置事项

### 1. Vercel部署配置

**需要操作**：
1. 登录Vercel：https://vercel.com
2. 导入GitHub仓库
3. 配置项目设置：
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

**配置完成后**：
- 每次push到main分支会自动部署
- 可以在Vercel控制台查看Build日志

---

### 2. GitHub Webhook配置

**需要操作**：
1. 进入GitHub仓库设置
2. 点击 Settings → Webhooks → Add webhook
3. 配置Webhook：
   - Payload URL: `https://your-fault-analysis-platform.com/webhook`
   - Content type: `application/json`
   - Secret: (可选，用于验证)
   - Events: 选择以下事件
     - ✅ Pushes
     - ✅ Deployment status

**Webhook Payload示例**：
```json
{
  "ref": "refs/heads/main",
  "commits": [{
    "id": "abc123...",
    "message": "test: inject syntax error",
    "author": {...},
    "modified": ["src/pages/Home.jsx"]
  }],
  "repository": {...}
}
```

---

### 3. 环境变量配置（可选）

**如果需要环境变量**：
1. 在Vercel项目设置中添加
2. Settings → Environment Variables
3. 添加变量：
   - `VITE_APP_NAME` = TaskFlow
   - 其他自定义变量...

**注意**：
- 环境变量以 `VITE_` 开头才能在前端访问
- 修改后需要重新部署

---

### 4. 故障分析平台集成

**需要实现**：
1. Webhook接收端点
2. 解析GitHub Webhook数据
3. 获取Vercel Build日志
4. 分析错误类型
5. 生成故障报告

**Webhook接收端点示例**：
```javascript
// POST /webhook
app.post('/webhook', async (req, res) => {
  const { commits, repository } = req.body;
  
  // 1. 获取Commit信息
  const latestCommit = commits[0];
  
  // 2. 触发Vercel部署（自动）
  
  // 3. 等待部署完成
  
  // 4. 获取Build日志
  const buildLog = await fetchVercelBuildLog(deploymentId);
  
  // 5. 分析错误
  const errorAnalysis = analyzeBuildError(buildLog);
  
  // 6. 生成报告
  const report = generateReport({
    commit: latestCommit,
    buildLog,
    errorAnalysis
  });
  
  res.json({ success: true });
});
```

---

### 5. Vercel Build日志获取

**方式1：通过Vercel API**
```bash
# 获取部署列表
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.vercel.com/v6/deployments?projectId=YOUR_PROJECT_ID

# 获取Build日志
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.vercel.com/v1/deployments/DEPLOYMENT_ID/events
```

**方式2：通过Webhook**
- 配置Vercel Integration
- 接收deployment_status事件
- 从事件中获取日志URL

---

## 🔧 可选优化

### 1. 添加更多错误模板

当前12种错误类型已覆盖常见场景，如需扩展：
- 添加新的模板文件到 `chaos-templates/`
- 在 `faultRegistry.js` 中注册
- 更新文档

### 2. 自动化测试脚本

创建批量测试脚本：
```bash
#!/bin/bash
# test-all-faults.sh

faults=(
  "syntax-error"
  "import-error"
  "dependency-missing"
  # ... 其他故障类型
)

for fault in "${faults[@]}"; do
  echo "Testing $fault..."
  npm run chaos inject --type $fault
  git add .
  git commit -m "test: $fault"
  git push origin main
  sleep 120  # 等待部署
  npm run chaos restore
  git add .
  git commit -m "fix: restore from $fault"
  git push origin main
  sleep 60
done
```

### 3. CI/CD集成

添加GitHub Actions工作流：
```yaml
# .github/workflows/chaos-test.yml
name: Chaos Engineering Test

on:
  workflow_dispatch:
    inputs:
      fault_type:
        description: 'Fault type to inject'
        required: true
        type: choice
        options:
          - syntax-error
          - import-error
          - dependency-missing

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run chaos inject --type ${{ inputs.fault_type }}
      - run: git push
```

---

## 📞 需要支持的配置

### Vercel Token获取
1. 登录Vercel
2. Settings → Tokens
3. Create Token
4. 保存Token（用于API调用）

### GitHub Personal Access Token
1. GitHub Settings → Developer settings → Personal access tokens
2. Generate new token
3. 权限选择：
   - ✅ repo (Full control)
   - ✅ admin:repo_hook (Read/Write)

---

## ✅ 验证清单

部署完成后，请验证：

- [ ] Vercel项目已创建并连接GitHub
- [ ] 推送代码可以触发自动部署
- [ ] GitHub Webhook已配置
- [ ] Webhook可以成功接收事件
- [ ] 故障分析平台可以获取Build日志
- [ ] CLI工具可以正常注入和恢复故障
- [ ] 至少测试3种故障类型的完整流程

---

## 🎯 下一步行动

1. **立即执行**：
   - 部署到Vercel
   - 配置GitHub Webhook

2. **测试验证**：
   - 运行 `npm run chaos list`
   - 测试一个简单的故障（如syntax-error）
   - 验证完整流程

3. **集成开发**：
   - 开发Webhook接收端点
   - 实现Build日志获取
   - 实现错误分析逻辑

---

## 📝 备注

- 所有配置都是可选的，项目本身已经完整
- CLI工具可以在本地直接使用
- 部署到Vercel后才能测试完整的故障分析流程
- 建议先在测试环境验证，再应用到生产环境

**如有任何问题，请查看文档或提Issue！**

