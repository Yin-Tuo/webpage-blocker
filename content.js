// 内容脚本 - 在页面加载时检查是否需要屏蔽
(function() {
  'use strict';
  
  const currentDomain = window.location.hostname;
  const currentUrl = window.location.href;
  
  chrome.storage.local.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    
    const isBlocked = blockedSites.some(site => {
      return currentDomain.includes(site) || currentUrl.includes(site);
    });
    
    if (isBlocked) {
      // 立即停止页面加载
      window.stop();
      
      // 清空页面内容
      document.documentElement.innerHTML = '';
      
      // 显示屏蔽警告
      showBlockedWarning(currentDomain);
    }
  });
  
  function showBlockedWarning(domain) {
    document.body.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 999999;
      ">
        <div style="
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          max-width: 500px;
          margin: 20px;
        ">
          <div style="
            font-size: 60px;
            margin-bottom: 20px;
          ">🚫</div>
          <h1 style="
            color: #e74c3c;
            margin: 0 0 20px 0;
            font-size: 28px;
            font-weight: bold;
          ">网站已被屏蔽</h1>
          <p style="
            color: #555;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 30px 0;
          ">
            域名 <strong>${domain}</strong> 已被添加到屏蔽列表中。<br>
            为了你的专注和效率，请离开此网站。
          </p>
          <button onclick="closeTab()" style="
            background: #e74c3c;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
          " onmouseover="this.style.background='#c0392b'" onmouseout="this.style.background='#e74c3c'">
            强制退出
          </button>
        </div>
      </div>
    `;
    
    // 防止用户通过开发者工具绕过
    setInterval(() => {
      if (document.body.children.length === 0 || !document.body.innerHTML.includes('网站已被屏蔽')) {
        location.href = 'about:blank';
      }
    }, 1000);
    
    // 添加关闭标签页的函数到全局
    window.closeTab = function() {
      window.close();
      // 如果无法关闭，则重定向到空白页
      setTimeout(() => {
        location.href = 'about:blank';
      }, 100);
    };
    
    // 阻止页面导航
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      return '';
    });
  }
})();