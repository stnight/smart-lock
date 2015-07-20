chSt = chrome.storage.sync

# on load options
chSt.get null, (settings) ->
    messageSetting = document.querySelector '#messageSetting'
    persistentSetting = document.querySelector '#persistentSetting'
    messageSetting.value = settings.userMessage
    if settings.persistent is 'on'
        persistentSetting.setAttribute 'checked', 'checked'
    

# for navigation
basicNav = document.querySelector '#nav_basic'
forgotNav = document.querySelector '#nav_forgot'

toggleActive = () ->
    [].forEach.call document.querySelectorAll('.navigation li'), (li) ->
        li.classList.toggle 'active'
        return
    return
toggleContent = () ->
    [].forEach.call document.querySelectorAll('.settings-content'), (content) ->
        content.classList.toggle 'hide'
        return
    return
basicNav.addEventListener 'click', (e) ->
    e.preventDefault()
    console.log this
    if this.classList.contains('active') is false
        toggleActive()
        toggleContent()
forgotNav.addEventListener 'click', (e) ->
    e.preventDefault()
    if this.classList.contains('active') is false
        toggleActive()
        toggleContent()

# settings
persistent = document.querySelector '#persistentSetting'
saveButton = document.querySelector '#saveButton'

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