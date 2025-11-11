/**
 * 应用配置管理
 * 从 public/config.json 加载配置项
 */

export interface AppConfig {
  // 应用基本信息
  app: {
    name: string;
    description: string;
    version: string;
  };

  // 页脚配置
  footer: {
    // GitHub 项目地址
    projectUrl: string;
    projectLabel: string;

    // ICP 备案信息
    icp?: {
      enabled: boolean;
      number: string;
      url: string;
      label: string;
    };

    // 其他链接
    links?: Array<{
      label: string;
      url: string;
      icon?: string;
    }>;

    // 版权信息
    copyright?: string;
  };

  // SDK 规则库配置
  rules?: {
    bundleUrl?: string;
    updateCheckInterval?: number; // 毫秒
  };
}

// 默认配置
const DEFAULT_CONFIG: AppConfig = {
  app: {
    name: 'APK SDK 分析工具',
    description: '快速识别 Android 应用中的 SDK 和第三方库',
    version: '1.0.0',
  },
  footer: {
    projectUrl: 'https://github.com/LibChecker/LibChecker-Rules',
    projectLabel: '规则库',
    copyright: '© 2025 APK Analyzer. All rights reserved.',
  },
};

let cachedConfig: AppConfig | null = null;

/**
 * 加载配置文件
 * @returns 应用配置
 */
export async function loadConfig(): Promise<AppConfig> {
  // 如果已经缓存，直接返回
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/config.json');

    if (!response.ok) {
      console.warn(`Failed to load config: ${response.status} ${response.statusText}, using default config`);
      cachedConfig = DEFAULT_CONFIG;
      return DEFAULT_CONFIG;
    }

    const config = await response.json();
    cachedConfig = mergeConfig(DEFAULT_CONFIG, config);
    return cachedConfig;
  } catch (error) {
    console.warn('Failed to load /config.json:', error);
    console.warn('Using default config');
    cachedConfig = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  }
}

/**
 * 获取缓存的配置（不加载新配置）
 * @returns 应用配置或 null
 */
export function getConfig(): AppConfig | null {
  return cachedConfig;
}

/**
 * 合并配置：深度合并用户配置和默认配置
 * @param defaults 默认配置
 * @param overrides 用户配置
 * @returns 合并后的配置
 */
function mergeConfig(defaults: AppConfig, overrides: Partial<AppConfig>): AppConfig {
  return {
    app: {
      ...defaults.app,
      ...(overrides.app || {}),
    },
    footer: {
      ...defaults.footer,
      ...(overrides.footer || {}),
      icp: overrides.footer?.icp
        ? {
            ...defaults.footer.icp,
            ...overrides.footer.icp,
          }
        : defaults.footer.icp,
      links: overrides.footer?.links || defaults.footer.links,
    },
    rules: {
      ...defaults.rules,
      ...(overrides.rules || {}),
    },
  };
}
