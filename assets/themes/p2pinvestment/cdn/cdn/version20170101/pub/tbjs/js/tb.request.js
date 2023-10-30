(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("lodash"), require("tb.xerrors"));
    } else if (typeof define === "function" && define.amd) {
        define([ "lodash-4", "tb.xerrors" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.Request = factory(global._, global.TB);
    }
})(this, function(_, TB) {
    "use strict";
    ASSERT(typeof _ != "undefined", {
        code: "TBJS/REQ/1010",
        msg: "Missing lodash-4"
    });
    var DOMhead = document.getElementsByTagName("head")[0];
    function Request(settings) {
        if (!(this instanceof Request)) {
            return new Request(settings);
        }
        var self = this;
        this.s = _.extend({
            data: null,
            processData: true,
            httpMethod: "GET",
            timeout: 1e4,
            retardTimeout: 800,
            retardCb: null,
            retry: true,
            retryAuto: true,
            retryRepeats: 10,
            retryInterval: 100,
            requestType: "urlencode"
        }, settings);
        this.timeout = null;
        this.retardTimeout = null;
        this.httpMethod = (this.s.httpMethod || "GET").toUpperCase();
        this.url = this.s.url || "";
        this.data = null;
        this.requestObj = null;
        this.commitedRetries = 0;
        if (!_.isEmpty(this.s.data)) {
            if (this.s.processData) {
                this.data = TB.toQueryString(this.s.data);
            } else {
                this.data = this.s.data;
            }
            if (this.httpMethod === "GET") {
                this.url = TB.urlAppend(this.url, this.data);
                this.data = null;
            }
        }
        this.promise = new Promise(function(resolve, reject) {
            self._promiseResolve = resolve;
            self._promiseReject = reject;
        });
        this.isRequested = false;
        this.then = function() {
            this.promise = this.promise.then.apply(this.promise, arguments);
            return this;
        };
        this.catch = function() {
            this.promise = this.promise.catch.apply(this.promise, arguments);
            return this;
        };
    }
    Request.prototype = {
        _defaultHeaders: {
            contentType: "application/x-www-form-urlencoded",
            accept: {
                "*": "text/javascript, text/html, application/xml, text/xml, */*",
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                js: "application/javascript, text/javascript"
            }
        },
        _makeRequest: function() {
            var self = this;
            TRACE("Starting request");
            this.isRequested = true;
            if (_.isNumber(this.s.timeout) && this.s.timeout > 0) {
                this.timeout = setTimeout(function() {
                    self._timedOut = true;
                    self.requestObj.abort();
                }, this.s.timeout);
            }
            if (_.isNumber(this.s.retardTimeout) && this.s.retardTimeout > 0) {
                this.retardTimeout = setTimeout(function() {
                    self._retarded = true;
                    if (_.isFunction(self.s.retardCb)) {
                        self.s.retardCb();
                    }
                }, self.s.retardTimeout);
            }
            if (this.s.type === "jsonp") {
                this.requestObj = this._makeRequestJSONP();
            } else {
                this.requestObj = this._makeRequestXHR();
            }
        },
        _makeRequestJSONP: function() {
            var cbQueryParamName = this.s["jsonpCallback"] || "callback";
            var cbQueryParamValue = this.s["jsonpCallbackName"];
            var scriptEl = document.createElement("script");
            var isLoaded = false;
            var responseData;
            this.url = TB.urlAppend(this.url, this.data);
            this.url = TB.urlAppend(this.url, cbQueryParamName + "=" + cbQueryParamValue);
            window[cbQueryParamValue] = function(data) {
                responseData = data;
            };
            scriptEl.type = "text/javascript";
            scriptEl.src = this.url;
            scriptEl.async = true;
            scriptEl.onload = scriptEl.onreadystatechange = function() {
                if (scriptEl.readyState && scriptEl.readyState !== "complete" && scriptEl.readyState !== "isLoaded" || isLoaded) {
                    return false;
                }
                scriptEl.onload = null;
                scriptEl.onreadystatechange = null;
                if (scriptEl.onclick) {
                    scriptEl.onclick();
                }
                this._successCallback(responseData);
                responseData = undefined;
                DOMhead.removeChild(scriptEl);
                isLoaded = true;
            };
            DOMhead.appendChild(scriptEl);
            return {
                abort: function() {
                    scriptEl.onload = scriptEl.onreadystatechange = null;
                    this._errorCallback(this.request, "abort", {});
                    responseData = undefined;
                    DOMhead.removeChild(scriptEl);
                    isLoaded = true;
                }
            };
        },
        _makeRequestXHR: function() {
            var xhr = this._getXHR(this.s);
            xhr.open(this.httpMethod, this.url, !this.s.async);
            this._setHeaders(xhr);
            this._setCredentials(xhr);
            xhr.onreadystatechange = this._handlerReadystatechangeXHR.bind(this);
            if (_.isFunction(this.s.beforeSend)) {
                this.s.beforeSend(xhr);
            }
            if (this.s.requestType === "formdata" && this.s.requestFiles) {
                var formData = new FormData();
                var jsonPointerToName = {};
                for (var key in this.s.requestFiles.fileRequest) {
                    if (this.s.requestFiles.fileRequest.hasOwnProperty(key)) {
                        var file = this.s.requestFiles.fileRequest[key].file;
                        var fileName = this.s.requestFiles.fileRequest[key].name;
                        formData.append(key, file, fileName);
                    }
                }
                for (var key in this.data) {
                    formData.append(key, this.data[key]);
                }
                xhr.send(formData);
                return xhr;
            }
            xhr.send(this.data);
            return xhr;
        },
        _getXHR: function() {
            ASSERT.has(window, "XMLHttpRequest", {
                code: "TBJS/REQ/2010",
                msg: "Browser does not support AJAX"
            });
            var xhr = new XMLHttpRequest();
            if (this.s.crossOrigin === true) {
                ASSERT.has(xhr, "withCredentials", {
                    code: "TBJS/REQ/2020",
                    msg: "Browser does not support cross-origin requests"
                });
            }
            return xhr;
        },
        _handlerReadystatechangeXHR: function() {
            if (this._aborted) {
                return this._errorCallback(this.request, "abort");
            }
            if (this._timedOut) {
                return this._errorCallback(this.request, "timeout");
            }
            if (this.requestObj && this.requestObj.readyState === 4) {
                this.requestObj.onreadystatechange = _.noop;
                if (this._checkResponseStatus()) {
                    this._successCallback(this.requestObj.responseText);
                } else {
                    this._errorCallback(this.request);
                }
            }
        },
        _checkResponseStatus: function() {
            var httpRe = /^http/;
            var protocolRe = /(^\w+):\/\//;
            var successStatus = /^(2\d\d)$/;
            var protocolMath = protocolRe.exec(this.url);
            var protocol = protocolMath && protocolMath[1] || window.location.protocol;
            if (httpRe.test(protocol)) {
                return successStatus.test(this.requestObj.status);
            } else {
                return !!this.requestObj.response;
            }
        },
        _successCallback: function(filteredResponse) {
            var type = this.s.type || this._getTypeFromResponseHeader(this.requestObj.getResponseHeader("Content-Type"));
            if (filteredResponse) {
                switch (type) {
                  case "json":
                    try {
                        filteredResponse = JSON.parse(filteredResponse);
                    } catch (err) {
                        return this.reject({
                            reason: this.request,
                            error: err
                        });
                    }
                    break;

                  case "js":
                    filteredResponse = eval(filteredResponse);
                    break;

                  case "html":
                    filteredResponse = filteredResponse;
                    break;

                  case "xml":
                    filteredResponse = this.requestObj.responseXML && this.requestObj.responseXML.parseError && this.requestObj.responseXML.parseError.errorCode && this.requestObj.responseXML.parseError.reason ? null : this.requestObj.responseXML;
                    break;

                  default:
                    THROW("Unknown expected response type");
                }
            }
            this._reqPromiseResolve({
                data: filteredResponse
            });
            this._completeCallback(filteredResponse);
        },
        _errorCallback: function(response, reason, t) {
            this._reqPromiseReject({
                xhr: response,
                reason: reason,
                error: t
            });
            this._completeCallback(response);
        },
        _completeCallback: function(resp) {
            if (this.s.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = null;
            if (_.isFunction(this.s.complete)) {
                this.s.complete(resp);
            }
        },
        _getTypeFromResponseHeader: function(header) {
            if (header === null) {
                return undefined;
            }
            if (header.match("json")) {
                return "json";
            }
            if (header.match("javascript")) {
                return "js";
            }
            if (header.match("text")) {
                return "html";
            }
            if (header.match("xml")) {
                return "xml";
            }
        },
        _setCredentials: function(xhr) {
            if (!_.isNil(this.s.withCredentials) && !_.isNil(xhr.withCredentials)) {
                xhr.withCredentials = !!this.s.withCredentials;
            }
        },
        _setHeaders: function(xhr) {
            var headers = this.s.headers || {};
            headers["Accept"] = headers["Accept"] || this._defaultHeaders["accept"][this.s.type] || this._defaultHeaders["accept"]["*"];
            var isAFormData = typeof FormData === "function" && this.s.data instanceof FormData;
            if (this.s.requestType !== "formdata") {
                headers["Content-Type"] = this.s.contentType || this._defaultHeaders["contentType"];
            }
            for (var header in headers) {
                xhr.setRequestHeader(header, headers[header]);
            }
        },
        abort: function() {
            this._aborted = true;
            this.requestObj.abort();
            return this;
        },
        request: function() {
            if (this.isRequested === true) {
                ASSERT(0, {
                    msg: "Already requested"
                });
            }
            return this._request();
        },
        _requestModifyResp: function() {
            if (this.s.modifyResp) {
                for (var i = 0, l = this.s.modifyResp.length; i < l; i++) {
                    this._reqPromise = this.s.modifyResp[i](this._reqPromise, this);
                }
            }
        },
        _request: function() {
            var self = this;
            this._reqPromise = new Promise(function(resolve, reject) {
                self._reqPromiseResolve = resolve;
                self._reqPromiseReject = reject;
            });
            this._requestModifyResp();
            this._makeRequest();
            this._reqPromise.then(function(result) {
                self._promiseResolve(result);
            }).catch(function(reason) {
                TRACE("Request failed, reason: $REASON$", {
                    REASON: reason
                });
                if (false && self.s.retry === true && self.commitedRetries < self.s.retryRepeats) {
                    if (self.s.retryAuto) {
                        setTimeout(function() {
                            try {
                                self.retry();
                            } catch (e) {
                                self._promiseReject(e);
                            }
                        }, self.s.retryInterval);
                    }
                } else {
                    self._promiseReject(reason);
                }
            });
            return this.promise;
        },
        retry: function() {
            ASSERT(this.s.retry === true, {
                msg: "Retrying request is not allowed"
            });
            ASSERT(this.commitedRetries < this.s.retryRepeats, {
                msg: "Retried too much times"
            });
            TRACE("Retrying request in $INTERVAL$ for $TIMES$ times so far", {
                INTERVAL: this.s.retryInterval,
                TIMES: this.commitedRetries
            });
            this.commitedRetries++;
            return this._request();
        },
        cancelRetry: function() {
            this.commitedRetries = this.s.retryRepeats;
        }
    };
    TB.Request = Request;
    return Request;
});