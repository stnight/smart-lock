var LockApp;

LockApp = {
  chRt: chrome.runtime,
  init: function() {
    this.chRt.sendMessage({
      cmd: 'check-lock'
    }, function(response) {
      if (response.reply === true) {
        return LockApp.lockTab();
      }
    });
  },
  lockTab: function() {
    var body, wrapper;
    body = document.querySelector('body');
    wrapper = document.createElement('div');
    wrapper.className = 'sl-wrapper';
    body.classList.add('rel');
    return body.appendChild(wrapper);
  }
};

LockApp.init();

LockApp.chRt.onConnect.addListener(function(e) {
  return console.log('someone is connected');
});

LockApp.chRt.onMessage.addListener(function(message, sender, response) {
  return console.log(message.text);
});

document.addEventListener('keyup', function(e) {
  if (e.ctrlKey && e.keyCode === 81) {
    return LockApp.chRt.sendMessage({
      greetings: 'lockBrowser'
    }, function(response) {
      return console.log(response.reply);
    });
  }
}, false);
