seeAll = () ->
    chrome.tabs.query {}, (tabs) ->
        tabs.forEach (tab) ->
            chrome.tabs.connect tab.id
            chrome.tabs.sendMessage tab.id, {text: 'Hello from backgroundscript'}
        return

chrome.runtime.onMessage.addListener (request, sender, sendResponse) ->
    if request.greetings is 'hello, please connect to me'
        seeAll()
        sendResponse {reply: 'ok wait'}
        return