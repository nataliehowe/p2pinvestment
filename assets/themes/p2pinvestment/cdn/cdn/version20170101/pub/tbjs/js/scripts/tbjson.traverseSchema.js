(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.TB = root.TB || {};
        root.TB.tbjson = root.TB.tbjson || {};
        root.TB.tbjson.traverseSchema = factory();
    }
})(this, function jsonschemaTraverse() {
    "use strict";
    var traverse = function(schema, opts, cb) {
        if (typeof opts == "function") {
            cb = opts;
            opts = {
                dataPointer: ""
            };
        }
        _traverse(opts, cb, schema, "", schema, undefined, undefined, undefined, undefined, "");
    };
    traverse.keywords = {
        additionalItems: true,
        items: true,
        contains: true,
        additionalProperties: true,
        propertyNames: true,
        not: true
    };
    traverse.arrayKeywords = {
        items: true,
        allOf: true,
        anyOf: true,
        oneOf: true
    };
    traverse.propsKeywords = {
        definitions: true,
        properties: true,
        patternProperties: true,
        dependencies: true
    };
    traverse.skipKeywords = {
        enum: true,
        const: true,
        required: true,
        maximum: true,
        minimum: true,
        exclusiveMaximum: true,
        exclusiveMinimum: true,
        multipleOf: true,
        maxLength: true,
        minLength: true,
        pattern: true,
        format: true,
        maxItems: true,
        minItems: true,
        uniqueItems: true,
        maxProperties: true,
        minProperties: true
    };
    function _traverse(opts, cb, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex, dataPointer, tbjsonPointer) {
        tbjsonPointer = tbjsonPointer || "";
        if (schema && typeof schema == "object" && !Array.isArray(schema)) {
            cb(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex, dataPointer, tbjsonPointer);
            for (var key in schema) {
                var sch = schema[key];
                if (Array.isArray(sch)) {
                    if (key in traverse.arrayKeywords) {
                        for (var i = 0; i < sch.length; i++) {
                            var newJsonPtr = jsonPtr + "/" + key + "/" + i;
                            var newDataPtr = dataPointer + "/" + i;
                            _traverse(opts, cb, sch[i], newJsonPtr, rootSchema, jsonPtr, key, schema, i, newDataPtr, tbjsonPointer);
                        }
                    }
                } else if (key in traverse.propsKeywords) {
                    if (sch && typeof sch == "object") {
                        for (var prop in sch) {
                            var escapedProp = escapeJsonPtr(prop);
                            var newJsonPtr = jsonPtr + "/" + key + "/" + escapedProp;
                            var newDataPtr = dataPointer + "/" + escapedProp;
                            var newTbjsonPointer = tbjsonPointer + "/" + escapedProp;
                            _traverse(opts, cb, sch[prop], newJsonPtr, rootSchema, jsonPtr, key, schema, prop, newDataPtr, newTbjsonPointer);
                        }
                    }
                } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
                    var newJsonPtr = jsonPtr + "/" + escapeJsonPtr(key);
                    var newDataPtr = dataPointer + "/" + escapeJsonPtr(key);
                    var token = "";
                    if (key === "items") {
                        token = "[]";
                    } else if (key === "additionalProperties") {
                        token = "{}";
                    }
                    var newTbjsonPointer = tbjsonPointer + token;
                    _traverse(opts, cb, sch, newJsonPtr, rootSchema, jsonPtr, key, schema, key, newDataPtr, newTbjsonPointer);
                }
            }
        }
    }
    function escapeJsonPtr(str) {
        return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    return traverse;
});