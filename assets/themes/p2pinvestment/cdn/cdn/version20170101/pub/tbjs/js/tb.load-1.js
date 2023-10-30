(function() {
    window.TB = window.TB || {};
    TB.request = undefined;
    TB.forms_submitted = {};
    TB.reqIds = {
        serial: {},
        only_last: {}
    };
    TB.REQ_SETTINGS = {
        MAX_RETRIES_COUNT: 15,
        REQ_TIMEOUT_MS: 60e4,
        TIMEOUT_RETRIES_COUNT: 1
    };
    TB.REQ_RETRIES_COUNT = {};
    TB.retryRequest = function(req, xhr, retriesCount) {
        if (typeof retriesCount === "undefined") {
            retriesCount = TB.REQ_SETTINGS.MAX_RETRIES_COUNT;
        }
        console.log("Rettrr");
        TB.REQ_RETRIES_COUNT[req] = TB.REQ_RETRIES_COUNT[req] || 0;
        if (TB.REQ_RETRIES_COUNT[req] >= retriesCount) {
            TB.REQ_RETRIES_COUNT[req] = 0;
            req = undefined;
            console.log("Req retris ", req, TB.REQ_RETRIES_COUNT[req]);
            return;
        }
        var rand = Math.floor(Math.random() * 4) + 1;
        console.log("Retry after ", rand, TB.REQ_RETRIES_COUNT[req]);
        setTimeout(function() {
            TB.REQ_RETRIES_COUNT[req]++;
            TB.request = $.ajax(req);
        }, 1e3 * rand);
        return true;
    };
    TB.loadUI = function(tbArgs) {
        console.log("TbLoadUI");
        TB.load(tbArgs, true);
    };
    TB.load = function(tbArgs, isUIReq) {
        TRACE("Document referrer ", document.referrer);
        var url = tbArgs.url;
        TRACE("url", url);
        ASSERT(TB.isString(url), {
            msg: "url is invalid"
        });
        var method = tbArgs.method || "GET";
        TRACE("method", method);
        ASSERT(TB.isString(method) && method.length > 0, {
            msg: "method is invalid"
        });
        var data = tbArgs.data;
        TRACE("data", data);
        ASSERT(!TB.isDefined(data) || TB.isObject(data) || TB.isString(data), {
            msg: "data is invalid"
        });
        var contSelector = tbArgs.contSelector;
        TRACE("contSelector", contSelector);
        ASSERT(!TB.isDefined(contSelector) || TB.isString(contSelector), {
            msg: "contSelector is invalid"
        });
        var reqId = tbArgs.reqId;
        TRACE("reqId", reqId);
        ASSERT(!TB.isDefined(reqId) || TB.isString(reqId), {
            msg: "reqId is invalid"
        });
        var loadingIndicatorSelector = tbArgs.loadingIndicatorSelector;
        TRACE("loadingIndicatorSelector", loadingIndicatorSelector);
        ASSERT(!TB.isDefined(loadingIndicatorSelector) || TB.isString(loadingIndicatorSelector), {
            msg: "loadingIndicatorSelector is invalid"
        });
        var overlaySelector = tbArgs.overlaySelector;
        TRACE("overlaySelector", overlaySelector);
        ASSERT(!TB.isDefined(overlaySelector) || TB.isString(overlaySelector), {
            msg: "overlaySelector is invalid"
        });
        var successCallback = tbArgs.successCallback || function() {};
        ASSERT(TB.isFunction(successCallback), {
            msg: "successCallback is not a function"
        });
        var errorCallback = tbArgs.errorCallback || function() {};
        ASSERT(TB.isFunction(errorCallback), {
            msg: "errorCallback is not a function"
        });
        var alwaysCallback = tbArgs.alwaysCallback || function() {};
        ASSERT(TB.isFunction(alwaysCallback), {
            msg: "alwaysCallback is not a function"
        });
        var timeoutRetriesCount = TB.REQ_SETTINGS.TIMEOUT_RETRIES_COUNT;
        var errorShowTimeoutMs = TB.REQ_SETTINGS.REQ_TIMEOUT_MS;
        if (tbArgs["url"].indexOf("tmms=") !== -1) {
            var vars = {};
            var parts = tbArgs["url"].replace(/[?&|;]+([^=&|;]+)=([^&|;]*)/gi, function(m, key, value) {
                vars[key] = value;
            });
            console.log("Varss ", vars["tmms"]);
            if (/^\d+$/.test(vars["tmms"])) {
                console.log("err shot Timeout Ms prefef", vars["tmms"]);
                errorShowTimeoutMs = vars["tmms"];
            }
        }
        var reqMode = "only_last";
        var reqType = "bg";
        if (TB.isDefined(tbArgs.reqMode)) {
            reqMode = tbArgs.reqMode;
        }
        if (TB.isDefined(tbArgs.reqType)) {
            reqType = tbArgs.reqType;
        }
        if (reqType == "ui") {
            isUIReq = true;
        }
        if (TB.isDefined(reqId)) {
            if (reqMode == "serial") {
                if (TB.reqIds.serial.hasOwnProperty(reqId)) {
                    TRACE("reqId: ", reqId, " is in serial queue");
                    return;
                }
            } else if (reqMode == "only_last") {
                if (TB.isDefined(TB.reqIds.only_last[reqId])) {
                    TRACE("reqId: ", reqId, " is in only_last queue; abort req");
                    TB.reqIds.only_last[reqId].abort();
                }
            }
        }
        isUIReq = isUIReq || false;
        if (isUIReq === true && TB.isDefined(loadingIndicatorSelector)) {
            var loadingIndicatorTimeout = setTimeout(function() {
                TRACE("loadingIndicatorTimeout");
                $(loadingIndicatorSelector).show();
                if (TB.isDefined(overlaySelector)) {
                    $(overlaySelector).show();
                }
            }, 600);
        }
        var hasCont = false;
        var cont = undefined;
        if (TB.isDefined(contSelector)) {
            cont = $(contSelector);
            hasCont = true;
        }
        if (isUIReq === true && hasCont === true) {
            var contInterval = setInterval(function() {
                if ($(contSelector).length > 0) {
                    TRACE("container is ready");
                    clearInterval(contInterval);
                }
            }, 100);
        }
        if (typeof loadingIndicatorSelector !== "undefined" && method !== "GET") {
            $(loadingIndicatorSelector).show();
            if (TB.isDefined(overlaySelector)) {
                $(overlaySelector).show();
            }
        }
        function setErrorTimeout() {
            console.log("Error Timmss", errorShowTimeoutMs);
            var errorShowTimeout = setTimeout(function() {
                console.log("errShowTimeout cc ", TB.request);
                if (TB.isDefined(reqId) && TB.reqIds[reqMode].hasOwnProperty(reqId)) {
                    delete TB.reqIds[reqMode][reqId];
                }
                if (isUIReq === true && TB.isDefined(loadingIndicatorSelector)) {
                    $(loadingIndicatorSelector).hide();
                    if (TB.isDefined(overlaySelector)) {
                        $(overlaySelector).hide();
                    }
                }
                if (TB.isDefined(TB.request)) {
                    TB.request.abort();
                }
            }, errorShowTimeoutMs);
            return errorShowTimeout;
        }
        var errorShowTimeout = setErrorTimeout();
        TB.request = $.ajax({
            url: url,
            method: method,
            async: true,
            data: data,
            success: function(data, textStatus, jqXHR) {
                console.log("tb.load call success request");
                clearInterval(contInterval);
                clearTimeout(errorShowTimeout);
                if (jqXHR.status == 302 && method === "GET") {
                    if (TB.retryRequest(this, jqXHR) === true) {
                        return;
                    }
                }
                if (typeof TB.REQ_RETRIES_COUNT[this] !== "undefined") {
                    TB.REQ_RETRIES_COUNT[this] = 0;
                }
                clearTimeout(loadingIndicatorTimeout);
                if (TB.isDefined(loadingIndicatorSelector)) {
                    $(loadingIndicatorSelector).hide();
                    if (TB.isDefined(overlaySelector)) {
                        $(overlaySelector).hide();
                    }
                }
                if (TB.isDefined(data.status) && TB.isDefined(data.status.code) && data.status.code == "RMA003" && TB.isDefined(TB.sessionExpiredHook)) {
                    TB.sessionExpiredHook({
                        isUIReq: isUIReq
                    });
                    return;
                }
                if (isUIReq === true && hasCont === true) {
                    contInterval = setInterval(function() {
                        console.log("Waiting for cont selector ", $(contSelector).length);
                        if ($(contSelector).length > 0) {
                            TRACE("container is ready");
                            clearInterval(contInterval);
                            var contentType = jqXHR.getResponseHeader("content-type");
                            TRACE("contentType", contentType);
                            ASSERT(TB.isString(contentType) && /^text\/html|application\/json/.test(contentType), {
                                msg: "contentType is invalid"
                            });
                            if (/^text\/html/.test(contentType)) {
                                $(contSelector).html(data);
                                successCallback({
                                    data: data,
                                    textStatus: textStatus,
                                    xhr: jqXHR
                                });
                            } else if (/^application\/json/.test(contentType)) {
                                if (TB.isDefined(data.status) && TB.isDefined(data.status.status)) {
                                    if (data.status.status == "ok") {
                                        successCallback({
                                            data: data,
                                            textStatus: textStatus,
                                            xhr: jqXHR
                                        });
                                    } else {
                                        errorCallback({
                                            msg: data.status.msg,
                                            code: data.status.code,
                                            xhr: jqXHR
                                        });
                                    }
                                }
                            } else {
                                ASSERT(false, {
                                    msg: "Unsupported content type",
                                    code: "UNS100"
                                });
                            }
                        }
                    }, 100);
                } else {
                    console.log("tb.load call success callback");
                    successCallback({
                        data: data,
                        textStatus: textStatus,
                        xhr: jqXHR
                    });
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("jqXHR ", jqXHR, textStatus, errorThrown);
                clearInterval(contInterval);
                clearTimeout(errorShowTimeout);
                TRACE("statusText ", jqXHR.statusText);
                if (jqXHR.statusText === "abort") {
                    console.log("Request abort22");
                    if (isUIReq == true) {
                        if (method === "GET" && TB.retryRequest(this, jqXHR, timeoutRetriesCount) === true) {
                            errorShowTimeout = setErrorTimeout();
                            $(loadingIndicatorSelector).show();
                            console.log("Request retry aborttt", TB.request);
                            return;
                        }
                        var error_msg = "Connection timeout. Please, try again! (P114)";
                        TRACE("errorShowTimeout", error_msg);
                        FLUSH("ERROR", error_msg);
                        errorCallback({
                            msg: error_msg
                        });
                    }
                    return;
                }
                if (jqXHR.status == 302 && method === "GET") {
                    if (TB.retryRequest(this, jqXHR) === true) {
                        return;
                    }
                }
                clearTimeout(loadingIndicatorTimeout);
                var statusCode = "P111";
                var statusMsg = "Please try again later! (" + statusCode + ")";
                var ignoreUnsent = false;
                console.log("Navigator and msg ", jqXHR.readyState, navigator.onLine);
                if (jqXHR.readyState == 0) {
                    if (typeof navigator !== "undefined" && navigator.onLine) {
                        ignoreUnsent = true;
                    }
                    statusCode = "P120";
                    statusMsg = "Please check your internet connection! (" + statusCode + ")";
                } else if (jqXHR.readyState == 1) {
                    if (typeof navigator !== "undefined" && navigator.onLine) {
                        ignoreUnsent = true;
                    }
                    statusCode = "P121";
                    statusMsg = "Please check your internet connection! (" + statusCode + ")";
                } else if (jqXHR.readyState == 2) {
                    statusCode = "P122";
                    statusMsg = "Please try again later! (" + statusCode + ")";
                } else if (jqXHR.readyState == 3) {
                    statusCode = "P123";
                    statusMsg = "Please try again later! (" + statusCode + ")";
                }
                if (jqXHR.status == 413) {
                    statusMsg = jqXHR.statusText;
                }
                if (!ignoreUnsent) {
                    TRACE(statusMsg, "Error thrownnnn: ", errorThrown, textStatus);
                    TRACE("REQ URL:", url);
                    TRACE("REQ Method: ", method);
                    TRACE("REQ Data: ", data);
                    FLUSH("ERROR", statusMsg);
                }
                if (isUIReq === true && hasCont === true) {
                    contInterval = setInterval(function() {
                        if ($(contSelector).length > 0) {
                            TRACE("container is ready");
                            clearInterval(contInterval);
                            if (TB.isDefined(loadingIndicatorSelector)) {
                                $(loadingIndicatorSelector).hide();
                                if (TB.isDefined(overlaySelector)) {
                                    $(overlaySelector).hide();
                                }
                            }
                        }
                    }, 100);
                }
                if (ignoreUnsent) {
                    console.info("MOMOTEST: it would have made a modal: ");
                }
                if (!ignoreUnsent) {
                    errorCallback({
                        msg: statusMsg,
                        xhr: jqXHR,
                        textStatus: textStatus,
                        errorThrown: errorThrown
                    });
                }
            }
        }).fail(function() {
            TRACE("Fail, AJAX Request FAILED, readyState ", TB.request.readyState);
            FLUSH();
        }).always(function(data, statusText, jqXHR) {
            console.log("Request TB  ", TB.request);
            console.log("Request jqXHR ", jqXHR);
            console.log("Request ready state", jqXHR.readyState);
            if (TB.isDefined(reqId) && TB.reqIds[reqMode].hasOwnProperty(reqId)) {
                delete TB.reqIds[reqMode][reqId];
            }
            if (jqXHR.readyState != 4) {
                console.log("TB Request State ", jqXHR.readyState);
                TRACE("Always, AJAX Request, readyState ", jqXHR.readyState);
                FLUSH();
            }
            if (typeof alwaysCallback != "undefined") {
                alwaysCallback();
            }
            TB.request = undefined;
        });
        console.log("Req ID ");
        if (TB.isDefined(reqId)) {
            console.log("Req IDz ", reqId, "Req Mode ", reqMode);
            TB.reqIds[reqMode][reqId] = TB.request;
        }
        return TB.request;
    };
})();
