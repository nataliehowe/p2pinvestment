(function(global) {
    function SignalBinding(signal, listener, isOnce, listenerContext, priority) {
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this._priority = priority || 0;
    }
    SignalBinding.prototype = {
        active: true,
        params: null,
        execute: function(paramsArr) {
            var handlerReturn, params;
            if (this.active && !!this._listener) {
                params = this.params ? this.params.concat(paramsArr) : paramsArr;
                handlerReturn = this._listener.apply(this.context, params);
                if (this._isOnce) {
                    this.detach();
                }
            }
            return handlerReturn;
        },
        detach: function() {
            return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
        },
        isBound: function() {
            return !!this._signal && !!this._listener;
        },
        isOnce: function() {
            return this._isOnce;
        },
        getListener: function() {
            return this._listener;
        },
        getSignal: function() {
            return this._signal;
        },
        _destroy: function() {
            delete this._signal;
            delete this._listener;
            delete this.context;
        },
        toString: function() {
            return "[SignalBinding isOnce:" + this._isOnce + ", isBound:" + this.isBound() + ", active:" + this.active + "]";
        }
    };
    function validateListener(listener, fnName) {
        if (typeof listener !== "function") {
            throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}", fnName));
        }
    }
    function Signal() {
        this._bindings = [];
        this._prevParams = null;
        var self = this;
        this.dispatch = function() {
            Signal.prototype.dispatch.apply(self, arguments);
        };
    }
    Signal.prototype = {
        VERSION: "1.0.0",
        memorize: false,
        _shouldPropagate: true,
        active: true,
        _registerListener: function(listener, isOnce, listenerContext, priority) {
            var prevIndex = this._indexOfListener(listener, listenerContext), binding;
            if (prevIndex !== -1) {
                binding = this._bindings[prevIndex];
                if (binding.isOnce() !== isOnce) {
                    throw new Error("You cannot add" + (isOnce ? "" : "Once") + "() then add" + (!isOnce ? "" : "Once") + "() the same listener without removing the relationship first.");
                }
            } else {
                binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
                this._addBinding(binding);
            }
            if (this.memorize && this._prevParams) {
                binding.execute(this._prevParams);
            }
            return binding;
        },
        _addBinding: function(binding) {
            var n = this._bindings.length;
            do {
                --n;
            } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
            this._bindings.splice(n + 1, 0, binding);
        },
        _indexOfListener: function(listener, context) {
            var n = this._bindings.length, cur;
            while (n--) {
                cur = this._bindings[n];
                if (cur._listener === listener && cur.context === context) {
                    return n;
                }
            }
            return -1;
        },
        has: function(listener, context) {
            return this._indexOfListener(listener, context) !== -1;
        },
        add: function(listener, listenerContext, priority) {
            validateListener(listener, "add");
            return this._registerListener(listener, false, listenerContext, priority);
        },
        addOnce: function(listener, listenerContext, priority) {
            validateListener(listener, "addOnce");
            return this._registerListener(listener, true, listenerContext, priority);
        },
        remove: function(listener, context) {
            validateListener(listener, "remove");
            var i = this._indexOfListener(listener, context);
            if (i !== -1) {
                this._bindings[i]._destroy();
                this._bindings.splice(i, 1);
            }
            return listener;
        },
        removeAll: function() {
            var n = this._bindings.length;
            while (n--) {
                this._bindings[n]._destroy();
            }
            this._bindings.length = 0;
        },
        getNumListeners: function() {
            return this._bindings.length;
        },
        halt: function() {
            this._shouldPropagate = false;
        },
        dispatch: function(params) {
            if (!this.active) {
                return;
            }
            var paramsArr = Array.prototype.slice.call(arguments), n = this._bindings.length, bindings;
            if (this.memorize) {
                this._prevParams = paramsArr;
            }
            if (!n) {
                return;
            }
            bindings = this._bindings.slice();
            this._shouldPropagate = true;
            do {
                n--;
            } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
        },
        forget: function() {
            this._prevParams = null;
        },
        dispose: function() {
            this.removeAll();
            delete this._bindings;
            delete this._prevParams;
        },
        toString: function() {
            return "[Signal active:" + this.active + " numListeners:" + this.getNumListeners() + "]";
        }
    };
    var signals = Signal;
    signals.Signal = Signal;
    if (typeof define === "function" && define.amd) {
        define(function() {
            return signals;
        });
    } else if (typeof module !== "undefined" && module.exports) {
        module.exports = signals;
    } else {
        global["signals"] = signals;
    }
})(this);

