App =
    storage: chrome.storage.sync
    noSettings:  document.querySelector '#noSettings'
    withSettings:  document.querySelector '#withSettings'
    passwordForm: document.querySelector 'form#gettingStarted'
    init: () ->
        @storage.get null, (settings) ->
            if settings.hasOwnProperty 'password'
                App.withSettings.classList.toggle 'hidden'
                return
            else
                App.noSettings.classList.toggle 'hidden'
                return
        @watchEvent()
        return
    watchEvent: () ->
        @passwordForm.addEventListener 'submit', (e) ->
            e.preventDefault()
            mainPw = document.querySelector('#mainPass').value
            rePw = document.querySelector('#rePass').value
            hintPw = document.querySelector('#hintPass').value
            if mainPw isnt rePw
                error = document.querySelector '.error strong'
                error.innerHTML = 'Password Must Match!'
                setTimeout () ->
                    error.innerHTML = ''
                    return
                , 750
                return
            else
                App.savePassword mainPw, hintPw
                return
        return
    savePassword: (password, hint) ->
        @storage.set {
            password: password,
            hint: hint,
            isLocked: false
        }, () ->
            App.noSettings.classList.toggle 'hidden'
            App.withSettings.classList.toggle 'hidden'
            return
        return
App.init();