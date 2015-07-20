var LockApp, Wtchr;

Wtchr = {
  chSt: chrome.storage.sync,
  init: function() {
    return this.chSt.get(null, function(settings) {
      if (settings.persistent === 'on') {
        return Wtchr.watch();
      }
    });
  },
  watch: function() {
    var config, dialog, observer;
    dialog = document.querySelector('.sl-dialog');
    observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        return console.log(mutation);
      });
    });
    config = {
      attributes: true,
      childList: true,
      characterData: true
    };
    observer.observe(dialog, config);
  }
};

LockApp = {
  chRt: chrome.runtime,
  chSt: chrome.storage.sync,
  isLocked: false,
  hint: null,
  init: function() {
    this.chSt.get(null, function(settings) {
      return LockApp.hint = settings.hint;
    });
    this.chRt.sendMessage({
      cmd: 'check-lock'
    }, function(response) {
      if (response.reply === true) {
        LockApp.isLocked = true;
        return LockApp.chSt.get(null, function(settings) {
          if (settings.userMessage !== '' || settings.userMessage !== null || settings.userMessage.length > 0) {
            return LockApp.lockTab(settings.userMessage);
          } else {
            return LockApp.lockTab();
          }
        });
      }
    });
  },
  lockTab: function(systemMessage) {
    var body, clearFix, dialog, dialogTitle, errorLabel, form, formButton, hintLabel, hintLink, hintText, message, passwordInput, row_1, row_2;
    if (systemMessage == null) {
      systemMessage = null;
    }
    body = document.querySelector('body');
    dialog = document.createElement('dialog');
    dialog.classList.add('sl-dialog');
    dialogTitle = document.createElement('h3');
    dialogTitle.textContent = 'YOUR BROWSER IS LOCKED';
    message = document.createElement('h4');
    message.textContent = systemMessage;
    form = document.createElement('form');
    passwordInput = document.createElement('input');
    formButton = document.createElement('button');
    errorLabel = document.createElement('label');
    row_1 = document.createElement('div');
    row_2 = document.createElement('div');
    row_1.classList.add('row');
    row_2.classList.add('row');
    clearFix = document.createElement('div');
    clearFix.classList.add('clear');
    errorLabel.classList.add('error', 'row');
    form.setAttribute('id', 'slForm');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('placeholder', 'Your Password');
    passwordInput.setAttribute('required', 'required');
    passwordInput.classList.add('sl-password', 'column', 'two-third');
    formButton.textContent = 'UNLOCK';
    formButton.classList.add('column', 'one-third');
    row_1.appendChild(passwordInput);
    row_1.appendChild(formButton);
    row_1.appendChild(clearFix);
    hintLabel = document.createElement('label');
    hintLink = document.createElement('a');
    hintText = document.createElement('span');
    hintLink.setAttribute('id', 'hintLink');
    hintLink.setAttribute('href', '#');
    hintLink.textContent = 'Hint:';
    hintText.setAttribute('id', 'hintText');
    hintLabel.setAttribute('id', 'hintLabel');
    hintLabel.appendChild(hintLink);
    hintLabel.appendChild(hintText);
    row_2.appendChild(hintLabel);
    form.appendChild(row_1);
    form.appendChild(errorLabel);
    form.appendChild(row_2);
    dialog.appendChild(dialogTitle);
    dialog.appendChild(message);
    dialog.appendChild(form);
    body.appendChild(dialog);
    dialog.showModal();
    this.formFunction();
    return Wtchr.init();
  },
  formFunction: function() {
    var form, hintLink, hintText, password;
    form = document.querySelector('#slForm');
    password = document.querySelector('input[type=password]');
    hintLink = document.querySelector('a#hintLink');
    hintText = document.querySelector('span#hintText');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      LockApp.chRt.sendMessage({
        cmd: 'validate-password',
        password: password.value
      }, function(response) {
        console.log(response);
        return LockApp.checkAuth(response.reply);
      });
    });
    hintLink.addEventListener('click', function(event) {
      event.preventDefault();
      hintText.textContent = ' ' + LockApp.hint;
    });
  },
  checkAuth: function(result) {
    var errorLabel;
    errorLabel = document.querySelector('label.error');
    if (result === false) {
      errorLabel.textContent = 'Your Password Is Incorrect';
    }
  },
  unlockTab: function() {
    var dialog;
    dialog = document.querySelector('dialog.sl-dialog');
    dialog.close();
    return dialog.remove();
  }
};

LockApp.init();

LockApp.chRt.onConnect.addListener(function(e) {
  return console.log('someone is connected');
});

document.addEventListener('keyup', function(e) {
  if (e.ctrlKey && e.keyCode === 81) {
    return LockApp.chRt.sendMessage({
      cmd: 'lock-browser'
    }, function(response) {
      return console.log(true);
    });
  }
}, false);

LockApp.chRt.onMessage.addListener(function(message, sender, response) {
  if (message.cmd === 'lock-everything' && LockApp.isLocked === false) {
    LockApp.isLocked = true;
    LockApp.chSt.get(null, function(settings) {
      if (settings.userMessage !== '' || settings.userMessage === null || settings.userMessage.length > 0) {
        return LockApp.lockTab(settings.userMessage);
      } else {
        return LockApp.lockTab();
      }
    });
  }
  if (message.cmd === 'unlock-attempt') {
    if (message.result === false) {
      return LockApp.checkAuth(message.result);
    } else {
      return LockApp.unlockTab();
    }
  }
});
