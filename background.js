// 后台脚本 - 监听网页导航
chrome.runtime.onInstalled.addListener(() => {
  // 初始化默认屏蔽网站列表（包含抖音相关域名）
  const defaultBlockedSites = [
    'douyin.com',
    'www.douyin.com',
    'm.douyin.com',
    'aweme.snssdk.com',
    'lf-cdn-tos.bytescm.com'
  ];
  
  chrome.storage.local.get(['blockedSites'], (result) => {
    if (!result.blockedSites) {
      chrome.storage.local.set({ blockedSites: defaultBlockedSites });
    }
  });
});

// 监听网页导航事件
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId === 0) { // 只处理主框架
    checkAndBlockSite(details.url, details.tabId);
  }
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    checkAndBlockSite(changeInfo.url, tabId);
  }
});

function checkAndBlockSite(url, tabId) {
  chrome.storage.local.get(['blockedSites'], (result) => {
    const blockedSites = result.blockedSites || [];
    const currentDomain = extractDomain(url);
    
    const isBlocked = blockedSites.some(site => {
      return currentDomain.includes(site) || url.includes(site);
    });
    
    if (isBlocked) {
      // 重定向到屏蔽页面
      chrome.tabs.update(tabId, {
        url: chrome.runtime.getURL('blocked.html') + '?blocked=' + encodeURIComponent(currentDomain)
      });
    }
  });
}

function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}