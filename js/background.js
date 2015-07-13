var chRt, chSt, chTb, isLocked, password, seeAll, tabsCommander;

chTb = chrome.tabs;

chRt = chrome.runtime;

chSt = chrome.storage.sync;

password = null;

isLocked = chSt.get(null, function(settings) {
  return settings.isLocked;
});

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

tabsCommander = function(cmd) {
  var commandType;
  commandType = null;
  switch (cmd) {
    case 'lockEverything':
      commandType = 'lock-everything';
  }
  return chTb.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chTb.connect(tab.id);
      return chTb.sendMessage(tab.id, {
        cmd: commandType
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
  switch (request.cmd) {
    case 'check-lock':
      return sendResponse({
        reply: isLocked
      });
    case 'lock-browser':
      chSt.get(null, function(settings) {
        if (settings.password !== null) {
          chSt.set({
            isLocked: true
          }, function() {});
          isLocked = true;
          tabsCommander('lockEverything');
        }
      });
      return sendResponse({
        reply: 'done with the commands'
      });
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  console.log(changes);
  isLocked = chSt.get(null, function(settings) {
    return settings.isLocked;
  });
});
