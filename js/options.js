var chRt, chSt, gPassButton, link, linksLi, persistent, pwdButton, saveButton, toggleActive, toggleContent, _i, _len;

chSt = chrome.storage.sync;

chRt = chrome.runtime;

chSt.get(null, function(settings) {
  var messageSetting, noSet, persistentSetting, withSet;
  noSet = document.querySelector('#noSettings');
  withSet = document.querySelector('#withSettings');
  if (settings.hasOwnProperty('password')) {
    withSet.classList.toggle('hide');
    messageSetting = document.querySelector('#messageSetting');
    persistentSetting = document.querySelector('#persistentSetting');
    messageSetting.value = settings.userMessage !== null && typeof settings.userMessage !== 'undefined' ? settings.userMessage : '';
    if (settings.persistent === 'on') {
      return persistentSetting.setAttribute('checked', 'checked');
    }
  } else {
    return noSet.classList.toggle('hide');
  }
});

toggleActive = function(toActive) {
  [].forEach.call(document.querySelectorAll('.navigation li'), function(li) {
    if (li.classList.contains('active')) {
      return li.classList.toggle('active');
    }
  });
  document.querySelector(toActive).classList.toggle('active');
};

toggleContent = function(toActive) {
  [].forEach.call(document.querySelectorAll('.settings-content'), function(content) {
    if (content.classList.contains('hide') === false) {
      console.log('yes');
      return content.classList.add('hide');
    }
  });
  document.querySelector(toActive).classList.toggle('hide');
};

linksLi = document.querySelectorAll('.navigation li');

for (_i = 0, _len = linksLi.length; _i < _len; _i++) {
  link = linksLi[_i];
  link.addEventListener('click', function() {
    var content, isActive, liId;
    content = this.dataset.content;
    isActive = this.classList.contains('active');
    liId = '#' + this.id;
    if (isActive === false) {
      toggleActive(liId);
      toggleContent(content);
    }
  });
}

persistent = document.querySelector('#persistentSetting');

saveButton = document.querySelector('#saveButton');

pwdButton = document.querySelector('#updatePasswordButton');

gPassButton = document.querySelector('#gPasswordButton');

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

pwdButton.addEventListener('click', function(e) {
  var currentPass, newPass, passMessage, rePass;
  passMessage = document.querySelector('#updatePasswordMessage');
  currentPass = document.querySelector('#currentPassword');
  newPass = document.querySelector('#newPassword');
  rePass = document.querySelector('#retypePassword');
  if (newPassword.value !== rePass.value) {
    passMessage.textContent = 'Password Mismatched, Please Retype Your Password.';
    return setTimeout(function() {
      return passMessage.textContent = '';
    }, 2500);
  } else {
    return chSt.get(null, function(settings) {
      if (settings.password !== newPass.value) {
        passMessage.textContent = 'Incorrect Password.';
        return setTimeout(function() {
          return passMessage.textContent = '';
        }, 2500);
      } else {
        return chSt.set({
          password: newPassword.value
        }, function() {
          passMessage.textContent = 'Password Updated';
          currentPassword.value = '';
          newPassword.value = '';
          rePass.value = '';
          return setTimeout(function() {
            return passMessage.textContent = '';
          }, 2500);
        });
      }
    });
  }
});

gPassButton.addEventListener('click', function(e) {
  var gPassMessage, newPass, rePass;
  newPass = document.querySelector('#gNewPass');
  rePass = document.querySelector('#gRePass');
  gPassMessage = document.querySelector('#gPasswordMessage');
  if (newPass.value !== rePass.value) {
    gPassMessage.textContent = 'Password Mismatched, Please Retype Your Password.';
    return setTimeout(function() {
      return gPassMessage.textContent = '';
    }, 2500);
  } else if (newPass.value.length === 0 || rePass.value.length === 0) {
    gPassMessage.textContent = 'All Fields Are Required.';
    return setTimeout(function() {
      return gPassMessage.textContent = '';
    }, 2500);
  } else {
    return chSt.set({
      password: newPass.value
    }, function() {
      var noSet, withSet;
      noSet = document.querySelector('#noSettings');
      withSet = document.querySelector('#withSettings');
      noSet.classList.toggle('hide');
      return withSet.classList.toggle('hide');
    });
  }
});
