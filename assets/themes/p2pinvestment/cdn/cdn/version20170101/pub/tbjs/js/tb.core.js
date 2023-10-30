(function(root, factory) {
    root.TB = root.TB || {};
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = root.TB = factory(root.TB, root._);
    } else if (typeof define === "function" && define.amd) {
        define([], function() {
            return root.TB = factory(root.TB, root._);
        });
    } else {
        root.TB = factory(root.TB, root._);
    }
})(this, function(TB, _) {
    "use strict";
    TB.CONFIG = TB.CONFIG || {};
    TB.CONFIG.WHITELISTED_ERROR_SOURCES = [];
    TB.CONFIG.ERR_PEER = "TbPeerError";
    TB.CONFIG.ERR_PEER_PREFIX = "PEER_ERROR";
    TB.CONFIG.ERR_ASSERT_PEER_PREFIX = "ASSERT_PEER_FAILED";
    TB.CONFIG.ERR_USER = "TbUserError";
    TB.CONFIG.ERR_USER_PREFIX = "USER_ERROR";
    TB.CONFIG.ERR_SYS = "TbSysError";
    TB.CONFIG.ERR_SYS_PREFIX = "TEMP_APP_ERROR";
    TB.CONFIG.ERR_APP = "TbAppError";
    TB.CONFIG.ERR_APP_PREFIX = "ASSERT_FAILED";
    TB.CONFIG.ERR_CONFIG = "TbConfigError";
    TB.CONFIG.ERR_CONFIG_PREFIX = "CONF_ERROR";
    TB.CONFIG.ERR_OPEN_CONN = "TbOpenConnError";
    TB.CONFIG.ERR_OPEN_CONN_PREFIX = "CONN_OPEN_ERROR";
    TB.CONFIG.ERR_IO_CONN = "TbConnIOError";
    TB.CONFIG.ERR_IO_CONN_PREFIX = "CONN_IO_ERROR";
    TB.CONFIG.ERR_UNKNOWN = "TbUnknownError";
    TB.CONFIG.ERR_UNKNOWN_PREFIX = "TEMP_APP_ERROR";
    TB.CONFIG.ERR_FATAL = "TbFatalError";
    TB.CONFIG.ERR_FATAL_PREFIX = "FATAL_APP_ERROR";
    TB.CONFIG.KEEP_ORIGINAL_MSGS = false;
    TB.CONFIG.DEBUG_IN_GLOBAL_SCOPE = true;
    TB.CONFIG.ASSERTS_DISABLED = false;
    TB.CONFIG.ASSERTS_DEFAULT_MSG_DELIMITER = " ";
    TB.CONFIG.TYPE_DELIMITER = "|";
    TB.CONFIG.TRACE_ARGUMENTS_DELIMITER = " ";
    TB.CONFIG.TRACE_OPEN_PLACEHOLDER_STR = "";
    TB.CONFIG.TRACE_CLOSE_PLACEHOLDER_STR = "";
    TB.CONFIG.TRACE_OPEN_PLACEHOLDER_STR = "[[ ";
    TB.CONFIG.TRACE_CLOSE_PLACEHOLDER_STR = " ]]";
    TB.CONFIG.TRACE_OPEN_TYPE_PLACEHOLDER_STR = "(";
    TB.CONFIG.TRACE_CLOSE_TYPE_PLACEHOLDER_STR = ")";
    TB.CONFIG.EMPTY_DATE = "";
    TB.CONFIG.XHR_RETRY_MS = 5e3;
    TB.CONFIG.ENV = "dev";
    TB.CONFIG.HAS_WINDOW = typeof window !== "undefined";
    TB.CONFIG.MAX_TRACE_LINES = 1e3;
    TB.CONFIG.MAX_TRACE_LINE_LENGTH = 500;
    TB.CONFIG.XERRORS_LOG_CONSOLE = typeof TB.CONFIG.XERRORS_LOG_CONSOLE !== "undefined" ? TB.CONFIG.XERRORS_LOG_CONSOLE : true;
    TB.CONFIG.XERRORS_LOG_LOCALSTORAGE = typeof TB.CONFIG.XERRORS_LOG_LOCALSTORAGE !== "undefined" ? TB.CONFIG.XERRORS_LOG_LOCALSTORAGE : false;
    TB.CONFIG.XERRORS_LOG_LOCALSTORAGE_NAME = "__TB_XERRORS__";
    TB.CONFIG.XERRORS_DEFAULT_CODE = "0000";
    TB.CONFIG.XERRORS_DEFAULT_MSG = "Application error!";
    TB.CONFIG.RETRY_TIMES = 10;
    TB.CONFIG.RETRY_INTERVAL = 1e3;
    TB.getUniqueId = function() {
        var idCounter = 0;
        return function(prefix) {
            prefix = prefix || "";
            return prefix + ++idCounter + "";
        };
    }();
    TB.isPositiveInteger = function isPositiveInteger(x) {
        return /^\d+$/.test(x);
    };
    TB.isCompatibleVersion = function isCompatibleVersion(ver1, ver2) {
        var ver1parts = ver1.split(".");
        var ver2parts = ver2.split(".");
        function validateParts(parts) {
            for (var i = 0; i < parts.length; ++i) {
                if (!TB.isPositiveInteger(parts[i])) {
                    return false;
                }
            }
            return true;
        }
        if (!validateParts(ver1parts) || !validateParts(ver2parts)) {
            return false;
        }
        if (ver1parts.length != ver2parts.length) {
            return false;
        }
        if (ver1parts[0] > ver2parts[0]) {
            return false;
        }
        for (var i = 1; i < ver1parts.length; ++i) {
            if (ver2parts.length === i) {
                return true;
            }
            if (ver1parts[i] >= ver2parts[i]) {
                continue;
            }
            return false;
        }
        if (ver1parts.length != ver2parts.length) {
            return false;
        }
    };
    TB.isArrayLike = function(obj) {
        var length = TB.isString(obj) ? obj.length : TB.get(obj, "length");
        if (Number.MAX_SAFE_INTEGER > 0) {
            return typeof length === "number" && length >= 0 && length <= Number.MAX_SAFE_INTEGER;
        } else {
            return typeof length === "number" && length >= 0;
        }
    };
    TB.toArray = function(obj) {
        if (TB.isUndefined(obj)) {
            return [];
        }
        if (TB.isArray(obj)) {
            return Array.prototype.slice.call(obj, 0);
        }
        if (TB.isArrayLike(obj)) {
            return TB.map(obj, function(value) {
                return value;
            });
        }
        return TB.values(obj);
    };
    TB.map = function(obj, iteratee, context) {
        var keys = !TB.isArrayLike(obj) && Object.keys(obj);
        var length = (keys || obj).length;
        var results = Array(length);
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee.bind(context || this)(obj[currentKey], currentKey, obj);
        }
        return results;
    };
    TB.values = function(obj) {
        var keys = Object.keys(obj);
        var result = [];
        for (var i = 0; i < keys.length; i++) {
            var val = obj[keys[i]];
            result.push(val);
        }
        return result;
    };
    TB.noop = function() {};
    TB.toPx = function(value) {
        return value + "px";
    };
    TB.get = function(obj, path, defaultValue) {
        var pathArr = typeof path === "string" ? path.split(".") : path;
        return pathArr.reduce(function(prev, curr) {
            return prev && prev[curr] !== undefined ? prev[curr] : defaultValue;
        }, obj);
    };
    TB.set = function(obj, path, value) {
        var a = typeof path === "string" ? path.split(".") : path;
        var o = obj;
        for (var i = 0; i < a.length - 1; i++) {
            var n = a[i];
            if (n in o) {
                o = o[n];
            } else {
                o[n] = {};
                o = o[n];
            }
        }
        o[a[a.length - 1]] = value;
        return value;
    };
    TB.cloneFunction = function(fn) {
        var temp = function temporary() {
            return fn.apply(this, arguments);
        };
        for (var key in fn) {
            if (fn.hasOwnProperty(key)) {
                temp[key] = fn[key];
            }
        }
        return temp;
    };
    TB.assign = function(obj1, obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
        return obj1;
    };
    TB.clone = TB.assign;
    TB.merge = function(destination, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                TB.merge(destination[property], source[property]);
            } else if (source[property] && source[property].constructor && source[property].constructor === Array) {
                destination[property] = destination[property] || [];
                TB.merge(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    };
    TB.isBetween = function(value, down, up, inclusive) {
        return inclusive ? value >= down && value <= up : value > down && value < up;
    };
    TB.limitToRange = function(value, down, up) {
        if (value > up) {
            return up;
        } else if (value < down) {
            return down;
        } else {
            return value;
        }
    };
    TB.contains = function(arr, item) {
        return arr.indexOf(item) >= 0;
    };
    TB.isBoolean = function(value) {
        return typeof value === "boolean";
    };
    TB.isNumber = function(value) {
        return typeof value === "number" || value instanceof Number;
    };
    TB.isDefined = function(value, nullIsDefined) {
        return nullIsDefined ? typeof value !== "undefined" : typeof value !== "undefined" && value !== null;
    };
    TB.isUndefined = function(value, nullIsDefined) {
        return !TB.isDefined(value, nullIsDefined);
    };
    TB.isObject = function(value) {
        return value === Object(value);
    };
    TB.isString = function(value) {
        return typeof value === "string";
    };
    TB.isFunction = function(value) {
        return typeof value === "function";
    };
    TB.isDate = function(value) {
        return value && typeof value === "object" && value.constructor === Date;
    };
    TB.isArray = function(value) {
        return value && typeof value === "object" && value.constructor === Array;
    };
    TB.isEmpty = function(value) {
        switch (TB.typeof(value)) {
          case "NaN":
          case "infinity":
          case "null":
          case "undefined":
            return true;

          case "string":
            return value === "";

          case "array":
            return value.length <= 0;

          case "object":
            return Object.keys(value).length <= 0;

          default:
            return false;
        }
    };
    TB.typeof = function(val) {
        switch (typeof val) {
          case "object":
            if (val === null) {
                return "null";
            } else if (TB.isArray(val)) {
                return "array";
            } else {
                return "object";
            }

          case "number":
            if (val !== val) {
                return "NaN";
            }
            if (!isFinite(val)) {
                return "infinity";
            }
            return "number";

          case "string":
          case "symbol":
          case "undefined":
          case "boolean":
          case "function":
          default:
            return typeof val;
        }
    };
    TB.applyCssRules = function(idSelector, cssText, destinationDocument) {
        var destination = destinationDocument || window.document;
        var style = destination.getElementById(idSelector);
        if (!style) {
            var container = destination;
            style = window.document.createElement("style");
            style.id = idSelector;
            style.type = "text/css";
            if (destination instanceof Document) {
                container = destination.head;
            }
            container.appendChild(style);
        }
        style.textContent = cssText;
    };
    TB.JSON2CSS = function(selector, jsonCss) {
        var resultCss = " ";
        ASSERT.isString(selector);
        ASSERT.isPlainObject(jsonCss);
        resultCss += selector;
        resultCss += " { ";
        for (var cssProperty in jsonCss) {
            ASSERT(_.isString(jsonCss[cssProperty]) || _.isNumber(jsonCss[cssProperty]));
            resultCss += TB.camelCaseToDashes(cssProperty);
            resultCss += ": ";
            resultCss += jsonCss[cssProperty];
            resultCss += "; ";
        }
        resultCss += " } ";
        return resultCss;
    };
    TB.camelCaseToDashes = function(str) {
        return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    };
    TB.underscoreToDash = function(str) {
        return str.replace("_", "-");
    };
    TB.classExtend = function(extendedClass, extensionClass) {
        extendedClass.prototype = TB.merge(Object.create(extensionClass.prototype), extendedClass.prototype);
        extendedClass.prototype.constructor = extendedClass;
        return extendedClass;
    };
    TB.urlAppend = function(url, queryString) {
        return url + (/\?/.test(url) ? "&" : "?") + (TB.isEmpty(queryString) ? "" : queryString);
    };
    TB.normalizeDate = function(date) {
        if (!(date instanceof Date) && TB.isEmpty(date)) {
            return "";
        }
        if (date instanceof String || typeof date === "string") {
            date = date.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, "$1T$2");
            date = new Date(date);
        }
        return date;
    };
    TB.parseQueryParams = function(inputQuery) {
        var search = /([^&;=]+)=?([^&;]*)/g;
        var decode = function(s) {
            return decodeURIComponent(s.replace(/\+/g, " "));
        };
        var queryString = inputQuery || window.location.search;
        var query = queryString.replace(/^(\?*)/, "");
        query = query.replace(/^(\#*)/, "");
        var urlParams = {};
        var match;
        while (match = search.exec(query)) {
            var key = decode(match[1]);
            var val = decode(match[2]);
            if (urlParams[key] instanceof Array) {
                urlParams[key].push(val);
            } else if (urlParams[key] !== undefined) {
                urlParams[key] = [ urlParams[key], val ];
            } else {
                urlParams[key] = val;
            }
        }
        return urlParams;
    };
    TB.toQueryString = function(params) {
        if (_.isString(params) || _.isEmpty(params)) {
            return params;
        }
        var queryArr = [];
        var add = function(key, value) {
            value = _.isFunction(value) ? value() : value === null ? "" : value;
            if (value === undefined) return;
            queryArr[queryArr.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
        if (_.isArray(params)) {
            for (var i = 0; params && i < params.length; i++) {
                add(params[i]["name"], params[i]["value"]);
            }
        } else {
            for (var prefix in params) {
                if (params.hasOwnProperty(prefix)) {
                    TB.buildParams(prefix, params[prefix], add);
                }
            }
        }
        return queryArr.join("&").replace(/%20/g, "+");
    };
    TB.buildParams = function(prefix, obj, add) {
        var rbracket = /\[ \ ]$/;
        if (_.isArray(obj)) {
            for (var i = 0, l = obj.length; obj && i < l; i++) {
                var value = obj[i];
                if (rbracket.test(prefix)) {
                    add(prefix, value);
                } else {
                    TB.buildParams(prefix + "[ " + (typeof value === "object" ? i : "") + " ]", value, add);
                }
            }
        } else if (obj && obj.toString() === "[ object Object ]") {
            for (var name in obj) {
                TB.buildParams(prefix + "[ " + name + " ]", obj[name], add);
            }
        } else {
            add(prefix, obj);
        }
    };
    TB.debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    TB.simpleTmpl = function(msgTmpl, placeholders) {
        if (!placeholders) {
            return msgTmpl;
        }
        for (var key in placeholders) {
            var searchFor = "$" + key + "$";
            msgTmpl = msgTmpl.replace(searchFor, placeholders[key]);
        }
        return msgTmpl;
    };
    var isLogoutRunning = false;
    TB.HTTPLogout = function() {
        if (isLogoutRunning) {
            return;
        }
        var username = "invalid-user-4236a440a662cc8253d7536e5aa17942";
        var password = "invalid-user-4236a440a662cc8253d7536e5aa17942";
        var exitReq = new XMLHttpRequest();
        exitReq.open("GET", "./?view=exit_form", true);
        exitReq.onreadystatechange = function() {
            if (exitReq.readyState == 4) {
                isLogoutRunning = false;
                if (exitReq.status >= 200 && exitReq.status < 300) {
                    var logout = new XMLHttpRequest();
                    var baseUrl = "/" + (window.location.pathname.split("/")[1] || window.location.pathname || "");
                    baseUrl += "/";
                    console.log("REQUESTING1", baseUrl, username, password);
                    logout.open("GET", baseUrl, true, username, password);
                    var isLoggedOut = false;
                    logout.onreadystatechange = function() {
                        if (isLoggedOut) {
                            return;
                        }
                        if (logout.status == 401) {
                            isLoggedOut = true;
                            window.location = baseUrl;
                        } else if (logout.readyState == 4) {
                            TB.THROW_USER("Error while log out");
                        }
                    };
                    logout.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
                    logout.send();
                } else {
                    TB.THROW_USER("Error while log out");
                }
            }
        };
        isLogoutRunning = true;
        exitReq.send();
    };
    TB.generateColor = function(seed) {
        seed = seed !== undefined ? seed : Math.random();
        seed = seed.toString();
        var hash = 0;
        for (var i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        var color = Math.floor(Math.abs(Math.sin(seed) * 16777215) % 16777215);
        color = color.toString(16);
        while (color.length < 6) {
            color = "0" + color;
        }
        return color;
    };
    TB.getCookie = function(cookies, cookieName) {
        var cookie = ("; " + cookies).split("; " + cookieName + "=").pop().split(";").shift();
        return cookie;
    };
    TB.rsplit = function(str, sep, maxsplit) {
        var split = str.split(sep);
        return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
    };
    TB.getDomain = function getDomain(url) {
        url = url.replace(/(https?:\/\/)?(www.)?/i, "");
        if (url.indexOf("/") !== -1) {
            url = url.split("/")[0];
        }
        return url;
    };
    return TB;
});