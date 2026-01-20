// src/components/ContactMe.tsx
// 联系我组件

import { useState } from 'react';

interface ContactMeProps {
  onClose: () => void;
}

export default function ContactMe({ onClose }: ContactMeProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 微信二维码图片URL - 根据环境使用正确的路径
  const getImagePath = () => {
    // 在生产环境中，base 是 /analysis/，所以需要加上这个前缀
    const isProduction = window.location.hostname === 'sumn20.github.io';
    return isProduction ? '/analysis/wechat-qr.jpg' : '/wechat-qr.jpg';
  };
  
  const wechatQRCode = getImagePath();

  const handleImageLoad = () => {
    console.log('微信二维码加载成功');
    setImageLoaded(true);
  };

  const handleImageError = (error: any) => {
    console.error('微信二维码加载失败:', error);
    console.error('尝试加载的URL:', wechatQRCode);
    setImageError(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content contact-me" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📱 联系我</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="contact-section">
            <h3>🤝 添加微信好友</h3>
            
            <div className="qr-code-container">
              {!imageLoaded && !imageError && (
                <div className="qr-loading">
                  <div className="loading-spinner"></div>
                  <p>加载中...</p>
                </div>
              )}
              
              {imageError ? (
                <div className="qr-placeholder">
                  <div className="qr-placeholder-content">
                    <div className="qr-placeholder-icon">📱</div>
                    <p>二维码加载失败</p>
                    <p>文件路径: <code>{wechatQRCode}</code></p>
                    <p>请检查文件是否存在</p>
                  </div>
                </div>
              ) : (
                <img
                  src={wechatQRCode}
                  alt="微信二维码"
                  className={`qr-code ${imageLoaded ? 'loaded' : 'loading'}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}