var LockApp;

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
        return LockApp.lockTab();
      }
    });
  },
  lockTab: function() {
    var body, br, dialog, dialogTitle, form, formButton, hintLabel, hintLink, hintText, passwordInput;
    body = document.querySelector('body');
    dialog = document.createElement('dialog');
    dialog.classList.add('sl-dialog');
    dialogTitle = document.createElement('h3');
    dialogTitle.textContent = 'YOUR BROWSER IS LOCKED';
    form = document.createElement('form');
    passwordInput = document.createElement('input');
    formButton = document.createElement('button');
    br = document.createElement('br');
    form.setAttribute('id', 'slForm');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('placeholder', 'Your Password');
    passwordInput.setAttribute('required', 'required');
    passwordInput.classList.add('sl-password');
    formButton.textContent = 'UNLOCK';
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
    form.appendChild(passwordInput);
    form.appendChild(formButton);
    form.appendChild(br);
    form.appendChild(hintLabel);
    dialog.appendChild(dialogTitle);
    dialog.appendChild(form);
    body.appendChild(dialog);
    dialog.showModal();
    return this.formFunction();
  },
  formFunction: function() {
    var form, hintLink, hintText, password;
    form = document.querySelector('#slForm');
    password = document.querySelector('input[type=password]');
    hintLink = document.querySelector('a#hintLink');
    hintText = document.querySelector('span#hintText');
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      console.log(password.value);
    });
    hintLink.addEventListener('click', function(event) {
      event.preventDefault();
      return hintText.textContent = ' ' + LockApp.hint;
    });
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
    return LockApp.lockTab();
  }
});
