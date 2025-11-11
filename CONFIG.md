# 项目配置说明

本项目使用 `public/config.json` 文件进行配置管理，支持动态修改项目信息、页脚链接和 ICP 备案信息等。

## 配置文件位置

```
public/config.json
```

## 配置文件结构

### 完整配置示例

```json
{
  "app": {
    "name": "APK SDK 分析工具",
    "description": "快速识别 Android 应用中的 SDK 和第三方库",
    "version": "1.0.0"
  },
  "footer": {
    "projectUrl": "https://github.com/ShellMonster/JavaScript_Apk_Analysis",
    "projectLabel": "查看源码",
    "icp": {
      "enabled": false,
      "number": "12345678",
      "url": "https://beian.miit.gov.cn/",
      "label": "ICP 备案号"
    },
    "copyright": "© 2025 APK Analyzer. All rights reserved."
  },
  "rules": {
    "bundleUrl": "https://raw.githubusercontent.com/LibChecker/LibChecker-Rules/master/",
    "updateCheckInterval": 86400000
  }
}
```

## 配置项详解

### `app` - 应用基本信息

| 字段 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `name` | 应用名称 | `string` | `"APK SDK 分析工具"` |
| `description` | 应用描述 | `string` | `"快速识别 Android 应用中的 SDK 和第三方库"` |
| `version` | 应用版本 | `string` | `"1.0.0"` |

### `footer` - 页脚配置

#### 基础配置

| 字段 | 说明 | 类型 | 必需 | 默认值 |
|------|------|------|------|--------|
| `projectUrl` | 项目 GitHub 地址 | `string` | ✅ | `"https://github.com/ShellMonster/JavaScript_Apk_Analysis"` |
| `projectLabel` | 项目链接文本 | `string` | ✅ | `"查看源码"` |
| `copyright` | 版权信息 | `string` | ❌ | `"© 2025 APK Analyzer. All rights reserved."` |

#### ICP 备案配置

```json
{
  "icp": {
    "enabled": false,
    "number": "12345678",
    "url": "https://beian.miit.gov.cn/",
    "label": "ICP 备案号"
  }
}
```

| 字段 | 说明 | 类型 | 必需 | 默认值 |
|------|------|------|------|--------|
| `enabled` | 是否启用 ICP 显示 | `boolean` | ✅ | `false` |
| `number` | ICP 备案号 | `string` | ✅ | `"12345678"` |
| `url` | ICP 查询链接 | `string` | ✅ | `"https://beian.miit.gov.cn/"` |
| `label` | ICP 链接文本 | `string` | ✅ | `"ICP 备案号"` |

### `rules` - SDK 规则库配置

| 字段 | 说明 | 类型 | 必需 | 默认值 |
|------|------|------|------|--------|
| `bundleUrl` | 规则库 CDN 地址 | `string` | ❌ | 无 |
| `updateCheckInterval` | 版本检查间隔（毫秒） | `number` | ❌ | `86400000`（24 小时） |

## 使用示例

### 示例 1: 启用 ICP 备案显示

```json
{
  "footer": {
    "icp": {
      "enabled": true,
      "number": "京ICP备2025001234号-1",
      "url": "https://beian.miit.gov.cn/",
      "label": "ICP 备案号"
    }
  }
}
```

### 示例 2: 修改项目链接

```json
{
  "footer": {
    "projectUrl": "https://gitee.com/your-org/your-repo",
    "projectLabel": "Gitee 源码"
  }
}
```

### 示例 3: 修改版权信息

```json
{
  "footer": {
    "copyright": "© 2025 Your Company. All rights reserved. | Terms | Privacy"
  }
}
```

## 配置加载流程

1. 应用启动时，`App.tsx` 的 `useEffect` 会自动调用 `loadConfig()`
2. `loadConfig()` 从 `public/config.json` 获取配置
3. 如果文件不存在或加载失败，使用内置默认配置
4. 配置被缓存在内存中，避免重复请求
5. 页脚和其他组件读取配置并渲染相应内容

## 开发和部署

### 开发环境

在开发环境中，修改 `public/config.json` 后需要：

```bash
# 开发服务器会自动监测 public 目录的变化
# 刷新浏览器查看效果
```

### 生产环境

1. **打包前修改配置**：
   ```bash
   # 修改 public/config.json
   vim public/config.json

   # 构建项目
   pnpm build
   ```

2. **部署后修改配置**（推荐）：
   - 直接修改部署目录中的 `config.json`
   - 无需重新构建，只需刷新浏览器

3. **Docker 部署**：
   - 使用 volume 挂载 `config.json`
   - 在容器运行时动态注入配置

   ```dockerfile
   # Dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY dist /app/dist
   COPY public/config.json /app/dist/
   # ... 其他配置
   ```

## 类型定义

如果在代码中需要访问配置，可以使用以下 TypeScript 类型：

```typescript
import { loadConfig, getConfig, type AppConfig } from './config';

// 异步加载配置
const config = await loadConfig();

// 获取已缓存的配置
const cachedConfig = getConfig();

// 配置类型定义
interface AppConfig {
  app: {
    name: string;
    description: string;
    version: string;
  };
  footer: {
    projectUrl: string;
    projectLabel: string;
    icp?: {
      enabled: boolean;
      number: string;
      url: string;
      label: string;
    };
    copyright?: string;
  };
  rules?: {
    bundleUrl?: string;
    updateCheckInterval?: number;
  };
}
```

## 常见问题

### Q: 修改了 config.json 但页面没有更新？

A: 检查以下几点：
1. 确认修改的是 `public/config.json` 而不是其他文件
2. 重新启动开发服务器或刷新浏览器
3. 检查浏览器控制台是否有错误信息

### Q: ICP 链接显示不出来？

A: 确保配置中的 `icp.enabled` 设置为 `true`：

```json
{
  "footer": {
    "icp": {
      "enabled": true,
      "number": "12345678",
      "url": "https://beian.miit.gov.cn/",
      "label": "ICP 备案号"
    }
  }
}
```

### Q: 如何在多个环境使用不同的配置？

A: 建议的方案：

```bash
# 创建环境特定的配置文件
public/config.dev.json      # 开发环境
public/config.prod.json     # 生产环境
public/config.test.json     # 测试环境

# 在构建脚本中动态选择：
# build: "cp public/config.$NODE_ENV.json public/config.json && vite build"
```

## 最佳实践

1. **版本控制**: 使用 `.gitignore` 排除环境特定的配置
   ```
   # .gitignore
   public/config.*.json      # 忽略环境特定配置
   !public/config.json       # 保留默认配置
   ```

2. **验证配置**: 定期检查 JSON 格式是否正确
   ```bash
   # 使用 jq 验证 JSON
   jq . public/config.json
   ```

3. **备份配置**: 在修改前备份配置文件
   ```bash
   cp public/config.json public/config.json.bak
   ```

4. **记录变更**: 在版本控制中记录配置变更
   ```bash
   git log -p public/config.json
   ```

## 相关文件

- 配置文件: `public/config.json`
- 配置加载模块: `src/config.ts`
- 主应用组件: `src/App.tsx`
- 页脚样式: `src/styles/App.css`
