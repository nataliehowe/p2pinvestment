(function(root, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require(".").core, require("lodash"));
    } else if (typeof define === "function" && define.amd) {
        define([ "tb.core", "lodash-4" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        root.TB = root.TB || {};
        root.TB = factory(root.TB, _);
    }
})(this, function(TB, _) {
    "use strict";
    if (TB.CONFIG.HAS_WINDOW && TB.XErrors) {
        return TB;
    }
    var traceData = [];
    var usingOldAssertAPI = false;
    var AUDIT_LEVEL_ERROR = "error";
    var AUDIT_LEVEL_NOTICE = "notice";
    var windowAlert = function(msg) {
        if (TB.CONFIG.HAS_WINDOW) {
            window.alert(msg);
        }
    };
    var TbCustomError = function() {
        function TbCustomError(message, tbData) {
            var error = Error.call(this, message);
            var isHandled = false;
            tbData = tbData || {};
            this.name = "${ errClassName }";
            this.origMsg = tbData.origMsg;
            this.message = error.message;
            this.msg = tbData.msg;
            this.code = tbData.code;
            this.stack = error.stack;
            this.tbData = tbData;
            this.isHandled = function() {
                return isHandled;
            };
            this.setHandled = function() {
                return isHandled = true;
            };
            return this;
        }
        TbCustomError.prototype = Object.create(Error.prototype);
        TbCustomError.prototype.constructor = TbCustomError;
        return TbCustomError;
    }();
    var ErrorClassCreator = function(errClassName) {
        var CustomError = new Function("baseErrorObj", "      baseErrorObj = baseErrorObj || Error;      return function " + errClassName + " (message, tbData) {        var error = baseErrorObj.call(this, message, tbData);        this.name = " + errClassName + ";      }    ")(TbCustomError);
        CustomError.prototype = Object.create(TbCustomError.prototype);
        CustomError.prototype.constructor = CustomError;
        return CustomError;
    };
    var UserError = ErrorClassCreator(TB.CONFIG.ERR_USER);
    var PeerError = ErrorClassCreator(TB.CONFIG.ERR_PEER);
    var AppError = ErrorClassCreator(TB.CONFIG.ERR_APP);
    var SysError = ErrorClassCreator(TB.CONFIG.ERR_SYS);
    var ConfigError = ErrorClassCreator(TB.CONFIG.ERR_CONFIG);
    var OpenConnError = ErrorClassCreator(TB.CONFIG.ERR_OPEN_CONN);
    var UnknownError = ErrorClassCreator(TB.CONFIG.ERR_UNKNOWN);
    var errorMap = {};
    errorMap[TB.CONFIG.ERR_USER] = UserError;
    errorMap[TB.CONFIG.ERR_PEER] = PeerError;
    errorMap[TB.CONFIG.ERR_APP] = AppError;
    errorMap[TB.CONFIG.ERR_SYS] = SysError;
    errorMap[TB.CONFIG.ERR_CONFIG] = ConfigError;
    errorMap[TB.CONFIG.ERR_OPEN_CONN] = OpenConnError;
    errorMap[TB.CONFIG.ERR_UNKNOWN] = UnknownError;
    var lodashAssertionsDefinitions = [ {
        methods: [ "isArguments", "isArray", "isBoolean", "isDate", "isElement", "isEmpty", "isError", "isFinite", "isFunction", "isInteger", "isLength", "isMap", "isNaN", "isNative", "isNil", "isNull", "isNumber", "isObject", "isObjectLike", "isPlainObject", "isRegExp", "isSafeInteger", "isSet", "isString", "isUndefined", "isTypedArray", "isWeakMap", "isWeakSet" ],
        numArgs: 1,
        orNil: true,
        todoUpdate: [ "isArrayBuffer", "isArrayLike", "isArrayLikeObject", "isBuffer" ]
    }, {
        methods: [ "isEqual", "isMatch", "has" ],
        numArgs: 2
    }, {
        methods: [ "isEqualWith", "isMatchWith" ],
        numArgs: 3
    } ];
    var lodashExecCondition = function(lodashMethodName, argumentsArr, isNil) {
        if (isNil) {
            return _.isNil.call(_, argumentsArr[0]) || _[lodashMethodName].apply(_, argumentsArr);
        } else {
            return _[lodashMethodName].apply(_, argumentsArr);
        }
    };
    var lodashAssertFunc = function(assert, lodashMethodName, lodashAssertionDefinition, isNil) {
        var minArguments = lodashAssertionDefinition.numArgs;
        var maxArguments = lodashAssertionDefinition.numArgs + 1;
        return function() {
            TB.ASSERT(arguments.length >= minArguments && arguments.length <= maxArguments, {
                code: "TBJS/XERR/1010",
                msg: "Incorrect use of tb.xerrors ASSERT with lodashMethodName `" + lodashMethodName + "`. Expected `" + minArguments + "` or `" + maxArguments + "`, but `" + arguments.length + "` found"
            });
            if (arguments.length === minArguments) {
                assert(lodashExecCondition(lodashMethodName, arguments, isNil));
            } else {
                var assertArgument = arguments[maxArguments - 1];
                delete arguments[maxArguments - 1];
                return assert.call(this, lodashExecCondition(lodashMethodName, arguments, isNil), assertArgument);
            }
        };
    };
    function XErrors(s) {
        this.s = _.defaults({
            prefix: "TB/Global: ",
            openPlaceholderStr: TB.CONFIG.TRACE_OPEN_PLACEHOLDER_STR,
            closePlaceholderStr: TB.CONFIG.TRACE_CLOSE_PLACEHOLDER_STR,
            openTypePlaceholderStr: TB.CONFIG.TRACE_OPEN_TYPE_PLACEHOLDER_STR,
            closeTypePlaceholderStr: TB.CONFIG.TRACE_CLOSE_TYPE_PLACEHOLDER_STR,
            recursiveObjectMsg: TB.CONFIG.TRACE_RECURSIVE_OBJECT_MSG,
            logConsole: TB.CONFIG.XERRORS_LOG_CONSOLE,
            logLocalStorage: TB.CONFIG.XERRORS_LOG_LOCALSTORAGE,
            logLocalStorageKey: TB.CONFIG.XERRORS_LOG_LOCALSTORAGE_KEY,
            maxTraceLines: TB.CONFIG.MAX_TRACE_LINES,
            maxTraceLineLength: TB.CONFIG.MAX_TRACE_LINE_LENGTH,
            defaultBenchmarkName: TB.CONFIG.DEFAULT_BENCHMARK_NAME,
            assertsDisabled: TB.CONFIG.ASSERTS_DISABLED,
            defaultMsg: TB.CONFIG.XERRORS_DEFAULT_MSG,
            keepOriginalMsgs: TB.CONFIG.KEEP_ORIGINAL_MSGS
        }, s);
        var HARD_MAX_TRACE_LINES = 5e3;
        var HARD_MAX_TRACE_LINE_LENGTH = 1e3;
        if (_.isNumber(this.s.maxTraceLines) && this.s.maxTraceLines > HARD_MAX_TRACE_LINES) {
            this.s.maxTraceLines = HARD_MAX_TRACE_LINES;
        }
        if (!_.isNumber(this.s.maxTraceLineLength) || this.s.maxTraceLineLength > HARD_MAX_TRACE_LINES) {
            this.s.maxTraceLineLength = HARD_MAX_TRACE_LINES;
        }
        this.remoteAuditConnectorTimeout = null;
        this.benchmarkData = {};
        this.ASSERT = this.assertWrapper(TB.CONFIG.ERR_APP, TB.CONFIG.ERR_APP_PREFIX);
        this.ASSERT_PEER = this.assertWrapper(TB.CONFIG.ERR_PEER, TB.CONFIG.ERR_ASSERT_PEER_PREFIX);
        this.ASSERT_USER = this.assertWrapper(TB.CONFIG.ERR_USER, TB.CONFIG.ERR_USER_PREFIX);
        this.THROW_SYS = this.throwErrorWrapper(TB.CONFIG.ERR_SYS, TB.CONFIG.ERR_SYS_PREFIX);
        this.THROW_FATAL = this.throwErrorWrapper(TB.CONFIG.ERR_FATAL, TB.CONFIG.ERR_FATAL_PREFIX);
        this.THROW_PEER = this.throwErrorWrapper(TB.CONFIG.ERR_PEER, TB.CONFIG.ERR_PEER_PREFIX);
        this.THROW_USER = this.throwErrorWrapper(TB.CONFIG.ERR_USER, TB.CONFIG.ERR_USER_PREFIX);
        this.THROW_CONFIG = this.throwErrorWrapper(TB.CONFIG.ERR_CONFIG, TB.CONFIG.ERR_CONFIG_PREFIX);
        this.THROW_OPEN_CONN = this.throwErrorWrapper(TB.CONFIG.ERR_OPEN_CONN, TB.CONFIG.ERR_OPEN_CONN_PREFIX);
        this.THROW_CONN = this.throwErrorWrapper(TB.CONFIG.ERR_IO_CONN, TB.CONFIG.ERR_IO_CONN_PREFIX);
        this.THROW_UNKNOWN = this.throwErrorWrapper(TB.CONFIG.ERR_UNKNOWN, TB.CONFIG.ERR_UNKNOWN_PREFIX);
        this.TRACE = this.trace.bind(this);
    }
    var p = {};
    XErrors.prototype = p;
    p.prepareMsg = function prepareMsg(msg, msgParams, addType) {
        var stringifiedParams = {};
        var MAX_OBJECT_PROPS_LIMIT = 100;
        if (typeof msgParams === "string") {
            return msg + " " + msgParams;
        }
        if (typeof msgParams === "number") {
            return msg + " " + msgParams;
        }
        if (msgParams && typeof msgParams === "object" && Object.keys(msgParams).length > MAX_OBJECT_PROPS_LIMIT) {
            return msg + " [OBJECT TOO BIG TO BE TRACED] ";
        }
        for (var msgParamName in msgParams) {
            var msgParam = msgParams[msgParamName];
            stringifiedParams[msgParamName] = "";
            if (addType) {
                stringifiedParams[msgParamName] += this.s.openPlaceholderStr + this.s.openTypePlaceholderStr + this.guessType(msgParam) + this.s.closeTypePlaceholderStr;
            }
            try {
                stringifiedParams[msgParamName] += JSON.stringify(msgParam);
            } catch (e) {
                stringifiedParams[msgParamName] += this.s.recursiveObjectMsg;
            }
            if (addType) {
                stringifiedParams[msgParamName] += this.s.closePlaceholderStr;
            }
        }
        return TB.simpleTmpl(msg, stringifiedParams);
    };
    p.guessType = function guessType(value) {
        if (_.isArray(value)) {
            return "array";
        }
        if (_.isNull(value)) {
            return "null";
        }
        if (_.isNaN(value)) {
            return "NaN";
        }
        return typeof value;
    };
    p.traceReadyMsg = function traceReadyMsg(msgStr) {
        if (TB.CONFIG.HAS_WINDOW) {
            if (this.s.logConsole && window.console && window.console.error) {
                console.log(msgStr || "");
            }
            if (this.s.logLocalStorage && window !== undefined && window.localStorage) {
                var logSoFar = window.localStorage.getItem(this.s.logLocalStorageKey) || "";
                var log = logSoFar + msgStr;
                window.localStorage.setItem(this.s.logLocalStorageKey, log);
            }
        }
        if (!_.isNumber(this.s.maxTraceLines) || traceData.length >= this.s.maxTraceLines) {
            traceData.shift();
        }
        try {
            msgStr = msgStr.toString();
        } catch (e) {
            msgStr = "";
        }
        if (msgStr.length > this.s.maxTraceLineLength) {
            var half = Math.max(Math.floor(this.s.maxTraceLineLength / 2) - 5, 4);
            var newStr = "!!!Message too long!!! ";
            newStr += msgStr.substr(0, half);
            newStr += " [...] ";
            newStr += msgStr.substr(-half);
            msgStr = newStr;
        }
        traceData.push(msgStr);
        return msgStr;
    };
    p.trace = function trace(msg, msgParams) {
        var msgStr = this.prepareMsg(msg, msgParams, true);
        return this.traceReadyMsg(msgStr);
    };
    p.benchmarkStart = function benchmarkStart(name) {
        name = name || this.s.defaultBenchmarkName;
        this.benchmarkData[name] = {
            start: new Date()
        };
        console.time(name);
        trace("Benchmark start $NAME$ at $TIME$", {
            NAME: name,
            TIME: this.benchmarkData[name].start
        });
    };
    p.benchmarkEnd = function benchmarkEnd(name) {
        name = name || this.s.defaultBenchmarkName;
        if (!this.benchmarkData.hasOwnProperty(name)) {
            return;
        }
        this.benchmarkData[name].end = new Date();
        var period = this.benchmarkData[name].end - this.benchmarkData[name].start;
        console.timeEnd(name);
        trace("Benchmark end $NAME$ for $PERIOD$ ($START$ | $END$)", {
            NAME: name,
            START: this.benchmarkData[name].start,
            END: this.benchmarkData[name].start,
            PERIOD: period
        });
        delete this.benchmarkData[name];
    };
    p.getLog = function getLog() {
        return traceData;
    };
    p.assertWrapper = function assertWrapper(type, monitoring_prefix) {
        var self = this;
        function assert(condition, props) {
            props = props || {};
            if (_.isString(props)) {
                if (!usingOldAssertAPI) {
                    if (!TB.CONFIG.ENV === "prod") {
                        windowAlert("YOU SHOULD CHANGE YOUR ASSERTS NOW!!! New assert syntax is: ASSERT(condition, { ..props })");
                        usingOldAssertAPI = true;
                    }
                }
                console.error("Using old ASSERT() syntax with msg `" + props + "`at:", self.simplifyStack(new Error("Using old ASSERT() syntax with msg: " + props), 0));
                props = {
                    msg: props,
                    code: "CHANGE_ASSERT_IMMEDIATLY"
                };
            }
            if (self.s.assertsDisabled) return true;
            if (type === TB.CONFIG.ERR_USER) {
                TB.ASSERT(!_.isNil(props.code));
                TB.ASSERT(!_.isNil(props.msg));
            }
            if (condition) {
                return true;
            }
            var error = self.createError({
                assert: true,
                type: type,
                monitoring_prefix: monitoring_prefix,
                code: props.code,
                msg: props.msg,
                msgParams: props.msgParams,
                debug: props.debug,
                depth: 4
            });
            self.errorHandler(error);
            throw error;
        }
        var allShortcutAssertsMethods = [ "isNotNil", "isNotEmpty" ];
        for (var i = 0, l = lodashAssertionsDefinitions.length; i < l; i++) {
            var lodashAssertionDefinition = lodashAssertionsDefinitions[i];
            for (var k = 0, l = lodashAssertionDefinition.methods.length; k < l; k++) {
                var lodashMethodName = lodashAssertionDefinition.methods[k];
                allShortcutAssertsMethods.push(lodashMethodName);
                if (typeof _[lodashMethodName] !== "function") {
                    var err = new AppError("Unknown lodash method: " + lodashMethodName);
                    throw err;
                }
                assert[lodashMethodName] = lodashAssertFunc(assert, lodashMethodName, lodashAssertionDefinition, false);
                if (lodashAssertionDefinition.orNil) {
                    assert[lodashMethodName + "OrNil"] = lodashAssertFunc(assert, lodashMethodName, lodashAssertionDefinition, true);
                }
            }
        }
        assert.isNotNil = function(value, errData) {
            return assert(!_.isNil(value), errData);
        };
        assert.isNotEmpty = function(value, errData) {
            return assert(!_.isEmpty(value), errData);
        };
        if (TB.CONFIG.ASSERTS_DISABLED) {
            for (var i = 0, l = allShortcutAssertsMethods.length; i < l; i++) {
                assert[allShortcutAssertsMethods[i]] = _.noop;
            }
        }
        return assert;
    };
    p.simplifyStack = function simplifyStack(err, level) {
        var stackArr = err.stack.split("\n");
        stackArr.splice(1, level || 0);
        return stackArr.join("\n");
    };
    p.createError = function createError(errData) {
        var code = errData.code || TB.CONFIG.XERRORS_DEFAULT_CODE;
        var isUI = errData.type === TB.CONFIG.ERR_USER;
        var msg;
        if (errData.msg) {
            msg = this.prepareMsg(errData.msg, errData.msgParams, !isUI);
        } else if (errData.defaultMsg) {
            msg = this.prepareMsg(errData.defaultMsg, errData.defaultMsgParams, !isUI);
        } else {
            msg = this.s.defaultMsg;
        }
        var msgWithCode;
        if (errData.err) {
            errData.origMsg = errData.err.origMsg || msg;
        } else {
            errData.origMsg = msg;
        }
        if (!this.s.keepOriginalMsgs && !isUI) {
            msg = this.s.defaultMsg;
        }
        msg = msg || this.s.defaultMsg;
        errData.msg = msg;
        errData.code = code;
        msgWithCode = "[" + code + "] " + msg;
        var err = new errorMap[errData.type](msgWithCode, errData);
        err.stack = this.simplifyStack(err, errData.depth || 0);
        err.level = errData.level || AUDIT_LEVEL_ERROR;
        return err;
    };
    p.throwErrorWrapper = function throwErrorWrapper(type, monitoring_prefix) {
        var self = this;
        return function(props) {
            if (type === TB.CONFIG.ERR_USER) {
                TB.ASSERT(!_.isNil(props.code));
                TB.ASSERT(!_.isNil(props.msg));
            } else {
                props = props || {};
            }
            var error = self.createError({
                throw: true,
                type: type,
                monitoring_prefix: monitoring_prefix,
                code: props.code,
                msg: props.msg,
                msgParams: props.msgParams,
                debug: props.debug,
                depth: 4
            });
            self.errorHandler(error);
            throw error;
        };
    };
    p.remoteAuditConnector = function(flushData) {
        if (!TB.CONFIG.HAS_WINDOW) {
            return;
        }
        var errData = "{}";
        flushData = flushData || {};
        if (_.get(flushData, "tbData.assert") || _.get(flushData, "tbData.throw")) {
            var stack = flushData.stack;
            var stackArray = stack.split("\n");
            var line = stackArray[1];
            var re = /.*?\((.*)\)/;
            var match = re.exec(line);
            if (match === null) {
                match = line;
            } else {
                match = match[1];
            }
            var matchArray = TB.rsplit(match, ":", 2);
            flushData.filename = matchArray[0];
            flushData.lineno = matchArray[1];
            flushData.colno = matchArray[2];
        } else if (_.get(flushData, "tbData.err")) {
            flushData.filename = flushData.tbData.err.filename;
            flushData.lineno = flushData.tbData.err.lineno;
            flushData.colno = flushData.tbData.err.colno;
        } else if (_.get(flushData, "tbData")) {
            flushData.filename = flushData.tbData.filename;
            flushData.lineno = flushData.tbData.lineno;
            flushData.colno = flushData.tbData.colno;
        } else {
            flushData.filename = "TO BE IMPLEMENTED";
            flushData.lineno = -1;
            flushData.colno = -1;
        }
        flushData.timestamp = new Date().toISOString();
        flushData.currentURL = window.location.href;
        flushData.refferer = document.referrer;
        try {
            errData = JSON.stringify(flushData);
        } catch (e) {
            try {
                errData = JSON.stringify(e);
            } catch (e) {
                errData = '{"__UNABLE_TO_ENCODE_ERR__": true, "msg":"[UNABLE TO ENCODE TO JSON]"}';
            }
        }
        var self = this;
        var promise = new Promise(TB.noop);
        var data = {
            cgi: "cgi",
            api_key: TB.API_KEY,
            err_data: errData,
            stack_trace: flushData.stack || new Error().stack,
            trace: traceData.join("\r\n"),
            command: "ui_trace"
        };
        clearTimeout(this.remoteAuditConnectorTimeout);
        if (TB.Request) {
            var reqSettings = {
                httpMethod: "POST",
                url: TB.API_URL,
                data: data
            };
            promise = new TB.Request(reqSettings).request();
        } else {
            promise = new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                var formData = new FormData();
                for (var k in data) {
                    if (typeof data[k] === "object") {
                        data[k] = JSON.stringify(data[k]);
                    }
                    formData.append(k, data[k]);
                }
                xhr.open("GET", TB.API_URL || "", true);
                xhr.onload = function(event) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            self.trace("Debug info successfully sent");
                            resolve();
                        } else {
                            self.trace("Sending debug info failed with status $STATUS_TEXT$", {
                                STATUS_TEXT: xhr.statusText
                            });
                            reject();
                        }
                    }
                };
                xhr.onerror = function(e) {
                    self.trace("Sending debug info failed with status $STATUS_TEXT$", {
                        STATUS_TEXT: xhr.statusText
                    });
                };
                xhr.send(formData);
            });
        }
        promise.then(function() {
            clearTimeout(self.remoteAuditConnectorTimeout);
        }).catch(function() {
            self.remoteAuditConnectorTimeout = setTimeout(function() {
                self.remoteAuditConnector(flushData);
            }, TB.CONFIG.XHR_RETRY_MS + Math.random() * TB.CONFIG.XHR_RETRY_MS);
        });
        return promise;
    };
    p.normalizeError = function normalizeError(origError) {
        var error;
        if (origError !== null && origError !== undefined) {
            if (origError instanceof TbCustomError) {
                error = origError;
            } else if (typeof origError === "object" && origError !== null) {
                error = this.createError({
                    type: TB.CONFIG.ERR_SYS,
                    code: TB.CONFIG.XERRORS_DEFAULT_CODE,
                    err: origError,
                    msg: origError.message,
                    depth: 4,
                    filename: origError.filename,
                    lineno: origError.lineno,
                    colno: origError.colno
                });
            } else {
                error = this.createError({
                    type: TB.CONFIG.ERR_SYS,
                    code: TB.CONFIG.XERRORS_DEFAULT_CODE,
                    err: origError,
                    msg: origError,
                    depth: 4,
                    filename: origError.filename,
                    lineno: origError.lineno,
                    colno: origError.colno
                });
            }
        } else {
            error = this.createError({
                type: TB.CONFIG.ERR_UNKNOWN,
                code: TB.CONFIG.XERRORS_DEFAULT_CODE,
                msg: TB.CONFIG.XERRORS_DEFAULT_MSG,
                data: event,
                depth: 5
            });
        }
        error.timestamp = new Date().toISOString();
        if (!(false || origError instanceof EvalError || origError instanceof RangeError || origError instanceof ReferenceError || origError instanceof SyntaxError || origError instanceof TypeError || origError instanceof URIError || origError instanceof TbCustomError)) {
            error.isErrorTypeRecognized = true;
        }
        return error;
    };
    p.remoteAudit = function remoteAudit(level, msg, data) {
        var data = {
            level: level || AUDIT_LEVEL_NOTICE,
            msg: msg || "",
            data: data,
            browser: TB.Browser && TB.Browser.getFullInfo()
        };
        return TB.CONFIG.XERRORS_HOOK_REMOTE_AUDIT(data);
    };
    p.flush = function flush(level, msg, data) {
        var err = new Error();
        windowAlert("You are using flush(), but must be replaced by remoteAudit() near: " + this.simplifyStack(err, 1));
        return remoteAudit(level, msg, data);
    };
    p.errorHandler = function errorHandler(tbError) {
        TB.LAST_ERROR = tbError;
        if (tbError.isHandled()) return tbError;
        tbError.setHandled(true);
        this.traceReadyMsg(tbError.origMsg);
        TB.CONFIG.XERRORS_HOOK_REMOTE_AUDIT(tbError);
        TB.CONFIG.XERRORS_HOOK_ERROR_HANDLER_UI(tbError);
        if (tbError instanceof AppError || tbError instanceof PeerError) {
            throw tbError;
        }
        return tbError;
    };
    p.errorHandlerUi = function errorHandlerUi(tbError) {
        windowAlert(tbError.code + " " + tbError.msg);
    };
    if (TB.CONFIG.HAS_WINDOW) {
        window.addEventListener("error", function(errorEvent) {
            if (errorEvent.message === "Script error.") {
                return false;
            }
            var filename = errorEvent.filename;
            if (TB.CONFIG.WHITELISTED_ERROR_SOURCES.length !== 0 && filename !== "" && filename !== undefined) {
                var domainName = TB.getDomain(filename);
                if (TB.CONFIG.WHITELISTED_ERROR_SOURCES.indexOf(domainName) == -1) {
                    return false;
                }
            }
            var origError;
            if (errorEvent.error) {
                if (!errorEvent.error.lineno && errorEvent.lineno) {
                    errorEvent.error.lineno = errorEvent.lineno;
                }
                if (!errorEvent.error.filename && errorEvent.filename) {
                    errorEvent.error.filename = errorEvent.filename;
                }
                if (!errorEvent.error.colno && errorEvent.colno) {
                    errorEvent.error.colno = errorEvent.colno;
                }
                origError = globalXerr.normalizeError(errorEvent.error);
            } else if (errorEvent.message) {
                origError = globalXerr.normalizeError({
                    message: errorEvent.message,
                    filename: errorEvent.filename,
                    lineno: errorEvent.lineno,
                    colno: errorEvent.colno,
                    isCors: errorEvent.message === "Script error."
                });
            } else {
                origError = globalXerr.normalizeError();
            }
            globalXerr.errorHandler(origError);
            errorEvent.error2 = TB.LAST_ERROR;
            errorEvent.tbError = TB.LAST_ERROR;
        });
    }
    var globalXerr = new XErrors();
    TB.TRACE = globalXerr.TRACE;
    TB.ASSERT = globalXerr.ASSERT;
    TB.ASSERT_PEER = globalXerr.ASSERT_PEER;
    TB.ASSERT_USER = globalXerr.ASSERT_USER;
    TB.THROW_SYS = globalXerr.THROW_SYS;
    TB.THROW_PEER = globalXerr.THROW_PEER;
    TB.THROW_USER = globalXerr.THROW_USER;
    TB.THROW_CONFIG = globalXerr.THROW_CONFIG;
    TB.THROW_OPEN_CONN = globalXerr.THROW_OPEN_CONN;
    TB.THROW_UNKNOWN = globalXerr.THROW_UNKNOWN;
    TB.GET_LOG = globalXerr.getLog.bind(globalXerr);
    TB.FLUSH = globalXerr.remoteAudit.bind(globalXerr);
    TB.BENCHMARK_START = globalXerr.benchmarkStart.bind(globalXerr);
    TB.BENCHMARK_END = globalXerr.benchmarkEnd.bind(globalXerr);
    TB.CREATE_ERROR = globalXerr.createError.bind(globalXerr);
    TB.NORMALIZE_ERROR = globalXerr.normalizeError.bind(globalXerr);
    TB.CONFIG = TB.CONFIG || {};
    TB.CONFIG = TB.CONFIG || {};
    TB.CONFIG.XERRORS_HOOK_REMOTE_AUDIT = TB.CONFIG.XERRORS_HOOK_REMOTE_AUDIT || globalXerr.remoteAuditConnector.bind(globalXerr);
    TB.CONFIG.XERRORS_HOOK_ERROR_HANDLER_UI = TB.CONFIG.XERRORS_HOOK_ERROR_HANDLER_UI || globalXerr.errorHandlerUi.bind(globalXerr);
    TB.XErrors = XErrors;
    if (TB.CONFIG.HAS_WINDOW && TB.CONFIG.DEBUG_IN_GLOBAL_SCOPE) {
        var globalDebugFunctionNames = [ "ASSERT", "ASSERT_PEER", "ASSERT_USER", "TRACE", "THROW_SYS", "THROW_PEER", "THROW_USER", "THROW_CONFIG", "THROW_OPEN_CONN", "THROW_UNKNOWN", "FLUSH", "BENCHMARK_START", "BENCHMARK_END", "NORMALIZE_ERROR" ];
        for (var i = 0, l = globalDebugFunctionNames.length; i < l; i++) {
            var debugFunctionName = globalDebugFunctionNames[i];
            window[debugFunctionName] = TB[debugFunctionName];
        }
    }
    return TB;
});