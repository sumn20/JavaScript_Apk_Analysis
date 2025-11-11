#!/bin/bash

# APK分析工具 - Git推送脚本
# 用法: ./push.sh "提交信息"
# 示例: ./push.sh "修复SDK列表显示问题"

if [ -z "$1" ]; then
  echo "❌ 错误：请提供提交信息"
  echo "用法: ./push.sh \"提交信息\""
  exit 1
fi

# 获取当前分支
BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🔍 检查git状态..."
git status

echo ""
echo "📝 添加所有更改..."
git add .

echo ""
echo "💾 提交代码..."
git commit -m "$1"

if [ $? -ne 0 ]; then
  echo "❌ 提交失败，可能没有新更改"
  exit 1
fi

echo ""
echo "🚀 推送到远程仓库..."
git push origin $BRANCH

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 推送成功！"
  echo "📍 分支: $BRANCH"
  echo "💬 信息: $1"
else
  echo "❌ 推送失败，请检查网络连接"
  exit 1
fi
