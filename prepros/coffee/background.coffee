chTb = chrome.tabs
chRt = chrome.runtime
chSt = chrome.storage.sync
password = null;
isLocked = chSt.get null, (settings) ->
    return settings.isLocked
userMessage = chSt.get null, (settings) ->
    return settings.userMessage

# this function dispatch a global trigger
tabsCommander = (cmd, txt = null) ->
    reply = {}
    switch cmd
        when 'lockEverything'
            reply.cmd = 'lock-everything'
        when 'noPassword'
            reply.cmd = 'no-password'
        when 'unlockAttempt'
            reply.cmd = 'unlock-attempt'
            reply.result = txt
        when 'unlockAll'
            reply.cmd = 'unlock-all'
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
                if settings.password isnt null and typeof settings.password isnt 'undefined' and settings.password isnt ''
                    chSt.set {isLocked: true}, () ->
                    isLocked = true
                    tabsCommander 'lockEverything'
                    return
                else if settings.password is '' or settings.password is null or typeof settings.password is 'undefined'
                    tabsCommander 'noPassword'
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
        when 'all-no-password'
            tabsCommander 'unlockAll'

chrome.storage.onChanged.addListener (changes, areaName) ->
    isLocked = chSt.get null, (settings) ->
        settings.isLocked
        return