var App;

App = {
  storage: chrome.storage.sync,
  noSettings: document.querySelector('#noSettings'),
  withSettings: document.querySelector('#withSettings'),
  passwordForm: document.querySelector('form#gettingStarted'),
  init: function() {
    this.storage.get(null, function(settings) {
      if (settings.hasOwnProperty('password')) {
        App.withSettings.classList.toggle('hidden');
      } else {
        App.noSettings.classList.toggle('hidden');
      }
    });
    this.watchEvent();
  },
  watchEvent: function() {
    this.passwordForm.addEventListener('submit', function(e) {
      var error, hintPw, mainPw, rePw;
      e.preventDefault();
      mainPw = document.querySelector('#mainPass').value;
      rePw = document.querySelector('#rePass').value;
      hintPw = document.querySelector('#hintPass').value;
      if (mainPw !== rePw) {
        error = document.querySelector('.error strong');
        error.innerHTML = 'Password Must Match!';
        setTimeout(function() {
          error.innerHTML = '';
        }, 750);
      } else {
        App.savePassword(mainPw, hintPw);
      }
    });
  },
  savePassword: function(password, hint) {
    this.storage.set({
      password: password,
      hint: hint,
      isLocked: false
    }, function() {
      App.noSettings.classList.toggle('hidden');
      App.withSettings.classList.toggle('hidden');
    });
  }
};

App.init();
