chTb = chrome.tabs
chRt = chrome.runtime
isLocked = true

seeAll = () ->
    chTb.query {}, (tabs) ->
        tabs.forEach (tab) ->
            chTb.connect tab.id
            chTb.sendMessage tab.id, {text: 'Going to lock'}
        return

chRt.onMessage.addListener (request, sender, sendResponse) ->
    if request.greetings is 'lockBrowser'
        seeAll()
        sendResponse {reply: 'ok wait'}
        return

chRt.onMessage.addListener (request, sender, sendResponse) ->
    if request.cmd is 'check-lock'
        sendResponse {reply: isLocked}
    