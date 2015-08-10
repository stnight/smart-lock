chSt = chrome.storage.sync
chRt = chrome.runtime

# on load options
chSt.get null, (settings) ->
    noSet = document.querySelector '#noSettings'
    withSet = document.querySelector '#withSettings'
    if settings.hasOwnProperty 'password'
        withSet.classList.toggle 'hide'
        messageSetting = document.querySelector '#messageSetting'
        persistentSetting = document.querySelector '#persistentSetting'
        messageSetting.value = if settings.userMessage isnt null and typeof settings.userMessage isnt 'undefined' then settings.userMessage else ''
        if settings.persistent is 'on'
            persistentSetting.setAttribute 'checked', 'checked'
    else
        noSet.classList.toggle 'hide'

# for navigation
toggleActive = (toActive) ->
    [].forEach.call document.querySelectorAll('.navigation li'), (li) ->
        if li.classList.contains 'active'
            li.classList.toggle 'active'
    document.querySelector(toActive).classList.toggle 'active'
    return
toggleContent = (toActive) ->
    [].forEach.call document.querySelectorAll('.settings-content'), (content) ->
        if content.classList.contains('hide') is false
            console.log 'yes'
            content.classList.add 'hide'
    document.querySelector(toActive).classList.toggle 'hide'
    return
linksLi = document.querySelectorAll '.navigation li'
for link in linksLi
    link.addEventListener 'click', () ->
        content = this.dataset.content
        isActive = this.classList.contains 'active'
        liId = '#'+this.id
        if isActive is false
            toggleActive liId
            toggleContent content
        return
# settings
persistent = document.querySelector '#persistentSetting'
saveButton = document.querySelector '#saveButton'
pwdButton = document.querySelector '#updatePasswordButton'
gPassButton = document.querySelector '#gPasswordButton'

persistent.addEventListener 'click', () ->
    if this.checked
        this.value = 'on'
    else 
        this.value = 'off'

saveButton.addEventListener 'click', (e) ->
    message = document.querySelector '#messageSetting'
    persistent = document.querySelector '#persistentSetting'
    chSt.set {
        userMessage: message.value,
        persistent: persistent.value
    }, () ->
        updateMessage = document.querySelector '#updateMessage'
        updateMessage.textContent = "Settings Updated."
        setTimeout () ->
            updateMessage.textContent = ''
        , 2500

pwdButton.addEventListener 'click', (e) ->
    passMessage = document.querySelector '#updatePasswordMessage'
    currentPass = document.querySelector '#currentPassword'
    newPass = document.querySelector '#newPassword'
    rePass = document.querySelector '#retypePassword'

    if newPassword.value isnt rePass.value
        passMessage.textContent = 'Password Mismatched, Please Retype Your Password.'
        setTimeout () ->
            passMessage.textContent = ''
        , 2500
    else
        chSt.get null, (settings) ->
            if settings.password isnt newPass.value
                passMessage.textContent = 'Incorrect Password.'
                setTimeout () ->
                    passMessage.textContent = ''
                , 2500
            else
                chSt.set {
                    password: newPassword.value
                }, () ->
                    passMessage.textContent = 'Password Updated'
                    currentPassword.value = ''
                    newPassword.value = ''
                    rePass.value = ''
                    setTimeout () ->
                        passMessage.textContent = ''
                    , 2500

gPassButton.addEventListener 'click', (e) ->
    newPass = document.querySelector '#gNewPass'
    rePass = document.querySelector '#gRePass'
    gPassMessage = document.querySelector '#gPasswordMessage'

    if newPass.value isnt rePass.value
        gPassMessage.textContent = 'Password Mismatched, Please Retype Your Password.'
        setTimeout () ->
            gPassMessage.textContent = ''
        , 2500
    else if newPass.value.length is 0 or rePass.value.length is 0
        gPassMessage.textContent = 'All Fields Are Required.'
        setTimeout () ->
            gPassMessage.textContent = ''
        , 2500 
    else
        chSt.set {
            password: newPass.value
        }, () ->
            noSet = document.querySelector '#noSettings'
            withSet = document.querySelector '#withSettings'

            noSet.classList.toggle 'hide'
            withSet.classList.toggle 'hide'