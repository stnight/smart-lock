var body;

body = document.querySelector('body');

body.addEventListener('click', function(event) {
  return chrome.runtime.sendMessage({
    greetings: 'hello, please connect to me'
  }, function(response) {
    return console.log(response.reply);
  });
});

chrome.runtime.onConnect.addListener(function(e) {
  return console.log('someone is connected');
});

chrome.runtime.onMessage.addListener(function(message, sender, response) {
  return console.log(message.text);
});
