LockApp =
    chRt: chrome.runtime
    init: () ->
        # this check if the browser is locked
        @chRt.sendMessage {cmd: 'check-lock'}, (response) ->
            if response.reply is true
                LockApp.lockTab()
        return
    lockTab: () ->
        body = document.querySelector 'body'
        # this creates the lock
        wrapper = document.createElement 'div'
        wrapper.className = 'sl-wrapper'

        body.classList.add 'rel'
        body.appendChild wrapper

LockApp.init()
# below is the prototype


LockApp.chRt.onConnect.addListener (e) ->
    console.log 'someone is connected'

LockApp.chRt.onMessage.addListener (message, sender, response) ->
    console.log message.text

document.addEventListener 'keyup', (e) ->
        if e.ctrlKey and e.keyCode is 81
            LockApp.chRt.sendMessage {greetings: 'lockBrowser'}, (response) ->
                console.log response.reply
    , false
