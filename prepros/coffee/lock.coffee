G = new MutationObserver (mutations)->
    mutations.forEach (mutation) ->
        if mutation.attributeName is 'close'
            if mutation.target.classList.contains('rtr') is false
                dialog = document.querySelector '.sl-dialog'
                dialog.classList.add 'rtr'
                dialog.remove()
                LockApp.isLocked = false
                LockApp.isDialogOpened = false
                LockApp.chRt.sendMessage {cmd: 'lock-browser'}, (response) ->
                   console.log true
        if mutation.attributeName is 'class'
            if mutation.oldValue is 'sl-dialog' and mutation.target.classList.contains('rtr') is false
                mutation.target.classList.contains('rtr')
                mutation.target.classList.add 'rtr'
                dialog = document.querySelector "dialog.rtr"
                dialog.remove()
                LockApp.isLocked = false
                LockApp.isDialogOpened = false
                LockApp.chRt.sendMessage {cmd: 'lock-browser'}, (response) ->
                   console.log true
        console.log mutation
    return

GConfig =
    attributes: true
    childList: true
    characterData: true
    attributeOldValue: true
    subtree: true

LockApp =
    chRt: chrome.runtime
    chSt: chrome.storage.sync
    isLocked: false
    isDialogOpened: false
    hint: null
    init: () ->
        @chSt.get null, (settings) ->
             LockApp.hint = if typeof settings.hint is 'undefined' then '' else settings.hint
        # this check if the browser is locked
        @chRt.sendMessage {cmd: 'check-lock'}, (response) ->
            if response.reply is true
                LockApp.isLocked = true
                LockApp.chSt.get null, (settings) ->
                    if settings.userMessage isnt '' or settings.userMessage isnt null or settings.userMessage.length > 0
                        LockApp.lockTab settings.userMessage, settings.persistent
                    else
                        LockApp.lockTab null, settings.persistent
        return
    noPassword: () ->
        body = document.querySelector 'body'
        dialog = document.createElement 'dialog'
        dialog.classList.add 'sl-dialog', 'no-pass'
        # for dialog title form
        dialogTitle = document.createElement 'h3'
        dialogTitle.textContent = 'PLEASE PROVIDE A PASSWORD'
        # form
        form = document.createElement 'form'
        form.setAttribute 'id', 'slForm'
        # button
        formButton = document.createElement 'button'
        formButton.setAttribute 'id', 'closeDialog'
        formButton.textContent = 'OKAY'
        # append
        form.appendChild formButton
        dialog.appendChild dialogTitle
        dialog.appendChild form
        body.appendChild dialog
        dialog.showModal()
        @noPwdFunction()
    noPwdFunction: () ->
        dialog = document.querySelector 'dialog.sl-dialog'
        form = document.querySelector '.sl-dialog form'
        form.addEventListener 'submit', (event) ->
            event.preventDefault()
            LockApp.chRt.sendMessage {cmd: 'all-no-password'}, (response) ->
                return true
    lockTab: (systemMessage = null, watcher = null) ->
        body = document.querySelector 'body'
        dialog = document.createElement 'dialog'
        dialog.classList.add 'sl-dialog'
        # for dialog title form
        dialogTitle = document.createElement 'h3'
        dialogTitle.textContent = 'YOUR BROWSER IS LOCKED'
        # system message
        message = document.createElement 'h4'
        message.textContent = systemMessage
        # form
        form = document.createElement 'form'
        passwordInput = document.createElement 'input'
        formButton = document.createElement 'button'
        errorLabel = document.createElement 'label'
        row_1 = document.createElement 'div'
        row_2 = document.createElement 'div'
        row_1.classList.add 'row'
        row_2.classList.add 'row'
        clearFix = document.createElement 'div'
        clearFix.classList.add 'clear'
        errorLabel.classList.add 'error', 'row'
        form.setAttribute 'id', 'slForm'
        passwordInput.setAttribute 'type', 'password'
        passwordInput.setAttribute 'placeholder', 'Your Password'
        passwordInput.setAttribute 'required', 'required'
        passwordInput.classList.add 'sl-password', 'column', 'two-third'
        formButton.textContent = 'UNLOCK'
        formButton.classList.add 'column', 'one-third'
        # for row and columns
        row_1.appendChild passwordInput
        row_1.appendChild formButton
        row_1.appendChild clearFix
        # for password hinting
        hintLabel = document.createElement 'label'
        hintLink = document.createElement 'a'
        hintText = document.createElement 'span'
        hintLink.setAttribute 'id', 'hintLink'
        hintLink.setAttribute 'href', '#'
        hintLink.textContent = 'Hint:'
        hintText.setAttribute 'id', 'hintText'
        hintLabel.setAttribute 'id', 'hintLabel'
        hintLabel.appendChild hintLink
        hintLabel.appendChild hintText
        row_2.appendChild hintLabel
        # append the elements on form
        form.appendChild row_1
        form.appendChild errorLabel
        form.appendChild row_2
        # append the dialog on the body
        dialog.appendChild dialogTitle
        dialog.appendChild message
        dialog.appendChild form
        body.appendChild dialog
        dialog.showModal()
        @formFunction()
        if watcher is 'on'
            @g()
    formFunction: () ->
        form = document.querySelector '#slForm'
        password = document.querySelector 'input[type=password]'
        hintLink = document.querySelector 'a#hintLink'
        hintText = document.querySelector 'span#hintText'
        form.addEventListener 'submit', (event) ->
            event.preventDefault()
            LockApp.chRt.sendMessage {cmd: 'validate-password', password: password.value}, (response) ->
                console.log response
                LockApp.checkAuth response.reply
            return
        hintLink.addEventListener 'click', (event) ->
            event.preventDefault()
            hintText.textContent = ' '+LockApp.hint
            return
        return
    checkAuth: (result) ->
        errorLabel = document.querySelector 'label.error'
        if result is false
            errorLabel.textContent = 'Your Password Is Incorrect'
            return
    unlockTab: () ->
        @isLocked = false
        @isDialogOpened = false
        dialog = document.querySelector 'dialog.sl-dialog'
        dialog.classList.add 'rtr'
        dialog.close()
        dialog.remove()
    g: () ->
        host = document.querySelector 'body'
        G.observe host, GConfig
        return
    ug: () ->
        G.disconnect()
        return

document.onreadystatechange = () ->
    switch document.readyState
        when 'interactive'
            LockApp.init()
        
LockApp.chRt.onConnect.addListener (e) ->
    console.log 'someone is connected'

# when ctrl + q is being pressed
document.addEventListener 'keyup', (e) ->
        if e.ctrlKey and e.keyCode is 81 and LockApp.isDialogOpened is false
            LockApp.isDialogOpened = true
            LockApp.chRt.sendMessage {cmd: 'lock-browser'}, (response) ->
               console.log true
    , false

# when there is a command from background
LockApp.chRt.onMessage.addListener (message, sender, response) ->
    if message.cmd is 'lock-everything' and LockApp.isLocked is false
        LockApp.isLocked = true
        LockApp.chSt.get null, (settings) ->
            if settings.userMessage isnt '' or settings.userMessage isnt null or settings.userMessage.length > 0
                LockApp.lockTab settings.userMessage, settings.persistent
            else
                LockApp.lockTab()
    if message.cmd is 'unlock-attempt'
        if message.result is false
            LockApp.checkAuth message.result
        else
            LockApp.unlockTab()
    if message.cmd is 'no-password'
        LockApp.noPassword()
    if message.cmd is 'unlock-all'
        LockApp.unlockTab()