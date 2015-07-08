body = document.querySelector 'body'
body.addEventListener 'click', (event) ->
    chrome.runtime.sendMessage {greetings: 'hello, please connect to me'}, (response) ->
        console.log response.reply

chrome.runtime.onConnect.addListener (e) ->
    console.log 'someone is connected'

chrome.runtime.onMessage.addListener (message, sender, response) ->
    console.log message.text