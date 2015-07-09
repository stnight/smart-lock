var chRt, chTb, isLocked, seeAll;

chTb = chrome.tabs;

chRt = chrome.runtime;

isLocked = true;

seeAll = function() {
  return chTb.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chTb.connect(tab.id);
      return chTb.sendMessage(tab.id, {
        text: 'Going to lock'
      });
    });
  });
};

chRt.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.greetings === 'lockBrowser') {
    seeAll();
    sendResponse({
      reply: 'ok wait'
    });
  }
});

chRt.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.cmd === 'check-lock') {
    return sendResponse({
      reply: isLocked
    });
  }
});
