(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("lodash"), require("tb.xerrors"), require("tb.request"), require("tb.dispatcher"));
    } else if (typeof define === "function" && define.amd) {
        define([ "lodash-4", "tb.xerrors", "tb.request", "tb.dispatcher" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.RAService = factory(global._, global.TB, global.TB.Request, global.TB.Dispatcher);
    }
})(this, function(_, TB, Request, Dispatcher) {
    "use strict";
    if (_.isNil(Dispatcher)) {
        alert("Please load tb.dispatcher.js");
    }
    function Service(settings) {
        if (!(this instanceof Service)) {
            return new TB.RAService(settings);
        }
        var defaultValues = {
            apiUrl: "",
            useTransportProtocolId: true,
            requestParams: null,
            payloadParams: null,
            retryMax: Infinity,
            retryAuto: true,
            retryInterval: 1e3,
            retryIncremental: true,
            transportProtocol: "jsonrpc2",
            commands: {
                ui_error: {
                    httpMethod: "post"
                }
            }
        };
        this.reqType = null;
        this.s = _.merge({}, defaultValues, settings);
        ASSERT.has(this._requestTypes, this.s.transportProtocol);
        this.id = 1;
        this.transactionId = 1;
        this.hasActiveRequest = false;
        this.reqType = this._requestTypes[this.s.transportProtocol];
        Dispatcher.call(this);
    }
    Service.prototype = {
        _requestId: 0,
        _requestTypes: {
            jsonrpc2: {
                payloadParamName: "payload_jsonrpc",
                makePayload: function(method, data) {
                    return {
                        jsonrpc: "2.0",
                        id: this.getNextRequestId(),
                        method: method,
                        params: data
                    };
                },
                unpackResult: function(rawResult) {
                    if (_.isString(rawResult)) {
                        rawResult = JSON.parse(rawResult);
                    }
                    if (!_.isUndefined(rawResult["error"])) {
                        TRACE("Error in API call: $_RESULT$", {
                            RESULT: rawResult
                        });
                        throw new UnpackError(rawResult);
                    }
                    if (_.isUndefined(rawResult["result"])) {
                        throw new Error("No result returned after API call: $_RESULT$", {
                            RESULT: rawResult
                        });
                    }
                    return rawResult["result"];
                }
            }
        },
        getNextRequestId: function() {
            this._requestId += 1;
            return this.s.useTransportProtocolId ? this._requestId : null;
        },
        incrementTransactionId: function() {
            this.transactionId += 1;
            return this.transactionId;
        },
        request: function(method, data, settings) {
            ASSERT.isString("string");
            ASSERT.isObjectOrNil(settings);
            var self = this;
            var commandDef = this.s.commands[method];
            var reqSettings = _.merge({
                retry: true,
                retryAuto: false,
                modifyResp: [ function(promise, req) {
                    return promise.then(function(rawResult) {
                        var result = self.reqType.unpackResult(rawResult.data);
                        return result;
                    }).catch(function(reqErr) {
                        var parsedErr = {
                            status: "sys_error",
                            code: null,
                            reqErr: reqErr,
                            msg: null
                        };
                        if (reqErr instanceof UnpackError) {
                            if (!reqErr.status) {
                                parsedErr.msg = TB.CONFIG.XERRORS_DEFAULT_MSG;
                            } else {
                                if (reqErr.status.status === "ui_error") {
                                    parsedErr.status = "ui_error";
                                    req.cancelRetry();
                                } else if (reqErr.status.status === "client_sys_error") {
                                    parsedErr.status = "peer_error";
                                    req.cancelRetry();
                                } else if (reqErr.status.status !== "sys_error") {
                                    parsedErr.msg = TB.CONFIG.XERRORS_DEFAULT_MSG;
                                }
                                parsedErr.code = reqErr.status.code;
                                parsedErr.msg = reqErr.status.msg;
                            }
                        } else {
                            if (reqErr.reason === "abort") {
                                parsedErr.status = "transport_error";
                                parsedErr.msg = "abort";
                            } else if (reqErr.reason === "timeout") {
                                parsedErr.status = "transport_error";
                                parsedErr.msg = "timeout";
                            } else if (reqErr.reason) {
                                parsedErr.msg = TB.CONFIG.XERRORS_DEFAULT_MSG;
                            } else if (reqErr.xhr && reqErr.xhr.responseText) {
                                var resp = reqErr.xhr.responseText;
                                if (typeof resp === "text") {
                                    parsedErr.msg = resp;
                                } else {
                                    parsedErr.msg = TB.CONFIG.XERRORS_DEFAULT_MSG;
                                }
                                req.cancelRetry();
                            } else {
                                parsedErr.msg = TB.CONFIG.XERRORS_DEFAULT_MSG;
                            }
                        }
                        throw parsedErr;
                    });
                } ]
            }, this.s, commandDef, settings);
            var reqPayload = this.prepareParams(reqSettings.requestParams);
            var protocolPayload = this.prepareParams(reqSettings.payloadParams);
            protocolPayload = _.extend(protocolPayload, data);
            reqPayload[this.reqType.payloadParamName] = this.reqType.makePayload.call(this, method, protocolPayload);
            reqPayload[this.reqType.payloadParamName] = JSON.stringify(reqPayload[this.reqType.payloadParamName]);
            reqSettings.data = reqPayload;
            reqSettings.url = reqSettings.apiUrl;
            var req = new Request(reqSettings);
            self.dispatch("ajaxStart", {
                req: req
            });
            req.then(function(resp) {
                self.dispatch("ajaxStop", {
                    req: req
                });
                return resp;
            });
            req.request();
            return req;
        }
    };
    Service.prototype.prepareParams = function(params) {
        var result = {};
        if (_.isObject(params)) {
            for (var k in params) {
                result[k] = params[k];
                if (_.isFunction(result[k])) {
                    result[k] = result[k]();
                }
                if (_.isUndefined(result[k])) {
                    result[k] = null;
                }
            }
        }
        return result;
    };
    function UnpackError(resp) {
        this.resp = resp;
        this.data = resp.error.data;
        this.message = resp.error.message;
        this.code = resp.error.code;
        this.status = resp.error.data && resp.error.data.status ? resp.error.data.status : null;
        this.details = _.get(resp, "error.data.details");
        if (this.details && this.details.validation_errors) {
            var validationErrors = this.details.validation_errors;
            ASSERT_PEER.isArray(validationErrors);
            validationErrors = validationErrors.map(function(d) {
                return {
                    dataPath: d.dataPath || d.data_path,
                    msg: d.msg
                };
            });
            this.validationErrors = validationErrors;
        }
    }
    TB.RAService = Service;
    TB.classExtend(Service, Dispatcher);
    return Service;
});