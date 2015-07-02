(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.DOM = {
    textNodesArr: ['a', 'p', 'label', 'span', 'li', 'div', 'button', 'textarea', 'option', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    registeredDOMarray: [],
    register: function(toReg) {
      return Object.keys(toReg).forEach(function(key) {
        return DOM.registeredDOMarray[key] = toReg[key];
      });
    },
    getElem: function(el) {
      return document.querySelectorAll(el);
    },
    makeElem: function(el) {
      return document.createElement(el);
    },
    delElem: function(el) {
      var element;
      element = DOM.getElem(el);
      return [].map.call(element, function(el) {
        return el.parentNode.removeChild(el);
      });
    },
    makeText: function(el) {
      return document.createTextNode(el);
    },
    giveAttributes: function(el, toMake, isTypeOfText) {
      var attr, eventName, textContent, _i, _j, _len, _len1, _ref, _ref1;
      if (typeof toMake.attributeList !== 'undefined') {
        _ref = toMake.attributeList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          attr = _ref[_i];
          el.setAttribute(attr, toMake.attributeList[attr]);
        }
      }
      if (isTypeOfText === true && typeof toMake.textContent !== 'undefined') {
        textContent = DOM.makeText(toMake, textContent);
        el.appendChild(textContent);
      }
      if (typeof toMake.eventFunc !== 'undefined') {
        _ref1 = toMake.eventFunc;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          eventName = _ref1[_j];
          el.addEventListener(eventName, toMake.eventFunc[eventName]);
        }
      }
      return el;
    },
    iterateContent: function(parentEl, hasContents) {
      var contents, currentEl, i, ia, isTypeOfText, originalEntity, results, _i, _j, _len, _len1, _ref, _ref1;
      if (hasContents) {
        results = [];
        _ref = parentEl.contentEl;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          originalEntity = parentEl.contentEl[i];
          currentEl = DOM.makeText(originalEntity.elType);
          isTypeOfText = (_ref1 = originalEntity.elType, __indexOf.call(DOM.textNodesArr, _ref1) >= 0) ? true : false;
          hasContents = typeof originalEntity !== 'undefined' ? true : false;
          DOM.giveAttributes(currentEl, originalEntity, isTypeOfText);
          contents = DOM.iterateContent(originalEntity, hasContents);
          if (contents !== false && content.length > 0) {
            for (_j = 0, _len1 = contents.length; _j < _len1; _j++) {
              ia = contents[_j];
              currentEl.appendChild(contents[ia]);
            }
          }
          results.push(currentEl);
        }
        return results;
      } else {
        return false;
      }
    },
    make: function(target, key) {
      var targets;
      targets = DOM.getElem(target);
      return [].map.call(targets, function(element) {
        var contents, el, hasContents, i, isTypeOfText, toMake, _i, _len, _ref;
        toMake = DOM.registeredDOMarray[key];
        el = DOM.makeElem(toMake.elType);
        isTypeOfText = (_ref = toMake.elType, __indexOf.call(DOM.textNodesArr, _ref) >= 0) ? true : false;
        hasContents = typeof toMake.contentEl !== 'undefined' ? true : false;
        DOM.giveAttributes(el, toMake, isTypeOfText);
        contents = DOM.iterateContent(toMake, hasContents);
        if (contents !== false && contens.length > 0) {
          for (_i = 0, _len = contents.length; _i < _len; _i++) {
            i = contents[_i];
            el.appendChild(contents[i]);
          }
        }
        return element.appendChild(el);
      });
    }
  };

}).call(this);
