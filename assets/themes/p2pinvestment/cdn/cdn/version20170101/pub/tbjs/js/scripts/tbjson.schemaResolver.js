(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("lodash"), require("tbjson.url"), require("tbjson.jsonpointer"));
    } else if (typeof define === "function" && define.amd) {
        define([ "lodash", "tbjson.url", "tbjson.jsonpointer" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.tbjson = global.TB.tbjson || {};
        global.TB.tbjson.schemaResolver = factory(global._, global.TB.tbjson.url, global.TB.tbjson.jsonpointer);
    }
})(this, function(_, url, jsonpointer) {
    var ASSERT = function(cond) {
        if (!cond) {
            throw new Error("ASSERT FAILED!");
        }
    };
    var ASSERT_PEER = ASSERT;
    function isArray(val) {
        return _.isArray(val);
    }
    function isNil(val) {
        return _.isNil(val);
    }
    function isInteger(val) {
        return _.isInteger(val);
    }
    function isString(val) {
        return _.isString(val);
    }
    function hasType(schemaType, checkWith) {
        return _.includes(schemaType, checkWith);
    }
    function isObject(val) {
        return _.isPlainObject(val);
    }
    function objectAssign(target, varArgs) {
        "use strict";
        if (target == null) {
            throw new TypeError("Cannot convert undefined or null to object");
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    }
    var REGEX_PATH_SEGMENT_ENDS_IN_ARRAY_WILDCARD = /.+\[]/;
    var REGEX_PATH_SEGMENT_ENDS_IN_OBJECT_WILDCARD = /.+\{\}/;
    var SchemaResolver = function(rootSchema, s) {
        this.s = s || {};
        this.rootSchema = rootSchema;
        this._refSchemas = rootSchema.$$refSchemas || {};
        this._cache = {};
    };
    SchemaResolver.prototype.normalizeUrlPointer = function(pointer) {
        return pointer.replace(/^#/, "");
    };
    SchemaResolver.prototype.resolveSchema = function(schema, opts) {
        if (isNil(schema)) return schema;
        opts = opts || {
            refsSoFar: []
        };
        ASSERT_PEER(isNil(schema.$ref) || isNil(schema.$merge), {
            code: "TB/JFUtils/11050",
            msg: "Schema must have either $ref or $merge, but not both at the same time. Check schema $SCHEMA$",
            msgParams: {
                SCHEMA: schema
            }
        });
        schema = this._resolveRefs(schema, opts);
        schema = this._resolveMerges(schema, opts);
        return schema;
    };
    SchemaResolver.prototype._resolveRefs = function(parentSchema, opts) {
        if (isNil(parentSchema) || !isString(parentSchema.$ref)) return parentSchema;
        var schema = parentSchema;
        var ref = schema.$ref;
        var schemaParser = this;
        if (opts.refsSoFar.indexOf(schema.$ref) >= 0) {
            throw new Error("reference loop");
        }
        var parsed = url.parse(ref);
        var hash = parsed.hash;
        if (ref.slice(0, 2) !== "#/") {
            var schemaId = [ parsed.protocol ? parsed.protocol + "//" : "", parsed.host || "", parsed.path || "" ].join("");
            if (this.rootSchema.id === schemaId) {
                hash = parsed.hash;
            } else if (this._refSchemas[schemaId]) {
                schemaParser = this.findParentSchemaResolver(schemaId);
                if (!schemaParser) {
                    schemaParser = new SchemaResolver(this._refSchemas[schemaId], {
                        parentParser: this
                    });
                }
            } else {
                hash = "#/definitions/" + jsonpointer.escape(ref);
            }
        }
        opts.refsSoFar.push(schema.$ref);
        if (hash) {
            schema = jsonpointer.get(schemaParser.rootSchema, hash);
        } else {
            schema = schemaParser.rootSchema;
        }
        schema = schemaParser.resolveSchema(schema, opts);
        return schema;
    };
    SchemaResolver.prototype._resolveMerges = function(parentSchema, opts) {
        if (isNil(parentSchema)) return parentSchema;
        var schema = parentSchema;
        if (isObject(schema.$merge)) {
            var sourceSch = this.resolveSchema(parentSchema.$merge.source, opts);
            var withSch = this.resolveSchema(parentSchema.$merge.with, opts);
            schema = _.merge({}, sourceSch, withSch);
        }
        return schema;
    };
    SchemaResolver.prototype.getSchemaBySchemaPointer = function(pointer, opts) {};
    SchemaResolver.prototype.getSchemaByContentPointer = function(pointer, opts) {};
    SchemaResolver.prototype.findParentSchemaResolver = function(schemaId) {
        var parser = null;
        if (this.s.parentParser) {
            if (this.s.parentParser.rootSchema.id === schemaId) {
                parser = this.s.parentParser;
            } else {
                this.s.parentParser.findParentSchemaResolver(schemaId);
            }
        }
        return parser;
    };
    SchemaResolver.prototype._searchInObj = function(schema, key, opts) {
        if (isObject(schema.properties)) {
            schema = schema.properties[key];
            opts.schemaPath.push("properties");
            opts.schemaPath.push(key);
        } else if (opts.useAdditionalProperties && isObject(schema.additionalProperties)) {
            schema = schema.additionalProperties;
            if (isObject(schema.properties) && !opts.dontGoDeeperInAdditionalProperties) {
                schema = schema.properties[key];
            }
            opts.schemaPath.push("additionalProperties");
        } else {
            schema = undefined;
        }
        return schema;
    };
    SchemaResolver.prototype._searchInArr = function(schema, key, opts) {
        if (isInteger(+key)) {
            if (isObject(schema.items)) {
                schema = schema.items;
            } else if (isArray(schema.items)) {
                if (schema.items.length > parseInt(key)) {
                    schema = schema.items[key];
                    opts.schemaPath.push("items");
                    opts.schemaPath.push(key);
                } else if (isObject(schema.additionalItems)) {
                    schema = schema.additionalItems;
                    opts.schemaPath.push("additionalItems");
                } else {
                    schema = undefined;
                }
            }
        } else {
            schema = undefined;
        }
        return schema;
    };
    SchemaResolver.prototype._searchInOneOf = function(parentSchema, key, opts) {
        if (!opts.useOneOfSchema) return parentSchema;
        ASSERT(isObject(opts.useOneOfSchema));
        var soFarPointer = jsonpointer.compilePointer(opts.soFarPointerArr);
        var schema = parentSchema;
        if (opts.useOneOfSchema.hasOwnProperty(soFarPointer)) {
            var oneOfConfig = opts.useOneOfSchema[soFarPointer];
            ASSERT(isObject(schema.oneOf));
            ASSERT(isObject(oneOfConfig));
            ASSERT(isInteger(oneOfConfig.index));
            var oneOfSchema = schema.oneOf[oneOfConfig.index];
            ASSERT(isObject(oneOfSchema));
            opts.schemaPath.push("oneOf");
            opts.schemaPath.push(oneOfConfig.index);
            schema = this._search(oneOfSchema, key, opts);
        }
        return schema;
    };
    SchemaResolver.prototype._search = function(parentSchema, key, opts) {
        if (isNil(parentSchema)) return parentSchema;
        var resolvedSchema = this.resolveSchema(parentSchema, opts);
        var schema = resolvedSchema;
        if (isNil(schema)) return schema;
        if (opts.requirements && opts.requirements[opts.depth]) {
            return schema[opts.requirements[opts.depth]];
        }
        schema = this._searchInOneOf(schema, key, opts);
        if (schema === resolvedSchema || schema === undefined) {
            if (schema === undefined) schema = resolvedSchema;
            if (hasType(schema.type, "object")) {
                schema = this._searchInObj(schema, key, opts);
            } else if (hasType(schema.type, "array")) {
                schema = this._searchInArr(schema, key, opts);
            } else {
                schema = undefined;
            }
        }
        return schema;
    };
    SchemaResolver.prototype.getByPointer = function(pointer, opts) {
        var pathArr = jsonpointer.parsePointer(pointer);
        var childSch = this.rootSchema;
        opts = objectAssign({}, opts || {});
        opts = objectAssign(opts, {
            schemas: [],
            schemaPath: [ "#" ],
            soFarPointerArr: [ "" ],
            refsSoFar: [],
            depth: 0
        });
        for (var i = 0, l = pathArr.length; i < l; i++) {
            var key = pathArr[i];
            if (key === "") {
                continue;
            }
            opts.soFarPointerArr.push(key);
            childSch = this._search(childSch, key, opts);
            opts.schemas.push({
                key: key,
                val: childSch
            });
            opts.depth++;
            if (childSch === undefined) {
                break;
            }
        }
        childSch = this.resolveSchema(childSch, opts);
        return childSch;
    };
    SchemaResolver.prototype.getSchemaByFormPointer = function(pointer, opts) {
        var pointerArr = jsonpointer.parsePointer(pointer);
        opts = opts || {};
        opts.requirements = {};
        pointerArr.forEach(function(key, i) {
            var depth = i;
            if (REGEX_PATH_SEGMENT_ENDS_IN_ARRAY_WILDCARD.test(key)) {
                opts.requirements[depth] = "items";
            }
            if (REGEX_PATH_SEGMENT_ENDS_IN_OBJECT_WILDCARD.test(key)) {
                opts.requirements[depth] = "additionalProperties";
            }
        });
        this.getByPointer(pointer, opts);
    };
    SchemaResolver.prototype.getParentSchemaByFormPointer = function(pointer, opts) {
        var pointerArr = jsonpointer.parsePointer(pointer);
        pointerArr.pop();
        var newPointer = jsonpointer.compile(pointerArr);
        return this.getSchemaByFormPointer(newPointer);
    };
    return SchemaResolver;
});