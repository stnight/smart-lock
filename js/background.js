var chRt, chSt, chTb, isLocked, password, tabsCommander, userMessage;

chTb = chrome.tabs;

chRt = chrome.runtime;

chSt = chrome.storage.sync;

password = null;

isLocked = chSt.get(null, function(settings) {
  return settings.isLocked;
});

userMessage = chSt.get(null, function(settings) {
  return settings.userMessage;
});

tabsCommander = function(cmd, txt) {
  var reply;
  if (txt == null) {
    txt = null;
  }
  reply = {};
  switch (cmd) {
    case 'lockEverything':
      reply.cmd = 'lock-everything';
      break;
    case 'noPassword':
      reply.cmd = 'no-password';
      break;
    case 'unlockAttempt':
      reply.cmd = 'unlock-attempt';
      reply.result = txt;
      break;
    case 'unlockAll':
      reply.cmd = 'unlock-all';
  }
  return chTb.query({}, function(tabs) {
    tabs.forEach(function(tab) {
      chTb.connect(tab.id);
      return chTb.sendMessage(tab.id, reply);
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
        if (settings.password !== null && typeof settings.password !== 'undefined' && settings.password !== '') {
          chSt.set({
            isLocked: true
          }, function() {});
          isLocked = true;
          tabsCommander('lockEverything');
        } else if (settings.password === '' || settings.password === null || typeof settings.password === 'undefined') {
          tabsCommander('noPassword');
        }
      });
      return sendResponse({
        reply: 'done with the commands'
      });
    case 'validate-password':
      return chSt.get(null, function(settings) {
        if (request.password === settings.password) {
          tabsCommander('unlockAttempt', true);
          isLocked = false;
          chSt.set({
            isLocked: false
          }, function() {});
        } else {
          tabsCommander('unlockAttempt', false);
        }
      });
    case 'all-no-password':
      return tabsCommander('unlockAll');
  }
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
  return isLocked = chSt.get(null, function(settings) {
    settings.isLocked;
  });
});
