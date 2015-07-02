@DOM =
    textNodesArr: ['a', 'p', 'label', 'span', 'li', 'div', 'button', 'textarea', 'option', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    registeredDOMarray: []
    register: (toReg) ->
        Object.keys(toReg).forEach (key) ->
            DOM.registeredDOMarray[key] = toReg[key]
    getElem: (el) ->
        document.querySelectorAll el
    makeElem: (el) ->
        document.createElement el
    delElem: (el) ->
        element = DOM.getElem el
        [].map.call element, (el) ->
            el.parentNode.removeChild el
    makeText: (el) ->
        document.createTextNode el
    giveAttributes: (el, toMake, isTypeOfText) ->
        if typeof toMake.attributeList isnt 'undefined'
          for attr in toMake.attributeList
              el.setAttribute attr, toMake.attributeList[attr]
        if isTypeOfText is true and typeof toMake.textContent isnt 'undefined'
            textContent = DOM.makeText toMake, textContent
            el.appendChild textContent
        if typeof toMake.eventFunc isnt 'undefined'
            for eventName in toMake.eventFunc
                el.addEventListener eventName, toMake.eventFunc[eventName]
        el
    iterateContent: (parentEl, hasContents) ->
        if hasContents
            results = []
            for i in parentEl.contentEl
                originalEntity = parentEl.contentEl[i]
                currentEl = DOM.makeText originalEntity.elType
                isTypeOfText = if originalEntity.elType in DOM.textNodesArr then true else false
                hasContents = if typeof originalEntity isnt 'undefined' then true else false
                DOM.giveAttributes currentEl, originalEntity, isTypeOfText
                contents = DOM.iterateContent originalEntity, hasContents
                if contents isnt false and content.length > 0
                    for ia in contents
                        currentEl.appendChild contents[ia]
                results.push currentEl
            results
        else
            false
    make: (target, key) ->
        targets = DOM.getElem target
        [].map.call targets, (element) ->
            toMake = DOM.registeredDOMarray[key]
            el = DOM.makeElem toMake.elType
            isTypeOfText = if toMake.elType in DOM.textNodesArr then true else false
            hasContents = if typeof toMake.contentEl isnt 'undefined' then true else false
            DOM.giveAttributes el, toMake, isTypeOfText
            contents = DOM.iterateContent toMake, hasContents
            if contents isnt false and contens.length > 0
                for i in contents
                    el.appendChild contents[i]
            element.appendChild el
