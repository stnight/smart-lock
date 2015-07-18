LockApp =
    chRt: chrome.runtime
    chSt: chrome.storage.sync
    isLocked: false
    hint: null
    init: () ->
        @chSt.get null, (settings) ->
             LockApp.hint = settings.hint
        # this check if the browser is locked
        @chRt.sendMessage {cmd: 'check-lock'}, (response) ->
            if response.reply is true
                LockApp.isLocked = true
                LockApp.lockTab()
        return
    lockTab: (systemMessage = null) ->
        body = document.querySelector 'body'
        dialog = document.createElement 'dialog'
        dialog.classList.add 'sl-dialog'
        # for dialog title form
        dialogTitle = document.createElement 'h3'
        dialogTitle.textContent = 'YOUR BROWSER IS LOCKED'
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
        dialog.appendChild form
        body.appendChild dialog
        dialog.showModal()
        @formFunction()
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
        dialog = document.querySelector 'dialog.sl-dialog'
        dialog.close()
        dialog.remove()

LockApp.init()

LockApp.chRt.onConnect.addListener (e) ->
    console.log 'someone is connected'

# when ctrl + q is being pressed
document.addEventListener 'keyup', (e) ->
        if e.ctrlKey and e.keyCode is 81
            LockApp.chRt.sendMessage {cmd: 'lock-browser'}, (response) ->
               console.log true
    , false

# when there is a command from background
LockApp.chRt.onMessage.addListener (message, sender, response) ->
    if message.cmd is 'lock-everything' and LockApp.isLocked is false
        LockApp.isLocked = true
        LockApp.lockTab()
    if message.cmd is 'unlock-attempt'
        if message.result is false
            LockApp.checkAuth message.result
        else
            LockApp.unlockTab()