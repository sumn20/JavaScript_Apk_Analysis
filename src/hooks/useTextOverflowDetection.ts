/**
 * 自动检测文字是否被框遮挡的 Hook（增强版）
 *
 * 原理:
 * 1. 监听容器和文字元素的尺寸变化
 * 2. 计算文字元素所需的容器高度
 * 3. 如果当前高度不足，自动增加容器的 min-height
 * 4. 自动调整 padding 保持视觉平衡
 * 5. 支持响应式调整
 */

import { useEffect, useRef, useState } from 'react';

interface TextOverflowConfig {
  containerSelector: string;      // 容器选择器（如 '.upload-zone'）
  textSelector: string;            // 文字元素选择器（如 '.upload-info'）
  minPaddingBottom?: number;       // 最小底部 padding（默认 40px）
  minPaddingTop?: number;          // 最小顶部 padding（默认 32px）
  checkInterval?: number;          // 检查间隔时间（默认 500ms）
  adjustHeight?: boolean;          // 是否自动调整高度（默认 true）
  debug?: boolean;                 // 是否输出调试信息
}

export function useTextOverflowDetection({
  containerSelector,
  textSelector,
  minPaddingBottom = 40,
  minPaddingTop = 32,
  checkInterval = 500,
  adjustHeight = true,
  debug = false,
}: TextOverflowConfig) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [adjustedPadding, setAdjustedPadding] = useState<number | null>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setInterval>>();
  const observerRef = useRef<ResizeObserver>();
  const originalMinHeightRef = useRef<string>('');

  // 执行检测逻辑
  const checkTextOverflow = () => {
    const container = document.querySelector(containerSelector) as HTMLElement;
    const textElement = document.querySelector(textSelector) as HTMLElement;

    if (!container || !textElement) {
      if (debug) console.warn(`[TextOverflow] 未找到元素: ${containerSelector} 或 ${textSelector}`);
      return;
    }

    // 保存原始的 min-height（仅第一次）
    if (!originalMinHeightRef.current) {
      originalMinHeightRef.current = window.getComputedStyle(container).minHeight;
    }

    // 获取元素的位置和尺寸信息（相对于 container 内部坐标）
    const containerRect = container.getBoundingClientRect();
    const textRect = textElement.getBoundingClientRect();

    // 计算文字相对于容器的位置
    const textTopInContainer = textRect.top - containerRect.top;
    const textBottomInContainer = textRect.bottom - containerRect.top;
    const textHeight = textRect.height;

    // 获取容器的 padding
    const computedStyle = window.getComputedStyle(container);
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const currentMinHeight = containerRect.height;

    // 计算需要的最小高度：
    // = 顶部 padding + 文字距离顶部的距离 + 文字高度 + 底部 padding
    const requiredHeight = paddingTop + textBottomInContainer + minPaddingBottom;

    const bottomGap = containerRect.bottom - textRect.bottom;
    const topGap = textRect.top - containerRect.top - paddingTop;

    if (debug) {
      console.log(`[TextOverflow] 详细检测:`, {
        containerHeight: containerRect.height,
        textHeight: textHeight.toFixed(2),
        textTopInContainer: textTopInContainer.toFixed(2),
        textBottomInContainer: textBottomInContainer.toFixed(2),
        paddingTop: paddingTop,
        paddingBottom: paddingBottom,
        requiredHeight: requiredHeight.toFixed(2),
        bottomGap: bottomGap.toFixed(2),
        topGap: topGap.toFixed(2),
        isOverflowing: bottomGap < minPaddingBottom || topGap < minPaddingTop,
      });
    }

    // 如果文字被遮挡（顶部或底部）
    if (bottomGap < minPaddingBottom || topGap < minPaddingTop) {
      setIsOverflowing(true);

      if (adjustHeight) {
        // 自动调整容器高度
        const neededHeight = Math.ceil(requiredHeight);

        if (debug) {
          console.log(`[TextOverflow] 调整 min-height: ${currentMinHeight}px → ${neededHeight}px`);
        }

        container.style.minHeight = `${neededHeight}px`;
      } else {
        // 如果不调整高度，则调整 padding
        const currentPadding = parseFloat(computedStyle.paddingBottom) || 0;
        const neededPadding = Math.ceil(currentPadding - bottomGap + 8);

        if (debug) {
          console.log(`[TextOverflow] 调整 padding-bottom: ${currentPadding}px → ${neededPadding}px`);
        }

        container.style.paddingBottom = `${neededPadding}px`;
        setAdjustedPadding(neededPadding);
      }
    } else {
      // 文字未被遮挡
      if (isOverflowing) {
        setIsOverflowing(false);

        if (adjustHeight) {
          // 恢复原始 min-height
          container.style.minHeight = originalMinHeightRef.current;

          if (debug) {
            console.log(`[TextOverflow] 恢复原始 min-height: ${originalMinHeightRef.current}`);
          }
        } else {
          container.style.paddingBottom = '';
          setAdjustedPadding(null);

          if (debug) {
            console.log(`[TextOverflow] 恢复原始 padding-bottom`);
          }
        }
      }
    }
  };

  useEffect(() => {
    // 初始检测
    checkTextOverflow();

    // 定时检测（处理异步加载等情况）
    checkTimeoutRef.current = setInterval(checkTextOverflow, checkInterval);

    // 使用 ResizeObserver 监听容器和文字元素的尺寸变化
    const container = document.querySelector(containerSelector);
    const textElement = document.querySelector(textSelector);

    if (container && textElement) {
      observerRef.current = new ResizeObserver(() => {
        // 清除之前的定时器，立即执行检测
        if (checkTimeoutRef.current) {
          clearInterval(checkTimeoutRef.current);
        }

        checkTextOverflow();

        // 重新开始定时检测
        checkTimeoutRef.current = setInterval(checkTextOverflow, checkInterval);
      });

      observerRef.current.observe(container);
      observerRef.current.observe(textElement);
    }

    // 监听窗口大小变化（响应式）
    const handleResize = () => {
      if (checkTimeoutRef.current) {
        clearInterval(checkTimeoutRef.current);
      }
      checkTextOverflow();
      checkTimeoutRef.current = setInterval(checkTextOverflow, checkInterval);
    };

    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      if (checkTimeoutRef.current) {
        clearInterval(checkTimeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [containerSelector, textSelector, checkInterval, debug]);

  return {
    isOverflowing,
    adjustedPadding,
  };
}

/**
 * 使用示例:
 *
 * ```tsx
 * export default function FileUploader() {
 *   // 检测 .upload-zone 中的 .upload-info 是否被遮挡
 *   useTextOverflowDetection({
 *     containerSelector: '.upload-zone',
 *     textSelector: '.upload-info',
 *     minPaddingBottom: 40,
 *     debug: false  // 生产环境设为 false
 *   });
 *
 *   return (
 *     <div className="upload-zone">
 *       <p className="upload-info">支持的文件格式: .apk | 最大文件大小: 500MB</p>
 *     </div>
 *   );
 * }
 * ```
 */
