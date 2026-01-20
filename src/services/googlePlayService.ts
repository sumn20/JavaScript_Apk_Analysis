// src/services/googlePlayService.ts
// Google Play URL解析和APKPure搜索服务

export interface GooglePlayInfo {
  packageName: string;
  originalUrl: string;
}

/**
 * 从Google Play URL中提取包名
 * @param url - Google Play URL
 * @returns 包名信息
 */
export function parseGooglePlayUrl(url: string): GooglePlayInfo | null {
  try {
    // 支持多种Google Play URL格式
    const patterns = [
      // https://play.google.com/store/search?q=com.purpur.ohio&c=apps&hl=zh-CN
      /[?&]q=([a-zA-Z0-9._]+)/,
      // https://play.google.com/store/apps/details?id=com.purpur.ohio
      /[?&]id=([a-zA-Z0-9._]+)/,
      // 直接包名格式
      /^([a-zA-Z0-9._]+)$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        const packageName = match[1];
        // 验证包名格式
        if (isValidPackageName(packageName)) {
          return {
            packageName,
            originalUrl: url
          };
        }
      }
    }

    return null;
  } catch (error) {
    console.error('解析Google Play URL失败:', error);
    return null;
  }
}

/**
 * 验证包名格式
 * @param packageName - 包名
 * @returns 是否有效
 */
function isValidPackageName(packageName: string): boolean {
  // Android包名格式：至少包含一个点，由字母、数字、下划线组成
  const pattern = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;
  return pattern.test(packageName);
}

/**
 * 构建APKPure搜索页面URL
 * @param packageName - 应用包名
 * @returns 搜索页面URL
 */
export function getAPKPureSearchUrl(packageName: string): string {
  console.log(`🔍 构建APKPure搜索页面: ${packageName}`);
  return `https://apkpure.com/search?q=${encodeURIComponent(packageName)}`;
}