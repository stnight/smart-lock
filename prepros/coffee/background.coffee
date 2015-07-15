chTb = chrome.tabs
chRt = chrome.runtime
chSt = chrome.storage.sync
password = null;
isLocked = chSt.get null, (settings) ->
    return settings.isLocked

# this function dispatch a global trigger
tabsCommander = (cmd, txt = null) ->
    reply = {}
    switch cmd
        when 'lockEverything'
            reply.cmd = 'lock-everything'
        when 'unlockAttempt'
            reply.cmd = 'unlock-attempt'
            reply.result = txt
    chTb.query {}, (tabs) ->
        tabs.forEach (tab) ->
            chTb.connect tab.id
            chTb.sendMessage tab.id, reply
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
        when 'validate-password'
            chSt.get null, (settings) ->
                if request.password is settings.password
                    tabsCommander 'unlockAttempt', true
                    isLocked = false;
                    chSt.set {isLocked: false}, () ->
                else
                    tabsCommander 'unlockAttempt', false
                return
            return

chrome.storage.onChanged.addListener (changes, areaName) ->
    console.log changes
    isLocked = chSt.get null, (settings) ->
        return settings.isLocked
    return