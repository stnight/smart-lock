(function() {
  this.App = {
    settings: {},
    init: function() {
      if (localStorage.settings) {
        return this.settings = localStorage.settings;
      } else {
        return console.log('New User');
      }
    },
    appLock: null
  };

}).call(this);
