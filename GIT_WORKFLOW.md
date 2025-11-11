# Git 工作流说明

## 项目仓库

```
git@github.com:ShellMonster/JavaScript_Apk_Analysis.git
```

## 快速推送

项目已配置推送脚本，使用以下命令快速提交和推送代码：

```bash
./push.sh "提交信息（中文）"
```

### 示例

```bash
# 修复SDK列表显示问题
./push.sh "修复SDK列表高度显示不正确的问题"

# 优化图标间距
./push.sh "优化图标间距和字体大小"

# 添加新功能
./push.sh "添加黑暗模式支持"
```

## 手动操作

如果不使用脚本，可以按照标准 git 流程：

```bash
# 查看状态
git status

# 添加所有更改
git add .

# 提交代码（用中文描述）
git commit -m "提交信息（中文）"

# 推送到远程
git push origin main
```

## 提交信息规范

所有提交信息请使用中文，格式如下：

```
简短描述（一句话，50字以内）

详细说明（可选）：
- 修改项1
- 修改项2
- 修改项3
```

### 示例

```
修复最近分析列表高度显示过高问题

- 减少.lib-header的padding从10px改为3px
- 修改line-height从1.2改为1
- 减少列表项gap从8px改为4px
- 调整响应式布局
```

## 查看提交历史

```bash
# 查看最近5条提交
git log --oneline -5

# 查看详细提交信息
git log -p -5

# 查看某个文件的修改历史
git log --oneline src/App.tsx
```

## 注意事项

1. **始终保持提交信息清晰易懂**
   - 使用中文描述改动内容
   - 一行简短描述 + 可选的详细说明

2. **定期推送代码**
   - 完成一个功能或修复一个bug后立即推送
   - 避免长时间本地积累大量更改

3. **检查代码质量**
   - 提交前运行 `pnpm build` 检查编译
   - 确保代码没有TypeScript错误
   - 测试关键功能

4. **保持分支整洁**
   - 所有开发直接在 `main` 分支
   - 避免创建多余的分支（除非需要长期特性开发）

## 常用命令速查

```bash
# 推送代码（推荐使用脚本）
./push.sh "提交信息"

# 手动推送
git add .
git commit -m "提交信息"
git push origin main

# 查看状态
git status

# 查看修改
git diff

# 查看提交历史
git log --oneline -10

# 撤销最后一次提交（未推送）
git reset --soft HEAD~1

# 撤销某个文件的修改（未提交）
git checkout -- 文件路径
```

## 问题排除

### 推送被拒绝

```bash
# 从远程拉取最新代码
git pull origin main

# 解决冲突后重新推送
git push origin main
```

### 提交信息写错了

```bash
# 修改最后一次提交信息（未推送）
git commit --amend -m "新的提交信息"
```

### 不小心提交了不应该提交的文件

```bash
# 移除文件但保留本地副本
git rm --cached 文件路径
echo "文件路径" >> .gitignore

# 提交这个修改
git commit -m "移除不需要的文件"
```

---

**祝你编码愉快！🚀**
