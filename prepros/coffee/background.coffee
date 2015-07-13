chTb = chrome.tabs
chRt = chrome.runtime
chSt = chrome.storage.sync
password = null;
isLocked = chSt.get null, (settings) ->
    return settings.isLocked

seeAll = () ->
    chTb.query {}, (tabs) ->
        tabs.forEach (tab) ->
            chTb.connect tab.id
            chTb.sendMessage tab.id, {text: 'Going to lock'}
        return

# this function dispatch a global trigger
tabsCommander = (cmd) ->
    commandType = null
    switch cmd
        when 'lockEverything'
            commandType = 'lock-everything'
    chTb.query {}, (tabs) ->
        tabs.forEach (tab) ->
            chTb.connect tab.id
            chTb.sendMessage tab.id, {cmd: commandType}
        return
    
chRt.onMessage.addListener (request, sender, sendResponse) ->
    if request.greetings is 'lockBrowser'
        seeAll()
        sendResponse {reply: 'ok wait'}
        return

chRt.onMessage.addListener (request, sender, sendResponse) ->
    switch request.cmd
        when 'check-lock'
            sendResponse {reply: isLocked}
        when 'lock-browser'
            chSt.get null, (settings) ->
                if settings.password isnt null
                    chSt.set {isLocked: true}, () ->
                    isLocked = true
                    tabsCommander 'lockEverything'
                    return
            sendResponse {reply:'done with the commands'}

chrome.storage.onChanged.addListener (changes, areaName) ->
    console.log changes
    isLocked = chSt.get null, (settings) ->
        return settings.isLocked
    return