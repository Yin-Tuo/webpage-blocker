document.addEventListener('DOMContentLoaded', function() {
  const websiteInput = document.getElementById('websiteInput');
  const addBtn = document.getElementById('addBtn');
  const blockedList = document.getElementById('blockedList');
  const statsText = document.getElementById('statsText');
  
  // 加载并显示已屏蔽的网站
  loadBlockedSites();
  
  // 添加网站按钮事件
  addBtn.addEventListener('click', addWebsite);
  
  // 回车键添加网站
  websiteInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      addWebsite();
    }
  });
  
  function addWebsite() {
    const website = websiteInput.value.trim();
    if (!website) {
      alert('请输入网站域名');
      return;
    }
    
    // 简单的域名格式验证
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    const cleanDomain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    
    if (!domainRegex.test(cleanDomain) && !cleanDomain.includes('.')) {
      alert('请输入有效的域名格式，如：example.com');
      return;
    }
    
    chrome.storage.local.get(['blockedSites'], function(result) {
      const blockedSites = result.blockedSites || [];
      
      if (blockedSites.includes(cleanDomain)) {
        alert('该网站已在屏蔽列表中');
        return;
      }
      
      blockedSites.push(cleanDomain);
      chrome.storage.local.set({ blockedSites: blockedSites }, function() {
        websiteInput.value = '';
        loadBlockedSites();
        alert('网站已添加到屏蔽列表');
      });
    });
  }
  
  function loadBlockedSites() {
    chrome.storage.local.get(['blockedSites'], function(result) {
      const blockedSites = result.blockedSites || [];
      
      if (blockedSites.length === 0) {
        blockedList.innerHTML = '<div class="stats">暂无屏蔽网站</div>';
        statsText.textContent = '';
        return;
      }
      
      let html = '';
      blockedSites.forEach(site => {
        html += `<div class="blocked-item">${site}</div>`;
      });
      
      blockedList.innerHTML = html;
      statsText.textContent = `共屏蔽 ${blockedSites.length} 个网站`;
    });
  }
});