(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("tb.xerrors"), require("lodash-4"), require("tbjson.ajv2tb"));
    } else if (typeof define === "function" && define.amd) {
        define([ "tb.xerrors", "lodash-4", "tbjson.ajv2tb" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.jf = global.TB.jf || {};
        global.TB.jf.utils = factory(global.TB, global._, global.TB.tbjson.ajv2tb);
    }
})(this, function(TB, _, tbjsonAjv2tb) {
    "use strict";
    var reArray = /\[([0-9]*)\](?=\[|\/|$)/g;
    var CONSTANT_CRUSH = "#";
    var replaceUnescapedKey = function(collection, oldKey) {
        if (String(oldKey).match(/\.|\~|\/|#/)) {
            var key = escapeKey(String(oldKey));
            collection[key] = collection[oldKey];
            delete collection[oldKey];
        }
    };
    var escapeSchemaKeys = function(schema) {
        _.each(schema, function(value, key, collection) {
            if (typeof value === "object") {
                replaceUnescapedKey(schema, key);
                escapeSchemaKeys(value);
            }
            if (key === "required" && _.isArray(value)) {
                _.each(value, function(requiredSchemaKey) {
                    var unescapedKeyIndex = collection.required.indexOf(requiredSchemaKey);
                    var escapedKey = escapeKey(String(requiredSchemaKey));
                    collection.required.splice(unescapedKeyIndex, 1, escapedKey);
                });
            }
        });
    };
    var escapeId = function(path) {
        return btoa(encodeURIComponent(path)).replace(/_/g, "_0").replace(/=/g, "_1").replace(/\+/g, "_2").replace(/\//g, "_3");
    };
    var unescapeId = function(path) {
        path = path.replace(/_0/g, "_").replace(/_1/g, "=").replace(/_2/g, "+").replace(/_3/g, "/");
        return decodeURIComponent(atob(path));
    };
    var escapeKey = function(key) {
        return key.replace(/\~/g, "~0").replace(/\//g, "~1").replace(/\{/g, "~3").replace(/\}/g, "~4").replace(/\[/g, "~6").replace(/\]/g, "~7");
    };
    var unescapeKey = function(key) {
        return key.replace(/~0/g, "~").replace(/~1/g, "/").replace(/~3/g, "{").replace(/~4/g, "}").replace(/~6/g, "[").replace(/~7/g, "]");
    };
    var escapeContentKeys = function(content) {
        for (var k in content) {
            if (!content.hasOwnProperty(k)) {
                continue;
            }
            var oldVal = content[k];
            var escapedKey = unescapeKey(k);
            delete content[k];
            content[escapedKey] = oldVal;
            if (_.isPlainObject(oldVal)) {
                escapeContentKeys(oldVal);
            }
        }
    };
    var getSchemaDefaultByJsonPointer = function(rootSchema, key) {
        var schema = tbjsonAjv2tb.getSchemaByJsonPointer(rootSchema, key);
        return schema && schema.default;
    };
    var getObjByKey = function(obj, key) {
        return tbjsonAjv2tb.getObjByKey(obj, key);
    };
    var resolveSchema = function(rootSchema, parentSchema) {
        return tbjsonAjv2tb.resolveSchema(rootSchema, parentSchema);
    };
    var resolveRefs = function(rootSchema, parentSchema, resolveInnerRefs, refPaths) {
        return tbjsonAjv2tb.resolveRefs(rootSchema, parentSchema, resolveInnerRefs, refPaths);
    };
    var setObjValueByKey = function(obj, key, value) {
        var innerobj = obj;
        var keyparts = key.split("/");
        var subkey = null;
        var arrayMatch = null;
        var prop = null;
        for (var i = 0; i < keyparts.length - 1; i++) {
            subkey = keyparts[i];
            prop = subkey.replace(reArray, "");
            reArray.lastIndex = 0;
            arrayMatch = reArray.exec(subkey);
            if (arrayMatch) {
                while (true) {
                    if (!_.isArray(innerobj[prop])) {
                        innerobj[prop] = [];
                    }
                    innerobj = innerobj[prop];
                    prop = parseInt(arrayMatch[1], 10);
                    arrayMatch = reArray.exec(subkey);
                    if (!arrayMatch) {
                        break;
                    }
                }
                if (typeof innerobj[prop] !== "object" || innerobj[prop] === null) {
                    innerobj[prop] = {};
                }
                innerobj = innerobj[prop];
            } else {
                if (typeof innerobj[prop] !== "object" || innerobj[prop] === null) {
                    innerobj[prop] = {};
                }
                innerobj = innerobj[prop];
            }
        }
        subkey = keyparts[keyparts.length - 1];
        prop = subkey.replace(reArray, "");
        reArray.lastIndex = 0;
        arrayMatch = reArray.exec(subkey);
        if (arrayMatch) {
            while (true) {
                if (!_.isArray(innerobj[prop])) {
                    innerobj[prop] = [];
                }
                innerobj = innerobj[prop];
                prop = parseInt(arrayMatch[1], 10);
                arrayMatch = reArray.exec(subkey);
                if (!arrayMatch) {
                    break;
                }
            }
            innerobj[prop] = value;
        } else {
            innerobj[prop] = value;
        }
    };
    var contains = function(target, properties) {
        if (Array.isArray(target)) {
            if (Array.isArray(properties)) {
                for (var i = 0, j = properties.length; i < j; i++) {
                    if (target.indexOf(properties[i]) < 0) {
                        return false;
                    }
                }
            } else {
                if (target.indexOf(properties) < 0) {
                    return false;
                }
            }
            return true;
        } else if (typeof target === "string") {
            if (Array.isArray(properties)) {
                return properties.indexOf(target) > -1;
            }
            return target === properties;
        }
        return false;
    };
    var forceValueTypes = function(rootSchema, schema, nodeValue, key) {
        key = key || "";
        ASSERT_PEER(schema.hasOwnProperty("type"), {
            msg: "The schema has no type $SCHEMA$",
            msgParams: {
                SCHEMA: schema
            },
            code: 2010
        });
        var value = nodeValue;
        if (TB.typeof(value) === "string") {
            value = _.trim(value);
            if (value === "") {
                value = null;
            }
        }
        if ((contains(schema.type, "number") || contains(schema.type, "integer")) && Number(value) === Number(value) && value !== null) {
            value = Number(value);
        }
        if (contains(schema.type, "object") && _.isString(value)) {
            if (value === "null" || value === "") {
                value = null;
            }
            if (value.substring(0, 1) === "{") {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    ASSERT_USER.isPlainObject(value, {
                        msg: "The schema element set to object but its value is not a valid object",
                        code: 2020
                    });
                }
            }
        }
        if (contains(schema.type, "array") && _.isString(value)) {
            if (value.substring(0, 1) === "[") {
                try {
                    value = JSON.parse(value);
                } catch (e) {
                    ASSERT_USER.isArray(value, {
                        msg: "The schema element set to object but its value is not a valid object",
                        code: 2030
                    });
                }
            } else {
                value = null;
            }
        }
        if (contains(schema.type, "array")) {
            _.each(_.keys(value), function(_key, idx) {
                value[_key] = forceValueTypes(rootSchema, schema.items, value[_key], key + "[" + _key + "]");
            });
        }
        if (contains(schema.type, "array") && contains(schema.type, "null")) {
            if (value === null || value === undefined || value.length === 0) {
                value = null;
            }
        }
        if (contains(schema.type, "object")) {
            ASSERT_PEER.isPlainObject(value, {
                msg: "Invalid value type",
                code: 2040
            });
            _.each(_.keys(value), function(_key) {
                if (schema.properties && schema.properties.hasOwnProperty(_key)) {
                    var fullKey = key + "/" + _key;
                    var subSchema = tbjsonAjv2tb.getSchemaByJsonPointer(rootSchema, fullKey);
                    value[_key] = forceValueTypes(rootSchema, subSchema, value[_key], fullKey);
                }
                if (schema.additionalProperties) {
                    var fullKey = key + "{" + _key + "}";
                    value[_key] = forceValueTypes(rootSchema, schema.additionalProperties, value[_key], fullKey);
                }
            });
        }
        if (contains(schema.type, "boolean")) {
            value = value === "true" ? true : value === "false" ? false : value === null || value === "" ? null : Boolean(value);
        }
        return value;
    };
    function getJsonType(val, allowInt) {
        if (val === null) {
            return "null";
        } else if (_.isString(val)) {
            return "string";
        } else if (_.isArray(val)) {
            return "array";
        } else if (_.isBoolean(val)) {
            return "boolean";
        } else if (allowInt && _.isInteger(val)) {
            return "integer";
        } else if (_.isNumber(val) && _.isFinite(val)) {
            return "number";
        } else if (_.isPlainObject) {
            return "object";
        } else {
            return undefined;
        }
    }
    function hasValidJsonType(validTypes, val) {
        validTypes = _.isString(validTypes) ? [ validTypes ] : validTypes;
        var valType = getJsonType(val, _.includes(validTypes, "integer"));
        return _.includes(validTypes, valType);
    }
    function getValidator(settings) {
        var validator = tbjsonAjv2tb.Ajv2tb.getAjv2tbInstance();
        return validator;
    }
    function mergeValues(contentValues, formValues) {
        function customArrayMerge(currentDestinationValue, currentSourceValue, key, fullDestination, fullSource) {
            if (_.isArray(currentDestinationValue) || _.isArray(currentSourceValue)) {
                if (_.isUndefined(currentSourceValue)) {
                    currentSourceValue = [];
                }
                return currentSourceValue;
            }
        }
        return _.mergeWith({}, contentValues, formValues, customArrayMerge);
    }
    function prependFormKeysWithString(form, string, includedForms) {
        if (form["keyContext"]) {
            form.items = includedForms[form["includeForm"]].fields;
        }
        _.each(form, function(value, key, collection) {
            if (_.isPlainObject(value)) {
                if (collection["keyContext"]) {
                    prependFormKeysWithString(value, string + collection["keyContext"] + "/", includedForms);
                } else {
                    prependFormKeysWithString(value, string, includedForms);
                }
            }
            if (_.isArray(value)) {
                if (collection["keyContext"]) {
                    prependFormKeysWithString(value, string + collection["keyContext"] + "/", includedForms);
                } else {
                    prependFormKeysWithString(value, string, includedForms);
                }
            }
            if (key === "key") {
                collection.key = string + value;
            }
        });
    }
    return {
        reArray: reArray,
        replaceUnescapedKey: replaceUnescapedKey,
        escapeSchemaKeys: escapeSchemaKeys,
        escapeId: escapeId,
        unescapeId: unescapeId,
        escapeKey: escapeKey,
        unescapeKey: unescapeKey,
        getObjByKey: getObjByKey,
        resolveSchema: resolveSchema,
        setObjValueByKey: setObjValueByKey,
        contains: contains,
        getJsonType: getJsonType,
        hasValidJsonType: hasValidJsonType,
        forceValueTypes: forceValueTypes,
        mergeValues: mergeValues,
        getValidator: getValidator,
        getSchemaDefaultByJsonPointer: getSchemaDefaultByJsonPointer,
        resolveRefs: resolveRefs,
        escapeContentKeys: escapeContentKeys,
        prependFormKeysWithString: prependFormKeysWithString
    };
});