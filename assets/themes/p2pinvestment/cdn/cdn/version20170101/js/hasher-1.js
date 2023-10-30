var hasher = function(window) {
    var POOL_INTERVAL = 25, document = window.document, history = window.history, Signal = signals.Signal, hasher, _hash, _checkInterval, _isActive, _frame, _checkHistory, _hashValRegexp = /#(.*)$/, _baseUrlRegexp = /(\?.*)|(\#.*)/, _hashRegexp = /^\#/, _isIE = !+"\v1", _isHashChangeSupported = "onhashchange" in window && document.documentMode !== 7, _isLegacyIE = _isIE && !_isHashChangeSupported, _isLocal = location.protocol === "file:";
    function _escapeRegExp(str) {
        return String(str || "").replace(/\W/g, "\\$&");
    }
    function _trimHash(hash) {
        if (!hash) return "";
        var regexp = new RegExp("^" + _escapeRegExp(hasher.prependHash) + "|" + _escapeRegExp(hasher.appendHash) + "$", "g");
        return hash.replace(regexp, "");
    }
    function _getWindowHash() {
        var result = _hashValRegexp.exec(hasher.getURL());
        var path = result && result[1] || "";
        try {
            return hasher.raw ? path : decodeURIComponent(path);
        } catch (e) {
            return path;
        }
    }
    function _getFrameHash() {
        return _frame ? _frame.contentWindow.frameHash : null;
    }
    function _createFrame() {
        _frame = document.createElement("iframe");
        _frame.src = "about:blank";
        _frame.style.display = "none";
        document.body.appendChild(_frame);
    }
    function _updateFrame() {
        if (_frame && _hash !== _getFrameHash()) {
            var frameDoc = _frame.contentWindow.document;
            frameDoc.open();
            frameDoc.write("<html><head><title>" + document.title + '</title><script type="text/javascript">var frameHash="' + _hash + '";<\/script></head><body>&nbsp;</body></html>');
            frameDoc.close();
        }
    }
    function _registerChange(newHash, isReplace) {
        if (_hash !== newHash) {
            var oldHash = _hash;
            _hash = newHash;
            if (_isLegacyIE) {
                if (!isReplace) {
                    _updateFrame();
                } else {
                    _frame.contentWindow.frameHash = newHash;
                }
            }
            hasher.changed.dispatch(_trimHash(newHash), _trimHash(oldHash));
        }
    }
    if (_isLegacyIE) {
        _checkHistory = function() {
            var windowHash = _getWindowHash(), frameHash = _getFrameHash();
            if (frameHash !== _hash && frameHash !== windowHash) {
                hasher.setHash(_trimHash(frameHash));
            } else if (windowHash !== _hash) {
                _registerChange(windowHash);
            }
        };
    } else {
        _checkHistory = function() {
            var windowHash = _getWindowHash();
            if (windowHash !== _hash) {
                _registerChange(windowHash);
            }
        };
    }
    function _addListener(elm, eType, fn) {
        if (elm.addEventListener) {
            elm.addEventListener(eType, fn, false);
        } else if (elm.attachEvent) {
            elm.attachEvent("on" + eType, fn);
        }
    }
    function _removeListener(elm, eType, fn) {
        if (elm.removeEventListener) {
            elm.removeEventListener(eType, fn, false);
        } else if (elm.detachEvent) {
            elm.detachEvent("on" + eType, fn);
        }
    }
    function _makePath(paths) {
        paths = Array.prototype.slice.call(arguments);
        var path = paths.join(hasher.separator);
        path = path ? hasher.prependHash + path.replace(_hashRegexp, "") + hasher.appendHash : path;
        return path;
    }
    function _encodePath(path) {
        path = encodeURI(path);
        if (_isIE && _isLocal) {
            path = path.replace(/\?/, "%3F");
        }
        return path;
    }
    hasher = {
        VERSION: "::VERSION_NUMBER::",
        raw: false,
        appendHash: "",
        prependHash: "/",
        separator: "/",
        changed: new Signal(),
        stopped: new Signal(),
        initialized: new Signal(),
        init: function() {
            if (_isActive) return;
            _hash = _getWindowHash();
            if (_isHashChangeSupported) {
                _addListener(window, "hashchange", _checkHistory);
            } else {
                if (_isLegacyIE) {
                    if (!_frame) {
                        _createFrame();
                    }
                    _updateFrame();
                }
                _checkInterval = setInterval(_checkHistory, POOL_INTERVAL);
            }
            _isActive = true;
            hasher.initialized.dispatch(_trimHash(_hash));
        },
        stop: function() {
            if (!_isActive) return;
            if (_isHashChangeSupported) {
                _removeListener(window, "hashchange", _checkHistory);
            } else {
                clearInterval(_checkInterval);
                _checkInterval = null;
            }
            _isActive = false;
            hasher.stopped.dispatch(_trimHash(_hash));
        },
        isActive: function() {
            return _isActive;
        },
        getURL: function() {
            return window.location.href;
        },
        getBaseURL: function() {
            return hasher.getURL().replace(_baseUrlRegexp, "");
        },
        setHash: function(path) {
            path = _makePath.apply(null, arguments);
            if (path !== _hash) {
                _registerChange(path);
                if (path === _hash) {
                    if (!hasher.raw) {
                        path = _encodePath(path);
                    }
                    window.location.hash = "#" + path;
                }
            }
        },
        replaceHash: function(path) {
            path = _makePath.apply(null, arguments);
            if (path !== _hash) {
                _registerChange(path, true);
                if (path === _hash) {
                    if (!hasher.raw) {
                        path = _encodePath(path);
                    }
                    window.location.replace("#" + path);
                }
            }
        },
        getHash: function() {
            return _trimHash(_hash);
        },
        getHashAsArray: function() {
            return hasher.getHash().split(hasher.separator);
        },
        dispose: function() {
            hasher.stop();
            hasher.initialized.dispose();
            hasher.stopped.dispose();
            hasher.changed.dispose();
            _frame = hasher = window.hasher = null;
        },
        toString: function() {
            return '[hasher version="' + hasher.VERSION + '" hash="' + hasher.getHash() + '"]';
        }
    };
    hasher.initialized.memorize = true;
    return hasher;
}(window);