@App =
    settings: {}
    init: () ->
        if localStorage.settings
            @settings = localStorage.settings
        else
            console.log 'New User'
    appLock: null