document.getElementById('go').onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    if (tab?.url?.includes('google.com/maps')) {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'togglePanel' });
      } catch (e) {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
        await chrome.scripting.insertCSS({ target: { tabId: tab.id }, files: ['content.css'] });
      }
      window.close();
    } else {
      chrome.tabs.create({ url: 'https://www.google.com/maps' });
    }
  });
};
