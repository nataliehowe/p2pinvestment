(function(global, factory) {
    if (typeof define === "function" && define.amd) {
        define([ "ajv-4", "lodash-4", "tbjson.jsonpointer", "tbjson.traverseSchema", "tbjson.traverse", "tbjson.schemaResolver", "tbjson.url", "tb.xerrors" ], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("ajv-4"), require("lodash-4"), require("tbjson.jsonpointer"), require("tbjson.traverseSchema"), require("tbjson.traverse"), require("tbjson.schemaResolver"), require("tbjson.url"), require("tb.xerrors"));
    } else {
        global.TB = global.TB || {};
        global.TB.tbjson = global.TB.tbjson || {};
        global.TB.tbjson.ajv2tb = factory(global.Ajv, global._, global.TB.tbjson.jsonpointer, global.TB.tbjson.traverseSchema, global.TB.tbjson.traverse, global.TB.tbjson.schemaResolver, global.TB.tbjson.url, global.TB);
    }
})(this, function(Ajv, _, tbjsonJsonpointer, tbjsonTraverseSchema, tbjsonTraverse, tbjsonSchemaResolver, tbjsonUrl, TB) {
    TB = TB || window.TB;
    var ERR_CODE_INVALID_VALUE = "tbjson/10000";
    var ERR_MSG_INVALID_VALUE = "There are some invalid values, please correct input data!";
    var TITLE_PATH_SEPARATOR = " => ";
    var CONSTANT_CRUSH = "#";
    var META_SCHEMA = {
        id: "http://jsonschemas.telebid-pro.com/tbjson/schemas/jsonschema_custom04",
        type: "object",
        $schema: "http://json-schema.org/draft-04/schema",
        default: {},
        properties: {
            id: {
                type: "string",
                format: "uri"
            },
            not: {
                $ref: "#"
            },
            enum: {
                type: "array",
                minItems: 1,
                uniqueItems: true
            },
            type: {
                anyOf: [ {
                    $ref: "#/definitions/simpleTypes"
                }, {
                    type: "array",
                    items: {
                        $ref: "#/definitions/simpleTypes"
                    },
                    minItems: 1,
                    uniqueItems: true
                } ]
            },
            allOf: {
                $ref: "#/definitions/schemaArray"
            },
            anyOf: {
                $ref: "#/definitions/schemaArray"
            },
            items: {
                anyOf: [ {
                    $ref: "#"
                }, {
                    $ref: "#/definitions/schemaArray"
                } ],
                default: {}
            },
            oneOf: {
                $ref: "#/definitions/schemaArray"
            },
            title: {
                type: "string"
            },
            refCol: {
                type: "string"
            },
            $schema: {
                type: "string",
                format: "uri"
            },
            default: {},
            maximum: {
                type: "number"
            },
            minimum: {
                type: "number"
            },
            pattern: {
                type: "string",
                format: "regex"
            },
            refType: {
                enum: [ "fkey", "relation", "reference" ],
                type: "string"
            },
            maxItems: {
                $ref: "#/definitions/positiveInteger"
            },
            minItems: {
                $ref: "#/definitions/positiveIntegerDefault0"
            },
            refTable: {
                type: "string"
            },
            required: {
                $ref: "#/definitions/stringArray"
            },
            maxLength: {
                $ref: "#/definitions/positiveInteger"
            },
            minLength: {
                $ref: "#/definitions/positiveIntegerDefault0"
            },
            isUIHidden: {
                type: "boolean",
                default: false
            },
            multipleOf: {
                type: "number",
                minimum: 0,
                exclusiveMinimum: true
            },
            properties: {
                type: "object",
                default: {},
                additionalProperties: {
                    $ref: "#"
                }
            },
            refNameCol: {
                type: "string"
            },
            translated: {
                type: "boolean",
                default: false
            },
            definitions: {
                type: "object",
                default: {},
                additionalProperties: {
                    $ref: "#"
                }
            },
            description: {
                type: "string"
            },
            fileMaxSize: {
                $ref: "#/definitions/positiveInteger"
            },
            uniqueItems: {
                type: "boolean",
                default: false
            },
            dependencies: {
                type: "object",
                additionalProperties: {
                    anyOf: [ {
                        $ref: "#"
                    }, {
                        $ref: "#/definitions/stringArray"
                    } ]
                }
            },
            fileMimeTypes: {
                $ref: "#/definitions/stringArray"
            },
            maxProperties: {
                $ref: "#/definitions/positiveInteger"
            },
            minProperties: {
                $ref: "#/definitions/positiveIntegerDefault0"
            },
            additionalItems: {
                anyOf: [ {
                    type: "boolean"
                }, {
                    $ref: "#"
                } ],
                default: {}
            },
            isMultilanguage: {
                type: "boolean",
                default: false
            },
            exclusiveMaximum: {
                type: "boolean",
                default: false
            },
            exclusiveMinimum: {
                type: "boolean",
                default: false
            },
            patternProperties: {
                type: "object",
                default: {},
                additionalProperties: {
                    $ref: "#"
                }
            },
            additionalProperties: {
                anyOf: [ {
                    type: "boolean"
                }, {
                    $ref: "#"
                } ],
                default: {}
            }
        },
        definitions: {
            schemaArray: {
                type: "array",
                items: {
                    $ref: "#"
                },
                minItems: 1
            },
            simpleTypes: {
                enum: [ "array", "boolean", "integer", "null", "number", "object", "string" ]
            },
            stringArray: {
                type: "array",
                items: {
                    type: "string"
                },
                minItems: 1,
                uniqueItems: true
            },
            positiveInteger: {
                type: "integer",
                minimum: 0
            },
            positiveIntegerDefault0: {
                allOf: [ {
                    $ref: "#/definitions/positiveInteger"
                }, {
                    default: 0
                } ]
            }
        },
        description: "Core schema meta-schema",
        dependencies: {
            refCol: [ "refTable" ],
            refType: [ "refTable", "refCol" ],
            refTable: [ "refCol" ],
            refNameCol: [ "refTable", "refCol" ],
            exclusiveMaximum: [ "maximum" ],
            exclusiveMinimum: [ "minimum" ]
        }
    };
    var reArray = /\[([0-9]*)\](?=\[|\/|$)/g;
    var escapeKey = function(key) {
        return key.replace(/\~/g, "~0").replace(/\//g, "~1").replace(/\{/g, "~3").replace(/\}/g, "~4").replace(/\[/g, "~6").replace(/\]/g, "~7");
    };
    var unescapeKey = function(key) {
        return key.replace(/~0/g, "~").replace(/~1/g, "/").replace(/~3/g, "{").replace(/~4/g, "}").replace(/~6/g, "[").replace(/~7/g, "]");
    };
    var jsonformPointerToJsonPointer = function(key) {
        if (key[0] != "/") {
            key = "/" + key;
        }
        key = key.replace(/\[\]/g, "/0");
        key = key.replace(/\[(\d+)\]/g, "/$1");
        key = key.replace(/\{\}/g, "");
        key = key.replace(/\{(\*?)\}/g, "");
        var key_arr = key.split("/");
        key_arr = key_arr.map(function(curr) {
            return unescapeKey(curr);
        });
        var return_key = key_arr.join("/");
        return return_key;
    };
    var getNewSchemaResolver = function(schema) {
        return new tbjsonSchemaResolver(schema);
    };
    var getSchemasByJsonPointer = function(rootSchema, jsonPointer, dontGoDeeperInAdditionalProperties) {
        jsonPointer = jsonformPointerToJsonPointer(jsonPointer);
        var schemaResolver = getNewSchemaResolver(rootSchema);
        var jsonPointerArr = [];
        if (jsonPointer === "/") {
            jsonPointerArr = [ "" ];
        } else {
            jsonPointerArr = jsonPointer.split("/");
        }
        var schemaArr = [];
        var currentPointer = "";
        for (var i = 1; i <= jsonPointerArr.length; i++) {
            var schema = schemaResolver.getByPointer(currentPointer, {
                dontGoDeeperInAdditionalProperties: dontGoDeeperInAdditionalProperties,
                useAdditionalProperties: true
            });
            schemaArr.push(schema);
            currentPointer += "/" + jsonPointerArr[i];
        }
        return schemaArr;
    };
    var getSchemaByJsonPointer = function(rootSchema, jsonPointer, dontGoDeeperInAdditionalProperties) {
        jsonPointer = jsonformPointerToJsonPointer(jsonPointer);
        var schemaResolver = getNewSchemaResolver(rootSchema);
        var schema = schemaResolver.getByPointer(jsonPointer, {
            dontGoDeeperInAdditionalProperties: dontGoDeeperInAdditionalProperties,
            useAdditionalProperties: true
        });
        return schema;
    };
    var generateEscapedKey = function(key) {
        key = key.split("/");
        if (key[0] === "") {
            key.shift();
        }
        var escapedKey = "";
        for (var i = 0; i < key.length; i++) {
            escapedKey += "['" + key[i].replace(/\'/g, "\\'") + "']";
        }
        return escapedKey;
    };
    var escapeSquareBrackets = function(key) {
        return key.replace(/\[(\d+)\]/g, "/$1");
    };
    var getObjByKey = function(obj, key) {
        key = escapeSquareBrackets(key);
        var escapedKey = generateEscapedKey(key);
        return _.get(obj, escapedKey);
    };
    var resolveSchema = function(rootSchema, parentSchema) {
        var schemaResolver = getNewSchemaResolver(rootSchema);
        return schemaResolver.resolveSchema(rootSchema);
    };
    var resolveMerge = function(schema) {
        if (_.isNil(schema)) return schema;
        if (_.isUndefined(schema.$merge)) return schema;
        TB.ASSERT(!_.isUndefined(schema.$merge.source) && !_.isUndefined(schema.$merge.with), {
            code: "TB/tbjsonAjv2tb/11060",
            msg: "$merge keyword needs both source and with!"
        });
        return _.merge({}, schema.$merge.source, schema.$merge.with);
    };
    var resolveRefs = function(rootSchema, parentSchema, resolveInnerRefs, refPaths) {
        if (_.isNil(parentSchema)) return parentSchema;
        var schema = parentSchema;
        TB.ASSERT(_.isPlainObject(schema), {
            code: "TB/tbjsonAjv2tb/11070",
            msg: "Schema must be an object"
        });
        if (_.isNil(schema.$ref)) {
            return schema;
        }
        TB.ASSERT(typeof schema.$ref === "string", {
            code: "TB/tbjsonAjv2tb/11080",
            msg: "Schema $ref must be string"
        });
        var initialRef = schema.$ref;
        var currentRefPath = refPaths || [];
        if (currentRefPath.indexOf(schema.$ref) >= 0) {
            return schema;
        }
        currentRefPath.push(schema.$ref);
        var schemaRef = schema.$ref;
        var schemaRefPath = "";
        if (_.includes(schemaRef, CONSTANT_CRUSH)) {
            var parts = schemaRef.split(CONSTANT_CRUSH);
            schemaRef = parts[0] || "";
            schemaRefPath = parts[1] || "";
        }
        if (!schemaRef && !resolveInnerRefs) {
            return schema;
        }
        var escapedRefSchema = schemaRef;
        var rootSchemaId = rootSchema.$id || rootSchema.id;
        if (schemaRef === "" || schemaRef === rootSchemaId) {
            schema = rootSchema;
        } else {
            TB.ASSERT(_.isPlainObject(rootSchema.definitions), {
                code: "TB/JFUtils/11090",
                msg: "$ref $REFERENCE$ not found for $SCHEMA$",
                msgParams: {
                    REFERENCE: schemaRef,
                    ROOT: rootSchema
                }
            });
            TB.ASSERT(rootSchema.definitions[escapedRefSchema], {
                code: "TB/JFUtils/11100",
                msg: "$ref $REFERENCE$ not found for $SCHEMA$",
                msgParams: {
                    REFERENCE: schemaRef,
                    ROOT: rootSchema
                }
            });
            schema = rootSchema.definitions[escapedRefSchema];
        }
        if (schemaRefPath.length > 0) {
            schema = getObjByKey(rootSchema, schemaRefPath);
        }
        if (schema && schema.$ref) {
            schema = resolveRefs(rootSchema, schema, resolveInnerRefs, currentRefPath);
        }
        return schema;
    };
    var hookKeywords = {
        readOnly: function(oldContent, newContent, props) {
            var path = [ "" ].concat(props.path).join("/");
            var oldValue = tbjsonJsonpointer.get(oldContent, path);
            tbjsonJsonpointer.set(newContent, path, oldValue);
        },
        passwordType: function(props) {}
    };
    var USER_ERR_STATUS = "user_error";
    var PEER_ERR_STATUS = "peer_error";
    var ERR_CODES_BY_KEYWORD = {
        multipleOf: 1e3,
        maximum: 1001,
        minimum: 1002,
        pattern: 1003,
        format: 1004,
        minLength: 1005,
        maxLength: 1006,
        refCol: 1100,
        nullValue: 1800,
        required: 1810,
        schemaError: 1900
    };
    function schemaHasType(schemaType, type) {
        return !!(typeof schemaType === "string" && schemaType === type || schemaType instanceof Array && schemaType.indexOf(type) >= 0);
    }
    function jsonPointerToTitlePath(rootSchema, jsonPointer) {
        jsonPointer = unescapeKey(Ajv2tb.dotNotationToJsonPointerNotation(jsonPointer));
        var schemasArr = getSchemasByJsonPointer(rootSchema, jsonPointer, true);
        var titleArr = schemasArr.map(function(schema) {
            return schema !== undefined ? schema.title : "UNDEFINED";
        }).join(TITLE_PATH_SEPARATOR);
        return "ROOT" + titleArr;
    }
    function addFormats(ajv) {
        var datePattern = /^\d\d\d\d-(\d\d)-(\d\d)$/;
        var daysPattern = [ 0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
        var timePattern = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i;
        var datetimeSeparatorPattern = /t| /i;
        var emailSenderPattern = /^[^@"]+@[^."]+\.[^"]+$/;
        var emailRecipeintsPattern = /^([^@"]+@[^."]+\.[^"]\w+[,; "]{0,1})+$/;
        var passwordValidate = function(jsonString) {
            try {
                var dataObject = JSON.parse(jsonString);
            } catch (e) {
                return false;
            }
            if (dataObject.oldValue === "") {
                return false;
            }
            if (dataObject.newValue === dataObject.confirmValue) {
                return true;
            }
            return false;
        };
        var validateEmailSender = function(str) {
            var matches = str.match(emailSenderPattern);
            if (!matches) return false;
            return true;
        };
        var validateEmailRecipients = function(str) {
            var matches = str.match(emailRecipeintsPattern);
            if (!matches) return false;
            return true;
        };
        var dateValidate = function(str) {
            var matches = str.match(datePattern);
            if (!matches) return false;
            var month = +matches[1];
            var day = +matches[2];
            return month >= 1 && month <= 12 && day >= 1 && day <= daysPattern[month];
        };
        var validateInet = function(str) {
            var MAX_INET_IP_LENGTH = 19;
            if (_.isUndefined(str)) {
                return str;
            }
            return str.length <= MAX_INET_IP_LENGTH;
        };
        var timeValidate = function(str, full) {
            var matches = str.match(timePattern);
            if (!matches) return false;
            var hour = matches[1];
            var minute = matches[2];
            var second = matches[3];
            var timeZone = matches[5];
            return hour <= 23 && minute <= 59 && second <= 59 && (!full || timeZone);
        };
        var datetimeValidate = function(str) {
            var datetime = str.split(datetimeSeparatorPattern);
            return datetime.length === 2 && dateValidate(datetime[0]) && timeValidate(datetime[1], false);
        };
        var validateNumeric = function(data) {
            if (typeof data === "Number") {
                return true;
            } else {
                return /^(\+|-)?(\d+(\.\d+)?)$/.test(data);
            }
        };
        var compareDate = function(d1, d2) {
            if (!(d1 && d2)) return;
            if (d1 > d2) return 1;
            if (d1 < d2) return -1;
            if (d1 === d2) return 0;
        };
        var compareTime = function(t1, t2) {
            if (!(t1 && t2)) return;
            if (!(t1 && t2)) return;
            t1 = t1[1] + t1[2] + t1[3] + (t1[4] || "");
            t2 = t2[1] + t2[2] + t2[3] + (t2[4] || "");
            if (t1 > t2) return 1;
            if (t1 < t2) return -1;
            if (t1 === t2) return 0;
        };
        var compareDatetime = function(dt1, dt2) {
            if (!(dt1 && dt2)) return;
            dt1 = dt1.split(datetimeSeparatorPattern);
            dt2 = dt2.split(datetimeSeparatorPattern);
            var res = compareDate(dt1[0], dt2[0]);
            if (res === undefined) return;
            return res || compareTime(dt1[1], dt2[1]);
        };
        var validateJSON = function(str) {
            var res;
            try {
                JSON.stringify(JSON.parse(str));
                res = true;
            } catch (e) {
                res = false;
            }
            return res;
        };
        ajv.addFormat("json", {
            validate: validateJSON
        });
        ajv.addFormat("numeric", {
            validate: validateNumeric
        });
        ajv.addFormat("html", {
            validate: function() {
                return true;
            }
        });
        ajv.addFormat("inet", {
            validate: validateInet
        });
        ajv.addFormat("iso8601date", {
            validate: dateValidate,
            compare: compareDate
        });
        ajv.addFormat("iso8601time", {
            validate: timeValidate,
            compare: compareTime
        });
        ajv.addFormat("iso8601datetime", {
            validate: datetimeValidate,
            compare: compareDatetime
        });
        ajv.addFormat("password", {
            validate: passwordValidate
        });
        ajv.addFormat("emailsender", {
            validate: validateEmailSender
        });
        ajv.addFormat("emailrecipeints", {
            validate: validateEmailRecipients
        });
    }
    function Ajv2tb(ajv, s) {
        this.ajv = ajv;
        this.s = s || {};
        this.s.msgs = this.s.msgs || {};
        this.s.msgs.default = this.s.msgs.default || "Invalid value";
        this.s.msgs.nullValue = this.s.msgs.nullValue || "Missing value";
        this.s.msgs.required = this.s.msgs.required || "Undefined value";
        this.s.msgs.refCol = this.s.msgs.refCol || "Value not found in referenced table";
        this.s.msgs.schemaError = this.s.msgs.schemaError || "Invalid value against schema";
        this.s.msgs.allPatterns = this.s.msgs.allPatterns || "Value must have all required symbols";
        addFormats(ajv);
        if (!this.s.dropTheKeywords) {
            this.addKeywords(ajv);
        }
    }
    Ajv2tb.prototype = Ajv2tb.prototype || {};
    Ajv2tb.prototype.addKeywords = function addKeywords(ajv) {
        var self = this;
        var parseBase64 = function(data) {
            var base64ToRealSizeCoefficient = 3 / 4;
            if (data === null) {
                return data;
            }
            var found = data.match("data:(.+);base64,(.*)");
            if (!found) {
                return null;
            }
            var size = Math.ceil(found[2].length * base64ToRealSizeCoefficient);
            return {
                mimeType: found[1],
                data: found[2],
                size: size
            };
        };
        var addMergePatchKeyword = function(ajv, keyword, jsonPatch, patchSchema) {
            if (!ajv._opts.v5) {
                throw new Error("keyword " + keyword + " requires v5 option");
            }
            ajv.addKeyword(keyword, {
                errors: "full",
                macro: function(schema, parentSchema, it) {
                    var source = schema.source;
                    var patch = schema.with;
                    var dest = {};
                    if (source.$ref) source = JSON.parse(JSON.stringify(getSchema(source.$ref)));
                    if (patch.$ref) patch = getSchema(patch.$ref);
                    jsonPatch.call(jsonPatch, dest, source, patch);
                    return dest;
                    function getSchema($ref) {
                        var id = it.baseId && it.baseId !== "#" ? tbjsonUrl.resolve(it.baseId, $ref) : $ref;
                        var validate = ajv.getSchema(id);
                        if (!TB.CONFIG.HAS_WINDOW) {
                            ajv._opts.loadSchema(id, function() {});
                            validate = ajv.getSchema(id);
                        }
                        if (validate) return validate.schema;
                        var err = new Error("can't resolve reference " + $ref + " from id " + it.baseId + " in $merge keyword");
                        err.missingRef = it.resolve.url(it.baseId, $ref);
                        err.missingSchema = it.resolve.normalizeId(it.resolve.fullPath(err.missingRef));
                        throw err;
                    }
                },
                metaSchema: {
                    type: "object",
                    required: [ "source", "with" ],
                    additionalProperties: false,
                    properties: {
                        source: {
                            anyOf: [ {
                                type: "object",
                                required: [ "$ref" ],
                                additionalProperties: false,
                                properties: {
                                    $ref: {
                                        type: "string",
                                        format: "uri"
                                    }
                                }
                            }, {
                                $ref: Ajv2tb.$schema
                            } ]
                        },
                        with: patchSchema
                    }
                }
            });
        };
        ajv.addKeyword("fileMimeTypes", {
            errors: true,
            validate: function(schema, data, parentSchema, key) {
                if (schemaHasType(parentSchema.type, "null") && data === null) {
                    return true;
                }
                if (!TB.CONFIG.HAS_WINDOW) {
                    return true;
                }
                if (parentSchema.format === "file") {
                    if (self.files === undefined) {
                        return true;
                    }
                    var jsonPathKey = key.replace(/\./g, "/").substr(1);
                    var fileWrapper = self.files && self.files[jsonPathKey];
                    if (fileWrapper === undefined) {
                        return true;
                    }
                    var file = fileWrapper.file[0];
                    for (var i = 0; i < parentSchema.fileMimeTypes.length; i++) {
                        if (file.type === parentSchema.fileMimeTypes[i]) {
                            return true;
                        }
                    }
                    return false;
                }
                var meta = parseBase64(data);
                if (!meta) return false;
                for (var i = 0, l = schema.length; i < l; i++) {
                    if (schema[i] === meta.mimeType) {
                        return true;
                    }
                }
                return false;
            },
            metaSchema: {
                type: "array",
                items: {
                    type: "string",
                    pattern: "^\\w+\\/\\w+$"
                }
            }
        });
        ajv.addKeyword("fileMaxSize", {
            errors: true,
            validate: function(schema, data, parentSchema, key) {
                if (schemaHasType(parentSchema.type, "null") && data === null) {
                    return true;
                }
                if (!TB.CONFIG.HAS_WINDOW) {
                    return true;
                }
                if (parentSchema.format === "file") {
                    if (self.files === undefined) {
                        return true;
                    }
                    var jsonPathKey = key.replace(/\./g, "/").substr(1);
                    var fileWrapper = self.files && self.files[jsonPathKey];
                    if (fileWrapper === undefined) {
                        return true;
                    }
                    var file = fileWrapper.file[0];
                    return file.size <= schema;
                }
                var meta = parseBase64(data);
                if (!meta) return false;
                return meta.size <= schema;
            },
            metaSchema: {
                type: "integer",
                minimum: 0
            }
        });
        ajv.addKeyword("$$jsonFormat", {
            errors: true,
            macro: function(schema, parentSchema) {
                if (schema === "tbjson" && schemaHasType(parentSchema.type, "object")) {
                    return {
                        type: "object",
                        required: [ "$schemaId" ],
                        properties: {
                            $schemaId: {
                                type: "string"
                            }
                        }
                    };
                }
                return {};
            }
        });
        addMergePatchKeyword(ajv, "$merge", function(dest, srcSchema, withSchema) {
            return _.merge(dest, srcSchema, withSchema);
        }, {});
    };
    Ajv2tb.prototype.removeSchema = function removeSchema(schemaId) {
        this.ajv.removeSchema(schemaId);
    };
    Ajv2tb.prototype.compile = function compile() {
        return this._compile.apply(this, arguments);
    };
    Ajv2tb.prototype._compile = function _compile(schema, schemaId) {
        schemaId = schemaId || schema.$id || schema.id;
        var validatorFn = this.ajv.getSchema(schemaId);
        if (validatorFn) {
            return validatorFn;
        } else {
            this.ajv.addSchema(schema, schemaId);
            return this.ajv.getSchema(schemaId);
        }
    };
    Ajv2tb.prototype._validate = function _validate(validatingSchema, schema, data) {
        var result = false;
        if (typeof schema === "string") {
            schema = this.ajv.getSchema(schema).schema;
        }
        var schemaId = schema.$id || schema.id;
        var errors;
        if (validatingSchema) {
            this.removeSchema(schemaId);
            result = this.ajv.validateSchema(schema);
        } else {
            this.compile(schema);
            result = this.ajv.validate(schemaId, data);
        }
        errors = this.ajv.errors;
        if (result !== true) {
            var resultErrors = [];
            var resolvedSchema = _.merge({}, schema);
            var firstNonUserErr = null;
            Ajv2tb.traverseSchema(resolvedSchema, function(props) {
                var innerSchemaId = props.schema.$id || props.schema.id;
                if (!props.jsonPointer || innerSchemaId === Ajv2tb.$schema) return;
                tbjsonJsonpointer.set(resolvedSchema, props.jsonPointer, resolveSchema(props.rootSchema, props.schema));
            });
            errors.forEach(function(ajvErr) {
                var titlePath = jsonPointerToTitlePath(resolvedSchema, ajvErr.dataPath);
                var errProto = {
                    debug: {
                        ajvErr: ajvErr
                    },
                    details: {
                        wrongData: ajvErr.data,
                        dataPath: ajvErr.dataPath,
                        titlePath: titlePath
                    },
                    msgParams: {},
                    msg: null,
                    msgTmpl: null,
                    status: null,
                    code: null
                };
                var constraintMsgs = ajvErr.parentSchema.constraintMsgs;
                var prefix = ajvErr.schema.errorPrefix || "";
                if (constraintMsgs === null || constraintMsgs === undefined) {
                    constraintMsgs = {};
                }
                if (_.isString(constraintMsgs)) {
                    constraintMsgs = {
                        default: constraintMsgs
                    };
                }
                if (!constraintMsgs.default) {
                    constraintMsgs.default = ajvErr.parentSchema.constraintMsg;
                }
                for (var key in this.s.msgs) {
                    constraintMsgs[key] = constraintMsgs[key] || constraintMsgs.default || this.s.msgs[key];
                }
                try {
                    errProto.msgParams.DATA = JSON.stringify(ajvErr.data);
                } catch (e) {
                    log(NOTICE, e);
                    errProto.msgParams.DATA = "!!!UNABLE TO REPRESENT AS A JSON!!!";
                }
                errProto.msgParams.PATH = titlePath;
                errProto.msgParams.DATA_PATH = ajvErr.dataPath;
                errProto.msgParams.TITLE = ajvErr.parentSchema.title;
                errProto.msgParams.DESCRIPTION = ajvErr.parentSchema.description;
                switch (ajvErr.keyword) {
                  case "$merge":
                    return;

                  case "required":
                    if (ajvErr.params && ajvErr.params.missingProperty !== undefined) {
                        var missingProperty = ajvErr.params.missingProperty;
                        var missingPropertyPath = ajvErr.dataPath + "." + missingProperty;
                        var missingPropertyTitlePath = jsonPointerToTitlePath(resolvedSchema, missingPropertyPath);
                        errProto.code = prefix + ERR_CODES_BY_KEYWORD.required;
                        errProto.type = TB.CONFIG.ERR_USER;
                        errProto.msg = constraintMsgs.required;
                        errProto.details.dataPath = missingPropertyPath;
                        errProto.details.titlePath = missingPropertyTitlePath;
                        errProto.msgParams.PATH = missingPropertyTitlePath;
                        errProto.msgParams.DATA_PATH = missingPropertyPath;
                        errProto.msgParams.TITLE = ajvErr.parentSchema.properties[missingProperty].title;
                        errProto.msgParams.DESCRIPTION = ajvErr.parentSchema.properties[missingProperty].description;
                        break;
                    }

                  case "type":
                    if (ajvErr.data === null) {
                        errProto.code = prefix + ERR_CODES_BY_KEYWORD.nullValue;
                        errProto.type = TB.CONFIG.ERR_USER;
                        errProto.msg = constraintMsgs.nullValue;
                        break;
                    }

                  default:
                    errProto.code = prefix + (ERR_CODES_BY_KEYWORD[ajvErr.keyword] || ERR_CODES_BY_KEYWORD.schemaError);
                    errProto.type = TB.CONFIG.ERR_USER;
                    errProto.msg = constraintMsgs[ajvErr.keyword] || constraintMsgs.default || this.s.msgs.schemaError;
                }
                var err = TB.CREATE_ERROR(errProto);
                if (!firstNonUserErr && err.tbData.type !== TB.CONFIG.ERR_USER) {
                    firstNonUserErr = err;
                }
                err.titlePath = err.tbData.details.titlePath;
                err.dataPath = err.tbData.details.dataPath;
                resultErrors.push(err);
            }.bind(this));
            resultErrors.sort(function(a, b) {
                if (a.dataPath < b.dataPath) {
                    return -1;
                } else if (a.dataPath > b.dataPath) {
                    return 1;
                }
                return 0;
            });
            if (!firstNonUserErr) {
                mainError = TB.CREATE_ERROR({
                    type: TB.CONFIG.ERR_USER,
                    code: ERR_CODE_INVALID_VALUE,
                    msg: ERR_MSG_INVALID_VALUE,
                    validationErrors: resultErrors
                });
            } else {
                mainError = TB.CREATE_ERROR({
                    type: TB.CONFIG.ERR_PEER,
                    code: firstNonUserErr.code,
                    msg: firstNonUserErr.origMsg,
                    validationErrors: resultErrors
                });
            }
            return mainError;
        }
        return true;
    };
    Ajv2tb.prototype.validate = function validate(schemaJson, content, files) {
        if (!_.isUndefined(files)) {
            this.files = files;
        }
        return this._validate(false, schemaJson, content);
    };
    Ajv2tb.prototype.validateSchema = function validateSchema(schemaJson) {
        return this._validate(true, schemaJson);
    };
    Ajv2tb.$schema = "http://jsonschemas.telebid-pro.com/tbjson/schemas/jsonschema_custom04";
    Ajv2tb.getAjvInstance = function getAjvInstance(settings) {
        var ajv = new Ajv(_.merge({}, {
            v5: true,
            verbose: true,
            allErrors: true
        }, settings || {}));
        ajv.addMetaSchema(META_SCHEMA);
        return ajv;
    };
    Ajv2tb.getAjv2tbInstance = function getAjv2tbInstance(settings) {
        settings = settings || {};
        var ajv = Ajv2tb.getAjvInstance(settings.ajvSettings);
        return new Ajv2tb(ajv, settings);
    };
    Ajv2tb.resolveSchema = function resolveSchema(schema) {
        return resolveSchema(schema, schema);
    };
    Ajv2tb.traverseSchema = function traverseSchema(schema, cb, content) {};
    Ajv2tb.traverse = function() {};
    Ajv2tb.dotNotationToJsonPointerNotation = function(dotString) {
        TB.ASSERT(_.isString(dotString), {
            msg: "Bad input",
            code: 2050
        });
        return dotString.split(/\[\'(.*?)\'\]|\[(\d*)\]|\./).filter(function(el) {
            return el !== undefined && el !== "";
        }).join("/");
    };
    Ajv2tb.getAllSpecialPaths = function(rootSchema, content) {
        var paths = [];
        var processItem = function(props) {
            var jsonPointer = [ "" ].concat(this.path);
            try {
                jsonPointer = jsonPointer.join("/");
                var schema = getSchemaByJsonPointer(rootSchema, jsonPointer);
            } catch (e) {
                if (e.code === 404) {
                    return;
                } else {
                    throw e;
                }
            }
            for (var hookKeyword in hookKeywords) {
                if (schema && schema.hasOwnProperty(hookKeyword)) {
                    paths.push({
                        prop: this,
                        path: jsonPointer,
                        type: hookKeyword,
                        cb: hookKeywords[hookKeyword]
                    });
                }
            }
        };
        tbjsonTraverse(content).forEach(processItem);
        return paths;
    };
    Ajv2tb.preprocessContent = function(oldContent, newContent, schema) {
        var paths = this.getAllSpecialPaths(schema, oldContent);
        var newContentCopy = _.cloneDeep(newContent);
        for (var i = paths.length - 1; i >= 0; i--) {
            paths[i].cb(oldContent, newContentCopy, paths[i].prop);
        }
        return newContentCopy;
    };
    Ajv2tb.metaSchema = META_SCHEMA;
    Ajv2tb.getSchemaByJsonPointer = getSchemaByJsonPointer;
    Ajv2tb.resolveRefs = resolveRefs;
    Ajv2tb.Ajv2tb = Ajv2tb;
    Ajv2tb.getObjByKey = getObjByKey;
    Ajv2tb.resolveSchema = resolveSchema;
    Ajv2tb.resolveRefs = resolveRefs;
    Ajv2tb.resolveMerge = resolveMerge;
    Ajv2tb.getNewSchemaResolver = getNewSchemaResolver;
    Ajv2tb.jsonformPointerToJsonPointer = jsonformPointerToJsonPointer;
    Ajv2tb.generateEscapedKey = generateEscapedKey;
    return Ajv2tb;
});