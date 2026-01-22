#!/bin/bash

# Browser MCP 配置验证脚本

echo "🔍 检查 Browser MCP 配置..."
echo ""

# 检查配置文件
CONFIG_FILE="$HOME/.cursor/mcp.json"

if [ -f "$CONFIG_FILE" ]; then
    echo "✅ 找到配置文件: $CONFIG_FILE"
    echo ""
    echo "📄 配置内容:"
    cat "$CONFIG_FILE" | jq '.' 2>/dev/null || cat "$CONFIG_FILE"
else
    echo "❌ 未找到配置文件: $CONFIG_FILE"
    echo ""
    echo "💡 建议配置:"
    cat << 'EOF'
{
  "mcpServers": {
    "browser": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
EOF
fi

echo ""
echo "🔍 检查依赖..."

# 检查 npx
if command -v npx &> /dev/null; then
    echo "✅ npx 已安装"
else
    echo "❌ npx 未安装，请安装 Node.js"
fi

# 检查 Puppeteer
if npx -y @modelcontextprotocol/server-puppeteer --help &> /dev/null; then
    echo "✅ Puppeteer MCP Server 可用"
else
    echo "⚠️  Puppeteer MCP Server 首次使用时会自动安装"
fi

echo ""
echo "📚 使用指南:"
echo "1. 在 Cursor 中请求 AI 访问网页"
echo "2. 示例: '请打开 https://example.com 并截图'"
echo ""

