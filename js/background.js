var seeAll;

seeAll = function() {
  return chrome.tabs.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chrome.tabs.connect(tab.id);
      return chrome.tabs.sendMessage(tab.id, {
        text: 'Hello from backgroundscript'
      });
    });
  });
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.greetings === 'hello, please connect to me') {
    seeAll();
    sendResponse({
      reply: 'ok wait'
    });
  }
});
