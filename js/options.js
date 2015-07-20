var basicNav, chSt, forgotNav, persistent, saveButton, toggleActive, toggleContent;

chSt = chrome.storage.sync;

chSt.get(null, function(settings) {
  var messageSetting, persistentSetting;
  messageSetting = document.querySelector('#messageSetting');
  persistentSetting = document.querySelector('#persistentSetting');
  messageSetting.value = settings.userMessage;
  if (settings.persistent === 'on') {
    return persistentSetting.setAttribute('checked', 'checked');
  }
});

basicNav = document.querySelector('#nav_basic');

forgotNav = document.querySelector('#nav_forgot');

toggleActive = function() {
  [].forEach.call(document.querySelectorAll('.navigation li'), function(li) {
    li.classList.toggle('active');
  });
};

toggleContent = function() {
  [].forEach.call(document.querySelectorAll('.settings-content'), function(content) {
    content.classList.toggle('hide');
  });
};

basicNav.addEventListener('click', function(e) {
  e.preventDefault();
  console.log(this);
  if (this.classList.contains('active') === false) {
    toggleActive();
    return toggleContent();
  }
});

forgotNav.addEventListener('click', function(e) {
  e.preventDefault();
  if (this.classList.contains('active') === false) {
    toggleActive();
    return toggleContent();
  }
});

persistent = document.querySelector('#persistentSetting');

saveButton = document.querySelector('#saveButton');

persistent.addEventListener('click', function() {
  if (this.checked) {
    return this.value = 'on';
  } else {
    return this.value = 'off';
  }
});

saveButton.addEventListener('click', function(e) {
  var message;
  message = document.querySelector('#messageSetting');
  persistent = document.querySelector('#persistentSetting');
  return chSt.set({
    userMessage: message.value,
    persistent: persistent.value
  }, function() {
    var updateMessage;
    updateMessage = document.querySelector('#updateMessage');
    updateMessage.textContent = "Settings Updated.";
    return setTimeout(function() {
      return updateMessage.textContent = '';
    }, 2500);
  });
});
