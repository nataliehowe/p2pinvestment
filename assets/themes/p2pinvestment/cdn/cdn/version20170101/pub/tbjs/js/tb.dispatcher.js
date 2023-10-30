(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("tb.xerrors"));
    } else if (typeof define === "function" && define.amd) {
        define([ "tb.xerrors" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.Dispatcher = factory(global.TB);
    }
})(this, function(TB) {
    "use strict";
    function Dispatcher() {
        if (!(this instanceof Dispatcher)) {
            return new Dispatcher();
        }
        var listeners = {};
        this.on = function(eventName, handler) {
            listeners[eventName] = listeners[eventName] || [];
            listeners[eventName].push(handler);
            return this;
        };
        this.off = function(eventName, handler) {
            if (!listeners.hasOwnProperty(eventName)) {
                return this;
            }
            if (TB.isEmpty(handler)) {
                listeners[eventName].length = 0;
            }
            ASSERT.isFunction(handler);
            var indexOfHandler = listeners[eventName].indexOf(handler);
            if (indexOfHandler >= 0) {
                listeners[eventName].splice(indexOfHandler, 1);
            }
            return this;
        };
        this.dispatch = function(eventName, data) {
            if (listeners.hasOwnProperty(eventName)) {
                for (var i = 0; i < listeners[eventName].length; i++) {
                    var callback = listeners[eventName][i];
                    callback(data);
                }
            }
            return this;
        };
    }
    Dispatcher.prototype = {};
    return Dispatcher;
});