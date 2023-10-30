(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("lodash-4"), require("tb.xerrors"), require("tb.service"));
    } else if (typeof define === "function" && define.amd) {
        define([ "lodash-4", "tb.xerrors", "tb.service" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.jf = global.TB.jf || {};
        global.TB.jf.API = factory(global._, global.TB, global.TB.RAService);
    }
})(this, function(_, TB, TbRAService) {
    "use strict";
    var queryParams = TB.parseQueryParams();
    var sp;
    var tbJfService = function(settings) {
        this.s = settings;
        this.service = new TbRAService({
            apiUrl: this.s.apiUrl,
            transportProtocol: "jsonrpc2",
            httpMethod: "POST",
            requireCommandDefinition: true,
            beforeSend: function(xhr) {},
            payloadParams: _.assign({
                session_token: function() {
                    return TB.SESSION_TOKEN || queryParams["session_token"] || null;
                }
            }, this.s.payloadParams),
            requestParams: _.assign({
                api_key: this.s.apiKey
            }, this.s.requestParams),
            commands: {
                get_jsonschema: {
                    httpMethod: "get",
                    schema_id: function() {
                        return queryParams["schema_id"];
                    }
                },
                get_data: {
                    httpMethod: "get",
                    payloadParams: {
                        form_name: function(val) {
                            return queryParams["form_name"] || queryParams["form"];
                        },
                        table_name: function() {
                            return queryParams["table_name"];
                        },
                        col_name: function() {
                            return queryParams["col_name"];
                        },
                        row_id: function() {
                            return queryParams["row_id"];
                        }
                    }
                },
                jsonform_form_load: {
                    httpMethod: "get",
                    payloadParams: {
                        form_name: function() {
                            return queryParams["form_name"] || settings["form_name"] || queryParams["form"];
                        },
                        record_id: function() {
                            return queryParams["record_id"] || settings["record_id"] || queryParams["row_id"] || settings["row_id"];
                        },
                        row_id: function() {
                            return queryParams["record_id"] || settings["record_id"] || queryParams["row_id"] || settings["row_id"];
                        }
                    }
                },
                jsonform_form_submit: {
                    httpMethod: "post",
                    payloadParams: {
                        table_name: function() {
                            return queryParams["table_name"] || settings["table_name"];
                        },
                        form_title: function() {
                            return queryParams["form_title"] || settings["form_title"];
                        },
                        col_name: function() {
                            return queryParams["col_name"] || settings["col_name"];
                        },
                        form_name: function() {
                            return queryParams["form_name"] || settings["form_name"] || queryParams["form"];
                        },
                        record_id: function() {
                            return queryParams["record_id"] || settings["record_id"] || queryParams["row_id"] || settings["row_id"];
                        },
                        row_id: function() {
                            return queryParams["record_id"] || settings["record_id"] || queryParams["row_id"] || settings["row_id"];
                        },
                        sp: function() {
                            return sp || 0;
                        }
                    }
                },
                jsonform_approve_record: {
                    httpMethod: "post",
                    payloadParams: {
                        table_name: function() {
                            return queryParams["table_name"] || settings["table_name"];
                        },
                        form_title: function() {
                            return queryParams["form_title"] || settings["form_title"];
                        },
                        col_name: function() {
                            return queryParams["col_name"] || settings["col_name"];
                        },
                        form_name: function() {
                            return queryParams["form_name"] || settings["form_name"] || queryParams["form"];
                        },
                        record_id: function() {
                            return queryParams["record_id"] || settings["record_id"] || queryParams["row_id"] || settings["row_id"];
                        },
                        row_id: function() {
                            return queryParams["record_id"] || settings["record_id"] || queryParams["row_id"] || settings["row_id"];
                        },
                        sp: function() {
                            return sp || 0;
                        }
                    }
                },
                crud_list: {
                    httpMethod: "get",
                    payloadParams: {
                        form_name: function() {
                            return queryParams["form_name"] || queryParams["form"];
                        },
                        table_name: function() {
                            return queryParams["table_name"];
                        }
                    }
                },
                crud_meta: {
                    httpMethod: "get",
                    payloadParams: {}
                },
                jsonform_fkey_search: {
                    httpMethod: "post"
                }
            }
        });
    };
    tbJfService.prototype = {
        getSchemaJSON: function() {
            return this.service.request("get_jsonschema", undefined, {
                timeout: 0
            });
        },
        getFormJSON: function() {},
        getContentJSON: function() {},
        formLoadTiny: function(params) {
            return this.service.request("jsonform_tiny_load", params, {
                timeout: 0
            }).then(function(resp) {
                sp = resp.sp || null;
                return resp;
            });
        },
        formLoad: function(params) {
            return this.service.request("jsonform_form_load", params, {
                timeout: 0
            }).then(function(resp) {
                sp = resp.sp || null;
                return resp;
            });
        },
        formApprove: function(params) {
            return this.service.request("jsonform_approve_record", params, {
                timeout: 0
            }).then(function(resp) {
                sp = resp.sp || null;
                return resp;
            });
        },
        formSubmit: function(value, files) {
            var timeout = 0;
            var realFiles = files.fileRequest;
            var requestType;
            if (files && Object.keys(realFiles).length > 0) {
                requestType = "formdata";
            }
            return this.service.request("jsonform_form_submit", value, {
                requestFiles: files,
                timeout: timeout,
                requestType: requestType,
                processData: requestType === undefined
            }).then(function(resp) {
                sp = resp.sp || null;
                return resp;
            });
        },
        searchForeignKey: function(params) {
            return this.service.request("jsonform_fkey_search", params.data, {
                timeout: 0
            });
        },
        addForeignEntry: function(params) {
            return this.service.request("jsonform_foreign_entry_add", params.data, {
                timeout: 0
            });
        },
        formSubmitForeign: function(params) {
            return this.service.request("create_record", params, {
                timeout: 0
            });
        }
    };
    return tbJfService;
});