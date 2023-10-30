(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("lodash-4"), require("tb.xerrors"), require("jf.utils"), require("tb.template"), require("tb.file"), require("tbjson.ajv2tb"), require("moment-2"), require("jquery-2"), require("tinymce-4"), require("ace-1"), require("jquery.orderedselect"), require("jquery.ui-1"), require("bootstrap-typeahead-2"), require("spectrum-1"), require("selectize-0"), require("select2-4"));
    } else if (typeof define === "function" && define.amd) {
        define([ "lodash-4", "tb.xerrors", "jf.utils", "tb.template", "tb.file", "tbjson.ajv2tb", "moment-2", "jquery-2", "tinymce-4", "ace-1", "tbjson.traverseSchema", "jquery.orderedselect", "jquery.ui-1", "bootstrap-typeahead-2", "spectrum-1", "selectize-0", "select2-4" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.jf = global.TB.jf || {};
        global.TB.jf.ui = factory(global._, global.TB, global.TB.jf.utils, global.TB.Template, global.TB.File, global.TB.tbjson.ajv2tb, global.moment, global.jQuery, global.tinyMCE, global.ace, global.TB.tbjson.traverseSchema);
    }
})(this, function(_, TB, jfUtils, tbTemplate, tbFile, tbjsonAjv2Tb, moment, $, tinyMCE, ace, tbjsonTraverseSchema) {
    "use strict";
    TB.CONFIG.XERRORS_LOG_CONSOLE = true;
    var jsonform = {
        util: {}
    };
    var editors = {};
    var REGEX = {
        PATH_ADDITIONAL_PROPERTIES: /\{\}/g,
        PATH_ARRAY: /\[[0-9]*\]\/?/g,
        PATH_FILTERSCHEMA: /\/(?!filterSchema)/g,
        GET_ARRAY_INDEX_FROM_INPUT_FIELD: /\[([0-9]*)\](?=\[|\/|$)/g,
        ESCAPE_SELECTOR: /([ !"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~])/g,
        EVALUATE_VIEW: /\{\[([\s\S]+?)\]\}/g,
        INTERPOLATE_VIEW: /\{\{([\s\S]+?)\}\}/g,
        REPLACE_ESCAPED_KEY: /\.|~|\/|#/,
        REPLACE_UNESCAPED_KEY: /\.|~|\/|#/,
        MAGIC_REGEX: /^((([^\\[\/]|\\.)+)|\[(\d+)\])\/?(.*)$/,
        MAGIC_REGEX_2: /\{\{values\/([^}]+)\}\}/g,
        MAGIC_REGEX_3: /^((([^\\[\/]|\\.)+)|\[(\d+)\])\/?(.*)$/,
        REMOVE_NUMBERS_FROM_ARRAY_INDEX_IN_INPUT_FIELD: /\[[0-9]+\]/g,
        GET_CLOSEST_ARRAY_PARENT: /\[\][^[\]]*$/,
        EVALUATE_TEMPLATE: /<%([\s\S]+?)%>/g,
        INTERPOLATE_TEMPLATE: /<%=([\s\S]+?)%>/g,
        REPLACE_ALL_DASHES_WITH_DOTS: /\//g,
        CATCH_CONTAINER_OR_FIELD: /tb-jf.{0,1}-\d-(container|field)-id-.*/g
    };
    var pA = function() {
        var lineNumber = new Error().stack.split("\n")[2];
        var argArray = Array.from(arguments);
        var beginLog = argArray.pop();
        for (var i = 0; i < argArray.length; i++) {
            console.info(beginLog + i, _.cloneDeep(argArray[i]), lineNumber);
        }
    };
    var removeFromContent = function(content, key) {
        var keyParsed = key.split("/");
        _.unset(content, keyParsed);
    };
    var removeCustomSchemaFromSchemaDefinitions = function(schema) {
        if (schema && schema.definitions) {
            delete schema.definitions[tbjsonAjv2Tb.metaSchema.id];
            delete schema.definitions[jfUtils.escapeKey(tbjsonAjv2Tb.metaSchema.id)];
        }
    };
    var removeFromContentWithSchemaKey = function(schemaKey, content) {};
    var mergeContentAndFormValues = function(content, formValue, schema) {
        return jfUtils.mergeValues(content, formValue);
    };
    var replaceCurlyBracesWithData = function(template, replaceWith) {
        return template.replace(REGEX.PATH_ADDITIONAL_PROPERTIES, "/" + replaceWith);
    };
    var setDataToField = function(field, replaceWithKey) {
        field.formElement.additionalPropertiesKey = field.formElement.key;
        field.formElement.key = replaceCurlyBracesWithData(field.formElement.key, replaceWithKey);
        if (field.formElement.id) {
            field.formElement.id = replaceCurlyBracesWithData(field.formElement.id, replaceWithKey);
        }
        field.formElement.name = field.formElement.key;
        if (field.formElement.type === "helptext") {
            var currView = _.clone(field.view);
            currView.template = tbTemplate.render(field.formElement.content, {
                objKey: replaceWithKey
            });
            field.view = currView;
        }
    };
    var getDefaultTimeValue = function(node) {
        var value;
        if (!_.isUndefined(node.value)) {
            value = node.value;
        } else if (!_.isUndefined(node.schemaElement.default)) {
            value = node.schemaElement.default;
        } else if (node.formElement.useNowAsDefault) {
            value = moment(new Date()).format(node.formElement.pluginoptions.format);
        }
        return value;
    };
    var fieldTemplateSettings = {
        evaluate: REGEX.EVALUATE_TEMPLATE,
        interpolate: REGEX.INTERPOLATE_TEMPLATE
    };
    var PG_INTERVAL_NAMES = [ "microseconds", "milliseconds", "second", "minute", "hour", "day", "week", "month", "quarter", "year", "decade", "century", "millennium" ];
    var valueTemplateSettings = {
        evaluate: REGEX.EVALUATE_VIEW,
        interpolate: REGEX.INTERPOLATE_VIEW
    };
    var _template = typeof _.template("", {}) === "string" ? _.template : function(tmpl, data, opts) {
        if (data && data.node && data.node.view.template && data.node.isTbTemplate === true) {
            return _.template(tmpl, opts)(data);
        } else {
            return _.template(tmpl, opts)(data);
        }
    };
    var reArray = REGEX.GET_ARRAY_INDEX_FROM_INPUT_FIELD;
    var constructObjectByKey = function(key, val) {
        ASSERT.isString(key, {
            msg: "constructObjectByKey: given invalid value for key %KEY%.",
            msgParams: {
                KEY: key
            },
            code: 2010
        });
        return _.set({}, key.split("/"), val);
    };
    var getSortedPropertyKeys = function(object) {
        ASSERT.isPlainObject(object, {
            msg: "Only the properties of objects can be sorted, but given $object$",
            code: 2030,
            msgParams: {
                object: object
            }
        });
        return _(object).keys().sortBy([ function(prop) {
            return object[prop].ordering;
        }, function(prop) {
            return prop;
        } ]).value();
    };
    var escapeSelector = function(selector) {
        return selector.replace(REGEX.ESCAPE_SELECTOR, "\\$1");
    };
    var replaceEscapedKey = function(collection, oldKey) {
        if (String(oldKey).match(REGEX.REPLACE_ESCAPED_KEY)) {
            var key = jfUtils.unescapeKey(String(oldKey));
            collection[key] = collection[oldKey];
            delete collection[oldKey];
        }
    };
    var escapeValueKeys = function(content, obj) {
        if (!obj) {
            obj = {};
        }
        _.each(content, function(value, key) {
            key = String(key);
            if (_.isPlainObject(value)) {
                obj[jfUtils.escapeKey(key)] = {};
                escapeValueKeys(value, obj[jfUtils.escapeKey(key)]);
            } else if (_.isArray(value)) {
                obj[jfUtils.escapeKey(key)] = [];
                escapeValueKeys(value, obj[jfUtils.escapeKey(key)]);
            } else {
                obj[jfUtils.escapeKey(key)] = value;
            }
        });
        return obj;
    };
    var unescapeValueKeys = function(content) {
        _.each(content, function(value, key) {
            replaceEscapedKey(content, key);
            if (typeof value === "object") {
                unescapeValueKeys(value);
            }
        });
    };
    var getInnermostJsonPathKey = function(key) {
        var childKeysArray = convertJsonPathStringToArray(key);
        var innermostChild = "";
        for (var i = childKeysArray.length - 1; i >= 0; i--) {
            innermostChild = childKeysArray[i];
            if (innermostChild !== "") {
                break;
            }
        }
        if (innermostChild.slice(-2) === "[]") {
            innermostChild = innermostChild.slice(0, -2);
        }
        return innermostChild;
    };
    var convertJsonPathStringToArray = function(path) {
        return path.split("/");
    };
    var getArrayFieldValueHtml = function(domElement, tree) {
        var formArray = $("input", domElement).serializeArray();
        _.each(_.keys(jsonform.elementTypes), function(elementType) {
            if (jsonform.elementTypes[elementType].getFieldValue) {
                formArray = formArray.concat($('[data-tb-jf-type="' + elementType + '"]', domElement).map(function() {
                    return jsonform.elementTypes[elementType].getFieldValue(this, tree);
                }).get());
            }
        });
        return formArray;
    };
    var getParentSchemaByKey = function(formDesc, key) {
        key = tbjsonAjv2Tb.jsonformPointerToJsonPointer(key).split("/");
        key.pop();
        key = key.join("/");
        return tbjsonAjv2Tb.getSchemaByJsonPointer(formDesc.schema, key);
    };
    var truncateToArrayDepth = function(key, arrayDepth) {
        var depth = 0;
        var pos = 0;
        if (!key) {
            return null;
        }
        if (arrayDepth > 0) {
            while (depth < arrayDepth) {
                pos = key.indexOf("[]", pos);
                if (pos === -1) {
                    return key;
                }
                pos = pos + 2;
                depth += 1;
            }
        }
        pos = key.indexOf("[]", pos);
        return pos === -1 ? key : key.substring(0, pos);
    };
    var applyArrayPath = function(key, arrayPath) {
        var depth = 0;
        if (!key) {
            return null;
        }
        if (!arrayPath || arrayPath.length === 0) {
            return key;
        }
        var newKey = key.replace(reArray, function(str, p1) {
            var newIndex = str;
            if (!_.isNil(arrayPath[depth])) {
                newIndex = "[" + arrayPath[depth] + "]";
            }
            depth += 1;
            return newIndex;
        });
        return newKey;
    };
    var getInitialValue = function(formObject, key, arrayPath, tpldata, usePreviousValues) {
        var value = null;
        tpldata = tpldata || {};
        tpldata.idx = tpldata.idx || (arrayPath ? arrayPath[arrayPath.length - 1] : 1);
        tpldata.value = !_.isNil(tpldata.value) ? tpldata.value : "";
        tpldata.getValue = tpldata.getValue || function(key) {
            return getInitialValue(formObject, key, arrayPath, tpldata, usePreviousValues);
        };
        var getFormElement = function(elements, key) {
            var formElement = null;
            if (!elements || !elements.length) {
                return null;
            }
            _.each(elements, function(elt) {
                if (formElement) {
                    return;
                }
                if (elt === key) {
                    formElement = {
                        key: elt
                    };
                    return;
                }
                if (_.isString(elt)) {
                    return;
                }
                if (elt.key === key) {
                    formElement = elt;
                } else if (elt.items) {
                    formElement = getFormElement(elt.items, key);
                }
            });
            return formElement;
        };
        var formElement = getFormElement(formObject.form.fields || [], key);
        var schemaElement = tbjsonAjv2Tb.getSchemaByJsonPointer(formObject.schema, key);
        if (usePreviousValues && formObject.value) {
            value = jfUtils.getObjByKey(formObject.value, applyArrayPath(key, arrayPath));
        }
        if (_.isNil(value)) {
            if (formElement && typeof formElement["value"] !== "undefined") {
                value = formElement["value"];
            } else if (schemaElement) {
                if (!_.isNil(schemaElement["default"])) {
                    value = schemaElement["default"];
                }
            }
            if (value && value.indexOf("{{values/") !== -1) {
                value = value.replace(REGEX.MAGIC_REGEX_2, '{{getValue("$1")}}');
            }
            if (value) {
                value = _template(value, tpldata, valueTemplateSettings);
            }
        }
        if (!_.isNil(value) && formElement && _.has(formElement.titleMap, value)) {
            value = _template(formElement.titleMap[value], tpldata, valueTemplateSettings);
        }
        if (value && _.isString(value) && schemaElement && schemaElement.maxLength) {
            if (value.length > schemaElement.maxLength) {
                value = value.substr(0, schemaElement.maxLength - 1) + "…";
            }
        }
        if (_.isNil(value)) {
            return null;
        } else {
            return value;
        }
    };
    var getDefaultClasses = function(cssFramework) {
        switch (cssFramework) {
          case "bootstrap2":
            return {
                groupClass: "control-group",
                groupMarkClassPrefix: "",
                labelClass: "control-label tb-jf-label",
                controlClass: "controls",
                iconClassPrefix: "icon",
                buttonClass: "btn",
                textualInputClass: "",
                prependClass: "input-prepend",
                appendClass: "input-append",
                addonClass: "add-on",
                inlineClassSuffix: " inline"
            };

          case "bootstrap3":
            return {
                groupClass: "form-group",
                groupMarkClassPrefix: "has-",
                labelClass: "control-label tb-jf-label",
                controlClass: "controls",
                iconClassPrefix: "glyphicon glyphicon",
                buttonClass: "btn btn-default",
                textualInputClass: "form-control tb-jf-input-class",
                prependClass: "input-group",
                appendClass: "input-group",
                addonClass: "input-group-addon",
                buttonAddonClass: "input-group-btn",
                inlineClassSuffix: "-inline"
            };

          default:
            THROW({
                msg: "Unknown cssFramework: $CSS_FRAMEWORK$",
                msgParams: {
                    CSS_FRAMEWORK: cssFramework
                }
            });
        }
    };
    var initializeTabs = function(tabs) {
        var activate = function(element, container) {
            container.find("> .active").removeClass("active").removeClass("in");
            element.addClass("active");
            setTimeout(function() {
                element.addClass("in");
            }, 0);
        };
        var enableFields = function($target, targetIndex) {
            $target.find("input, textarea, select").removeAttr("disabled");
            $target.parent().children(":not([data-idx=" + targetIndex + "])").find("input, textarea, select").attr("disabled", "disabled");
        };
        var optionSelected = function(e) {
            var $option = $("option:selected", $(this));
            var $select = $(this);
            var targetIdx = $option.get(0).getAttribute("data-idx") || $option.attr("value");
            var $target;
            e.preventDefault();
            if ($option.hasClass("active")) {
                return;
            }
            $target = $(this).parents(".tabbable").eq(0).find("> .tab-content > [data-idx=" + targetIdx + "]");
            activate($option, $select);
            activate($target, $target.parent());
            enableFields($target, targetIdx);
        };
        var tabClicked = function(e) {
            var $content = $(this).parents(".tabbable").first().find(".tab-content").first();
            var targetIdx = $(this).index();
            var $target = $content.find("> .tab-pane[data-idx=" + targetIdx + "]");
            e.preventDefault();
            activate($(this), $(this).parent());
            activate($target, $target.parent());
            $(this).parent().parent().parent().parent().parent().attr("active-idx", targetIdx);
            if ($(this).parent().hasClass("tb-jf-alternative")) {
                enableFields($target, targetIdx);
            }
        };
        tabs.each(function() {
            $(this).delegate("select.nav", "change", optionSelected);
            $(this).find("select.nav").each(function() {
                $(this).val($(this).find(".active").attr("value"));
                var targetIdx = $(this).find("option:selected").get(0).getAttribute("data-idx") || $(this).find("option:selected").attr("value");
                var $target = $(this).parents(".tabbable").eq(0).find("> .tab-content > [data-idx=" + targetIdx + "]");
                enableFields($target, targetIdx);
            });
            $(this).on("click", "ul.nav li", tabClicked);
            $(this).find("ul.nav li.active").click();
        });
    };
    var createOverlay = function(el) {
        return $("<div>").addClass("tb-jf-overlay").height(el.height() + 10).width(el.width() + 20).offset({
            left: el.offset().left - 10,
            top: el.offset().top - 10
        });
    };
    var displayLoadingAnimation = function(el, message) {
        var loadingMessage = $("<span>").addClass("tb-jf-loading-message").text(message || "Loading ...");
        var loadingDots = $("<ul><li><li><li></ul>").addClass("tb-jf-loading-dots");
        $(el).prepend($("<div>").addClass("tb-jf-loading text-center").prepend(loadingDots).prepend(loadingMessage));
        var overlay = createOverlay(el);
        $(el.height).on("change", function() {
            overlay.height = el.height + 20;
        });
        $(el.width).on("change", function() {
            overlay.width = el.width + 20;
        });
        $(el).append(overlay);
    };
    var removeLoadingAnimation = function(el) {
        $(el).find("> .tb-jf-loading").remove();
        $(el).find("> .tb-jf-overlay").remove();
    };
    jsonform.util.getObjByKeyEx = function(obj, key, objKey) {
        ASSERT.isStringOrNil(key, {
            msg: "getObjByKeyEx received unexpected input.",
            code: 2140
        });
        var innerobj = obj;
        if (key === null || key === undefined || key === "") {
            return obj;
        }
        if (typeof objKey === "string" && objKey.length > 0) {
            if (key.slice(0, objKey.length) !== objKey) {
                throw new Error("key [" + key + "] does not match the objKey [" + objKey + "]");
            }
            key = key.slice(objKey.length);
            if (key[0] === "/") {
                key = key.slice(1);
            }
        }
        var m = key.match(REGEX.MAGIC_REGEX_3);
        if (!m) {
            throw new Error("bad format key: " + key);
        }
        if (typeof m[2] === "string" && m[2].length > 0) {
            innerobj = innerobj[m[2]];
        } else if (typeof m[4] === "string" && m[4].length > 0) {
            innerobj = innerobj[Number(m[4])];
        } else {
            throw new Error("impossible reach here");
        }
        if (innerobj && m[5].length > 0) {
            innerobj = this.getObjByKeyEx(innerobj, m[5]);
        }
        if (innerobj && innerobj.$ref) {
            innerobj = jfUtils.resolveSchema(jsonform.schema, innerobj, key);
        }
        return innerobj;
    };
    jsonform.util.validateValueType = function(key, schemaElement, formElement, deprecatedValue, value, strictNumberTypes, formDesc) {
        var valueType = jfUtils.getJsonType(value, _.includes(schemaElement.type, "integer"));
        var jsonValueTypes = [ "null", "boolean", "string", "integer", "number", "object", "array" ];
        ASSERT(_.includes(jsonValueTypes, valueType), {
            code: 2183
        });
        ASSERT(valueType === "null" || jfUtils.hasValidJsonType(schemaElement.type, value), {
            code: 2150,
            msg: "The value of schema key $KEY$ with allowed schema types $SCHEMATYPE$ is of type $VALUETYPE$, deduced from $VALUE$.",
            msgParams: {
                KEY: key,
                SCHEMATYPE: schemaElement.type,
                VALUETYPE: valueType,
                VALUE: value
            }
        });
        if (valueType === "array") {
            ASSERT.isNotNil(schemaElement.items, {
                msg: "Invalid Schema: no items descriptor defined for this array.",
                code: 2180
            });
            ASSERT.isPlainObject(schemaElement.items, {
                msg: "Currently supports only ``object`` on items.",
                code: 2181
            });
            if (_.includes(schemaElement.items.type, "object")) {
                _.each(value, function(childValue, index) {
                    ASSERT(_.hasValidJsonType(schemaElement.items.type, childValue), {
                        msg: "Invalid value: The value of schema.items for key $KEY$ with allowed schema types $SCHEMATYPE$ is of type $VALUETYPE$.",
                        msgParams: {
                            KEY: key,
                            SCHEMATYPE: schemaElement.items.type,
                            VALUETYPE: valueType
                        },
                        code: 2190
                    });
                    if (jsonform.elementTypes[formElement.type].requiresEnum) {
                        ASSERT(schemaElement.items.enum, {
                            msg: "Enums are required, but there were none found!",
                            code: 2200
                        });
                    }
                });
            }
        }
        return value;
    };
    jsonform.fieldTemplate = function(inner) {
        return "" + '<div  <% if (node.formElement.type === "hidden") { %>style="display: none;"<% } %> class="<%= cls.groupClass %> tb-jf-node col-sm-<%= node.rowWidth %>' + '<%= (node.key) ? " tb-jf-error-" + node.selectorKey : "" %>' + '<%= elt.htmlClass ? " " + elt.htmlClass : "" %>' + '<%= (node.formElement && node.formElement.required && (node.formElement.type !== "checkbox") ? " tb-jf-required" : "") %>' + '<%= (node.isReadOnly() ? " tb-jf-readonly" : "") %>' + '<%= (node.disabled ? " tb-jf-disabled" : "") %>"' + ' data-tb-jf-type="<%= node.formElement.type %>"' + ' name="<%= node.key %>">' + "<% if (node.title && !elt.notitle) { %>" + '<label class="<%= cls.labelClass %> tb-jf-clear-margins" for="<%= node.id %>"><span class="tb-jf-enumerate-form"><%= enumerationText %>: </span><%= node.title %> </label>' + "<% } %>" + '<div class="<%= cls.controlClass %>">' + "<% if (node.description) { %>" + '<span class="help-block tb-jf-description tb-jf-clear-margins"><%= node.description %></span>' + "<% } %>" + "<% if (node.formElement && !node.formElement.readOnly &&  (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset)) { %>" + '<div class="tb-jf-value-history-buttons">' + "<% if (node.formElement.enableReset) { %>" + '<button type="button" class="btn btn-xs btn-default tb-jf-description tb-jf-value-history-reset">' + "<span>" + "↻ reset" + "</span>" + "</button> " + "<% } %>" + "<% if (node.formElement.enableUndo) { %>" + '<button type="button" class="btn btn-xs btn-default tb-jf-description tb-jf-value-history-undo">' + "<span>" + "↰ undo" + "</span>" + "</button> " + "<% } %>" + "<% if (node.formElement.enableRedo) { %>" + '<button type="button" class="btn btn-xs btn-default tb-jf-description tb-jf-value-history-redo">' + "<span>" + "↱ redo" + "</span>" + "</button> " + "<% } %>" + "</div>" + "<% } %>" + "<% if (node.prepend || node.append) { %>" + '<div class="<%= node.prepend ? cls.prependClass : "" %> ' + '<%= node.append ? cls.appendClass : "" %>">' + '<% if (node.prepend && node.prepend.indexOf("<button ") >= 0) { %>' + "<% if (cls.buttonAddonClass) { %>" + '<span class="<%= cls.buttonAddonClass %>"><%= node.prepend %></span>' + "<% } else { %>" + "<%= node.prepend %>" + "<% } %>" + "<% } %>" + '<% if (node.prepend && node.prepend.indexOf("<button ") < 0) { %>' + '<span class="<%= cls.addonClass %>"><%= node.prepend %></span>' + "<% } %>" + "<% } %>" + inner + '<% if (node.append && node.append.indexOf("<button ") >= 0) { %>' + "<% if (cls.buttonAddonClass) { %>" + '<span class="<%= cls.buttonAddonClass %>"><%= node.append %></span>' + "<% } else { %>" + "<%= node.append %>" + "<% } %>" + "<% } %>" + '<% if (node.append && node.append.indexOf("<button ") < 0) { %>' + '<span class="<%= cls.addonClass %>"><%= node.append %></span>' + "<% } %>" + "<% if (node.prepend || node.append) { %>" + "</div>" + "<% } %>" + '<span class="help-block tb-jf-errortext tb-jf-hide"></span>' + "</div></div>";
    };
    jsonform.tableCellTemplate = function(inner) {
        return '<td class="<%= cls.groupClass %> tb-jf-tablecell tb-jf-node ' + '<%= (node.key) ? " tb-jf-error-" + node.selectorKey : "" %>' + '<%= elt.htmlClass ? " " + elt.htmlClass : "" %>' + '<%= (node.formElement && node.formElement.required && (node.formElement.type !== "checkbox") ? " tb-jf-required" : "") %>' + '<%= (node.isReadOnly() ? " tb-jf-readonly" : "") %>' + '<%= (node.disabled ? " tb-jf-disabled" : "") %>' + '" data-tb-jf-type="<%= node.formElement.type %>">' + '<div class="<%= cls.controlClass %>">' + "<% if (node.description) { %>" + '<span class="help-block tb-jf-description tb-jf-clear-margins"><%= node.description %></span>' + "<% } %>" + "<% if (node.formElement && (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset)) { %>" + '<div class="tb-jf-value-history-buttons">' + "<% if (node.formElement.enableReset) { %>" + '<button type="button" class="btn btn-xs btn-default tb-jf-description tb-jf-value-history-reset">' + "<span>" + "↻ reset" + "</span>" + "</button> " + "<% } %>" + "<% if (node.formElement.enableUndo) { %>" + '<button type="button" class="btn btn-xs btn-default tb-jf-description tb-jf-value-history-undo">' + "<span>" + "↰ undo" + "</span>" + "</button> " + "<% } %>" + "<% if (node.formElement.enableRedo) { %>" + '<button type="button" class="btn btn-xs btn-default tb-jf-description tb-jf-value-history-redo">' + "<span>" + "↱ redo" + "</span>" + "</button> " + "<% } %>" + "</div>" + "<% } %>" + "<% if (node.prepend || node.append) { %>" + '<div class="<%= node.prepend ? cls.prependClass : "" %> ' + '<%= node.append ? cls.appendClass : "" %>">' + '<% if (node.prepend && node.prepend.indexOf("<button ") >= 0) { %>' + "<% if (cls.buttonAddonClass) { %>" + '<span class="<%= cls.buttonAddonClass %>"><%= node.prepend %></span>' + "<% } else { %>" + "<%= node.prepend %>" + "<% } %>" + "<% } %>" + '<% if (node.prepend && node.prepend.indexOf("<button ") < 0) { %>' + '<span class="<%= cls.addonClass %>"><%= node.prepend %></span>' + "<% } %>" + "<% } %>" + inner + '<% if (node.append && node.append.indexOf("<button ") >= 0) { %>' + "<% if (cls.buttonAddonClass) { %>" + '<span class="<%= cls.buttonAddonClass %>"><%= node.append %></span>' + "<% } else { %>" + "<%= node.append %>" + "<% } %>" + "<% } %>" + '<% if (node.append && node.append.indexOf("<button ") < 0) { %>' + '<span class="<%= cls.addonClass %>"><%= node.append %></span>' + "<% } %>" + "<% if (node.prepend || node.append) { %>" + "</div>" + "<% } %>" + '<span class="help-block tb-jf-errortext tb-jf-hide"></span>' + "</div></td>";
    };
    var inputFieldTemplate = function(type, isTextualInput, extraOpts) {
        var templ = {
            template: "<input " + 'class="<%= cls.textualInputClass %> <%= fieldHtmlClass %>" ' + 'name="<%= node.name %>" value="<%= _.escape(value) %>" id="<%= id %>"' + '<%= (node.disabled? " disabled" : "")%>' + "<%= node.readOnly %>" + "<%= node.placeholder %>" + " />",
            compatibleTypes: [ "string", "number", "integer" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                node.readOnly = node.isReadOnly() ? ' readonly="readonly"' : "";
                node.placeholder = node.placeholder ? ' placeholder="' + node.placeholder + '"' : " ";
                node.characterCounter = true;
            },
            onInsert: function(evt, node) {
                if (node.formElement.align !== undefined) {
                    ASSERT([ "left", "right", "center" ].indexOf(node.formElement.align) >= 0, {
                        msg: "input field: the align property must be either left, right or center.",
                        code: 2290
                    });
                    $(node.el).find("input").css("text-align", node.formElement.align);
                }
                var $input;
                if (node.formElement && node.formElement.autocomplete) {
                    $input = $(node.el).find("input");
                    if ($input.autocomplete) {
                        $input.autocomplete(node.formElement.autocomplete);
                    }
                }
                if (node.formElement && (node.formElement.tagsinput || node.formElement.getValue === "tagsvalue")) {
                    if (!$.fn.tagsinput) {
                        throw new Error("tagsinput is not found");
                    }
                    $input = $(node.el).find("input");
                    var isArray = _.isArray(node.value);
                    if (isArray) {
                        $input.attr("value", "").val("");
                    }
                    $input.tagsinput(node.formElement ? node.formElement.tagsinput || {} : {});
                    if (isArray) {
                        node.value.forEach(function(value) {
                            $input.tagsinput("add", value);
                        });
                    }
                }
                if (node.formElement && node.formElement.typeahead) {
                    $input = $(node.el).find("input");
                    if ($input.typeahead) {
                        if (_.isArray(node.formElement.typeahead)) {
                            for (var i = 1; i < node.formElement.typeahead.length; ++i) {
                                var dataset = node.formElement.typeahead[i];
                                if (dataset.source && _.isArray(dataset.source)) {
                                    var source = dataset.source;
                                    dataset.source = function(query, cb) {
                                        var lq = query.toLowerCase();
                                        cb(source.filter(function(v) {
                                            return v.toLowerCase().indexOf(lq) >= 0;
                                        }).map(function(v) {
                                            return typeof v === "string" ? {
                                                value: v
                                            } : v;
                                        }));
                                    };
                                }
                            }
                            $.fn.typeahead.apply($input, node.formElement.typeahead);
                        } else {
                            $input.typeahead(node.formElement.typeahead);
                        }
                    }
                }
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("readonly", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").removeProp("readonly");
            }
        };
        if (extraOpts) {
            templ = _.extend(templ, extraOpts);
        }
        return templ;
    };
    var numberFieldTemplate = function(type, isTextualInput) {
        return {
            template: "<input " + 'class="<%= cls.textualInputClass %> <%= fieldHtmlClass %>" ' + 'name="<%= node.name %>" value="<%= _.escape(value) %>" id="<%= id %>"' + '<%= (node.disabled? " disabled" : "")%>' + "<%= node.readOnly %>" + "<%= node.step %>" + "<%= node.placeholder %>" + " />",
            fieldtemplate: true,
            inputfield: true,
            minRowWidth: "quarter",
            maxRowWidth: "full",
            isTbTemplate: false,
            compatibleTypes: [ "number", "integer" ],
            compatibleFormats: [],
            onBeforeRender: function(data, node) {
                var rangeStep = _.get(node, "range.step");
                node.step = rangeStep ? ' step="' + rangeStep + '"' : " ";
                node.readOnly = node.isReadOnly() ? ' readonly="readonly"' : "";
                node.placeholder = node.placeholder ? ' placeholder="' + node.placeholder + '"' : " ";
                data.range = {
                    step: 1
                };
                if (type === "range") {
                    data.range.min = 1;
                    data.range.max = 100;
                }
                if (!node || !node.schemaElement) {
                    return;
                }
                if (node.formElement && node.formElement.step) {
                    data.range.step = node.formElement.step;
                } else if (node.schemaElement.type === "number") {
                    data.range.step = "any";
                }
                var step = data.range.step === "any" ? 1 : data.range.step;
                if (typeof node.schemaElement.minimum !== "undefined") {
                    if (node.schemaElement.exclusiveMinimum) {
                        data.range.min = node.schemaElement.minimum + step;
                    } else {
                        data.range.min = node.schemaElement.minimum;
                    }
                }
                if (typeof node.schemaElement.maximum !== "undefined") {
                    if (node.schemaElement.exclusiveMaximum) {
                        data.range.max = node.schemaElement.maximum - step;
                    } else {
                        data.range.max = node.schemaElement.maximum;
                    }
                }
            },
            onInsert: function(evt, node) {
                if (node.formElement.align !== undefined) {
                    ASSERT([ "left", "right", "center" ].indexOf(node.formElement.align) >= 0, {
                        msg: "input field: the align property must be either left, right or center.",
                        code: 2300
                    });
                    $(node.el).find("input").css("text-align", node.formElement.align);
                }
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("readonly", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").prop("readOnly", false);
            }
        };
    };
    var tableAsObject = {
        template: '<div class="tb-jf-table-container"><table ' + 'name="<%= node.name %><%= (node.schemaElement && node.schemaElement.type === "array" ? "[]" : "") %>" ' + 'data-attr-isarray="<%= node.view.array ? "123" : "object-table" %>"' + 'data-attr-name="<%= node.name %>"' + 'id="<%= id %>" ' + 'class="tb-jf-table table table-responsive <%= node.formElement.disableTableBorder %> table-hover <%= (fieldHtmlClass ? " fieldHtmlClass " : "") %> <%= (node.formElement.displayCompressedTables ? " table-sm " : "") %>" ' + '<%= (node.disabled || node.readOnly? " disabled" : "")%> ' + ">" + "<thead> <tr> <%= node.formElement.thead %> <tr> </thead>" + "<tbody> <%= children %> </tbody>" + "</table>" + "<% if (!node.isReadOnly() && node.formElement.enableAddingItems) { %>" + '<span class="tb-jf-array-buttons">' + '<a href="#" class="<%= cls.buttonClass %> btn-group-justified tb-jf-table-addmore <%= (node.formElement.displayCompressedTables ? " btn-sm " : "") %>"><i class="<%= cls.iconClassPrefix %>-plus-sign" title="Add new"></i> add new</a> ' + "</span>" + "<% } %>" + "</div>",
        fieldtemplate: true,
        containerField: true,
        compatibleTypes: [ "array", "object" ],
        compatibleFormats: [],
        minRowWidth: "half",
        maxRowWidth: "full",
        isArrayContainer: true,
        isTbTemplate: false,
        onBeforeRender: function(data, node) {
            if (node.schemaElement && jfUtils.contains(node.schemaElement.type, "object") || node.formElement.preview) {
                node.formElement.enableSorting = false;
                node.formElement.enableDeletingItems = false;
                node.formElement.enableAddingItems = false;
            }
            node.arrayLimits = node.getArrayLimits();
            node.formElement.disableTableBorder = node.formElement.disableTableBorder ? " tb-jf-disable-table-border " : " table-bordered ";
            if (!node.childTemplate || !node.childTemplate.hasOwnProperty("view") || !node.childTemplate.view.hasOwnProperty("template")) {
                node.childTemplate = {
                    view: {
                        template: ""
                    }
                };
            }
            node.childTemplate.view.template = "<tr " + '<% if (node.id) { %> id="<%= node.id %>"<% } %> ' + 'class="tb-jf-node ' + '<%= (node.key) ? " tb-jf-error-" + node.selectorKey : "" %>' + ' <%= elt.htmlClass ? elt.htmlClass : "" %>"> ' + "<%= children %>" + "</tr>";
            if (node.formElement.items[0].type === "section") {
                node.formElement.items[0].type = "tablerow";
            }
            if (node.formElement.items) {
                ASSERT.isArray(node.formElement.items, {
                    msg: "table: items must be an array",
                    code: 2310
                });
                ASSERT(node.formElement.items.length >= 1, {
                    msg: "table: items must have a length of 1 or more",
                    code: 2320
                });
                node.formElement.thead = "";
                _.each(node.formElement.items[0].items, function(col, index) {
                    ASSERT(col.title, {
                        msg: "table: every column requires a title",
                        code: 2330
                    });
                    if (col.type === "section") {
                        ASSERT.isArray(col.items, {
                            msg: "table: items must be an array",
                            code: 2340
                        });
                        ASSERT(col.items.length >= 1, {
                            msg: "table: items must have a length of 1 or more",
                            code: 2350
                        });
                    }
                    node.formElement.thead += "<th>" + col.title + "</th>";
                });
                if (!node.formElement.preview) {
                    if (node.formElement.enableSorting && !node.formElement.enableDeletingItems) {
                        node.formElement.thead += "<th> Reorder </th>";
                    } else if (!node.formElement.enableSorting && node.formElement.enableDeletingItems) {
                        node.formElement.thead += "<th> Remove </th>";
                    } else if (node.formElement.enableSorting && node.formElement.enableDeletingItems) {
                        node.formElement.thead += "<th> Modify </th>";
                    }
                }
            }
            _.each(node.children, function(row) {
                _.each(row.children, function(col) {
                    col.view.tablecell = true;
                });
            });
        },
        insideObjectTable: function(rootElement) {
            return $(rootElement).find("table").attr("data-attr-isarray") === "object-table";
        },
        getValueOfObjectTable: function(rootElement) {
            var myValue = {};
            $(rootElement).find("table tbody tr").each(function(idx, row) {
                var arrayOfValues = getArrayFieldValueHtml(row);
                for (var i = 0; i < arrayOfValues.length; i++) {
                    _.merge(myValue, constructObjectByKey(arrayOfValues[i]["name"], arrayOfValues[i]["value"]));
                }
            });
            return myValue;
        },
        getFieldValue: function(rootEl) {
            if (this.insideObjectTable(rootEl)) {
                var name = $(rootEl).find("table").attr("data-attr-name");
                var value = this.getValueOfObjectTable(rootEl)[name];
                return {
                    name: name,
                    value: value
                };
            } else {
                var $rootEl = $(rootEl);
                var name = $rootEl.attr("name");
                if ($rootEl.find("tr").length <= 2) {
                    return {
                        name: name,
                        value: []
                    };
                }
            }
        },
        onInsert: function(evt, node) {
            var $node = $(node.el);
            var $nodeid = $(node.el).find("#" + escapeSelector(node.id));
            var tableBody = $nodeid.find("tbody");
            var arrayLimits = node.arrayLimits;
            var moveNodeTo = function(fromIdx, toIdx) {
                if (fromIdx === toIdx) {
                    return;
                }
                var incr = fromIdx < toIdx ? 1 : -1;
                var parentEl = tableBody;
                for (var i = fromIdx; i !== toIdx; i += incr) {
                    node.children[i].switchValuesWithNode(node.children[i + incr]);
                    node.children[i].shouldEnhanceFunc();
                    console.info("Calling Render 2: from the moveNodeTo of tableAsObject");
                    node.children[i].render(parentEl.get(0));
                    node.children[i + incr].render(parentEl.get(0));
                }
                var fromEl = $(node.children[fromIdx].el);
                var toEl = $(node.children[toIdx].el);
                fromEl.detach();
                toEl.detach();
                if (fromIdx < toIdx) {
                    if (fromIdx === 0) parentEl.prepend(fromEl); else $(node.children[fromIdx - 1].el).after(fromEl);
                    $(node.children[toIdx - 1].el).after(toEl);
                } else {
                    if (toIdx === 0) parentEl.prepend(toEl); else $(node.children[toIdx - 1].el).after(toEl);
                    $(node.children[fromIdx - 1].el).after(fromEl);
                }
            };
            var addItem = function(idx) {
                if (arrayLimits.maxItems >= 0) {
                    var slotNum = arrayLimits.maxItems - node.children.length;
                    $node.find("> span > a.tb-jf-table-addmore").toggleClass("disabled", slotNum <= 1);
                    if (slotNum < 1) {
                        return false;
                    }
                }
                node.insertArrayItem(idx, tableBody);
                var canDelete = node.children.length > arrayLimits.minItems;
                $node.find("> span > a.tb-jf-table-deletelast").toggleClass("disabled", !canDelete);
                $node.find("> ul > li > a.tb-jf-table-row-delete").toggle(canDelete);
            };
            var deleteItem = function(idx) {
                var itemNumCanDelete = node.children.length - Math.max(arrayLimits.minItems, 0);
                $node.find("> span > a.tb-jf-table-deletelast").toggleClass("disabled", itemNumCanDelete <= 1);
                $node.find("> ul > li > a.tb-jf-table-row-delete").toggle(itemNumCanDelete > 1);
                if (itemNumCanDelete < 1) {
                    return false;
                }
                node.deleteArrayItem(idx);
                $node.find("> span > a.tb-jf-table-addmore").toggleClass("disabled", arrayLimits.maxItems >= 0 && node.children.length >= arrayLimits.maxItems);
            };
            $("+ span > a.tb-jf-table-addmore", $nodeid).click(function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                var idx = node.children.length;
                addItem(idx);
            });
            if (arrayLimits.minItems > 0) {
                for (var i = node.children.length; i < arrayLimits.minItems; i++) {
                    node.insertArrayItem(node.children.length, $nodeid.find("> ul").get(0));
                }
            }
            var itemNumCanDelete = node.children.length - Math.max(arrayLimits.minItems, 0);
            $nodeid.find("> span > a.tb-jf-table-deletelast").toggleClass("disabled", itemNumCanDelete <= 0);
            $nodeid.find("> ul > li > a.tb-jf-table-row-delete").toggle(itemNumCanDelete > 0);
            $nodeid.find("> span > a.tb-jf-table-addmore").toggleClass("disabled", arrayLimits.maxItems >= 0 && node.children.length >= arrayLimits.maxItems);
            $("+ span > a.tb-jf-table-deletelast", $nodeid).click(function(evt) {
                var idx = node.children.length - 1;
                evt.preventDefault();
                evt.stopPropagation();
                deleteItem(idx);
            });
            $nodeid.on("click", "> tbody > tr > td > span > a.tb-jf-table-row-delete", function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $tr = $(e.currentTarget).parent().parent().parent();
                var idx = $tr.data("idx");
                deleteItem(idx);
            });
            $nodeid.on("click", "> tbody > tr > td > span > a.tb-jf-table-row-move-up", function(e) {
                e.preventDefault();
                var index = Number(this.parentNode.parentNode.parentNode.getAttribute("data-idx"));
                e.stopPropagation();
                if (index - 1 >= 0) {
                    moveNodeTo(index, index - 1);
                }
            });
            $nodeid.on("click", "> tbody > tr > td > span > a.tb-jf-table-row-move-down", function(e) {
                e.preventDefault();
                var index = Number(this.parentNode.parentNode.parentNode.getAttribute("data-idx"));
                var maxIndex = node.children.length - 1;
                e.stopPropagation();
                if (index + 1 <= maxIndex) {
                    moveNodeTo(index, index + 1);
                }
            });
            if (!node.isReadOnly() && $(node.el).sortable && node.formElement.enableSorting) {
                tableBody.sortable();
                tableBody.bind("sortstop", function(event, ui) {
                    var idx = $(ui.item).data("idx");
                    var newIdx = $(ui.item).index();
                    moveNodeTo(idx, newIdx);
                });
            }
        }
    };
    tableAsObject["array"] = true;
    var tableObjectasObject = _.cloneDeep(tableAsObject);
    tableObjectasObject["array"] = false;
    var selectFieldTemplate = "" + '<select name="<%= node.name %>" id="<%= id %>"' + 'class="<%= cls.textualInputClass %> <%= fieldHtmlClass %> select-class-jf" ' + '<%= (node.disabled? " disabled" : "")%>' + "<%= (node.readOnly ? \" readonly='readonly' disabled='disabled'\" : \"\") %>" + "> " + "<% _.each(node.options, function(key, val) { if (key instanceof Object) { " + "if (value === key.value) { %> " + '<option <%= (key.disabled? " disabled" : "")%> selected value="<%= escape(key.value) %>"><%= key.title %></option> ' + "<% } else { %> " + '<option <%= (key.disabled? " disabled" : "")%> value="<%= escape(key.value) %>"><%= key.title %></option> ' + "<% }} else { if (value === key) { %> " + '<option <%= (key.disabled? " disabled" : "")%> selected value="<%= key === null ? \'\' : key %>"><%= escape(key) %></option> ' + "<% } else { %> " + '<option <%= (key.disabled? " disabled" : "")%> value="<%= key === null ? \'\' : key %>"><%= escape(key) %></option> <% }}}); %> ' + "</select>";
    var datePickerTemplate = "" + '<div class="row" style="position: relative;"><input value="<%= node.value %>" name="<%= node.name %>" id="<%= id %>"' + 'class="<%= cls.textualInputClass %> <%= fieldHtmlClass %>" ' + '<%= (node.disabled? " disabled" : "")%>' + '<%= (node.isReadOnly() ? " readonly=\'readonly\'" : "") %>' + '<%= (node.placeholder? " placeholder=" + \'"\' + node.placeholder + \'"\' : "")%>' + 'value="" /></div>';
    jsonform.elementTypes = {
        none: {
            template: ""
        },
        helptext: {
            template: "",
            compatibleTypes: [ "object" ]
        },
        genericHTML: {
            template: '<div class="row"><%= node.schemaElement.content %></div>',
            onBeforeRender: function(evt, node) {
                node.schemaElement.content = node.schemaElement.content.replace(/<script>(.*?)<\/script>/gi, "");
            }
        },
        root: {
            template: '<div class="row"><%= children %></div>'
        },
        text: inputFieldTemplate("text", true),
        password: inputFieldTemplate("password", true),
        date: inputFieldTemplate("date", true, {
            onInsert: function(evt, node) {
                if (window.Modernizr && window.Modernizr.inputtypes && !window.Modernizr.inputtypes.date) {
                    var $input = $(node.el).find("input");
                    if ($input.datepicker) {
                        var opt = {
                            dateFormat: "yy-mm-dd"
                        };
                        if (node.formElement && node.formElement.datepicker && typeof node.formElement.datepicker === "object") {
                            _.extend(opt, node.formElement.datepicker);
                        }
                        $input.datepicker(opt);
                    }
                }
            }
        }),
        datetime: inputFieldTemplate("datetime", true),
        "datetime-local": inputFieldTemplate("datetime-local", true, {
            onBeforeRender: function(data, node) {
                if (data.value && data.value.getTime) {
                    data.value = new Date(data.value.getTime() - data.value.getTimezoneOffset() * 6e4).toISOString().slice(0, -1);
                }
            }
        }),
        email: inputFieldTemplate("email", true),
        month: inputFieldTemplate("month", true),
        number: numberFieldTemplate("number", true),
        search: inputFieldTemplate("search", true),
        tel: inputFieldTemplate("tel", true),
        time: inputFieldTemplate("time", true),
        url: inputFieldTemplate("url", true),
        week: inputFieldTemplate("week", true),
        range: numberFieldTemplate("range"),
        color: {
            template: '<input type="text" ' + '<%= (fieldHtmlClass ? "class=\'" + fieldHtmlClass + "\' " : "") %>' + 'name="<%= node.name %>" value="<%= escape(value) %>" id="<%= id %>"' + '<%= (node.formElement.readOnly? " disabled=\'disabled\'" : "")%>' + '<%= (node.required ? " required=\'required\'" : "") %>' + " />",
            compatibleTypes: [ "string" ],
            compatibleFormats: [ "color" ],
            fieldtemplate: true,
            inputfield: true,
            minRowWidth: "quarter",
            maxRowWidth: "full",
            isTbTemplate: false,
            onInsert: function(evt, node) {
                $(node.el).find("#" + escapeSelector(node.id)).spectrum({
                    preferredFormat: "hex",
                    showInput: true
                });
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("disabled", "disabled");
                $(node.el).find(".sp-replacer").addClass("sp-disabled");
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").removeProp("disabled");
                $(node.el).find(".sp-replacer").removeClass("sp-disabled");
            }
        },
        textarea: {
            template: '<textarea id="<%= id %>" name="<%= node.name %>" ' + 'class="<%= cls.textualInputClass %> <%= fieldHtmlClass %>" ' + 'style="<%= elt.height ? "height:" + elt.height + ";" : "" %>width:<%= elt.width || "100%" %>;"' + '<%= (node.disabled? " disabled" : "")%>' + '<%= (node.isReadOnly() ? " readonly=\'readonly\'" : "") %>' + '<%= (node.placeholder? " placeholder=" + \'"\' + node.placeholder + \'"\' : "")%>' + "><%= escape(value) %></textarea>",
            compatibleTypes: [ "string", "number", "integer" ],
            compatibleFormats: [],
            fieldtemplate: true,
            minRowWidth: "quarter",
            maxRowWidth: "full",
            inputfield: true,
            isTbTemplate: false,
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("textarea").prop("readonly", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("textarea").removeProp("readonly");
            },
            getFieldValue: function(node) {
                var textarea = $(node).find("textarea");
                return {
                    name: textarea[0].getAttribute("name"),
                    value: textarea.val()
                };
            }
        },
        preview: {
            template: '<div id="<%= id %>" name="<%= node.name %>" ' + 'class="<%= fieldHtmlClass %> tb-jf-preview" ' + '<span class="tb-jf-title"> <%= node.title %>: </span> ' + '<span class="tb-jf-value"> <%= node.previewValue %> </span>' + "</div>",
            compatibleTypes: [ "string", "number", "integer", "boolean", "array" ],
            compatibleFormats: [],
            previewField: true,
            minRowWidth: "quarter",
            maxRowWidth: "full",
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                var nodeKeyPath = node.formElement.key.split("/");
                node.title = node.title || nodeKeyPath[nodeKeyPath.length - 1].split("[")[0];
                if (node.value === null || node.value === undefined || _.trim(node.value) === "") {
                    node.previewValue = " - ";
                } else {
                    node.previewValue = node.value;
                }
            },
            onInsert: function(evt, node) {}
        },
        imagepreview: {
            template: "" + '<div style="display: inline-block; width: 100%;" id="<%= id %>" name="<%= node.name %>"> ' + '<span class="tb-jf-title" style="display: block;"> <%= node.title %>: </span> <%= node.fullHTMLData %>' + "</div>",
            compatibleTypes: [ "null" ],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            getImageParams: function(node) {
                var data = {};
                data.imgHeight = node.formElement.filePreviewHeight || _.get(node.schemaElement, "filePreviewHeight") || node.ownerTree.formDesc.form.filePreviewHeight;
                data.imgWidth = node.formElement.filePreviewWidth || _.get(node.schemaElement, "filePreviewWidth") || node.ownerTree.formDesc.form.filePreviewWidth;
                data.fullName = node.formElement.fullName || node.ownerTree.formDesc.form.redirectImageDefault;
                data.thumbName = node.formElement.thumbName || node.ownerTree.formDesc.form.thumbnailImageDefault;
                data.imageTitle = node.formElement.imageTitle || node.ownerTree.formDesc.form.titleImagePreviewDefault;
                data.sources = node.formElement.imageSource;
                return data;
            },
            checkImageParams: function(data, node) {
                ASSERT(_.isNumber(data.imgHeight), {
                    code: 4590,
                    msg: "$KEY$ Default values should be number for value $HEIGHT$",
                    msgParams: {
                        KEY: node.formElement.key,
                        HEIGHT: data.imgHeight
                    }
                });
                ASSERT(data.imgHeight > 0, {
                    code: 4600,
                    msg: "$KEY$ Default values should be positive $HEIGHT$",
                    msgParams: {
                        KEY: node.formElement.key,
                        HEIGHT: data.imgHeight
                    }
                });
                ASSERT(data.imgHeight < node.ownerTree.formDesc.form.maximumFilePreviewHeight, {
                    code: 4610,
                    msg: "$KEY$ Default values should be below 2000 $HEIGHT$",
                    msgParams: {
                        KEY: node.formElement.key,
                        HEIGHT: data.imgHeight
                    }
                });
                ASSERT(_.isNumber(data.imgWidth), {
                    code: 4620,
                    msg: "$KEY$ Default values should be number for value $WIDTH$",
                    msgParams: {
                        KEY: node.formElement.key,
                        WIDTH: data.imgWidth
                    }
                });
                ASSERT(data.imgWidth > 0, {
                    code: 4630,
                    msg: "$KEY$ Default values should be positive $WIDTH$",
                    msgParams: {
                        KEY: node.formElement.key,
                        WIDTH: data.imgWidth
                    }
                });
                ASSERT(data.imgWidth < node.ownerTree.formDesc.form.maximumFilePreviewWidth, {
                    code: 4640,
                    msg: "$KEY$ Default values should be below 2000 $WIDTH$",
                    msgParams: {
                        KEY: node.formElement.key,
                        WIDTH: data.imgWidth
                    }
                });
            },
            appendElement: function($node, thumb, full, title, $temp) {
                $node.find("a")[0].href = full;
                $node.find("img")[0].src = thumb;
                if (title) {
                    $node.find("p").text(title);
                }
                $node.clone().appendTo($temp);
            },
            onBeforeRender: function(data, node) {
                var data = this.getImageParams(node);
                this.checkImageParams(data, node);
                var $node = $('<div data-tb-jf-placeholder style="display: inline-block; max-width: ' + data.imgWidth + 'px;">' + '<p style="word-wrap: break-word;"></p>' + '<a href="" target="_blank">' + '<img src=""' + 'style="float: left; width: 100%; max-height: ' + data.imgHeight + 'px;">' + "</a>" + "</div>");
                var $temp = $("<div></div>");
                if (_.isArray(data.sources)) {
                    data.sources.forEach(function(elem) {
                        if (_.isString(elem)) {
                            this.appendElement($node, elem, elem, null, $temp);
                        } else {
                            this.appendElement($node, elem[data.thumbName], elem[data.fullName], elem[data.imageTitle], $temp);
                        }
                    }, this);
                } else {
                    this.appendElement($node, data.sources, data.sources, null, $temp);
                }
                node.fullHTMLData = $temp[0].outerHTML;
            }
        },
        jsoneditor: {
            template: '<div id="<%= id %>" name="<%= node.name %>" ' + 'class="<%= fieldHtmlClass %>" ' + '<%= (node.disabled? " disabled" : "")%>' + '<%= (node.readOnly? " disabled" : "")%>' + "></div>",
            compatibleTypes: [ "string" ],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onInsert: function(data, node) {
                var container = $("#" + node.id)[0];
                var options = {
                    mode: "text"
                };
                var editor = new JSONEditor(container, options);
                editor.set(JSON.parse(node.value));
                editors[node.name] = editor;
            },
            getFieldValue: function(rootEl) {
                var $div = $(rootEl).find("div[name]");
                var editor = editors[$div.attr("name")];
                var result;
                try {
                    result = JSON.stringify(editor.get());
                } catch (e) {
                    result = "INVALID_JSON";
                }
                return {
                    name: $div.attr("name"),
                    value: result
                };
            }
        },
        tinymce: {
            template: '<textarea id="<%= id %>" name="<%= node.name %>" ' + 'class="<%= cls.textualInputClass %> <%= fieldHtmlClass %>" ' + 'style="<%= elt.height ? "height:" + elt.height + ";" : "" %>width:<%= elt.width || "100%" %>;"' + '<%= (node.disabled? " disabled" : "")%>' + '<%= (node.readOnly? " disabled" : "")%>' + '<%= (node.placeholder? " placeholder=" + \'"\' + node.placeholder + \'"\' : "")%>' + "><%= escape(value) %></textarea>",
            compatibleTypes: [ "string", "number", "integer" ],
            compatibleFormats: [ "html" ],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                var userGuideLink = "https://www.radarhill.com/tinymce-user-guide";
                if (node.description) {
                    node.description += ' - <a href="' + userGuideLink + '" target="_blank">user guide</a>&nbsp;&nbsp;<a style="cursor: pointer;" class="create-new-modal">Preview</a>';
                } else {
                    node.description = '&nbsp;&nbsp;<a href="' + userGuideLink + '" target="_blank">user guide</a>&nbsp;&nbsp;<a style="cursor: pointer;" class="create-new-modal">Preview</a>';
                }
            },
            onInsert: function(evt, node) {
                var supportedThemes = [ "modern" ];
                var supportedSkins = [ "lightgray", "lightgray-gradient", "charcoal" ];
                var supportedPlugins = [ "advlist", "codesample", "noneditable", "template", "anchor", "colorpicker", "imagetools", "pagebreak", "textcolor", "autolink", "contextmenu", "importcss", "paste", "textpattern", "autoresize", "directionality", "insertdatetime", "preview", "visualblocks", "autosave", "emoticons", "layer", "print", "visualchars", "base64image", "example", "legacyoutput", "save", "wordcount", "bbcode", "example_dependency", "link", "searchreplace", "fullpage", "lists", "spellchecker", "charmap", "fullscreen", "tabfocus", "code", "hr", "nonbreaking", "table", "fontselect", "fontsize" ];
                var pluginOptions = node.formElement.pluginOptions || {};
                pluginOptions.selector = "#" + node.id;
                pluginOptions.readonly = node.isReadOnly() || node.disabled;
                if (pluginOptions.valid_children) {
                    pluginOptions.valid_children += ",+body[style]";
                } else {
                    pluginOptions.valid_children = "+body[style]";
                }
                if (pluginOptions.height !== undefined) {
                    ASSERT.isNumber(pluginOptions.height, {
                        msg: "Height must be a number!",
                        code: 2370
                    });
                    ASSERT(pluginOptions.height > 0, {
                        msg: "Height must be more than 0",
                        code: 2380
                    });
                } else {
                    pluginOptions.height = 150;
                }
                if (pluginOptions.valid_children) {
                    pluginOptions.valid_children += ",+body[style]";
                } else {
                    pluginOptions.valid_children = "+body[style]";
                }
                if (pluginOptions.max_height !== undefined) {
                    ASSERT(pluginOptions.max_height >= pluginOptions.height, {
                        msg: "TinyMCE: pluginOptions.max_height $MAXHEIGHT$ must be greater or equal to pluginOptions.height $HEIGHT$.",
                        msgParams: {
                            MAXHEIGHT: pluginOptions.max_height,
                            HEIGHT: pluginOptions.height
                        },
                        code: 2390
                    });
                }
                if (pluginOptions.min_height !== undefined) {
                    ASSERT(pluginOptions.min_height <= pluginOptions.height, {
                        msg: "TinyMCE: pluginOptions.min_height $MINHEIGHT$ must be lesser or equal to pluginOptions.height $HEIGHT$.",
                        msgParams: {
                            MINHEIGHT: pluginOptions.min_height,
                            HEIGHT: pluginOptions.height
                        },
                        code: 2400
                    });
                }
                if (pluginOptions.width !== undefined) {
                    ASSERT.isNumber(pluginOptions.width, {
                        msg: "Width must be a number",
                        code: 2410
                    });
                    ASSERT(pluginOptions.width > 0, {
                        msg: "Height must be above 0",
                        code: 2420
                    });
                }
                if (pluginOptions.max_width !== undefined) {
                    ASSERT.isNumber(pluginOptions.max_width, {
                        msg: "maxWidth must be a number",
                        code: 2430
                    });
                    if (pluginOptions.width !== undefined) {
                        ASSERT(pluginOptions.max_width >= pluginOptions.width, {
                            msg: "TinyMCE: pluginOptions.max_width $MAXWIDTH$ must be greater or equal to pluginOptions.width $WIDTH$.",
                            msgParams: {
                                MAXWIDTH: pluginOptions.max_width,
                                WIDTH: pluginOptions.width
                            },
                            code: 2440
                        });
                    }
                }
                if (pluginOptions.min_width !== undefined) {
                    ASSERT.isNumber(pluginOptions.min_width, {
                        msg: "minWidth must be a number",
                        code: 2450
                    });
                    if (pluginOptions.width !== undefined) {
                        ASSERT(pluginOptions.min_width <= pluginOptions.width, {
                            msg: "TinyMCE: pluginOptions.min_width $MINWIDTH$ must be less or equal to pluginOptions.width $WIDTH$.",
                            msgParams: {
                                MINWIDTH: pluginOptions.min_width,
                                WIDTH: pluginOptions.width
                            },
                            code: 2460
                        });
                    }
                }
                if (pluginOptions.theme !== undefined) {
                    ASSERT.isString(pluginOptions.theme, {
                        msg: "theme must be a string",
                        code: 2470
                    });
                    ASSERT(supportedThemes.indexOf(pluginOptions.theme) >= 0, {
                        msg: "TinyMCE: pluginOptions.theme contains a theme that does not exist: $THEME$.",
                        msgParams: {
                            THEME: pluginOptions.theme
                        },
                        code: 2480
                    });
                } else {
                    pluginOptions.theme = "modern";
                }
                if (pluginOptions.skin !== undefined) {
                    ASSERT.isString(pluginOptions.skin, {
                        msg: "skin must be of type string",
                        code: 2490
                    });
                    ASSERT(supportedSkins.indexOf(pluginOptions.skin) >= 0, {
                        msg: "TinyMCE: pluginOptions.skin contains a skin that does not exist: $SKIN$.",
                        msgParams: {
                            SKIN: pluginOptions.skin
                        },
                        code: 2500
                    });
                } else {
                    pluginOptions.skin = "lightgray-gradient";
                }
                if (pluginOptions.plugins !== undefined && pluginOptions.plugins.length) {
                    ASSERT(_.isArray(pluginOptions.plugins) === true, {
                        msg: "TinyMCE: pluginOptions.plugins must be an array.",
                        code: 2510
                    });
                    for (var i = 0, j = pluginOptions.plugins.length; i < j; i++) {
                        ASSERT(supportedPlugins.indexOf(pluginOptions.plugins[i]) >= 0, {
                            msg: "TinyMCE: pluginOptions.plugins contains a plugin that does not exist: $PLUGIN$",
                            msgParams: {
                                PLUGIN: pluginOptions.plugins[i]
                            },
                            code: 2520
                        });
                    }
                    if (pluginOptions.plugins.indexOf("base64image") < 0) {
                        pluginOptions.plugins.push("base64image");
                    }
                } else {
                    pluginOptions.plugins = [ "base64image" ];
                }
                pluginOptions.plugins.push("code");
                if (pluginOptions.inline !== undefined) {
                    pluginOptions.inline = false;
                }
                if (pluginOptions.image_advtab !== undefined) {} else {
                    pluginOptions.image_advtab = false;
                }
                if (pluginOptions.resize !== undefined) {
                    if (typeof pluginOptions.resize !== "string") {
                        ASSERT.isBoolean(pluginOptions.resize, {
                            msg: 'TinyMCE: pluginOptions.resize $RESIZE$ must be a boolean or the string "both"',
                            msgParams: {
                                RESIZE: pluginOptions.resize
                            },
                            code: 2530
                        });
                    } else {
                        ASSERT(pluginOptions.resize === "both", {
                            msg: 'TinyMCE: pluginOptions.resize $RESIZE$ must be a boolean or the string "both"',
                            msgParams: {
                                RESIZE: pluginOptions.resize
                            },
                            code: 2540
                        });
                    }
                } else {
                    pluginOptions.resize = true;
                }
                if (pluginOptions.paste_data_images !== undefined) {
                    ASSERT.isBoolean(pluginOptions.paste_data_images, {
                        msg: "TinyMCE: pluginOptions.resize $PASTE_DATA_IMAGE$ must be a boolean",
                        msgParams: {
                            PASTE_DATA_IMAGE: pluginOptions.paste_data_images
                        },
                        code: 2550
                    });
                } else {
                    pluginOptions.paste_data_images = true;
                }
                if (pluginOptions.max_image_count !== undefined) {
                    ASSERT.isNumber(pluginOptions.max_image_count, {
                        msg: "TinyMCE: pluginOptions.max_image_count $MAXIMAGECOUNT$ must be a number",
                        msgParams: {
                            MAXIMAGECOUNT: pluginOptions.max_image_count
                        },
                        code: 2560
                    });
                } else {
                    pluginOptions.max_image_count = 10;
                }
                if (pluginOptions.max_image_size !== undefined) {
                    ASSERT.isNumber(pluginOptions.max_image_size, {
                        msg: "TinyMCE: pluginOptions.max_image_size $MAXIMAGECOUNT$ must be a number",
                        msgParams: {
                            MAXIMAGECOUNT: pluginOptions.max_image_size
                        },
                        code: 2570
                    });
                } else {
                    pluginOptions.max_image_size = 512e3;
                }
                if (pluginOptions.max_image_height !== undefined) {
                    ASSERT.isNumber(pluginOptions.max_image_height, {
                        msg: "TinyMCE: pluginOptions.max_image_height $MAXIMAGECOUNT$ must be a number",
                        msgParams: {
                            MAXIMAGECOUNT: pluginOptions.max_image_height
                        },
                        code: 2580
                    });
                } else {
                    pluginOptions.max_image_height = 1024;
                }
                if (pluginOptions.max_image_width !== undefined) {
                    ASSERT.isNumber(pluginOptions.max_image_width, {
                        msg: "TinyMCE: pluginOptions.max_image_width $MAXIMAGEWIDTH$ must be a number",
                        msgParams: {
                            MAXIMAGEWIDTH: pluginOptions.max_image_width
                        },
                        code: 2590
                    });
                } else {
                    pluginOptions.max_image_width = 1024;
                }
                pluginOptions.toolbar1 = "undo redo | base64image styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | link image | forecolor backcolor | preview print code";
                if (pluginOptions.readonly !== undefined) {
                    ASSERT.isBoolean(pluginOptions.readonly, {
                        msg: "TinyMCE: pluginOptions.readonly $READONLY$ must be a boolean",
                        msgParams: {
                            READONLY: pluginOptions.readonly
                        },
                        code: 2600
                    });
                    if (pluginOptions.readonly) {
                        pluginOptions.toolbar1 = "";
                    }
                }
                pluginOptions.setup = function(editor) {
                    editor.on("change", function(e) {
                        $(pluginOptions.selector).val(editor.getContent());
                        $(pluginOptions.selector).trigger("change");
                    });
                };
                $(pluginOptions.selector).one("click", function() {
                    tinyMCE.init(pluginOptions);
                });
                $(node.el).find(".create-new-modal").click(function(e) {
                    var editorValue = $(pluginOptions.selector).val();
                    var myWindow = window.open("Preview", "PREVIEW", "resizable,scrollbars,status");
                    myWindow.document.write(editorValue);
                });
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                tinyMCE.get("" + node.id).setMode("readonly");
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                tinyMCE.get("" + node.id).setMode("edit");
            },
            getFieldValue: function(node) {
                var textarea = $(node).find("textarea");
                return {
                    name: textarea[0].getAttribute("name"),
                    value: textarea.val()
                };
            }
        },
        ace: {
            template: '<div id="<%= id %>" style="position:relative;height:<%= elt.height || "300px" %>;"><div id="<%= id %>__ace" style="width:<%= elt.width || "100%" %>;height:<%= elt.height || "300px" %>;"></div><input type="hidden" name="<%= node.name %>" id="<%= id %>__hidden" value="<%= escape(value) %>"/></div>',
            compatibleTypes: [ "string", "number", "integer" ],
            compatibleFormats: [],
            fieldtemplate: true,
            inputfield: true,
            minRowWidth: "quarter",
            maxRowWidth: "full",
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                if (data.value && typeof data.value === "object" || _.isArray(data.value)) {
                    data.value = JSON.stringify(data.value, null, 2);
                }
            },
            onInsert: function(evt, node) {
                var setup = function() {
                    var formElement = node.formElement || {};
                    var ace = window.ace;
                    var editor = ace.edit($(node.el).find("#" + escapeSelector(node.id) + "__ace").get(0));
                    var idSelector = "#" + escapeSelector(node.id) + "__hidden";
                    editor.getSession().setNewLineMode("unix");
                    editor.renderer.setShowPrintMargin(false);
                    editor.setTheme("ace/theme/" + (formElement.aceTheme || "twilight"));
                    if (formElement.aceMode) {
                        editor.getSession().setMode("ace/mode/" + formElement.aceMode);
                    }
                    editor.getSession().setTabSize(2);
                    var valueStr = node.value;
                    if (valueStr === null || valueStr === undefined) {
                        valueStr = "";
                    } else if (typeof valueStr === "object" || Array.isArray(valueStr)) {
                        valueStr = JSON.stringify(valueStr, null, 2);
                    }
                    editor.getSession().setValue(valueStr);
                    var lazyChanged = _.debounce(function() {
                        $(node.el).find(idSelector).val(editor.getSession().getValue());
                        $(node.el).find(idSelector).change();
                    }, 600);
                    editor.getSession().on("change", lazyChanged);
                    editor.on("blur", function() {
                        $(node.el).find(idSelector).trigger("blur");
                    });
                    editor.on("focus", function() {
                        $(node.el).find(idSelector).trigger("focus");
                    });
                    if (node.formElement.readOnly === true) {
                        editor.setReadOnly(true);
                    }
                };
                if (window.jsonform_ace_setup) {
                    window.jsonform_ace_setup(setup);
                    return;
                }
                var itv = window.setInterval(function() {
                    if (window.ace) {
                        window.clearInterval(itv);
                        setup();
                    }
                }, 1e3);
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                ace.edit($(node.el).find("#" + escapeSelector(node.id) + "__ace").get(0)).setReadOnly(true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                ace.edit($(node.el).find("#" + escapeSelector(node.id) + "__ace").get(0)).setReadOnly(false);
            }
        },
        checkbox: {
            template: '<div class="checkbox styled"><input type="checkbox" id="<%= id %>" ' + 'name="<%= node.name %>" value="1" <% if (value) {%>checked<% } %>' + '<%= (node.disabled? " disabled=\'disabled\'" : "")%>' + '<%= (node.readOnly? " disabled=\'disabled\'" : "")%>' + " />" + '<label class="tb-jf-checkbox-label" for="<%= id %>">' + '<%= (node.inlinetitle ? node.inlinetitle : node.title) || "" %>' + "</label>" + "</div>",
            compatibleTypes: [ "boolean" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(evt, node) {
                node.inlinetitle = node.formElement.inlinetitle || node.formElement.title;
                node.title = undefined;
                node.isTbTemplate = false;
            },
            onInsert: function(evt, node) {
                if (!node.formElement.hasOwnProperty("useDeprecatedPlugin") || node.formElement.useDeprecatedPlugin === false) {
                    var msg = "Checkbox plugins are deprecated as it is always necessary to specify a default value. Otherwise the library must choose a default which is problematic.";
                    console.log(msg);
                }
                if (node.formElement.toggleNext) {
                    var nextN = node.formElement.toggleNext === true ? 1 : node.formElement.toggleNext;
                    var toggleNextClass = "tb-jf-toggle-next tb-jf-toggle-next-" + nextN;
                    var $next = nextN === 1 ? $(node.el).next() : nextN === "all" ? $(node.el).nextAll() : $(node.el).nextAll().slice(0, nextN);
                    $next.addClass("tb-jf-toggle-next-target");
                    $(node.el).addClass(toggleNextClass).find(":checkbox").on("change", function() {
                        var $this = $(this);
                        var checked = $this.is(":checked");
                        $(node.el).toggleClass("checked", checked);
                        $next.toggle(checked).toggleClass("tb-jf-visible", checked);
                    }).change();
                }
            },
            getElement: function(el) {
                return $(el).parent().parent().get(0);
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("disabled", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").removeProp("disabled");
            },
            getFieldValue: function(node) {
                var checkbox = $(node).find(":input[type=checkbox]");
                return {
                    name: checkbox[0].name,
                    value: checkbox[0].checked
                };
            }
        },
        changepassword: {
            template: "" + '<div class="tb-jf-password-container tb-jf-error-<%= node.selectorKey %>" data-tb-jf-type="<%= node.formElement.type %>">' + '<span class="help-block tb-jf-errortext tb-jf-hide"></span>' + '<input  type="hidden" name="<%= node.name %>" id="<%= id %>" class="tb-jf-password-field" >' + '<div class="tb-jf-password-item-container"><%= node.passwordTitle.old %><br />' + '<input class="<%= cls.textualInputClass %> <%= fieldHtmlClass %> tb-jf-password-field" ' + ' type="password" dataId="oldPass" id="<%= node.slaveIds.old %>" ' + " /></div>" + '<div class="tb-jf-password-item-container"><%= node.passwordTitle.new %><br />' + '<input class="<%= cls.textualInputClass %> <%= fieldHtmlClass %> tb-jf-password-field" ' + ' id="<%= node.slaveIds.new %>" type="password" dataId="newPass"' + " /></div>" + '<div class="tb-jf-password-item-container"><%= node.passwordTitle.confirm %><br /><input  ' + 'class="<%= cls.textualInputClass %> <%= fieldHtmlClass %> tb-jf-password-field" ' + ' id="<%= node.slaveIds.confirm %>" type="password" dataId="validateMe"' + " /></div></div>",
            compatibleTypes: [ "string" ],
            compatibleFormats: [ "password" ],
            isTbTemplate: false,
            inputfield: true,
            minRowWidth: "quarter",
            maxRowWidth: "half",
            onBeforeRender: function(evt, node) {
                var regex = REGEX.CATCH_CONTAINER_OR_FIELD;
                var match = regex.exec(node.id);
                regex.lastIndex = 0;
                var passwordTitle = {};
                passwordTitle.old = node.formElement.oldPasswordTitle;
                passwordTitle.new = node.formElement.newPasswordTitle;
                passwordTitle.confirm = node.formElement.confirmNewPasswordTitle;
                node.passwordTitle = passwordTitle;
                var oldSlave = node.id.replace(match[1], match[1] + "-slave-old");
                var newSlave = node.id.replace(match[1], match[1] + "-slave-new");
                var confirmSlave = node.id.replace(match[1], match[1] + "-slave-confirm");
                var slaveIds = {
                    old: oldSlave,
                    new: newSlave,
                    confirm: confirmSlave
                };
                node.slaveIds = slaveIds;
            },
            getFieldValue: function(rootEl) {
                var $rootEl = $(rootEl);
                var realInputField = $rootEl.find('[type="hidden"]');
                var name = $rootEl.find("[name]").attr("name");
                var oldValue = $rootEl.find('[dataId="oldPass"]').val();
                var newValue = $rootEl.find('[dataId="newPass"]').val();
                var newValueVerify = $rootEl.find('[dataId="validateMe"]').val();
                var isEmpty = false;
                var returnObject = {
                    oldValue: oldValue,
                    newValue: newValue,
                    confirmValue: newValueVerify
                };
                if (oldValue === "" && newValue === "" && newValueVerify === "") {
                    isEmpty = true;
                }
                realInputField.val(JSON.stringify(returnObject));
                return {
                    name: name,
                    value: isEmpty ? null : JSON.stringify(returnObject)
                };
            }
        },
        file: {
            template: '<input class="input-file form-control tb-jf-input-class" type="file" id="<%= id %>" name="<%= node.name %>" accept="<%= node.mimeTypesFormattedString %>" data-tb-jf-type="file" <%= node.isMultiple %>  /> ',
            compatibleTypes: [ "string", null ],
            compatibleItemTypes: "string",
            minRowWidth: "quarter",
            maxRowWidth: "half",
            fieldtemplate: true,
            isTbTemplate: false,
            inputfield: true,
            onBeforeRender: function(evt, node) {
                node.isMultiple = node.schemaElement.isMultiple ? "multiple" : undefined;
                var mimeTypesFormattedString = "";
                var fileMimeTypesList = node.schemaElement.fileMimeTypes || _.get(node.schemaElement, "items.fileMimeTypes");
                if (fileMimeTypesList === undefined) {
                    return;
                }
                fileMimeTypesList.map(function(mimeType) {
                    mimeTypesFormattedString += mimeType + ",";
                });
                node.mimeTypesFormattedString = mimeTypesFormattedString;
            },
            getFieldValue: function(rootEl) {
                var $fileInput = $(rootEl);
                var value;
                if ($fileInput.find(".input-file.form-control").length !== 0) {
                    $fileInput = $fileInput.find(".input-file.form-control");
                }
                for (var i = 0; i < $fileInput[0].files.length; i++) {
                    value = $fileInput[0].files[i].name;
                }
                return {
                    name: $fileInput.attr("name"),
                    value: value !== undefined ? value : null
                };
            }
        },
        base64file: {
            template: '<input type="hidden" id="<%= id %>"  name=<%= node.name %> /><input class="input-file form-control" accept="<%= node.mimeTypesFormattedString %>" data-tb-jf-type="base64file" type="file" <%= node.isMultipleField %> /> ',
            compatibleTypes: [ "string", null ],
            compatibleFormats: [ "base64" ],
            minRowWidth: "quarter",
            maxRowWidth: "half",
            fieldtemplate: true,
            isTbTemplate: false,
            inputfield: true,
            onBeforeRender: function(evt, node) {
                var mimeTypesFormattedString = "";
                var fileMimeTypesList = node.schemaElement.fileMimeTypes || _.get(node.schemaElement, "items.fileMimeTypes");
                ASSERT(fileMimeTypesList, {
                    msg: "Please give mimetypes",
                    code: 2610
                });
                fileMimeTypesList.map(function(mimeType) {
                    mimeTypesFormattedString += mimeType + ",";
                });
                node.mimeTypesFormattedString = mimeTypesFormattedString;
            },
            appendImagePlaceholder: function($hiddenInput, $imgContainer, imgWidth, imgHeight) {
                var $imageWrapper = $('<div class="1-debug tb-jf-file-preview-container"></div>');
                var $img = $("<img />");
                var $span = $('<span class="glyphicon glyphicon-remove-circle"></span>');
                $imageWrapper.append($img);
                $imageWrapper.append($span);
                $span.css("display", "none");
                $img.css("display", "none").css("max-height", imgHeight).css("max-width", imgWidth);
                $imgContainer.append($imageWrapper);
                $span.click(function() {
                    var $fileInput = $(this).parent().parent().siblings('[type="file"]');
                    $fileInput.val("");
                    $(this).siblings(".2-debug img").attr("src", "");
                    $($imgContainer).find("img").css("display", "none");
                    $imgContainer.find("span").css("display", "none");
                    $hiddenInput.val("");
                });
            },
            changeImg: function($hiddenInput, imgData, $imgContainer, parsedFileData) {
                $hiddenInput.val(imgData);
                $($imgContainer).find("img").prop("src", parsedFileData ? parsedFileData[2] : imgData).css("display", "inline-block");
                $imgContainer.find("span").css("display", "inline-block");
            },
            onInsert: function(evt, node) {
                var parseAsText = [ "text/x-url", "application/x-url", "text/url" ];
                var self = this;
                var idSelector = "#" + escapeSelector(node.id);
                var $hiddenInput = $(node.el).find(idSelector);
                var $fileInput = $hiddenInput.next();
                var $fileInputParent = $fileInput.parent();
                var $imgContainer = $('<div class="2-debug"></div>');
                var imgHeight;
                var imgWidth;
                var imagesDefaultValue;
                $fileInputParent.append($imgContainer);
                imgHeight = node.formElement.filePreviewHeight || _.get(node.schemaElement, "filePreviewHeight") || node.ownerTree.formDesc.form.filePreviewHeight;
                imgWidth = node.formElement.filePreviewWidth || _.get(node.schemaElement, "filePreviewWidth") || node.ownerTree.formDesc.form.filePreviewWidth;
                imagesDefaultValue = node.value || node.schemaElement.default;
                ASSERT(_.isNumber(imgHeight), {
                    code: 2620,
                    msg: "$KEY$ Default values should be number for value $HEIGHT$",
                    msgParams: {
                        KEY: node.formElement.key,
                        HEIGHT: imgHeight
                    }
                });
                ASSERT(imgHeight > 0, {
                    code: 2630,
                    msg: "$KEY$ Default values should be positive $HEIGHT$",
                    msgParams: {
                        KEY: node.formElement.key,
                        HEIGHT: imgHeight
                    }
                });
                ASSERT(imgHeight < node.ownerTree.formDesc.form.maximumFilePreviewHeight, {
                    code: 2640,
                    msg: "$KEY$ Default values should be below 2000 $HEIGHT$",
                    msgParams: {
                        KEY: node.formElement.key,
                        HEIGHT: imgHeight
                    }
                });
                ASSERT(_.isNumber(imgWidth), {
                    code: 2650,
                    msg: "$KEY$ Default values should be number for value $WIDTH$",
                    msgParams: {
                        KEY: node.formElement.key,
                        WIDTH: imgWidth
                    }
                });
                ASSERT(imgWidth > 0, {
                    code: 2660,
                    msg: "$KEY$ Default values should be positive $WIDTH$",
                    msgParams: {
                        KEY: node.formElement.key,
                        WIDTH: imgWidth
                    }
                });
                ASSERT(imgWidth < node.ownerTree.formDesc.form.maximumFilePreviewWidth, {
                    code: 2670,
                    msg: "$KEY$ Default values should be below 2000 $WIDTH$",
                    msgParams: {
                        KEY: node.formElement.key,
                        WIDTH: imgWidth
                    }
                });
                this.appendImagePlaceholder($hiddenInput, $imgContainer, imgWidth, imgHeight);
                if (!_.isNil(imagesDefaultValue)) {
                    ASSERT(_.isString(imagesDefaultValue), {
                        msg: "Default values should be string for value $DEFAULT$",
                        msgParams: {
                            DEFAULT: imagesDefaultValue
                        },
                        code: 2680
                    });
                    var arrayOfImgs = [ imagesDefaultValue ];
                    for (var i = 0; i < arrayOfImgs.length; i++) {
                        var found = arrayOfImgs[i].match("data:(.+);base64,(.*)");
                        if (parseAsText.indexOf(found[1]) > 0) {
                            this.changeImg($hiddenInput, arrayOfImgs[i], $imgContainer, found);
                        } else {
                            this.changeImg($hiddenInput, arrayOfImgs[i], $imgContainer);
                        }
                    }
                }
                $fileInput.on("change", function(e) {
                    var myFile = $(this).prop("files")[0];
                    ASSERT_USER(myFile, {
                        msg: "$NODENAME$ No file found",
                        msgParams: {
                            NODENAME: node.name
                        },
                        code: 2690
                    });
                    for (var i = 0; i < $(this).prop("files").length; i++) {
                        var file = $(this).prop("files")[i];
                        tbFile.loadFile(file, "DataURL").then(function(fileContent) {
                            self.changeImg($hiddenInput, fileContent, $imgContainer);
                        });
                    }
                });
            }
        },
        pgtimeinterval: {
            template: '<div style="display: inline-block;">' + '<div class="col-lg-6" style="display: inline-block; width: 350px;"><div class="input-group">' + '<span class="input-group-addon" id="basic-addon1">How many units</span> <input class="form-control handler" placeholder="Units" ' + 'aria-describedby="basic-addon1" id="<%= id %>" name="<%= node.name %>" type="number" style="width: auto; display: inline-block;" /> ' + "</div></div>" + '<div class="col-lg-6" style="display: inline-block; width: 350px;"><div class="input-group">' + '<span class="input-group-addon" id="basic-addon2">Units of data</span>' + '<select class="form-control" style="width: auto; display: inline-block;">' + PG_INTERVAL_NAMES.map(function(opt) {
                return "<option>" + opt + "</option>";
            }) + "</select>" + "</div></div>" + "</div>",
            minRowWidth: "half",
            maxRowWidth: "half",
            compatibleTypes: [ "string" ],
            compatibleFormats: [ "base64" ],
            fieldtemplate: true,
            isTbTemplate: false,
            inputfield: true,
            onInsert: function(evt, node) {
                var $select = $(node.el).find("select");
                ASSERT(!node.value || PG_INTERVAL_NAMES.indexOf(node.value) !== -1, {
                    msg: "pgtimeinterval: content input value $VALUE$ from schema must be inside $OPTIONS$",
                    msgParams: {
                        VALUE: node.value,
                        OPTIONS: PG_INTERVAL_NAMES
                    },
                    code: 2700
                });
                ASSERT(!node.schemaElement.default || PG_INTERVAL_NAMES.indexOf(node.schemaElement.default) !== -1, {
                    msg: "pgtimeinterval: schema input value $INPUT$ from schema must be inside $OPTIONS$ ",
                    msgParams: {
                        INPUT: node.schemaElement.default,
                        OPTIONS: PG_INTERVAL_NAMES
                    },
                    code: 2710
                });
                var initialValue = node.value || node.schemaElement.default;
                $select.find("option").each(function() {
                    if (initialValue !== undefined && this.text === initialValue) {
                        $(this).prop("selected", true);
                        return false;
                    }
                });
            },
            getFieldValue: function(rootEl) {
                var $input = $(rootEl).find("input.handler");
                var $select = $(rootEl).find("select");
                var returnValue = $input.val() ? $input.val() + " " + $select.val() : null;
                return {
                    name: $input.attr("name"),
                    value: returnValue
                };
            }
        },
        select: {
            template: selectFieldTemplate,
            compatibleTypes: [ "string", "number", "integer", "boolean", "null" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isSearchableField: true,
            requiresEnum: true,
            usesEnum: true,
            isTbTemplate: false,
            setOptions: function(node, values, inSearch) {
                var $select = $(node.el).find("select.select-class-jf");
                $select.html("");
                if (values.length === 0) {
                    if (inSearch) {
                        var $options = '<option value="" disabled selected hidden>No Results Found!</option>';
                        $select.append($options);
                    } else {
                        var $options = '<option value="" disabled selected hidden>Please Choose...</option>';
                        $select.append($options);
                    }
                    return;
                }
                for (var i = 0; i < values.length; i++) {
                    var val = values[i];
                    var $option = $('<option value="' + val.id + '">' + val.title + "</option>");
                    $select.append($option);
                }
            },
            addOptionFromRecord: function(node, record) {
                var id_field = node.schemaElement.refCol;
                var name_field = node.schemaElement.refColTitle || "name";
                jsonform.elementTypes.select.addOption(node, {
                    id: record[id_field],
                    title: record[name_field]
                });
            },
            addOption: function(node, record) {
                var $select = $(node.el).find("select.select-class-jf");
                var $option = $('<option value="' + record.id + '">' + record.title + "</option>");
                $select.append($option);
            },
            setMetaData: function(node, moreResults, $el) {
                var $spans = $el.find(".more-results");
                if (moreResults) {
                    if ($spans.length === 0) {
                        $el.append('<span class="more-results">There are more results!</span>');
                    }
                } else {
                    $spans.remove();
                }
            },
            setValueFromRecord: function(node, record) {
                var id_field = node.schemaElement.refCol;
                jsonform.elementTypes.select.setValue(node, record[id_field]);
            },
            setValue: function(node, value) {
                var $select = $(node.el).find("select.select-class-jf");
                $select.val(value);
            },
            onChange: function(evt, node) {},
            onInsert: function(evt, node) {
                if (!(node.schemaElement && isForeignKeyField(node.schemaElement))) return;
                if (node.schemaElement.enum) return;
                ASSERT_USER(node.ownerTree.formDesc.resources && node.ownerTree.formDesc.resources[node.schemaElement.refTable], {
                    code: 2725,
                    msg: "Foreign key: I did not find my resources! Resources: $resource$; Key: $key$",
                    msgParams: {
                        resource: node.schemaElement.refTable,
                        resources: node.ownerTree.formDesc.resources,
                        key: node.name
                    }
                });
                var resources = node.ownerTree.formDesc.resources[node.schemaElement.refTable];
                var setFilterState = function setFilterState(node) {
                    node.filterOptionCurrent = {
                        select: $select.val(),
                        value: $input.val()
                    };
                };
                var $el = $(node.el);
                var $div = $('<div class="momo"></div>');
                if (resources.hasMoreRecords) {
                    var $select = $("<select></select>");
                    $select.change(function() {
                        setFilterState(node);
                    });
                    var arr = node.filterOptions || [];
                    for (var i = 0; i < arr.length; i++) {
                        var obj = arr[i];
                        var itemName = obj.title;
                        var itemValue = obj.id;
                        var itemType = _.isArray(obj.type) ? obj.type.map(function(el) {
                            if (el !== "null") {
                                return el;
                            }
                        })[0] : obj.type;
                        var $item = $('<option data-selected-type="' + itemType + '"  value="' + itemValue + '">' + itemName + "</option>");
                        $select.append($item);
                    }
                    var $input = $('<input type="text" />');
                    $input.change(function() {
                        setFilterState(node);
                    });
                    var uniqueIdSearchButton = _.uniqueId();
                    var $button = $('<button type="button" id="' + uniqueIdSearchButton + '">X</button>');
                    $button.click(function(e) {
                        $button.attr("disabled", "disabled");
                        var filters = [];
                        filters.push({
                            field_value: $input.val(),
                            field_name: $select.val(),
                            type: $select.find(":selected").attr("data-selected-type")
                        });
                        var type;
                        var isNullable = false;
                        var types = _.isArray(node.schemaElement.type) ? node.schemaElement.type : [ node.schemaElement.type ];
                        for (var i = 0; i < types.length; i++) {
                            if (types[i] === "null") {
                                isNullable = true;
                            } else {
                                type = types[i];
                            }
                        }
                        var isNull = node.schemaElement.type;
                        var resolvedSchema = jfUtils.resolveRefs(node.ownerTree.formDesc.schema, node.schemaElement.filterSchema, true);
                        var event = new CustomEvent("jf_specialSearch", {
                            detail: {
                                filters: filters,
                                ref_col: node.schemaElement.refCol,
                                ref_table: node.schemaElement.refTable,
                                ref_col_title: node.schemaElement.refColTitle,
                                form_id: node.ownerTree.formDesc.form.$formIdCode,
                                schema_id: node.ownerTree.formDesc.schema.id,
                                field_schema: node.schemaElement,
                                field_type: type,
                                is_nullable: isNullable,
                                sp: node.ownerTree.formDesc.sp,
                                nodeId: uniqueIdSearchButton,
                                cb: function(responce, err) {
                                    if (err) {
                                        TRACE(err);
                                        throw err;
                                        return;
                                    }
                                    var result = responce.result;
                                    if (result) {
                                        var options = result.data.map(function(item, idx) {
                                            return {
                                                id: item.data[item.refFieldName],
                                                title: item.data[item.refFieldTitleName]
                                            };
                                        });
                                        node.currentOptions = options;
                                        jsonform.elementTypes.select.setOptions(node, options, true);
                                        jsonform.elementTypes.select.setMetaData(node, result.hasMoreFkeyRecords, $div);
                                    }
                                }
                            }
                        });
                        node.ownerTree.domRoot.dispatchEvent(event);
                    });
                }
                if (node.filterOptionCurrent) {
                    $select.val(node.filterOptionCurrent.select);
                    $input.val(node.filterOptionCurrent.value);
                    jsonform.elementTypes.select.setOptions(node, node.currentOptions);
                    jsonform.elementTypes.select.setValue(node, node.value);
                } else if (!node.schemaElement.enum) {
                    var currKey = node.formElement.key;
                    var foreignKeyData = resources.records || [];
                    if (foreignKeyData.length > 0) {
                        var id_field = node.schemaElement.refCol;
                        var name_field = node.schemaElement.refColTitle || "name";
                        if (node.value) {
                            if (resources.hasMoreRecords) {
                                for (var i = 0; i < foreignKeyData.length; i++) {
                                    if (foreignKeyData[i][id_field] === node.value) {
                                        jsonform.elementTypes.select.setOptions(node, [ {
                                            id: foreignKeyData[i][id_field],
                                            title: foreignKeyData[i][name_field]
                                        } ]);
                                        jsonform.elementTypes.select.setValue(node, node.value);
                                        break;
                                    }
                                }
                            } else {
                                jsonform.elementTypes.select.setOptions(node, foreignKeyData.map(function(fkeyData) {
                                    return {
                                        id: fkeyData[id_field],
                                        title: fkeyData[name_field]
                                    };
                                }));
                                jsonform.elementTypes.select.setValue(node, node.value);
                            }
                        } else {
                            var res = foreignKeyData.map(function(fkeyData) {
                                return {
                                    id: fkeyData[id_field],
                                    title: fkeyData[name_field]
                                };
                            });
                            res.unshift({
                                id: "",
                                title: "Please Select"
                            });
                            jsonform.elementTypes.select.setOptions(node, res);
                            jsonform.elementTypes.select.setValue(node, node.value);
                        }
                    } else {
                        jsonform.elementTypes.select.setOptions(node, []);
                    }
                    var hasMoreRecords = resources.hasMoreRecords;
                    if (hasMoreRecords) {
                        jsonform.elementTypes.select.setMetaData(node, hasMoreRecords, $div);
                    }
                }
                if (resources.canInsertReferencedRecord) {
                    var uniqueId = _.uniqueId();
                    var $addButton = $('<button type="button" id="' + uniqueId + '" class="btn btn-success">+</button>');
                    $addButton.click(function() {
                        $addButton.attr("disabled", "disabled");
                        var type;
                        var isNullable = false;
                        var types = _.isArray(node.schemaElement.type) ? node.schemaElement.type : [ node.schemaElement.type ];
                        for (var i = 0; i < types.length; i++) {
                            if (types[i] === "null") {
                                isNullable = true;
                            } else {
                                type = types[i];
                            }
                        }
                        var isNull = node.schemaElement.type;
                        var resolvedSchema = jfUtils.resolveRefs(node.ownerTree.formDesc.schema, node.schemaElement.filterSchema, true);
                        var event = new CustomEvent("jf_addFKey", {
                            detail: {
                                ref_col: node.schemaElement.refCol,
                                ref_table: node.schemaElement.refTable,
                                ref_col_title: node.schemaElement.refColTitle,
                                form_id: node.ownerTree.formDesc.form.$formIdCode,
                                schema_id: node.ownerTree.formDesc.schema.id,
                                field_schema: node.schemaElement,
                                field_type: type,
                                is_nullable: isNullable,
                                foreign_form_id: node.formElement.filterForm,
                                form_name: node.formElement.filterForm,
                                sp: node.ownerTree.formDesc.sp,
                                nodeId: uniqueId,
                                selectNode: node
                            }
                        });
                        node.ownerTree.domRoot.dispatchEvent(event);
                    });
                    $div.append($addButton);
                }
                $div.append($select);
                $div.append($input);
                $div.append($button);
                $el.append($div);
            },
            onBeforeRender: function(evt, node) {
                if (node.formElement.titleMap) {
                    _.each(node.options, function(key) {
                        if (node.formElement.titleMap[key.value]) {
                            key.title = node.formElement.titleMap[key.value];
                        }
                    });
                }
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("select").prop("disabled", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("select").removeProp("disabled");
            },
            getFieldValue: function(node) {
                var select = $(node).find("select:not([filterTreeSelect])");
                if (select.length === 0) {
                    select = $(node).find("select");
                }
                return {
                    name: select[0].getAttribute("name"),
                    value: select.val()
                };
            }
        },
        selectize: {
            template: "" + '<select name="<%= node.name %>" ' + ' <%= (node.schemaElement && (node.schemaElement.type === "array" || Array.isArray(node.schemaElement.type) && node.schemaElement.type.indexOf("array") !== -1 ) ? "multiple=\'multiple\'" : "") %>' + ' id="<%= id %>"' + ' <%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' + ' <%= (node.disabled? " disabled" : "")%>' + "> " + " <% _.each(node.options, function(key, val) { %>" + '   <option <%= (value === key.value || (value.indexOf(key.value) >= 0)) ? "selected" : "" %> value="<%= key.value === null ? \'\' : escape(key.value) %>">' + "       <%= key.title %>" + "   </option>" + " <% }) %>" + "</select>",
            compatibleTypes: [ "string", "number", "integer", "boolean" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            requiresEnum: true,
            inputfield: true,
            isSearchableField: true,
            isTbTemplate: false,
            onInsert: function(evt, node) {
                var options = {};
                if (node.formElement.pluginOptions) {
                    options = node.formElement.pluginOptions;
                }
                $("#" + node.id).selectize(options);
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("select")[0].selectize.disable();
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("select")[0].selectize.enable();
            },
            getFieldValue: function(node) {
                var select = $(node).find("select:not([filterTreeSelect])");
                return {
                    name: select[0].getAttribute("name"),
                    value: select.val()
                };
            }
        },
        selecttemplate: {
            template: "" + '<select name="<%= node.name %>" ' + ' <%= (node.schemaElement && (node.schemaElement.type === "array" || Array.isArray(node.schemaElement.type) && node.schemaElement.type.indexOf("array") !== -1 ) ? "multiple=\'multiple\'" : "") %>' + ' id="<%= id %>"' + ' <%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' + ' <%= (node.disabled? " disabled" : "")%>' + ' <%= (node.readOnly? " readonly" : "")%>' + ' <%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>' + "> " + "</select>",
            compatibleTypes: [ "string", "number", "integer", "object" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            requiresEnum: true,
            isSearchableField: true,
            isTbTemplate: false,
            setValueFromRecord: function(node, record) {
                var element = $("#" + node.id)[0];
                var valueField = element.selectize.settings.valueField;
                element.selectize.setValue(record[valueField], false);
            },
            addOptionFromRecord: function(node, record) {
                var element = $("#" + node.id)[0];
                element.selectize.addOption(record);
                element.selectize.refreshOptions();
            },
            setOptions: function(node, options, inSearch, pluginOptions) {
                pluginOptions.options = options;
                pluginOptions.render = {
                    option: function(data, escape) {
                        return tbTemplate.render(pluginOptions.optionTemplate, data);
                    },
                    item: function(data, escape) {
                        if (pluginOptions.itemTemplate) {
                            return tbTemplate.render(pluginOptions.itemTemplate, data);
                        } else {
                            return tbTemplate.render(pluginOptions.optionTemplate, data);
                        }
                    }
                };
                if (!pluginOptions.searchField) {
                    pluginOptions.searchField = [ pluginOptions.valueField ];
                    if (node.schemaElement.enumTemplate) {
                        _.each(_.keys(pluginOptions.options[0]), function(value) {
                            pluginOptions.searchField.push(value);
                        });
                    }
                }
                var element = $("#" + node.id)[0];
                var clearedOptions = options.map(function(option) {
                    return option.data;
                });
                element.selectize.clearOptions();
                element.selectize.addOption(clearedOptions);
                element.selectize.refreshOptions();
            },
            onBeforeRender: function(data, node) {
                ASSERT(tbTemplate, {
                    msg: "TB.Template not loaded",
                    code: 2720
                });
                ASSERT.isPlainObject(node.formElement.pluginOptions, {
                    msg: "selecttemplate: no pluginOptions object.",
                    code: 2730
                });
                ASSERT.isString(node.formElement.pluginOptions.valueField, {
                    msg: "selecttemplate: no valueField speciefied.",
                    code: 2740
                });
                var pluginOptions = node.formElement.pluginOptions;
                if (isForeignKeyField(node.schemaElement)) {
                    var resources = node.ownerTree.formDesc.resources;
                    ASSERT_USER(resources, {
                        msg: "Foreign key: I did not find my resources! Resources: $resource$; Key: $key$",
                        msgParams: {
                            resources: node.ownerTree.formDesc.resources,
                            key: node.name
                        },
                        code: 2725
                    });
                    ASSERT(resources, {
                        code: 2750,
                        msg: "Resources were not in the top level of the form descriptor. Please include it!"
                    });
                    ASSERT(node.formElement.refTable, {
                        code: 2752,
                        msg: "No Reftable defined on the formelement, and we use it for the resources. formElement: $formelement$",
                        msgParams: {
                            formelement: node.formElement
                        }
                    });
                    ASSERT(resources[node.formElement.refTable], {
                        code: 2754,
                        msg: "No resources given for the ref field! node: $node$",
                        msgParams: {
                            node: node
                        }
                    });
                    var resourcesForField = resources[node.schemaElement.refTable];
                    node.ownerTree.formDesc.form.templateData = node.ownerTree.formDesc.form.templateData || {};
                    node.ownerTree.formDesc.form.templateData[node.formElement.key] = resourcesForField.records;
                }
                if (node.ownerTree.formDesc.form.templateData && node.ownerTree.formDesc.form.templateData[node.formElement.key]) {
                    pluginOptions.options = node.ownerTree.formDesc.form.templateData[node.formElement.key];
                    pluginOptions.render = {
                        option: function(data, escape) {
                            return tbTemplate.render(pluginOptions.optionTemplate, data);
                        },
                        item: function(data, escape) {
                            if (pluginOptions.itemTemplate) {
                                return tbTemplate.render(pluginOptions.itemTemplate, data);
                            } else {
                                return tbTemplate.render(pluginOptions.optionTemplate, data);
                            }
                        }
                    };
                }
                if (!pluginOptions.searchField) {
                    pluginOptions.searchField = [ pluginOptions.valueField ];
                    if (node.schemaElement.enumTemplate) {
                        _.each(_.keys(pluginOptions.options[0]), function(value) {
                            pluginOptions.searchField.push(value);
                        });
                    }
                }
                node.formElement.pluginOptions.load = function(query, callback) {
                    function updateOptions(options) {
                        ASSERT.isArray(options, {
                            msg: "selecttemplate: the callback expected an array of options",
                            code: 2760
                        });
                        _.each(options, function(value, index) {
                            var valueField = value[node.formElement.pluginOptions.valueField];
                            jsonform.util.validateValueType(node.key, node.schemaElement, node.formElement, node.ownerTree.formDesc.form.deprecatedValue, valueField, true, node.ownerTree.formDesc);
                            node.schemaElement.enumTemplate.push(valueField);
                        });
                        callback(options);
                    }
                    if (query.length) {
                        $(node.el).trigger("search", {
                            node: node,
                            callback: updateOptions
                        });
                    }
                };
            },
            onInsert: function(evt, node) {
                var element = $("#" + node.id);
                element.selectize(node.formElement.pluginOptions);
                if (node.readOnly) {
                    element[0].selectize.disable();
                }
                if (node.value && !isForeignKeyField(node.schemaElement)) {
                    var isValidValue = false;
                    _.each(node.schemaElement.enum, function(value) {
                        if (value === node.value) {
                            isValidValue = true;
                        }
                    });
                    ASSERT(isValidValue === true, {
                        msg: "selecttemplate: The value does not appear in the schema enum.",
                        code: 2770
                    });
                }
                if (!isForeignKeyField(node.schemaElement)) {
                    return;
                }
                if (node.value !== undefined) {
                    element[0].selectize.addItem(node.value);
                }
                var resources = node.ownerTree.formDesc.resources[node.schemaElement.refTable];
                ASSERT_USER(resources, {
                    msg: "Foreign key: I did not find my resources! Resources: $resource$; Key: $key$",
                    msgParams: {
                        resources: node.ownerTree.formDesc.resources,
                        key: node.name
                    },
                    code: 2725
                });
                var setFilterState = function setFilterState(node) {
                    node.filterOptionCurrent = {
                        select: $select.val(),
                        value: $input.val()
                    };
                };
                var $el = $(node.el);
                var $div = $('<div class="momo"></div>');
                if (resources.hasMoreRecords) {
                    var $select = $("<select></select>");
                    $select.change(function() {
                        setFilterState(node);
                    });
                    var arr = node.filterOptions || [];
                    for (var i = 0; i < arr.length; i++) {
                        var obj = arr[i];
                        var itemName = obj.title;
                        var itemValue = obj.id;
                        var itemType = _.isArray(obj.type) ? obj.type.map(function(el) {
                            if (el !== "null") {
                                return el;
                            }
                        })[0] : obj.type;
                        var $item = $('<option data-selected-type="' + itemType + '"  value="' + itemValue + '">' + itemName + "</option>");
                        $select.append($item);
                    }
                    var $input = $('<input type="text" />');
                    $input.change(function() {
                        setFilterState(node);
                    });
                    var uniqueIdSearchButton = _.uniqueId();
                    var $button = $('<button type="button" id="' + uniqueIdSearchButton + '">X</button>');
                    $button.click(function(e) {
                        $button.attr("disabled", "disabled");
                        var filters = [];
                        filters.push({
                            field_value: $input.val(),
                            field_name: $select.val(),
                            type: $select.find(":selected").attr("data-selected-type")
                        });
                        var type;
                        var isNullable = false;
                        var types = _.isArray(node.schemaElement.type) ? node.schemaElement.type : [ node.schemaElement.type ];
                        for (var i = 0; i < types.length; i++) {
                            if (types[i] === "null") {
                                isNullable = true;
                            } else {
                                type = types[i];
                            }
                        }
                        var isNull = node.schemaElement.type;
                        var resolvedSchema = jfUtils.resolveRefs(node.ownerTree.formDesc.schema, node.schemaElement.filterSchema, true);
                        var event = new CustomEvent("jf_specialSearch", {
                            detail: {
                                filters: filters,
                                ref_col: node.schemaElement.refCol,
                                ref_table: node.schemaElement.refTable,
                                ref_col_title: node.schemaElement.refColTitle,
                                form_id: node.ownerTree.formDesc.form.$formIdCode,
                                schema_id: node.ownerTree.formDesc.schema.id,
                                field_schema: node.schemaElement,
                                field_type: type,
                                is_nullable: isNullable,
                                sp: node.ownerTree.formDesc.sp,
                                nodeId: uniqueIdSearchButton,
                                cb: function(responce, err) {
                                    if (err) {
                                        TRACE(err);
                                        throw err;
                                        return;
                                    }
                                    var result = responce.result;
                                    if (result) {
                                        node.currentOptions = result.data;
                                        jsonform.elementTypes.selecttemplate.setOptions(node, result.data, true, node.formElement.pluginOptions);
                                        jsonform.elementTypes.select.setMetaData(node, result.hasMoreFkeyRecords, $div);
                                    }
                                }
                            }
                        });
                        node.ownerTree.domRoot.dispatchEvent(event);
                    });
                }
                if (node.filterOptionCurrent) {
                    $select.val(node.filterOptionCurrent.select);
                    $input.val(node.filterOptionCurrent.value);
                    jsonform.elementTypes.select.setOptions(node, node.currentOptions);
                    jsonform.elementTypes.select.setValue(node, node.value);
                } else if (!node.schemaElement.enum) {
                    var currKey = node.formElement.key;
                    var foreignKeyData = resources.records || [];
                    if (foreignKeyData.length > 0) {
                        var id_field = node.schemaElement.refCol;
                        var name_field = node.schemaElement.refColTitle || "name";
                        if (node.value) {
                            if (resources.hasMoreRecords) {
                                for (var i = 0; i < foreignKeyData.length; i++) {
                                    if (foreignKeyData[i][id_field] === node.value) {
                                        jsonform.elementTypes.select.setOptions(node, [ {
                                            id: foreignKeyData[i][id_field],
                                            title: foreignKeyData[i][name_field]
                                        } ]);
                                        jsonform.elementTypes.select.setValue(node, node.value);
                                        break;
                                    }
                                }
                            } else {
                                jsonform.elementTypes.select.setOptions(node, foreignKeyData.map(function(fkeyData) {
                                    return {
                                        id: fkeyData[id_field],
                                        title: fkeyData[name_field]
                                    };
                                }));
                                jsonform.elementTypes.select.setValue(node, node.value);
                            }
                        } else {
                            var res = foreignKeyData.map(function(fkeyData) {
                                return {
                                    id: fkeyData[id_field],
                                    title: fkeyData[name_field]
                                };
                            });
                            res.unshift({
                                id: "",
                                title: "Please Select"
                            });
                            jsonform.elementTypes.select.setOptions(node, res);
                            jsonform.elementTypes.select.setValue(node, node.value);
                        }
                    } else {
                        jsonform.elementTypes.select.setOptions(node, []);
                    }
                    var hasMoreRecords = resources.hasMoreRecords;
                    if (hasMoreRecords) {
                        jsonform.elementTypes.select.setMetaData(node, hasMoreRecords, $div);
                    }
                }
                if (resources.canInsertReferencedRecord) {
                    var uniqueId = _.uniqueId();
                    var $addButton = $('<button type="button" id="' + uniqueId + '" class="btn btn-success">+</button>');
                    $addButton.click(function() {
                        $addButton.attr("disabled", "disabled");
                        var type;
                        var isNullable = false;
                        var types = _.isArray(node.schemaElement.type) ? node.schemaElement.type : [ node.schemaElement.type ];
                        for (var i = 0; i < types.length; i++) {
                            if (types[i] === "null") {
                                isNullable = true;
                            } else {
                                type = types[i];
                            }
                        }
                        var isNull = node.schemaElement.type;
                        var resolvedSchema = jfUtils.resolveRefs(node.ownerTree.formDesc.schema, node.schemaElement.filterSchema, true);
                        var event = new CustomEvent("jf_addFKey", {
                            detail: {
                                ref_col: node.schemaElement.refCol,
                                ref_table: node.schemaElement.refTable,
                                ref_col_title: node.schemaElement.refColTitle,
                                form_id: node.ownerTree.formDesc.form.$formIdCode,
                                schema_id: node.ownerTree.formDesc.schema.id,
                                field_schema: node.schemaElement,
                                field_type: type,
                                is_nullable: isNullable,
                                foreign_form_id: node.formElement.filterForm || "JF::TBLIB::TEST_TABLE2000",
                                form_name: node.formElement.filterForm || "JF::TBLIB::TEST_TABLE2000",
                                sp: node.ownerTree.formDesc.sp,
                                nodeId: uniqueId,
                                selectNode: node
                            }
                        });
                        node.ownerTree.domRoot.dispatchEvent(event);
                    });
                    $div.append($addButton);
                }
                $div.append($select);
                $div.append($input);
                $div.append($button);
                $el.append($div);
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("select.selectized")[0].selectize.disable();
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("select.selectized")[0].selectize.enable();
            },
            getFieldValue: function(node) {
                var select = $(node).find("select:not([filterTreeSelect])");
                return {
                    name: select[0].getAttribute("name"),
                    value: select.val()
                };
            }
        },
        nativemultipleselect: {
            template: '<select name="<%= node.name %>" <%= (node.schemaElement && (node.schemaElement.type === "array" || Array.isArray(node.schemaElement.type) && node.schemaElement.type.indexOf("array") !== -1 ) ? "multiple=\'multiple\'" : "") %> id="<%= id %>"' + '<%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' + '<%= (node.disabled || node.readOnly? " disabled" : "")%>' + "> " + "<% _.each(node.options, function(key, val) { if(key instanceof Object) { if (node.value && node.value.indexOf(key.value) >= 0) { %>" + "<option selected value=\"<%= key.value === null ? '' : escape(key.value) %>\"><%= key.title %></option>" + " <% } else { %> " + "<option value=\"<%= key.value === null ? '' : key.value %>\"><%= key.title %></option>" + " <% }} else { if (value === key) { %>" + "<option selected value=\"<%= key === null ? '' : key %>\"><%= key %></option> " + " <% } else { %>" + "<option value=\"<%= key === null ? '' : key %>\"><%= key %></option> " + "<% }}  }); %> " + "</select>",
            compatibleTypes: [ "array" ],
            compatibleItemTypes: [ "string", "number", "integer", "boolean" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            isSearchableField: true,
            requiresEnum: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                node.options = [];
                _.each(node.schemaElement.items.enum, function(key, val) {
                    node.options.push({
                        title: key,
                        value: key
                    });
                });
                if (node.formElement.titleMap) {
                    _.each(node.options, function(key) {
                        if (node.formElement.titleMap[key.value]) {
                            key.title = node.formElement.titleMap[key.value];
                        }
                    });
                }
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("select").prop("disabled", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("select").removeProp("disabled");
            },
            getFieldValue: function(node) {
                var select = $(node).find("select");
                return {
                    name: select[0].getAttribute("name"),
                    value: select.val()
                };
            }
        },
        multipleselect: {
            template: '<select name="<%= node.name %>" <%= (node.schemaElement && (node.schemaElement.type === "array" || Array.isArray(node.schemaElement.type) && node.schemaElement.type.indexOf("array") !== -1 ) ? "multiple=\'multiple\'" : "") %> id="<%= id %>"' + '<%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' + '<%= (node.disabled || node.readOnly? " disabled" : "")%>' + "> " + "<% _.each(node.options, function(key, val) { " + "if (key instanceof Object) { " + "if (node.value && node.value.indexOf(key.value) >= 0) { %>" + "<option selected value=\"<%= key.value === null ? '' : escape(key.value) %>\"><%= key.title %></option> " + "<% } else { %>" + " <option value=\"<%= key.value === null ? '' : escape(key.value) %>\"><%= key.title %></option> " + "<% }} else { if (value === key) { %>" + " <option selected value=\"<%= key === null ? '' : escape(key) %>\"><%= key %></option> " + "<% } else { %> " + "<option value=\"<%= key === null ? '' : escape(key) %>\"><%= key %></option> " + "<% }} }); %> " + "</select>",
            compatibleTypes: [ "array" ],
            compatibleItemTypes: [ "string", "number", "integer", "boolean" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            requiresEnum: true,
            inputfield: true,
            isSearchableField: true,
            isTbTemplate: false,
            appendNull: false,
            onBeforeRender: function(data, node) {
                if (node.formElement.titleMap) {
                    _.each(node.options, function(key) {
                        if (node.formElement.titleMap[key.value]) {
                            key.title = node.formElement.titleMap[key.value];
                        }
                    });
                }
            },
            onInsert: function(evt, node) {
                var defaultOptions = {
                    sortable: false,
                    animate: true,
                    readOnly: node.readOnly ? true : false
                };
                var options = _.extend(defaultOptions, node.formElement.multipleselectOptions);
                $("#" + node.id).orderedSelect(options);
            },
            getFieldValue: function(node) {
                var select = $(node).find("select");
                return {
                    name: select[0].getAttribute("name"),
                    value: select.val()
                };
            }
        },
        orderedselect: {
            template: '<select name="<%= node.name %>" <%= (node.schemaElement && (node.schemaElement.type === "array" || Array.isArray(node.schemaElement.type) && node.schemaElement.type.indexOf("array") !== -1 ) ? "multiple=\'multiple\'" : "") %> id="<%= id %>"' + '<%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' + '<%= (node.disabled || node.readOnly? " disabled" : "")%>' + "> " + "<%= node.options_string %>" + "</select>",
            compatibleTypes: [ "array" ],
            compatibleItemTypes: [ "string", "number", "integer", "boolean", "numeric" ],
            compatibleFormats: [],
            minRowWidth: "half",
            maxRowWidth: "full",
            fieldtemplate: true,
            requiresEnum: true,
            inputfield: true,
            isSearchableField: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                if (node.formElement.titleMap) {
                    _.each(node.options, function(key) {
                        if (node.formElement.titleMap[key.value]) {
                            key.title = node.formElement.titleMap[key.value];
                        }
                    });
                }
                if (node.value) {
                    if (_.isArray(node.value)) {
                        var pushVals = _.cloneDeep(node.value);
                        _.each(node.options, function(option, key) {
                            var idx = pushVals.indexOf(option.value);
                            if (idx > -1) {
                                pushVals.splice(idx, 1);
                            }
                        });
                        var deprecated = node.ownerTree.formDesc.form.deprecatedValue;
                        pushVals = pushVals.map(function(value) {
                            return {
                                title: deprecated + " " + String(value) + " " + deprecated,
                                value: value
                            };
                        });
                        node.options = pushVals.concat(node.options);
                    } else {
                        var append = true;
                        _.each(node.options, function(val, key) {
                            if (node.value === val.value) {
                                append = false;
                                return false;
                            }
                        });
                        if (append) {
                            node.options.push({
                                title: node.deprecatedValues + " " + String(node.value) + " " + node.deprecatedValue,
                                value: node.value
                            });
                        }
                    }
                }
                node.options_string = "";
                _.each(node.options, function(key, val) {
                    if (_.isPlainObject(key)) {
                        var currValue = key.value === null ? "" : escape(key.value);
                        var selected = node.value && node.value.indexOf(key.value) >= 0 ? "selected" : "";
                        node.options_string += "<option " + selected + ' value = "' + currValue + '">' + key.title + "";
                    }
                });
            },
            onInsert: function(evt, node) {
                var defaultOptions = {
                    animate: true,
                    readOnly: node.formElement.readOnly ? true : false,
                    noOrder: node.formElement.noOrder ? true : false
                };
                var options = _.extend(defaultOptions, node.formElement.multipleselectOptions);
                $("#" + node.id).orderedSelect(options, node.value);
            },
            getFieldValue: function(node) {
                var select = $(node).find("select");
                return {
                    name: select[0].getAttribute("name"),
                    value: select.val()
                };
            }
        },
        tags: {
            template: "" + '<select name="<%= node.name %>" multiple="multiple"' + ' id="<%= id %>"' + ' <%= (fieldHtmlClass ? " class=\'" + fieldHtmlClass + "\'" : "") %>' + ' <%= (node.disabled? " disabled" : "")%>' + "> " + " <% _.each(node.options, function(key, val) { %>" + '   <option <%= (value === key.value || (value.indexOf(key.value) >= 0)) ? "selected" : "" %> value="<%= key.value === null ? \'\' : escape(key.value) %>">' + "       <%= key.title %>" + "   </option>" + " <% }) %>" + "</select>" + '<input type="text" id="<%=\'tags-\' + id %>" />',
            compatibleTypes: [ "array" ],
            compatibleItemTypes: [ "string", "number", "integer", "boolean" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            acceptsEnum: true,
            inputfield: true,
            isSearchableField: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                if (node.value) {
                    node.schemaElement.items.enum = node.value;
                }
            },
            onInsert: function(evt, node) {
                var options = [];
                var selectedOptions = node.value || [];
                var selectizeOptions = node.formElement.selectizeoptions || {};
                var initialInput = "";
                var textInput = $("#tags-" + node.id);
                var selectInput = $("#" + node.id);
                var delimiterRegEx = "";
                var arrayDelimiterRegEx = "";
                var isDelimiterArray = selectizeOptions.delimiters && selectizeOptions.delimiters.constructor === Array;
                node.schemaElement.getValue = "tagsinput";
                selectInput.hide();
                _.each(selectInput.find("option"), function(option) {
                    options.push(option.value);
                });
                $.extend(selectizeOptions, {
                    plugins: [ "drag_drop", "remove_button" ],
                    persist: false,
                    create: true,
                    loadThrottle: null,
                    onType: function(input) {
                        if (isDelimiterArray) {
                            if (selectizeOptions.delimiters && selectizeOptions.delimiters.indexOf(input.slice(-1)) >= 0) {
                                this.createItem(input.slice(0, -1));
                            }
                        }
                    },
                    onChange: function(value) {
                        var optionsString = "";
                        var tags = textInput[0].value.split(selectizeOptions.delimiter);
                        var i, j;
                        if (isDelimiterArray && value.match(arrayDelimiterRegEx)) {
                            var arrayDelimiterTags = textInput[0].value.split(delimiterRegEx);
                            if (arrayDelimiterTags.length !== tags.length) {
                                textInput[0].value = arrayDelimiterTags.join(selectizeOptions.delimiter);
                                textInput[0].defaultValue = arrayDelimiterTags.join(selectizeOptions.delimiter);
                                tags = arrayDelimiterTags;
                                this.clear();
                                for (i = 0; i < tags.length; i++) {
                                    this.createItem(tags[i]);
                                }
                            }
                        }
                        for (i = 0, j = tags.length - 1; i <= j; i++) {
                            optionsString += "" + '<option value="' + _.escape(tags[i]) + '" selected="selected">' + _.escape(tags[i]) + "</option>";
                        }
                        selectInput.find("option").remove().end().append(optionsString);
                        node.schemaElement.items.enum = tags;
                        $(node.el).trigger("change");
                    }
                });
                if (!selectizeOptions.delimiter) {
                    if (isDelimiterArray) {
                        selectizeOptions.delimiter = selectizeOptions.delimiters[0];
                    } else {
                        selectizeOptions.delimiter = ",";
                    }
                }
                if (isDelimiterArray) {
                    delimiterRegEx = "[" + selectizeOptions.delimiter;
                    arrayDelimiterRegEx = "[";
                    for (var i = 0; i < selectizeOptions.delimiters.length; i++) {
                        if (selectizeOptions.delimiters[i] !== selectizeOptions.delimiter) {
                            if (i !== 0) {
                                arrayDelimiterRegEx += "|";
                            }
                            arrayDelimiterRegEx += _.escapeRegExp(selectizeOptions.delimiters[i]);
                            delimiterRegEx += "|";
                            delimiterRegEx += _.escapeRegExp(selectizeOptions.delimiters[i]);
                        }
                    }
                    delimiterRegEx += "]";
                    arrayDelimiterRegEx += "]";
                    delimiterRegEx = RegExp(delimiterRegEx, "g");
                    arrayDelimiterRegEx = RegExp(arrayDelimiterRegEx, "g");
                }
                initialInput = selectedOptions[0];
                for (i = 1; i < selectedOptions.length; i++) {
                    initialInput += selectizeOptions.delimiter + selectedOptions[i];
                }
                textInput[0].value = _.isString(initialInput) ? initialInput : "";
                textInput.selectize(selectizeOptions);
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input")[0].selectize.disable();
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input")[0].selectize.enable();
            },
            getFieldValue: function(node) {
                var select = $(node).find("select");
                return {
                    name: select[0].getAttribute("name"),
                    value: select.val()
                };
            }
        },
        datepicker: {
            template: datePickerTemplate,
            compatibleTypes: [ "string" ],
            compatibleFormats: [ "iso8601-date" ],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                ASSERT(moment, {
                    msg: "Moment.js not loaded",
                    code: 2780
                });
                ASSERT($.fn.hasOwnProperty("datetimepicker"), {
                    msg: "datetimepicker $ plugin not loaded",
                    code: 2790
                });
                ASSERT(jfUtils.contains(node.schemaElement.type, "string"), {
                    msg: "Invalid schema type",
                    code: 2800
                });
                if (node.required) {}
            },
            onInsert: function(evt, node) {
                var selector = "#" + node.id;
                var $selector = $(selector);
                node.formElement.pluginoptions = node.formElement.pluginoptions || {};
                node.formElement.pluginoptions.maxDate = node.formElement.pluginoptions.maxDate || node.formElement.maxDate;
                node.formElement.pluginoptions.minDate = node.formElement.pluginoptions.minDate || node.formElement.minDate;
                if (!node.formElement.pluginoptions.format) {
                    node.formElement.pluginoptions.format = "YYYY-MM-DD";
                }
                node.formElement.pluginoptions.useCurrent = false;
                $selector.one("click", function() {
                    var value = getDefaultTimeValue(node);
                    if (value) {
                        var valueUnixTime = new Date(value);
                        var minDateUnixTime = new Date(node.formElement.pluginoptions.minDate);
                        var maxDateUnixTime = new Date(node.formElement.pluginoptions.maxDate);
                        ASSERT(valueUnixTime <= maxDateUnixTime, {
                            code: 2810,
                            msg: "value `$date$` higher than maximum allowed date `$maxdate$`",
                            msgParams: {
                                date: valueUnixTime,
                                maxdate: maxDateUnixTime
                            }
                        });
                        ASSERT(valueUnixTime >= minDateUnixTime, {
                            msg: "value lower than minimum allowed date",
                            code: 2820
                        });
                        node.formElement.pluginoptions.defaultDate = value;
                    }
                    $(selector.toString()).datetimepicker(node.formElement.pluginoptions);
                    $(selector).on("dp.change", function() {
                        $(selector).trigger("change");
                        $(selector).trigger("jfValChange");
                    });
                });
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("readonly", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").prop("readonly", false);
            }
        },
        datetimepicker: {
            template: datePickerTemplate,
            compatibleTypes: [ "string" ],
            compatibleFormats: [ "iso8601-date" ],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                ASSERT(moment, {
                    msg: "Moment.js not loaded",
                    code: 2830
                });
                ASSERT($.fn.hasOwnProperty("datetimepicker"), {
                    msg: "datetimepicker $ plugin not loaded",
                    code: 2840
                });
                ASSERT(jfUtils.contains(node.schemaElement.type, "string"), {
                    msg: "invalid schema type",
                    code: 2850
                });
                if (node.required) {}
            },
            onInsert: function(evt, node) {
                var selector = "#" + node.id;
                var $selector = $(selector);
                node.formElement.pluginoptions = node.formElement.pluginoptions || {};
                node.formElement.pluginoptions.maxDate = node.formElement.pluginoptions.maxDate || node.formElement.maxDate;
                node.formElement.pluginoptions.minDate = node.formElement.pluginoptions.minDate || node.formElement.minDate;
                if (!node.formElement.pluginoptions.format) {
                    node.formElement.pluginoptions.format = "YYYY-MM-DD HH:mm:ss";
                }
                node.formElement.pluginoptions.useCurrent = false;
                $selector.one("click", function() {
                    var value = getDefaultTimeValue(node);
                    if (value) {
                        var valueUnixTime = new Date(value);
                        var minDateUnixTime = new Date(node.formElement.pluginoptions.minDate);
                        var maxDateUnixTime = new Date(node.formElement.pluginoptions.maxDate);
                        ASSERT(valueUnixTime <= maxDateUnixTime, {
                            msg: "value higher than maximum allowed date",
                            code: 2860
                        });
                        ASSERT(valueUnixTime >= minDateUnixTime, {
                            msg: "value lower than minimum allowed date",
                            code: 2870
                        });
                        node.formElement.pluginoptions.defaultDate = value;
                    }
                    $(selector.toString()).datetimepicker(node.formElement.pluginoptions);
                });
                $(selector).on("dp.change", function() {
                    $(selector).trigger("change");
                    $(selector).trigger("jfValChange");
                });
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("readonly", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").prop("readonly", false);
            }
        },
        timepicker: {
            template: datePickerTemplate,
            compatibleTypes: [ "string" ],
            compatibleFormats: [ "iso8601time" ],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                ASSERT(moment, {
                    msg: "Moment.js not loaded",
                    code: 2880
                });
                ASSERT($.fn.hasOwnProperty("datetimepicker"), {
                    msg: "datetimepicker $ plugin not loaded",
                    code: 2890
                });
                ASSERT(jfUtils.contains(node.schemaElement.type, "string"), {
                    msg: "invalid schema type",
                    code: 2900
                });
                if (node.required) {}
            },
            onInsert: function(evt, node) {
                var selector = "#" + node.id;
                node.formElement.pluginoptions = node.formElement.pluginoptions || {};
                if (!node.formElement.pluginoptions.format) {
                    node.formElement.pluginoptions.format = "HH:mm:ss";
                }
                node.formElement.pluginoptions.useCurrent = false;
                var value = getDefaultTimeValue(node);
                var timePicker = $(selector.toString()).datetimepicker(node.formElement.pluginoptions);
                if (value) {
                    timePicker.val(value);
                }
                $(selector).on("dp.change", function() {
                    $(selector).trigger("change");
                    $(selector).trigger("jfValChange");
                });
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("readonly", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").prop("readonly", false);
            }
        },
        radios: {
            template: "" + '<div id="<%= node.id %>"><% _.each(node.options, function(key, val) { %>' + '<% if (!elt.inline) { %><div class="radio "><label><% } else { %>' + '<label class="radio<%= cls.inlineClassSuffix %>"><% } %>' + '<input type="radio" <% if (((key instanceof Object) && (node.value === key.value)) || (node.value === key)) { %> checked="checked" <% } %> name="<%= node.name %>" value="<%= (key instanceof Object ? key.value : key) %>"' + '<%= (node.disabled? " disabled" : "")%>' + '/><span><%= (key instanceof Object ? key.title : key) %></span></label><%= elt.inline ? "" : "</div>" %> <% }); %></div>',
            compatibleTypes: [ "array", "string", "number", "integer", "boolean" ],
            compatibleItemTypes: [ "string", "number", "integer", "boolean" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            fieldtemplate: true,
            requiresEnum: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(evt, node) {
                if (node.formElement.titleMap) {
                    _.each(node.options, function(key) {
                        if (node.formElement.titleMap[key.value]) {
                            key.title = node.formElement.titleMap[key.value];
                        }
                    });
                }
            },
            onInsert: function(evt, node) {
                node.initializeEventHandlers = function() {
                    if (node.formElement.toggleNextMap) {
                        var valueMapToNext = {};
                        for (var value in node.formElement.toggleNextMap) {
                            var toggleNext = node.formElement.toggleNextMap[value];
                            var nextN = toggleNext === true ? 1 : toggleNext;
                            var toggleNextClass = "tb-jf-toggle-next tb-jf-toggle-next-" + nextN;
                            var $next = nextN === 1 ? $(node.el).next() : nextN === "all" ? $(node.el).nextAll() : $(node.el).nextAll().slice(0, nextN);
                            $next.addClass("tb-jf-toggle-next-target");
                            valueMapToNext[value] = $next;
                        }
                        $(node.el).addClass(toggleNextClass).find(":radio").on("change", function() {
                            var $this = $(this);
                            var val = $this.val();
                            var checked = $this.is(":checked");
                            var v, $n;
                            if (checked) {
                                for (v in valueMapToNext) {
                                    $n = valueMapToNext[v];
                                    if (v === val) {
                                        $n.toggle(checked).toggleClass("tb-jf-visible", checked);
                                    } else {
                                        $n.toggle(!checked).toggleClass("tb-jf-visible", !checked);
                                    }
                                }
                            } else {
                                for (v in valueMapToNext) {
                                    $n = valueMapToNext[v];
                                    $n.toggle(false).toggleClass("tb-jf-visible", false);
                                }
                            }
                        }).change();
                    }
                };
                node.initializeEventHandlers();
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("disabled", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").removeProp("disabled");
            },
            getFieldValue: function(node) {
                var options = $(node).find(":input[type=radio]");
                var name = node.getAttribute("name");
                for (var i = 0, j = options.length; i < j; i++) {
                    if (options[i].checked) {
                        return {
                            name: name,
                            value: options[i].value
                        };
                    } else if (i === j - 1) {
                        return {
                            name: name,
                            value: null
                        };
                    }
                }
            }
        },
        radiobuttonset: {
            template: "" + '<div id="<%= node.id %>"' + ' class=" <%= elt.htmlClass ? " " + elt.htmlClass : "" %>' + ' <%= node.formElement.vertical ? "btn-group-vertical": "btn-group" %>' + ' <%= node.formElement.justified? "btn-group-justified": "btn-group" %>">' + "   <% _.each(node.options, function(key, val) {%>" + '   <label class="<%= node.formElement.buttonSize %> <%= cls.buttonClass %>">' + '     <input type="radio" id="<%= node.id %>" style="position:absolute;left:-9999px;"' + '       <%= (node.value === key.value || node.value === key) ? "checked=checked" : "" %>' + '       name="<%= node.name %>"' + '       value="<%= (key instanceof Object) ? escape(key.value) : escape(key) %>" />' + "     <span><%= (key instanceof Object ? key.title : key) %></span>" + "   </label>" + "<% }); %>" + "</div>",
            compatibleTypes: [ "array", "string", "number", "integer", "boolean", "null" ],
            compatibleItemTypes: [ "string", "number", "integer", "boolean", "null" ],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            requiresEnum: true,
            compatibleFormats: [],
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            onBeforeRender: function(evt, node) {
                if (node.schemaElement.type === "boolean") {
                    ASSERT.isBooleanOrNil(node.value, {
                        code: 2910,
                        msg: "invalid value type"
                    });
                } else if (node.schemaElement.type === "string") {
                    ASSERT.isStringOrNil(node.value, {
                        code: 2920,
                        msg: "invalid value type"
                    });
                    if (!_.isNil(node.value)) {
                        var isEnumMember = node.schemaElement.enum.indexOf(node.value) >= 0;
                        ASSERT(isEnumMember === true, {
                            code: 2930,
                            msg: "radiobuttonset: the specified value is not a valid type for this field."
                        });
                    }
                } else if (node.schemaElement.type === "number" || node.schemaElement.type === "integer") {
                    ASSERT.isNumberOrNil(node.value, {
                        code: 2940,
                        msg: "invalid value type"
                    });
                }
                if (node.formElement.titleMap) {
                    _.each(node.options, function(key) {
                        if (node.formElement.titleMap[key.value]) {
                            key.title = node.formElement.titleMap[key.value];
                        }
                    });
                }
                switch (node.formElement.buttonSize) {
                  case 1:
                    node.formElement.buttonSize = "btn-xs";
                    break;

                  case 2:
                    node.formElement.buttonSize = "btn-sm";
                    break;

                  case 4:
                    node.formElement.buttonSize = "btn-lg";
                    break;

                  default:
                    node.formElement.buttonSize = "";
                }
            },
            onInsert: function(evt, node) {
                if (node.formElement.inline) {
                    $(node.el).children(".controls").css("display", "inline");
                }
                var activeClass = "active";
                node.initializeEventHandlers = function() {
                    $(node.el).find("label.btn").on("click", function(e) {
                        var $this = $(this);
                        var checked = node.required || node.schemaElement.type === "boolean" || !$this.hasClass(activeClass);
                        if (!$this.attr("disabled")) {
                            $this.toggleClass(activeClass, checked).find(":radio").prop("checked", checked).end().parent().find("label.btn").not($this).prop("checked", false).removeClass(activeClass);
                        }
                        $(node.el).trigger("change");
                        return false;
                    }).find(":checked").closest("label").addClass(activeClass);
                };
                node.initializeEventHandlers();
            },
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find(".btn-group > label").attr("disabled", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("label").removeAttr("disabled");
            }
        },
        checkboxes: {
            template: '<div id="<%= node.id %>"><%= choiceshtml %><%= children %></div>',
            compatibleTypes: [ "array" ],
            compatibleItemTypes: [ "string", "number", "integer", "boolean" ],
            compatibleFormats: [],
            minRowWidth: "quarter",
            maxRowWidth: "full",
            requiresEnum: true,
            fieldtemplate: true,
            inputfield: true,
            isTbTemplate: false,
            childTemplate: function(inner, node) {
                if (!node.formElement.otherField) {
                    return inner;
                }
                var template = "";
                if (node.formElement.otherField.asArrayValue) {
                    if (node.otherValues) {
                        template += '<% value = node.parentNode.otherValues.join(", ") %>';
                    }
                }
                template += '<input type="checkbox"<%= value !== undefined && value !== null && value !== "" ? " checked=\'checked\'" : "" %>';
                if (!node.formElement.otherField.asArrayValue && node.formElement.otherField.novalue !== true || node.formElement.otherField.novalue === false) {
                    template += ' name="' + node.key + "[" + (node.formElement.otherField.idx !== undefined ? node.formElement.otherField.idx : node.formElement.options.length) + ']" value="' + _.escape(node.formElement.otherField.otherValue || "OTHER") + '"';
                }
                template += '<%= node.disabled? " disabled=\'disabled\'" : "" %>';
                template += '<%= node.formElement.readOnly? " disabled=\'disabled\'" : "" %> />';
                template += '<span><%= node.title || "Other" %> </span>';
                var otherFieldClass = "other-field";
                if (node.formElement.otherField.inline) {
                    template += '<div class="tb-jf-other-field-content">' + inner + "</div>";
                    otherFieldClass = "tb-jf-inline-" + otherFieldClass;
                }
                if (node.formElement.inline) {
                    template = '<label class="' + otherFieldClass + ' checkbox<%= cls.inlineClassSuffix %>">' + template + "</label>";
                } else {
                    template = '<div class="' + otherFieldClass + ' checkbox"><label>' + template + "</label></div>";
                }
                if (!node.formElement.otherField.inline) {
                    template += '<div class="tb-jf-other-field-content">' + inner + "</div>";
                }
                return template;
            },
            onBeforeRender: function(data, node) {
                if (!node || !node.schemaElement || !node.schemaElement.items) {
                    return;
                }
                var choices = node.formElement.options;
                if (!choices) {
                    return;
                }
                var template = '<input type="checkbox"<%= checked ? " checked=\'checked\'" : "" %>' + ' name="<%= name %>" value="<%= escape(value) %>"' + ' <%= node.disabled? " disabled=\'disabled\'" : "" %>' + ' <%= node.readOnly? " readonly=\'disabled\'" : "" %> />' + " <span><%= title %></span>";
                if (node.formElement.inline) {
                    template = '<label class="checkbox' + data.cls.inlineClassSuffix + '">' + template + "</label>";
                } else {
                    template = '<div class="checkbox"><label>' + template + "</label></div>";
                }
                var choiceshtml = "";
                if (node.formElement.otherField && node.formElement.otherField.asArrayValue && node.value) {
                    var choiceValues = choices.map(function(choice) {
                        return choice.value;
                    });
                    var otherValues = [];
                    node.value.forEach(function(val) {
                        if (!_.includes(choiceValues, val)) {
                            otherValues.push(val);
                        }
                    });
                    if (otherValues.length > 0) {
                        node.otherValues = otherValues;
                    }
                } else {
                    delete node.otherValues;
                }
                _.each(choices, function(choice, idx) {
                    if (node.formElement.otherField && choice.value === (node.formElement.otherField.otherValue || "OTHER")) {
                        node.formElement.otherField.idx = idx;
                        return;
                    }
                    choiceshtml += _template(template, {
                        name: node.key + "[" + idx + "]",
                        value: choice.value,
                        checked: _.includes(node.value, choice.value),
                        title: choice.title,
                        node: node,
                        escape: _.escape
                    }, fieldTemplateSettings);
                });
                if (node.formElement.otherField) {}
                data.choiceshtml = choiceshtml;
            },
            onInsert: function(evt, node) {
                function inputHasAnyValue(inputs) {
                    var anyValue = false;
                    inputs.each(function() {
                        var $input = $(this);
                        if ($input.is(":checkbox, :radio")) {
                            if ($input.prop("checked")) {
                                anyValue = true;
                                return false;
                            }
                        }
                        if ($input.is("button")) {
                            return;
                        }
                        if ($(this).val() !== "") {
                            anyValue = true;
                            return false;
                        }
                    });
                    return anyValue;
                }
                var $checkbox = node.formElement.otherField && node.formElement.otherField.inline ? $(node.el).find(".tb-jf-inline-other-field :checkbox").first() : $(node.el).find(".tb-jf-other-field :checkbox");
                var $inputs = $(node.el).find(".tb-jf-other-field-content :input");
                function otherFieldValueChange() {
                    $checkbox.prop("checked", inputHasAnyValue($inputs));
                }
                $inputs.on("keyup", otherFieldValueChange).on("change", otherFieldValueChange).change();
                $checkbox.on("change", function() {
                    if (this.checked) {
                        this.checked = false;
                        $inputs.not(":checkbox, :radio, button").focus();
                    } else {
                        $inputs.filter("input[type=text], textarea").val("");
                    }
                });
            },
            onChange: function(evt, node) {},
            lock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").hide();
                }
                $(node.el).find("input").prop("disabled", true);
            },
            unlock: function(node) {
                if (node.formElement.enableUndo || node.formElement.enableRedo || node.formElement.enableReset) {
                    $(node.el).find(".tb-jf-value-history-buttons").show();
                }
                $(node.el).find("input").removeProp("disabled");
            },
            getFieldValue: function(node) {
                var options = $(node).find(":input[type=checkbox]");
                var name = node.getAttribute("name");
                var checkboxValues = [];
                for (var i = 0, j = options.length; i < j; i++) {
                    if (options[i].checked) {
                        checkboxValues.push(options[i].getAttribute("value"));
                    }
                }
                if (checkboxValues.length === 0) {
                    checkboxValues = null;
                }
                return {
                    name: name,
                    value: checkboxValues
                };
            }
        },
        array: {
            template: "" + '<div id="<%= id %>">' + '<ul class="tb-jf-array-ul">' + "<%= children %>" + "</ul>" + "<% if (!node.isReadOnly()) { %>" + '<span class="tb-jf-array-buttons">' + "<% if (node.formElement.enableAddingItems) { %>" + '<a href="" class="<%= cls.buttonClass %> btn-group-justified tb-jf-array-addmore">' + '<i class="<%= cls.iconClassPrefix %>-plus-sign" title="Add new"></i> add new</a> ' + "<% } %>" + "</span>" + "<% } %>" + "</div>",
            compatibleItemTypes: [ "string", "number", "integer", "boolean", "numeric" ],
            compatibleTypes: [ "array" ],
            minRowWidth: "half",
            maxRowWidth: "full",
            containerField: true,
            compatibleFormats: [],
            fieldtemplate: true,
            array: true,
            isSearchableField: true,
            isArrayContainer: true,
            isTbTemplate: false,
            onBeforeRender: function(data, node) {},
            getFieldValue: function(rootNode) {
                var $rootNode = $(rootNode);
                var name = $rootNode.attr("name");
                if ($(rootNode).find("ul").children().length === 0) {
                    return {
                        name: name,
                        value: []
                    };
                }
            },
            childTemplate: function(inner, node) {
                var template = '<li class="tb-jf-array-element row" data-idx="<%= node.childPos %>" data-tb-jf-type="array-item">';
                if (!node.isReadOnly() && $("").sortable && node.formElement.enableSorting) {
                    template += ' <span class="tb-jf-array-button-group draggable line tb-jf-draggable">';
                } else if (!node.isReadOnly() && node.formElement.enableSorting) {
                    template += ' <span class="tb-jf-array-button-group">';
                }
                if (!node.isReadOnly() && node.formElement.enableSorting) {
                    template += ' <a class="<%= cls.buttonClass %> tb-jf-array-item-move-up btn-sm"><i class="<%= cls.iconClassPrefix %>-circle-arrow-up" title="Move item up"></i>' + "</a>" + ' <a class="<%= cls.buttonClass %> tb-jf-array-item-move-down btn-sm"><i class="<%= cls.iconClassPrefix %>-circle-arrow-down" title="Move item down"></i>' + "</a>" + " </span>";
                }
                if (!node.isReadOnly() && node.formElement.enableDeletingItems) {
                    template += ' <a href="#" class="<%= cls.buttonClass %> tb-jf-array-item-delete btn-xs btn-danger"><i class="<%= cls.iconClassPrefix %>-remove" title="Remove item"></i>' + "</a>";
                }
                template += inner + "</li>";
                return template;
            },
            onInsert: function(evt, node) {
                var $nodeid = $(node.el).find("#" + escapeSelector(node.id));
                var arrayLimits = node.getArrayLimits();
                var moveNodeTo = function(fromIdx, toIdx) {
                    if (fromIdx === toIdx || node.formElement.enableSorting !== true) {
                        return;
                    }
                    var parentEl = $("> ul", $nodeid);
                    var arrayIndexIncrementor = toIdx > fromIdx ? 1 : -1;
                    for (var i = fromIdx; i !== toIdx; i += arrayIndexIncrementor) {
                        node.children[i].switchValuesWithNode(node.children[i + arrayIndexIncrementor]);
                        console.info("Calling Render 3: from moveNodeTo of array");
                        node.children[i].render(parentEl.get(0));
                        node.children[i + arrayIndexIncrementor].render(parentEl.get(0));
                        node.children[i].markChildEventHandlersForUpdate();
                        node.children[i + arrayIndexIncrementor].markChildEventHandlersForUpdate();
                    }
                    var fromEl = $(node.children[fromIdx].el);
                    var toEl = $(node.children[toIdx].el);
                    fromEl.detach();
                    toEl.detach();
                    if (fromIdx < toIdx) {
                        if (fromIdx === 0) {
                            parentEl.prepend(fromEl);
                        } else {
                            $(node.children[fromIdx - 1].el).after(fromEl);
                        }
                        $(node.children[toIdx - 1].el).after(toEl);
                    } else {
                        if (toIdx === 0) {
                            parentEl.prepend(toEl);
                        } else {
                            $(node.children[toIdx - 1].el).after(toEl);
                        }
                        $(node.children[fromIdx - 1].el).after(fromEl);
                    }
                    $nodeid.trigger("change");
                };
                var addItem = function(idx) {
                    if (node.formElement.enableAddingItems !== true) {
                        return;
                    }
                    if (arrayLimits.maxItems >= 0) {
                        var slotNum = arrayLimits.maxItems - node.children.length;
                        $nodeid.find("> span > a.tb-jf-array-addmore").toggleClass("disabled", slotNum <= 1);
                        if (slotNum < 1) {
                            return false;
                        }
                    }
                    node.insertArrayItem(idx, $("> ul", $nodeid).get(0));
                    var canDelete = node.children.length > arrayLimits.minItems;
                    $nodeid.find("> span > a.tb-jf-array-deletelast").toggleClass("disabled", !canDelete);
                    $nodeid.find("> ul > li > a.tb-jf-array-item-delete").toggle(canDelete);
                    $nodeid.trigger("change");
                };
                var deleteItem = function(idx) {
                    if (node.formElement.enableDeletingItems !== true) {
                        return;
                    }
                    var itemNumCanDelete = node.children.length - Math.max(arrayLimits.minItems, 0);
                    $nodeid.find("> span > a.tb-jf-array-deletelast").toggleClass("disabled", itemNumCanDelete <= 1);
                    $nodeid.find("> ul > li > a.tb-jf-array-item-delete").toggle(itemNumCanDelete > 1);
                    if (itemNumCanDelete < 1) {
                        return false;
                    }
                    node.deleteArrayItem(idx);
                    $nodeid.find("> span > a.tb-jf-array-addmore").toggleClass("disabled", arrayLimits.maxItems >= 0 && node.children.length >= arrayLimits.maxItems);
                    $nodeid.trigger("change");
                };
                var addItemEvent = function(item, evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    var idx = node.children.length;
                    addItem(idx);
                };
                var deleteLastItemEvent = function(item, evt) {
                    var idx = node.children.length - 1;
                    evt.preventDefault();
                    evt.stopPropagation();
                    deleteItem(idx);
                };
                var deleteItemByIndexEvent = function(item, evt) {
                    evt.preventDefault();
                    var $li = $(evt.currentTarget).parent();
                    if ($li.parent().parent().attr("id") !== node.id) {
                        return;
                    }
                    evt.stopPropagation();
                    var idx = $li.data("idx");
                    deleteItem(idx);
                };
                var moveItemUpEvent = function(item, evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    var index = item.parentNode.parentNode.getAttribute("data-idx");
                    if (+index - 1 >= 0) {
                        moveNodeTo(+index, +index - 1);
                    }
                };
                var moveItemDownEvent = function(item, evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    var maxIndex = node.children.length - 1;
                    var index = item.parentNode.parentNode.getAttribute("data-idx");
                    if (+index + 1 <= +maxIndex) {
                        moveNodeTo(+index, +index + 1);
                    }
                };
                var moveItemToPositionEvent = function(item, evt, ui) {
                    var idx = $(ui.item).data("idx");
                    var newIdx = $(ui.item).index();
                    moveNodeTo(idx, newIdx);
                };
                node.initializeEventHandlers = function() {
                    var itemNumCanDelete = this.children.length - Math.max(arrayLimits.minItems, 0);
                    $nodeid.find("> span > a.tb-jf-array-deletelast").toggleClass("disabled", itemNumCanDelete <= 0);
                    $nodeid.find("> ul > li > a.tb-jf-array-item-delete").toggle(itemNumCanDelete > 0);
                    $nodeid.find("> span > a.tb-jf-array-addmore").toggleClass("disabled", arrayLimits.maxItems >= 0 && this.children.length >= arrayLimits.maxItems);
                    $("> span > a.tb-jf-array-addmore", $nodeid).click(function(evt) {
                        addItemEvent(this, evt);
                    });
                    $("> span > a.tb-jf-array-deletelast", $nodeid).click(function(evt) {
                        deleteLastItemEvent(this, evt);
                    });
                    $nodeid.on("click", "> ul > li > a.tb-jf-array-item-delete", function(evt) {
                        deleteItemByIndexEvent(this, evt);
                    });
                    $nodeid.on("click", "> ul > li > .tb-jf-array-button-group > a.tb-jf-array-item-move-up", function(evt) {
                        moveItemUpEvent(this, evt);
                    });
                    $nodeid.on("click", "> ul > li > .tb-jf-array-button-group > a.tb-jf-array-item-move-down", function(evt) {
                        moveItemDownEvent(this, evt);
                    });
                    if (!this.isReadOnly() && $(this.el).sortable && this.formElement.enableSorting) {
                        $("> ul", $nodeid).sortable();
                        $("> ul", $nodeid).bind("sortstop", function(evt, ui) {
                            moveItemToPositionEvent(this, evt, ui);
                        });
                    }
                };
                if (arrayLimits.minItems > 0) {
                    for (var i = node.children.length; i < arrayLimits.minItems; i++) {
                        node.insertArrayItem(node.children.length, $nodeid.find("> ul").get(0));
                    }
                }
                node.initializeEventHandlers();
            },
            lock: function(node) {
                $(node.el).find("> div.controls > div > ul.tb-jf-array-ul > .tb-jf-array-element > .tb-jf-array-item-delete").hide();
                $(node.el).find("> div.controls > div > ul.tb-jf-array-ul > .tb-jf-array-element > .tb-jf-array-button-group").hide();
                $(node.el).find("> div.controls > div > ul.tb-jf-array-ul > .tb-jf-array-element > .tb-jf-draggable").hide();
                $(node.el).find("> div.controls > div > span.tb-jf-array-buttons").hide();
            },
            unlock: function(node) {
                $(node.el).find("> div.controls > div > ul.tb-jf-array-ul > .tb-jf-array-element > .tb-jf-array-item-delete").show();
                $(node.el).find("> div.controls > div > ul.tb-jf-array-ul > .tb-jf-array-element > .tb-jf-array-button-group").show();
                $(node.el).find("> div.controls > div > ul.tb-jf-array-ul > .tb-jf-array-element > .tb-jf-draggable").show();
                $(node.el).find("> div.controls > div > span.tb-jf-array-buttons").show();
            }
        },
        tabarray: {
            template: "" + '<div id="<%= id %>">' + '<div class="tabbable tabs-left">' + '<ul name="<%= name || node.name %>" class="nav nav-tabs <%= (node.formElement.justified === true) ? "nav-justified" : "" %>">' + "<%= tabs %>" + "</ul>" + '<div class="tab-content tb-jf-input-fieldset row">' + "<%= children %>" + "</div>" + "</div>" + "</div>",
            compatibleTypes: [ "array" ],
            compatibleFormats: [],
            minRowWidth: "half",
            maxRowWidth: "full",
            fieldtemplate: true,
            containerField: true,
            array: true,
            isArrayContainer: true,
            isTbTemplate: false,
            getFieldValue: function(rootNode) {
                var $indexList = $(rootNode).children("div").children("div").children("div").children("ul");
                var name = $indexList.attr("name");
                var $indexListChildren = $indexList.children("li");
                if ($indexListChildren.length === 1 && $($indexListChildren[0]).attr("data-idx") === "-1") {
                    return {
                        name: name,
                        value: []
                    };
                }
            },
            childTemplate: function(inner, node) {
                var template = '<div data-idx="<%= node.childPos %>" class="tab-pane fade" data-tb-jf-type="tabarray-item">';
                if (!node.isReadOnly() && node.formElement.enableSorting) {
                    template += ' <span class="tb-jf-tab-array-button-group">' + ' <a class="<%= cls.buttonClass %> tb-jf-array-item-move-left btn-xs"><i class="<%= cls.iconClassPrefix %>-circle-arrow-left" title="Remove item"></i>';
                    if (node.formElement.displaySystemButtonsLabels) {
                        template += " move left";
                    }
                    template += "</a>";
                    template += ' <a class="<%= cls.buttonClass %> tb-jf-array-item-move-right btn-xs"><i class="<%= cls.iconClassPrefix %>-circle-arrow-right" title="Remove item"></i>';
                    if (node.formElement.displaySystemButtonsLabels) {
                        template += " move right";
                    }
                    template += "</a> </span>";
                }
                template += inner + "</div>";
                return template;
            },
            onBeforeRender: function(data, node) {
                if (node.formElement.items && node.formElement.items.length >= 0) {
                    _.each(node.formElement.items, function(item) {
                        ASSERT(item.type === "section", {
                            msg: "tabarray: only elements with type section can be direct children of a tabarray"
                        });
                    });
                }
                data.tabs = "";
            },
            onInsert: function(evt, node) {
                var $nodeid = $(node.el).find("#" + escapeSelector(node.id));
                var arrayLimits = node.getArrayLimits();
                var moveNodeTo = function(fromIdx, toIdx) {
                    fromIdx = Number(fromIdx);
                    toIdx = Number(toIdx);
                    if (fromIdx === toIdx) {
                        return;
                    }
                    var incr = fromIdx < toIdx ? 1 : -1;
                    var tabEl = $("> .tabbable > .tab-content", $nodeid).get(0);
                    for (var i = fromIdx; i !== toIdx; i += incr) {
                        node.children[i].switchValuesWithNode(node.children[i + incr]);
                        console.info("Calling Render 4: from the moveNodeTo tabarray ");
                        node.children[i].render(tabEl);
                        node.children[i + incr].render(tabEl);
                        node.children[i].markChildEventHandlersForUpdate();
                        node.children[i + incr].markChildEventHandlersForUpdate();
                    }
                    $nodeid.trigger("change");
                };
                var updateTabs = function(selIdx) {
                    var tabs = "";
                    var activateFirstTab = false;
                    if (selIdx === undefined) {
                        selIdx = $("> .tabbable > .nav-tabs .active", $nodeid).data("idx");
                        if (selIdx) {
                            selIdx = parseInt(selIdx, 10);
                        } else {
                            activateFirstTab = true;
                            selIdx = 0;
                        }
                    }
                    if (selIdx >= node.children.length) {
                        selIdx = node.children.length - 1;
                    }
                    _.each(node.children, function(child, idx) {
                        var titlePrefix = '<span class="tb-jf-enumerate-form">' + child.currentCounterArray.join(".") + ": </span>";
                        var title = child.legend || child.title || "Item " + (idx + 1);
                        tabs += '<li data-idx="' + idx + '">' + '<a class="draggable tab" data-toggle="tab">' + titlePrefix + _.escape(title);
                        if (!node.isReadOnly() && node.formElement.enableDeletingItems) {
                            tabs += ' <span href="#" class="tb-jf-tab-array-tab-delete btn-default btn-xs btn-danger"> <i class="' + node.ownerTree.defaultClasses.iconClassPrefix + '-remove" title="Remove item"></i></span>' + "</a>";
                        }
                        tabs += "</li>";
                    });
                    if (!node.isReadOnly() && node.formElement.enableAddingItems && (arrayLimits.maxItems < 0 || node.children.length < arrayLimits.maxItems)) {
                        tabs += '<li data-idx="-1"><a class="tab tb-jf-tab-array-addmore" title="' + (node.formElement.addMoreTooltip ? _.escape(node.formElement.addMoreTooltip) : "Add new item") + '"><i class="' + node.ownerTree.defaultClasses.iconClassPrefix + '-plus-sign"></i> ' + (node.formElement.addMoreTitle || "New") + "</a></li>";
                    }
                    $("> .tabbable > .nav-tabs", $nodeid).html(tabs);
                    var canDelete = arrayLimits.minItems >= 0 && node.children.length <= arrayLimits.minItems;
                    $nodeid.find("> .tabbable > .nav-tabs > li > a > .tb-jf-array-item-delete").toggle(!canDelete);
                    if (activateFirstTab) {
                        $('> .tabbable > .nav-tabs [data-idx="0"]', $nodeid).addClass("active");
                    }
                    $('> .tabbable > .nav-tabs [data-toggle="tab"]', $nodeid).eq(selIdx).click();
                };
                var deleteItem = function(idx) {
                    var itemNumCanDelete = node.children.length - Math.max(arrayLimits.minItems, 0) - 1;
                    $nodeid.find("> .tabbable > .nav-tabs > li > a > .tb-jf-tab-array-tab-delete").toggle(itemNumCanDelete > 0);
                    if (itemNumCanDelete < 0 || node.formElement.enableDeletingItems !== true) {
                        return false;
                    }
                    node.deleteArrayItem(idx);
                    updateTabs();
                    $nodeid.find("> a.tb-jf-tab-array-addmore").toggleClass("disabled", arrayLimits.maxItems >= 0 && node.children.length >= arrayLimits.maxItems);
                    $nodeid.trigger("change");
                };
                var addItem = function(idx) {
                    if (node.formElement.enableAddingItems !== true) {
                        return false;
                    }
                    if (arrayLimits.maxItems >= 0) {
                        var slotNum = arrayLimits.maxItems - node.children.length;
                        $nodeid.find("> a.tb-jf-tab-array-addmore").toggleClass("disabled", slotNum <= 1);
                        if (slotNum < 1) {
                            return false;
                        }
                    }
                    node.insertArrayItem(idx, $nodeid.find("> .tabbable > .tab-content").get(0));
                    updateTabs(idx);
                    $nodeid.find("> a.tb-jf-tab-array-tab-delete").toggleClass("disabled", node.children.length <= arrayLimits.minItems);
                    $nodeid.trigger("change");
                };
                var addItemEvent = function(item, evt) {
                    var idx = Number(node.children.length);
                    evt.preventDefault();
                    evt.stopPropagation();
                    addItem(idx);
                };
                var deleteClickedItemEvent = function(item, evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    var idx = Number($(evt.currentTarget).closest("li").data("idx"));
                    deleteItem(idx);
                };
                var updateLegendEvent = function(item, evt) {
                    updateTabs();
                    evt.preventDefault();
                    evt.stopPropagation();
                };
                var moveItemAheadEvent = function(item, evt) {
                    var idx = Number($(item).closest(".active.tab-pane").data("idx"));
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (idx > 0) {
                        moveNodeTo(idx, idx - 1);
                        updateTabs(idx - 1);
                    }
                };
                var moveItemBehindEvent = function(item, evt) {
                    var idx = Number($(item).closest(".active.tab-pane").data("idx"));
                    evt.preventDefault();
                    evt.stopPropagation();
                    if (idx < node.children.length - 1) {
                        moveNodeTo(idx, idx + 1);
                        updateTabs(idx + 1);
                    }
                };
                var itemSortChangeEvent = function(item, evt, ui) {
                    if (ui.placeholder.index() === $(item).children().length - 1 && ui.placeholder.prev().data("idx") === -1) {
                        ui.placeholder.prev().before(ui.placeholder);
                    }
                };
                var itemSortStopEvent = function(item, evt, ui) {
                    var idx = $(ui.item).data("idx");
                    var newIdx = $(ui.item).index();
                    moveNodeTo(idx, newIdx);
                    updateTabs(newIdx);
                };
                node.initializeEventHandlers = function() {
                    $nodeid.find("> a.tb-jf-tab-array-addmore").toggleClass("disabled", arrayLimits.maxItems >= 0 && node.children.length >= arrayLimits.maxItems);
                    var canDelete = arrayLimits.minItems >= 0 && node.children.length <= arrayLimits.minItems;
                    $nodeid.find("> a.tb-jf-tab-array-tab-delete").toggleClass("disabled", canDelete);
                    $nodeid.find("> .tabbable > .nav-tabs > li > a > .tb-jf-tab-array-tab-delete").toggle(!canDelete);
                    $nodeid.on("click", "> a.tb-jf-tab-array-addmore, > .tabbable > .nav-tabs > li > .tb-jf-tab-array-addmore", function(evt) {
                        addItemEvent(this, evt);
                    });
                    $nodeid.on("click", "> .tabbable > .nav-tabs > li > a > .tb-jf-tab-array-tab-delete", function(evt) {
                        deleteClickedItemEvent(this, evt);
                    });
                    $(node.el).on("legendUpdated", function(evt) {
                        updateLegendEvent(this, evt);
                    });
                    if (!node.isReadOnly() && node.formElement.enableSorting) {
                        $nodeid.on("click", "> .tabbable > .tab-content > .tab-pane > .tb-jf-tab-array-button-group > .tb-jf-array-item-move-left", function(evt) {
                            moveItemAheadEvent(this, evt);
                        });
                        $nodeid.on("click", "> .tabbable > .tab-content > .tab-pane > .tb-jf-tab-array-button-group > .tb-jf-array-item-move-right", function(evt) {
                            moveItemBehindEvent(this, evt);
                        });
                    }
                    if (!node.isReadOnly() && $(node.el).sortable && node.formElement.enableSorting) {
                        $("> .tabbable > .nav-tabs", $nodeid).sortable({
                            containment: node.el,
                            cancel: ".tb-jf-tab-array-addmore",
                            tolerance: "pointer"
                        }).on("sortchange", function(evt, ui) {
                            itemSortChangeEvent(this, evt, ui);
                        }).on("sortstop", function(evt, ui) {
                            itemSortStopEvent(this, evt, ui);
                        });
                    }
                };
                if (arrayLimits.minItems >= 0) {
                    for (var i = node.children.length; i < arrayLimits.minItems; i++) {
                        addItem(node.children.length);
                    }
                    updateTabs();
                } else {
                    updateTabs(_.isUndefined(node.currentlySelectedIndex) ? undefined : parseInt(node.currentlySelectedIndex, 10));
                }
                node.initializeEventHandlers();
            },
            lock: function(node) {
                $(node.el).find("> div.controls > div > div.tabbable > ul.nav > li[data-idx] > a > span.tb-jf-tab-array-tab-delete").hide();
                $(node.el).find('> div.controls > div > div.tabbable > ul.nav > li[data-idx="-1"]').hide();
                $(node.el).find("> div.controls > div > div.tabbable > div.tab-content > div.tab-pane > span.tb-jf-tab-array-button-group").hide();
            },
            unlock: function(node) {
                $(node.el).find("> div.controls > div > div.tabbable > ul.nav > li[data-idx] > a > span.tb-jf-tab-array-tab-delete").show();
                $(node.el).find('> div.controls > div > div.tabbable > ul.nav > li[data-idx="-1"]').show();
                $(node.el).find("> div.controls > div > div.tabbable > div.tab-content > div.tab-pane > span.tb-jf-tab-array-button-group").show();
            }
        },
        alternative: {
            template: "" + '<div id="<%= id %>">' + '<div class="tabbable <%= node.formElement.tabClass %> ">' + '<div class="tab-content tb-jf-input-fieldset row">' + "<%= children %>" + "</div>" + "</div>" + "</div>",
            minRowWidth: "half",
            maxRowWidth: "full",
            fieldtemplate: true,
            isTbTemplate: false,
            compatibleTypes: [],
            childTemplate: function(inner, parent) {
                this.please_send_help_is_even = this.please_send_help_is_even || 0;
                if (this.please_send_help_is_even % 2 === 0) {
                    this.please_send_help_is_even++;
                    var metaChild = parent.children[0];
                    var options = metaChild.options;
                    var $resultHtmlContainer = $("<div />");
                    var $resultHtml = $("<div />");
                    $resultHtml.addClass("tb-jf-alternative-meta");
                    $resultHtml.attr("help_prop", metaChild.name);
                    $resultHtml.attr("help_prop2", parent.children[1].name);
                    for (var i = 0; i < options.length; i++) {
                        var option = options[i];
                        var id = this.please_send_help_is_even + "_" + i + "_alternatives";
                        var $div = $("<span />");
                        var $check = $('<input type="checkbox" />');
                        $check.val(option.value);
                        $check.attr("id", id);
                        $div.append($check);
                        var $label = $("<label />");
                        $label.attr("for", id);
                        $label.text(option.value);
                        $div.append($label);
                        $resultHtml.append($div);
                    }
                    $resultHtmlContainer.append($resultHtml);
                    return $resultHtmlContainer.html();
                } else {
                    this.please_send_help_is_even++;
                    return '<div class="tb-jf-alternative-real">' + inner + "</div>";
                }
            },
            getFieldValue: function(node, formTree) {
                var $node = $(node);
                var value = {};
                var $container = $node.find(".tb-jf-alternative-meta");
                var metaName = $container.attr("help_prop");
                var realName = $container.attr("help_prop2");
                value.name = metaName;
                value.value = [];
                formTree.removeFieldsFromForm = formTree.removeFieldsFromForm || {};
                formTree.removeFieldsFromForm[realName] = [];
                $container.find("input").each(function(idx) {
                    if (this.checked) {
                        value.value.push(this.value);
                    } else {
                        formTree.removeFieldsFromForm[realName].push(this.value);
                    }
                });
                return value;
            }
        },
        tabobject: {
            template: "" + '<div id="<%= id %>">' + '<div class="tabbable <%= node.formElement.tabClass %> ">' + '<ul class="nav nav-tabs <%= (node.formElement.justified === true) ? "nav-justified" : "" %>">' + "<%= tabs %>" + "</ul>" + '<div class="tab-content tb-jf-input-fieldset row">' + "<%= children %>" + "</div>" + "</div>" + "</div>",
            compatibleTypes: [ "object" ],
            compatibleFormats: [],
            minRowWidth: "half",
            maxRowWidth: "full",
            containerField: true,
            fieldtemplate: true,
            isTbTemplate: false,
            getElement: function(el) {
                return $(el).parent().get(0);
            },
            childTemplate: function(inner) {
                return "" + '<div data-idx="<%= node.childPos %>" class="tab-pane fade ' + '<% if (node.active) { %> in active <% } %>">' + inner + "</div>";
            },
            onBeforeRender: function(data, node) {
                if (node.formElement.items && node.formElement.items.length >= 0) {
                    _.each(node.formElement.items, function(item) {});
                }
                var children = null;
                var choices = [];
                switch (node.formElement.tabPosition) {
                  case "left":
                    node.formElement.tabClass = "tabs-left";
                    break;

                  case "right":
                    node.formElement.tabClass = "tabs-right";
                    break;

                  default:
                    node.formElement.tabClass = "tabs";
                }
                if (node.schemaElement) {
                    choices = node.schemaElement["enum"] || [];
                }
                if (node.options) {
                    children = _.map(node.options, function(option, idx) {
                        var child = node.children[idx];
                        if (option instanceof Object) {
                            option = _.extend({
                                node: child
                            }, option);
                            option.title = option.title || child.legend || child.title || "Option " + (child.childPos + 1);
                            option.value = !_.isNil(option.value) ? option.value : !_.isNil(choices[idx]) ? choices[idx] : idx;
                            return {
                                value: option,
                                title: option
                            };
                        } else {
                            return {
                                title: option,
                                value: !_.isNil(choices[child.childPos]) ? choices[child.childPos] : child.childPos,
                                node: child
                            };
                        }
                    });
                } else {
                    children = _.map(node.children, function(child, idx) {
                        return {
                            title: child.legend || child.title || "Option " + (child.childPos + 1),
                            value: choices[child.childPos] || child.childPos,
                            node: child
                        };
                    });
                }
                var activeChild = null;
                if (data.value) {
                    activeChild = _.find(children, function(child) {
                        return child.value === node.value;
                    });
                }
                if (!activeChild) {
                    activeChild = _.find(children, function(child) {
                        return child.node.hasNonDefaultValue();
                    });
                }
                if (!activeChild) {
                    activeChild = children[0];
                }
                activeChild.node.active = true;
                data.value = activeChild.value;
                var tabs = "";
                _.each(node.children, function(child, idx) {
                    var title = "Tab " + (idx + 2);
                    if (child && child.legend) {
                        title = child.legend;
                    } else if (child && child.title) {
                        title = child.title;
                    } else if (child && child.key) {
                        title = child.key.split("/").pop();
                    }
                    title = '<span class="tb-jf-enumerate-form">' + child.currentCounterArray.join(".") + ": </span>" + title;
                    var value = !_.isNil(child.value) ? child.value : idx;
                    tabs += "" + '<li data-idx="' + idx + '" value = "' + _.escape(value) + '"' + ">" + '<a class="tab ' + (child.active ? "active" : "") + '">' + title + "</a>";
                    +"</li>";
                });
                data.tabs = tabs;
                return data;
            },
            onInsert: function(evt, node) {
                var firstTab = $('> .tabbable > .nav-tabs [data-idx="0"]', "#" + node.id);
                firstTab.addClass("active");
                firstTab.addClass("in");
                firstTab.click();
            }
        },
        alert: {
            template: '<div class=" <%= node.formElement.alertType %>" role="alert">' + "<%= node.formElement.alertMessage %>" + "</div>",
            isTbTemplate: false,
            minRowWidth: "quarter",
            maxRowWidth: "full",
            onBeforeRender: function(data, node) {
                if (!node.formElement.description) {
                    ASSERT.isString(node.formElement.title, {
                        msg: "elementType alert: the alert must have title, description or both.",
                        code: 2960
                    });
                } else {
                    ASSERT.isString(node.formElement.description, {
                        msg: "elementType alert: the alert must have title, description or both.",
                        code: 2970
                    });
                }
                node.formElement.alertMessage = "";
                switch (node.formElement.alertType) {
                  case "success":
                    node.formElement.alertType = "alert alert-success";
                    node.formElement.alertMessage = '<i class="glyphicon glyphicon-ok"></i> ';
                    break;

                  case "warning":
                    node.formElement.alertType = "alert alert-warning";
                    node.formElement.alertMessage = '<i class="glyphicon glyphicon-warning-sign"></i> ';
                    break;

                  case "danger":
                    node.formElement.alertType = "alert alert-danger";
                    node.formElement.alertMessage = '<i class="glyphicon glyphicon-remove-sign"></i> ';
                    break;

                  case "info":
                    node.formElement.alertType = "alert alert-info";
                    node.formElement.alertMessage = '<i class="glyphicon glyphicon-info-sign"></i> ';
                    break;

                  case "message":
                  default:
                    node.formElement.alertType = "well";
                }
                if (node.formElement.title) {
                    node.formElement.alertMessage += "<strong>" + node.formElement.title + "</strong> </br>";
                }
                node.formElement.alertMessage += node.formElement.description;
            }
        },
        fieldset: {
            template: '<fieldset class="tb-jf-fieldset-header tb-jf-node row ' + '<%= (node.key) ? " tb-jf-error-" + node.selectorKey : "" %>' + '<% if (elt.expandable) { %>expandable<% } %> <%= elt.htmlClass?elt.htmlClass:"" %>" ' + '<% if (id) { %> id="<%= id %>"<% } %>' + ' data-tb-jf-type="fieldset">' + '<% if (node.title || node.legend) { %><legend class="tb-jf-legend" <% if (node.description) { %> style="border-bottom: none;" <% } %> ><%= node.title || node.legend %></legend><% } %>' + '<% if (node.description) { %> <span class="help-block tb-jf-description tb-jf-clear-margins"><%= node.description %></span><% } %>' + '<div class="tb-jf-plain-fieldset myClass123 row' + '<% if (elt.expandable) { %>cls.groupClass" hidden <% } else { %> " <% } %> >' + "<%= children %>" + "</div>" + '<span class="help-block tb-jf-errortext tb-jf-hide"></span>' + "</fieldset>",
            isTbTemplate: false,
            containerField: true,
            compatibleTypes: [ "object" ],
            compatibleFormats: [],
            minRowWidth: "half",
            maxRowWidth: "full",
            onBeforeRender: function(data, node) {}
        },
        submit: {
            template: '<input type="submit" <% if (id) { %> id="<%= id %>" <% } %> class="btn btn-primary <%= elt.htmlClass?elt.htmlClass:"" %>" value="<%= value || node.title %>"<%= (node.disabled? " disabled" : "")%>/>',
            isTbTemplate: false,
            minRowWidth: "full",
            maxRowWidth: "full",
            compatibleTypes: []
        },
        button: {
            template: "" + '<button type="button" ' + '<% if (id) { %> id="<%= id %>" <% } %> ' + '<% if (node.rowWidth) { %>style="float: left;"<% } %>' + 'class="btn <%= node.formElement.buttonSize %>' + "  <%= node.formElement.buttonType %> <%= cls.buttonClass %>" + '  <%= elt.htmlClass?elt.htmlClass:"" %> <%= node.formElement.buttonStyle %>">' + '<i class="glyphicon glyphicon-<%= node.formElement.buttonIcon %>">' + "</i>" + " <%= node.title %>" + "</button> ",
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                node.formElement.parent = node.parentNode;
                if (!node.formElement.description) {
                    ASSERT.isString(node.formElement.title, {
                        msg: "elementType alert: the alert must have title, description or both.",
                        code: 2980
                    });
                } else {
                    ASSERT.isString(node.formElement.description, {
                        msg: "elementType alert: the alert must have title, description or both.",
                        code: 2990
                    });
                }
                node.formElement.alertMessage = "";
                switch (node.formElement.buttonType) {
                  case "primary":
                    node.formElement.buttonType = "btn-primary";
                    node.formElement.buttonIcon = !_.isNil(node.formElement.buttonIcon) ? node.formElement.buttonIcon : '<i class="glyphicon glyphicon-ok"></i> ';
                    break;

                  case "success":
                    node.formElement.buttonType = "btn-success";
                    node.formElement.buttonIcon = !_.isNil(node.formElement.buttonIcon) ? node.formElement.buttonIcon : '<i class="glyphicon glyphicon-ok"></i> ';
                    break;

                  case "warning":
                    node.formElement.buttonType = "btn-warning";
                    node.formElement.buttonIcon = !_.isNil(node.formElement.buttonIcon) ? node.formElement.buttonIcon : '<i class="glyphicon glyphicon-warning-sign"></i> ';
                    break;

                  case "danger":
                    node.formElement.buttonType = "btn-danger";
                    node.formElement.buttonIcon = !_.isNil(node.formElement.buttonIcon) ? node.formElement.buttonIcon : '<i class="glyphicon glyphicon-remove-sign"></i> ';
                    break;

                  case "info":
                    node.formElement.buttonType = "btn-info";
                    node.formElement.buttonIcon = !_.isNil(node.formElement.buttonIcon) ? node.formElement.buttonIcon : '<i class="glyphicon glyphicon-info-sign"></i> ';
                    break;

                  case "default":
                  default:
                    node.formElement.buttonType = "btn-default";
                }
                switch (node.formElement.buttonSize) {
                  case "big":
                    node.formElement.buttonSize = "btn-xl";
                    break;

                  case "small":
                    node.formElement.buttonSize = "btn-sm";
                    break;

                  case "very small":
                    node.formElement.buttonSize = "btn-xs";
                    break;

                  case "normal":
                  default:
                    node.formElement.buttonSize = "btn";
                    break;
                }
                switch (node.formElement.buttonStyle) {
                  case "justified":
                    node.formElement.buttonStyle = "btn-group btn-group-justified";
                    break;

                  case "block":
                    node.formElement.buttonSize = "btn-block";
                    break;

                  case "normal":
                  default:
                    node.formElement.buttonSize = "";
                    break;
                }
            },
            lock: function(node) {
                $(node.el).addClass("disabled").prop("disabled", true);
            },
            unlock: function(node) {
                $(node.el).removeClass("disabled").removeProp("disabled");
            },
            minRowWidth: "sixth",
            maxRowWidth: "full"
        },
        actions: {
            template: '<div class="form-actions <%= elt.htmlClass?elt.htmlClass:"" %>"><%= children %></div>',
            isTbTemplate: false
        },
        hidden: {
            template: "" + '<input type="hidden" id="<%= node.id %>" name="<%= node.name %>" value="<%= node.value %>" />',
            inputfield: true,
            isTbTemplate: false,
            fieldtemplate: true,
            compatibleTypes: [ "string", "number", "integer", "boolean", "object", "array" ],
            compatibleFormats: [],
            minRowWidth: "half",
            maxRowWidth: "full",
            onBeforeRender: function(data, node) {
                if (node.required === true && !node.value) {
                    ASSERT_USER(0, {
                        code: 2995,
                        msg: "The node $nodename$ that is required and hidden should have value in content or default!",
                        msgParams: {
                            nodename: node.name
                        }
                    });
                }
            }
        },
        selectfieldset: {
            template: '<fieldset data-tb-jf-type="<%= node.formElement.type %>" name="<%= node.name %>" class="tab-container <%= elt.htmlClass?elt.htmlClass:"" %>">' + "<% if (node.legend) { %><legend><%= node.legend %></legend><% } %>" + '<% if (node.formElement.key) { %> <input type="hidden" id="<%= node.id %>" value="<%= escape(value) %>" /> <% } else { %>' + '<a id="<%= node.id %>"></a><% } %>' + '<div class="tabbable">' + '<div class="tb-jf-form-group <%= cls.groupClass %><%= node.formElement.hideMenu ? " hide" : "" %>">' + '<% if (node.title && !elt.notitle) { %><label class="<%= cls.labelClass %>" for="<%= node.id %>"><%= node.title %></label><% } %>' + '<div class="<%= cls.controlClass %>"><%= tabs %></div>' + "</div>" + '<div class="tab-content">' + "<%= children %>" + "</div>" + "</div>" + "</fieldset>",
            compatibleTypes: [ "object" ],
            minRowWidth: "half",
            maxRowWidth: "full",
            isTbTemplate: false,
            containerField: true,
            isSearchableField: true,
            getElement: function(el) {
                return $(el).parent().get(0);
            },
            childTemplate: function(inner) {
                return '<div data-idx="<%= node.childPos %>" class="tab-pane' + '<% if (node.active) { %> active<% } %>">' + inner + "</div>";
            },
            onBeforeRender: function(data, node) {
                var children = null;
                var choices = [];
                var activeChild = null;
                if (node.schemaElement) {
                    choices = node.schemaElement["enum"] || node.schemaElement["anyOf"] || [];
                }
                if (node.options) {
                    children = _.map(node.options, function(option, idx) {
                        var child = node.children[idx];
                        if (option instanceof Object) {
                            option = _.extend({
                                node: child
                            }, option);
                            option.title = option.title || child.legend || child.title || "Option " + (child.childPos + 1);
                            option.value = !_.isNil(option.value) ? option.value : !_.isNil(choices[idx]) ? choices[idx] : idx;
                            return option;
                        } else {
                            return {
                                title: option,
                                value: !_.isNil(choices[child.childPos]) ? choices[child.childPos] : child.childPos,
                                node: child
                            };
                        }
                    });
                } else {
                    if (node.children) {
                        children = _.map(node.children, function(child, idx) {
                            return {
                                title: child.legend || child.title || "Option" + (child.childPos + 1),
                                value: choices[child.childPos] || child.childPos,
                                node: child
                            };
                        });
                    } else {}
                }
                if (data.value) {
                    activeChild = _.find(children, function(child) {
                        return child.value === node.value;
                    });
                }
                if (!activeChild) {
                    activeChild = _.find(children, function(child) {
                        return child.node.hasNonDefaultValue();
                    });
                }
                if (!activeChild) {
                    activeChild = children[0];
                }
                activeChild.node.active = true;
                data.value = activeChild.value;
                var tabs = '<select class="nav ' + data.cls.textualInputClass + '"' + (node.disabled ? " disabled" : "") + ">";
                _.each(children, function(child, idx) {
                    tabs += '<option data-idx="' + idx + '" value="' + _.escape(child.value) + '"' + (child.node.active ? ' class="active"' : "") + ">" + child.title + "</option>";
                });
                tabs += "</select>";
                data.tabs = tabs;
                return data;
            },
            onInsert: function(evt, node) {
                $(node.el).find("select.nav").first().on("change", function(evt) {
                    var $option = $(this).find("option:selected");
                    $(node.el).find('input[type="hidden"]').first().val($option.attr("value"));
                });
            },
            getFieldValue: function(node) {
                var $node = $(node);
                var selectedIdx = Number($node.find("div div div select").val());
                var dataHTML = $node.find('div div.tab-content div[data-idx="' + selectedIdx + '"]');
                var arrayOfValues = getArrayFieldValueHtml(dataHTML);
                var resultValue = {};
                for (var i = 0; i < arrayOfValues.length; i++) {
                    _.merge(resultValue, constructObjectByKey(arrayOfValues[i]["name"], arrayOfValues[i]["value"]));
                }
                return {
                    name: $node.attr("name"),
                    value: resultValue[$node.attr("name")]
                };
            }
        },
        optionfieldset: {
            template: "<div" + '<% if (node.id) { %> id="<%= node.id %>"<% } %>' + ">" + "<%= children %>" + "</div>",
            compatibleTypes: [ "object" ],
            containerField: true,
            minRowWidth: "half",
            maxRowWidth: "full",
            isTbTemplate: false
        },
        section: {
            template: "<div" + '<% if (node.id) { %> id="<%= node.id %>"<% } %> class="tb-jf-node row ' + '<%= (node.key) ? " tb-jf-error-" + node.selectorKey : "" %>' + ' <%= elt.htmlClass?elt.htmlClass:"" %>"' + ' data-tb-jf-type="section"><%= children %></div>',
            compatibleTypes: [ "array" ],
            compatibleFormats: [],
            containerField: true,
            minRowWidth: "half",
            maxRowWidth: "full",
            isTbTemplate: false
        },
        tablerow: {
            template: "<div" + '<% if (node.id) { %> id="<%= node.id %>"<% } %> class="tb-jf-node ' + '<%= (node.key) ? " tb-jf-error-" + node.selectorKey : "" %>' + ' <%= elt.htmlClass?elt.htmlClass:"" %>"' + "><%= children %></div>",
            compatibleTypes: [ "array" ],
            compatibleFormats: [],
            containerField: true,
            minRowWidth: "full",
            maxRowWidth: "full",
            isTbTemplate: false,
            onBeforeRender: function(data, node) {
                node.view.template = '<tr data-idx="<%= node.childPos %>" data-tb-jf-type="table-item"' + '<% if (node.id) { %> id="<%= node.id %>"<% } %> ' + 'class="tb-jf-node ' + '<%= (node.key) ? " tb-jf-error-" + node.selectorKey : "" %>' + ' <%= elt.htmlClass ? elt.htmlClass: "" %>"> ' + "<%= children %>";
                if (node.parentNode.formElement.enableDeletingItems || node.parentNode.formElement.enableSorting) {
                    node.view.template += '<td width="1%"> ' + ' <span class="tb-jf-table-button-group">';
                }
                if (node.parentNode.formElement.enableSorting) {
                    node.view.template += ' <a class="<%= cls.buttonClass %> tb-jf-table-row-move-up btn-xs">' + '<i class="<%= cls.iconClassPrefix %>-circle-arrow-up" title="move row up"></i>' + "</a>" + ' <a class="<%= cls.buttonClass %> tb-jf-table-row-move-down btn-xs">' + '<i class="<%= cls.iconClassPrefix %>-circle-arrow-down" title="move row down"></i>' + "</a>";
                }
                if (node.parentNode.formElement.enableDeletingItems) {
                    node.view.template += ' <a href="#" class="<%= cls.buttonClass %> tb-jf-table-row-delete btn-xs btn-danger"><i class="<%= cls.iconClassPrefix %>-remove" title="remove row"></i></a>' + " </span>" + " </td>";
                }
                if (node.parentNode.formElement.enableDeletingItems || node.parentNode.formElement.enableSorting) {
                    node.view.template += " </span>" + " </td>";
                }
                node.view.template += "</tr>";
                _.each(node.children, function(child) {
                    child.fieldtemplate = false;
                    child.view.tablecell = true;
                });
            }
        },
        table: tableAsObject,
        tableobject: tableObjectasObject
    };
    var FormNode = function() {
        this.id = null;
        this.key = null;
        this.el = null;
        this.formElement = null;
        this.schemaElement = null;
        this.view = null;
        this.children = [];
        this.ownerTree = null;
        this.parentNode = null;
        this.childTemplate = null;
        this.legendChild = null;
        this.arrayPath = [];
        this.childPos = 0;
        this.valueHistory = [];
        this.activeValueHistoryIdx = null;
        this.shouldEnhance = true;
    };
    FormNode.prototype.render = function(el, shouldFilter) {
        var start_time = Date.now();
        var html = this.getHtml();
        this.setHtml(html, el);
        this.enhance(shouldFilter);
        console.info("Finished rendering for " + (Date.now() - start_time) + "ms");
    };
    FormNode.prototype.setValue = function(value) {
        this.value = value;
        this.shouldEnhance = true;
        if (this.formElement.type === "tabarray") {
            this.currentlySelectedIndex = $(this.el).attr("active-idx");
        }
        console.info("Calling Render 5: from the FormNode.setValue method");
        this.computeInitialValues(value, {
            computeValues: true
        });
        this.render();
    };
    FormNode.prototype.setSelectOptions = function(options) {
        this.options = options;
        this.shouldEnhanceFunc();
        console.info("Calling Render 6: from the FormNode.setSelectOptions method");
        this.render();
    };
    FormNode.prototype.setTemplateOptions = function(options, templateData) {
        jfUtils.setObjValueByKey(_.get(this.ownerTree, "formDesc.form.templateData"), this.key, templateData);
        this.formElement.options = options;
        this.options = options;
        this.shouldEnhanceFunc();
        console.info("Calling Render 7: from the FormNode.setTemplateOptions method");
        this.render();
    };
    FormNode.prototype.addTemplateOptions = function(options, templateData) {
        var oldTemplateData = jfUtils.getObjByKey(_.get(this.ownerTree, "formDesc.form.templateData"), this.key);
        var newTemplateData = oldTemplateData.concat(templateData);
        jfUtils.setObjValueByKey(_.get(this.ownerTree, "formDesc.form.templateData"), this.key, newTemplateData);
        this.formElement.options = options;
        this.options = options;
        this.shouldEnhanceFunc();
        console.info("Calling Render 8: from the FormNode.addTemplateOptions method");
        this.render();
    };
    FormNode.prototype.addSelectOptions = function(options) {
        this.options = this.options.concat(options);
        this.shouldEnhanceFunc();
        console.info("Calling Render 9: from the FormNode.addSelectOptions method");
        this.render();
    };
    FormNode.prototype.getHtml = function() {
        var html = "";
        var template = null;
        var data = {
            id: this.id,
            key: this.key,
            elt: this.formElement,
            schema: this.schemaElement,
            node: this,
            value: !_.isNil(this.value) ? this.value : "",
            cls: this.ownerTree.defaultClasses,
            escape: _.escape
        };
        if (this.ownerTree.formDesc.onBeforeRender) {
            this.ownerTree.formDesc.onBeforeRender(data, this);
        }
        if (this.view.onBeforeRender) {
            this.view.onBeforeRender(data, this);
        }
        if (this.template) {
            template = this.template;
        } else if (this.formElement && this.formElement.template) {
            template = this.formElement.template;
        } else {
            template = this.view.template;
        }
        if (this.fieldtemplate !== false && (this.fieldtemplate || this.view.fieldtemplate)) {
            template = jsonform.fieldTemplate(template);
        } else if (this.tablecell || this.view.tablecell) {
            template = jsonform.tableCellTemplate(template);
        }
        if (this.parentNode && this.parentNode.view && this.parentNode.view.childTemplate) {
            template = this.parentNode.view.childTemplate(template, this.parentNode);
        }
        var childrenhtml = "";
        _.each(this.children, function(child) {
            childrenhtml += child.getHtml();
        });
        data.children = childrenhtml;
        if (_.isArray(data.node.currentCounterArray)) {
            data.enumerationText = data.node.currentCounterArray.join(".");
        } else {
            data.enumerationText = "";
        }
        data.fieldHtmlClass = "";
        if (this.ownerTree && this.ownerTree.formDesc && this.ownerTree.formDesc.params && this.ownerTree.formDesc.params.fieldHtmlClass) {
            data.fieldHtmlClass = this.ownerTree.formDesc.params.fieldHtmlClass;
        }
        if (this.formElement && typeof this.formElement.fieldHtmlClass !== "undefined") {
            data.fieldHtmlClass = this.formElement.fieldHtmlClass;
        }
        html = _template(template, data, fieldTemplateSettings);
        return html;
    };
    FormNode.prototype.setHtml = function(html, parentEl) {
        var node = $(html);
        var descrNodes = node.find(".tb-jf-description");
        for (var i = 0; i < descrNodes.length; i++) {
            var currNode = $(descrNodes[i]);
            var currNodeDescrText = currNode.text();
            if (currNodeDescrText.indexOf("\n") >= 0) {
                currNodeDescrText = currNodeDescrText.replace(/\n/g, "<br />");
                currNode.html(currNodeDescrText);
            }
        }
        var parentNode = parentEl || (this.parentNode ? this.parentNode.el : this.ownerTree.domRoot);
        var nextSibling = $(parentNode).children().get(this.childPos);
        if (this.el) {
            $(this.el).replaceWith(node);
        } else {
            if (nextSibling) {
                $(nextSibling).before(node);
            } else {
                $(parentNode).append(node);
            }
        }
        this.el = node;
        this.updateDomElementReference(this.el);
    };
    FormNode.prototype.updateDomElementReference = function(domNode) {
        if (this.id) {
            this.el = $("#" + escapeSelector(this.id), domNode).get(0) || $("#" + escapeSelector(this.id));
            var isArrayItem = this.parentNode && this.parentNode.formElement && jsonform.elementTypes[this.parentNode.formElement.type].array === true;
            if (isArrayItem) {
                var parentType = this.parentNode.formElement.type;
                this.el = this.el.closest("[data-tb-jf-type=" + parentType + "-item]");
            } else {
                this.el = this.el.closest("[data-tb-jf-type]");
            }
        }
        _.each(this.children, function(child) {
            child.updateDomElementReference(child.el || domNode);
        });
    };
    FormNode.prototype.getSchemaDefault = function() {
        var schemaDefault = null;
        if (this.formElement.additionalPropertiesKey) {
            schemaDefault = jfUtils.getSchemaDefaultByJsonPointer(this.ownerTree.formDesc.schema, this.formElement.additionalPropertiesKey);
        } else {
            schemaDefault = jfUtils.getSchemaDefaultByJsonPointer(this.ownerTree.formDesc.schema, this.key);
        }
        if (schemaDefault) {
            jsonform.util.validateValueType(this.key, this.schemaElement, this.formElement, this.ownerTree.formDesc.form.deprecatedValue, schemaDefault, true, this.ownerTree.formDesc);
        }
        return schemaDefault;
    };
    FormNode.prototype.getContentDefault = function(formAndContentValues) {
        var fieldValue = jfUtils.getObjByKey(formAndContentValues, this.key);
        if (fieldValue === undefined) return fieldValue;
        if (!this.ownerTree.formDesc.form.isStrict) {
            fieldValue = jfUtils.forceValueTypes(this.ownerTree.formDesc.schema, this.schemaElement, fieldValue);
        } else {
            fieldValue = jsonform.util.validateValueType(this.key, this.schemaElement, this.formElement, this.ownerTree.formDesc.form.deprecatedValue, fieldValue, this.ownerTree.formDesc.form.strictNumberTypes, this.ownerTree.formDesc);
        }
        return fieldValue;
    };
    FormNode.prototype.computeInitialValues = function(values, settings) {
        var self = this;
        var topDefaultArrayLevel;
        var ignoreSchemaDefaultValues;
        var computeValues;
        var shouldUpdateValueHistory;
        var formData = this.ownerTree.formDesc.tpldata || {};
        if (settings) {
            shouldUpdateValueHistory = settings.shouldUpdateValueHistory !== false;
            ignoreSchemaDefaultValues = settings.ignoreSchemaDefaultValues;
            topDefaultArrayLevel = settings.topDefaultArrayLevel;
            computeValues = settings.computeValues || false;
        }
        if (computeValues) {
            this.children = [];
        }
        topDefaultArrayLevel = topDefaultArrayLevel || 0;
        if (this.parentNode) {
            this.arrayPath = _.clone(this.parentNode.arrayPath);
            if (this.parentNode.view && this.parentNode.view.array) {
                this.arrayPath.push(this.childPos);
            }
        } else {
            this.arrayPath = [];
        }
        formData.idx = this.arrayPath.length > 0 ? this.arrayPath[this.arrayPath.length - 1] + 1 : this.childPos + 1;
        formData.value = "";
        formData.getValue = function(key) {
            return getInitialValue(self.ownerTree.formDesc, key, self.arrayPath, formData, !!values);
        };
        if (this.formElement) {
            this.applyArrayPathToNodeProperties();
            this.applyTemplateToNodeProperties(formData);
        }
        var hasNonPrivateValues = _.find(values, function(value, key) {
            return key !== "$schemaId" && key !== "jsonformVersion" && key !== "schemaId";
        });
        if (hasNonPrivateValues === undefined) {
            hasNonPrivateValues = false;
        } else {
            hasNonPrivateValues = true;
        }
        if (this.view && (this.view.inputfield || this.view.previewField) && this.schemaElement) {
            var fieldValue = this.getContentDefault(values);
            var schemaDefault = this.getSchemaDefault();
            var parentKey, parentSchema;
            if (this.formElement.additionalPropertiesKey) {
                parentKey = _.dropRight(this.formElement.additionalPropertiesKey.split("/")).join("/");
                parentSchema = tbjsonAjv2Tb.getSchemaByJsonPointer(this.ownerTree.formDesc.schema, parentKey);
            } else {
                parentKey = _.dropRight(this.key.split("/")).join("/");
                parentSchema = tbjsonAjv2Tb.getSchemaByJsonPointer(this.ownerTree.formDesc.schema, this.formElement.key);
            }
            var keyBeforeLocalization = parentKey + "/" + this.ownerTree.formDesc.form.originalLocale;
            var valueBeforeLocalization = jfUtils.getObjByKey(values, keyBeforeLocalization);
            if (fieldValue !== undefined) {
                this.value = fieldValue;
                if (shouldUpdateValueHistory) {
                    this.updateValueHistory(this.value);
                }
            } else if (parentSchema && parentSchema.isMultilanguage === true && !_.isNil(valueBeforeLocalization)) {
                this.value = valueBeforeLocalization;
                if (shouldUpdateValueHistory) {
                    this.updateValueHistory(this.value);
                }
            } else if (!_.isNil(schemaDefault)) {
                if (this.description) {
                    this.description += " Suggested value: [" + schemaDefault + "]";
                } else {
                    this.description = "Suggested value: [" + schemaDefault + "]";
                }
                if (_.isString(this.value)) {
                    if (this.value.indexOf("{{values/") !== -1) {
                        this.value = this.value.replace(REGEX.MAGIC_REGEX_2, '{{getValue("$1")}}');
                    } else {
                        this.value = applyArrayPath(this.value, this.arrayPath);
                    }
                    if (this.value) {
                        this.value = _template(this.value, formData, valueTemplateSettings);
                    }
                }
                if (shouldUpdateValueHistory) {
                    this.updateValueHistory(this.value);
                }
                this.defaultValue = true;
            } else if (this.parentNode.schemaElement && this.parentNode.schemaElement.isMultilanguage) {
                var parentNodeValue = jfUtils.getObjByKey(values, parentKey);
                if (!_.isNil(parentNodeValue)) {
                    if (parentNodeValue.constructor !== Object) {
                        this.value = parentNodeValue;
                        if (shouldUpdateValueHistory) {
                            this.updateValueHistory(this.value);
                        }
                    }
                }
            } else {
                if (shouldUpdateValueHistory) {
                    this.updateValueHistory(null);
                }
            }
            _.set(this.ownerTree.formDesc.value, this.key, this.value);
        } else if (this.view && this.view.array) {
            var nbChildren = 1;
            if (hasNonPrivateValues) {
                nbChildren = this.getNumberOfItems(values, this.arrayPath);
            }
            for (var i = 0; i < nbChildren; i++) {
                var childTemplate = this.getChildTemplate(i);
                if (i == 0) {
                    childTemplate.currentCounterArray.pop();
                }
                var node = childTemplate.clone();
                if (node.children) {
                    fixChildrenPrefix(node);
                }
                this.appendChildNode(node);
            }
        } else if (this.schemaElement && this.formElement && this.formElement.type === "tableobject" && jfUtils.contains(this.schemaElement.type, "object")) {
            var additionalPropertiesContainer = jfUtils.getObjByKey(values, this.key);
            var sortedadditionalPropertiesContainer = [];
            var propertyKey;
            for (propertyKey in additionalPropertiesContainer) {
                if (additionalPropertiesContainer.hasOwnProperty(propertyKey)) {
                    sortedadditionalPropertiesContainer.push([ additionalPropertiesContainer[propertyKey], propertyKey ]);
                }
            }
            sortedadditionalPropertiesContainer.sort(function(a, b) {
                if (a[0].ordering === b[0].ordering) {
                    return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0;
                } else {
                    return a[0].ordering > b[0].ordering ? 1 : a[0].ordering < b[0].ordering ? -1 : 0;
                }
            });
            for (var idx = 0; idx < sortedadditionalPropertiesContainer.length; idx++) {
                var cloneChildNode = this.children[0].clone();
                propertyKey = sortedadditionalPropertiesContainer[idx][1];
                for (var j = 0; j < cloneChildNode.formElement.items.length; j++) {
                    var tableRowItem = cloneChildNode.formElement.items[j];
                    tableRowItem.key = replaceCurlyBracesWithData(tableRowItem.key, propertyKey);
                    var inputField = cloneChildNode.children[j];
                    setDataToField(inputField, propertyKey);
                    cloneChildNode.children[j] = inputField;
                    cloneChildNode.formElement.items[j] = tableRowItem;
                }
                this.appendChildNode(cloneChildNode);
            }
            this.children.splice(0, 1);
        }
        if (this.schemaElement && jfUtils.contains(this.schemaElement.type, "boolean") && this.formElement && this.ownerTree.formDesc.form.nullValueTitle && (this.value === undefined || this.value === null)) {
            appendNullOptionIfNotDefined(this.schemaElement, this.formElement, this.ownerTree.formDesc.form.nullValueTitle);
        }
        _.each(this.children, function(child) {
            child.computeInitialValues(values, {
                ignoreSchemaDefaultValues: ignoreSchemaDefaultValues,
                topDefaultArrayLevel: topDefaultArrayLevel
            });
        });
        if (this.formElement && this.formElement.valueInLegend) {
            var node = this;
            while (node) {
                if (node.parentNode && node.parentNode.view && node.parentNode.view.array) {
                    node.legendChild = this;
                    if (node.formElement && node.formElement.legend) {
                        node.legend = applyArrayPath(node.formElement.legend, node.arrayPath);
                        formData.idx = node.arrayPath.length > 0 ? node.arrayPath[node.arrayPath.length - 1] + 1 : node.childPos + 1;
                        formData.value = !_.isNil(this.value) ? this.value : "";
                        node.legend = _template(node.legend, _.merge(formData, this.ownerTree.formDesc.value, node.ownerTree.formDesc.currentValue), valueTemplateSettings);
                        break;
                    }
                }
                node = node.parentNode;
            }
        }
    };
    FormNode.prototype.getFormValues = function(updateArrayPath, tree) {
        ASSERT(this.el, {
            msg: "FormNode.getFormValues can't be called on nodes not associated with the tree",
            code: 3e3
        });
        var domElement = this.el;
        var values = {};
        var formArray = getArrayFieldValueHtml(domElement, tree);
        if (updateArrayPath) {
            _.each(formArray, function(param) {
                param.name = applyArrayPath(param.name, updateArrayPath);
            });
        }
        for (var i = 0; i < formArray.length; i++) {
            if (!formArray[i].name) {
                continue;
            }
            ASSERT_USER(formArray[i].name, {
                msg: "Unknown field name",
                code: 3030
            });
            var name = formArray[i].name;
            var eltSchema = tbjsonAjv2Tb.getSchemaByJsonPointer(this.ownerTree.formDesc.schema, name);
            if (!eltSchema) {
                continue;
            }
            if (jfUtils.getJsonType(formArray[i]) === "string") {
                formArray[i].value = _.trim(formArray[i].value);
            }
            formArray[i].value = jfUtils.forceValueTypes(this.ownerTree.formDesc.schema, eltSchema, formArray[i].value, name);
            if (formArray[i].name) {
                jfUtils.setObjValueByKey(values, formArray[i].name, formArray[i].value);
            }
        }
        if (tree && tree.removeFieldsFromForm) {
            for (var key in tree.removeFieldsFromForm) {
                var obj = jfUtils.getObjByKey(values, key);
                for (var i = 0; i < tree.removeFieldsFromForm[key].length; i++) {
                    delete obj[tree.removeFieldsFromForm[key][i]];
                }
            }
        }
        return values;
    };
    FormNode.prototype.resetValues = function() {
        var params = null;
        this.value = null;
        if (this.parentNode) {
            this.arrayPath = _.clone(this.parentNode.arrayPath);
            if (this.parentNode.view && this.parentNode.view.array) {
                this.arrayPath.push(this.childPos);
            }
        } else {
            this.arrayPath = [];
        }
        if (this.view && this.view.inputfield) {
            params = $(":input", this.el).serializeArray();
            _.each(params, function(param) {
                $('[name="' + escapeSelector(param.name) + '"]', $(this.el)).val("");
            }.bind(this));
        } else if (this.view && this.view.array) {
            while (this.children.length > 0) {
                this.removeChild();
            }
        }
        _.each(this.children, function(child) {
            child.resetValues();
        });
    };
    FormNode.prototype.moveValuesToNode = function(node) {
        var values = this.getFormValues(node.arrayPath);
        node.resetValues();
        node.computeInitialValues(values, {
            ignoreSchemaDefaultValues: true
        });
    };
    FormNode.prototype.switchValuesWithNode = function(node) {
        var currentNodeValues = this.getFormValues(node.arrayPath);
        var substituteNodeValues = node.getFormValues(this.arrayPath);
        node.resetValues();
        this.resetValues();
        node.computeInitialValues(currentNodeValues, {
            ignoreSchemaDefaultValues: true
        });
        this.computeInitialValues(substituteNodeValues, {
            ignoreSchemaDefaultValues: true
        });
    };
    FormNode.prototype.validate = function(value) {
        var validationValue = constructObjectByKey(this.formElement.key, value);
        $(this.ownerTree).jsonFormClearErrors({
            dataPath: this.formElement.key
        });
        this.ownerTree.validate({
            values: validationValue,
            clearOldErrors: false
        });
    };
    FormNode.prototype.hasNonDefaultValue = function() {
        if (this.formElement && this.formElement.type === "hidden") {
            return false;
        }
        if (this.value && !this.defaultValue) {
            return true;
        }
        var child = _.find(this.children, function(child) {
            return child.hasNonDefaultValue();
        });
        return !!child;
    };
    FormNode.prototype.activateValueHistoryEventHandlers = function() {
        if (this.formElement.enableReset || this.formElement.enableUndo || this.formElement.enableRedo) {
            var self = this;
            var valueControls = $(this.el).find("> .controls > .tb-jf-value-history-buttons");
            if (this.formElement.enableReset) {
                var resetButton = valueControls.find("> .tb-jf-value-history-reset");
                ASSERT(resetButton, {
                    msg: "The reset button for schema element $FORMKEY$ did not render properly.",
                    msgParams: {
                        FORMKEY: this.formElement.key
                    },
                    code: 3040
                });
                resetButton.bind("click", function(evt) {
                    self.setValueHistoryAbsPos(0);
                });
            }
            if (this.formElement.enableUndo) {
                var undoButton = valueControls.find("> .tb-jf-value-history-undo");
                ASSERT(undoButton, {
                    msg: "The undo button for schema element $FORMKEY$ did not render properly",
                    msgParams: {
                        FORMKEY: this.formElement.key
                    },
                    code: 3050
                });
                undoButton.bind("click", function(evt) {
                    self.setValueHistoryRelPos(-1);
                });
            }
            if (this.formElement.enableRedo) {
                var redoButton = valueControls.find("> .tb-jf-value-history-redo");
                ASSERT(redoButton, {
                    msg: "The redo button for schema element $FORMKEY$ did not render properly",
                    msgParams: {
                        FORMKEY: this.formElement.key
                    },
                    code: 3060
                });
                redoButton.bind("click", function(evt) {
                    self.setValueHistoryRelPos(1);
                });
            }
        }
    };
    FormNode.prototype.updateValueHistory = function(value, validate) {
        if (value === undefined) {
            value = null;
        }
        if (this.valueHistory.length === 0 || typeof this.valueHistory[this.valueHistory.length - 1] === "object" && !_.isEqual(value, this.valueHistory[this.valueHistory.length - 1]) || typeof this.valueHistory[this.valueHistory.length - 1] !== "object" && value !== this.valueHistory[this.valueHistory.length - 1]) {
            this.activeValueHistoryIdx = this.valueHistory.push(value) - 1;
        }
        if (validate && jsonform.formTree.formDesc.form.liveValidation) {
            this.validate(value);
        }
        ASSERT(this.valueHistory.length >= 1, {
            msg: "No value given.",
            code: 3070
        });
        var element = $(this.el);
        if (this.valueHistory.length === 1) {
            element.addClass("tb-jf-original-value");
        } else {
            element.addClass("tb-jf-dirty-value");
            if (this.valueHistory[0] === value) {
                element.addClass("tb-jf-original-value");
            } else {
                element.removeClass("tb-jf-original-value");
            }
        }
        if (!this.ownerTree.isAlreadyTriggeredChange) {
            setTimeout(function() {
                $(this.ownerTree.domRoot).trigger("jsonformsChange");
                this.ownerTree.isAlreadyTriggeredChange = false;
            }.bind(this));
            this.ownerTree.isAlreadyTriggeredChange = true;
        }
    };
    FormNode.prototype.setValueHistoryAbsPos = function(position) {
        ASSERT(_.isInteger(position), {
            code: 3080,
            msg: "setValueHistoryPos: position must be an integer for key $FORMKEY$.",
            msgParams: {
                FORMKEY: this.formElement.key
            }
        });
        var historicalValue = null;
        var historicalPosition = position;
        var historyMaxIdx = this.valueHistory.length - 1;
        if (historicalPosition < 0) {
            historicalPosition++;
            if (Math.abs(historicalPosition) > historyMaxIdx) {
                historicalPosition = 0;
            } else {
                historicalPosition = historyMaxIdx + historicalPosition;
            }
        } else if (historicalPosition > historyMaxIdx) {
            historicalPosition = historyMaxIdx;
        }
        this.activeValueHistoryIdx = historicalPosition;
        historicalValue = this.valueHistory[historicalPosition];
        var values = constructObjectByKey(this.formElement.key, historicalValue);
        this.computeInitialValues(values, {
            ignoreSchemaDefaultValues: true,
            shouldUpdateValueHistory: false
        });
        this.shouldEnhanceFunc();
        console.info("Calling Render 10: from the FormNode.setValueHistoryAbsPos method");
        this.render();
    };
    FormNode.prototype.setValueHistoryRelPos = function(position) {
        ASSERT(_.isInteger(position), {
            msg: "setValueHistoryPos: position must be an integer for key $KEY$.",
            msgParams: {
                KEY: this.formElement.key
            },
            code: 3090
        });
        var historicalValue = null;
        var historicalPosition = this.activeValueHistoryIdx + position;
        var historyMaxIdx = this.valueHistory.length - 1;
        if (historicalPosition < 0) {
            historicalPosition = 0;
        } else if (historicalPosition > historyMaxIdx) {
            historicalPosition = historyMaxIdx;
        }
        this.activeValueHistoryIdx = historicalPosition;
        historicalValue = this.valueHistory[historicalPosition];
        var values = constructObjectByKey(this.formElement.key, historicalValue);
        this.computeInitialValues(values, {
            ignoreSchemaDefaultValues: true,
            shouldUpdateValueHistory: false
        });
        console.info("Calling Render 11: from the FormNode.setValueHistoryRelPos method");
        this.render(this.el);
    };
    FormNode.prototype.clone = function(parentNode) {
        this.currentClone = this.currentClone || 1;
        var parentCurrentCounterArray = _.clone(this.currentCounterArray);
        parentCurrentCounterArray.push(this.currentClone);
        var node = new FormNode();
        node.currentCounterArray = parentCurrentCounterArray;
        node.childPos = this.childPos;
        node.arrayPath = _.clone(this.arrayPath);
        node.ownerTree = this.ownerTree;
        node.parentNode = parentNode || this.parentNode;
        node.formElement = _.clone(this.formElement);
        node.schemaElement = this.schemaElement;
        node.view = this.view;
        node.children = _.map(this.children, function(child) {
            return child.clone(node);
        });
        this.currentClone += 1;
        node.currentClone = this.currentClone;
        return node;
    };
    FormNode.prototype.getChildNodeByKey = function(key, shouldDie) {
        ASSERT.isString(key, {
            msg: "getChildNodeByKey expected key to be a string.",
            code: 3100
        });
        shouldDie = _.isUndefined(shouldDie) ? true : shouldDie;
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].key && key === getInnermostJsonPathKey(this.children[i].key)) {
                return this.children[i];
            }
        }
        ASSERT(!shouldDie, {
            msg: "getChildNodeByKey: a node with the given path does not exist.",
            code: 3110
        });
    };
    FormNode.prototype.getChildNodeByKeyPath = function(keyPath, shouldDie) {
        shouldDie = _.isUndefined(shouldDie) ? true : shouldDie;
        ASSERT.isString(keyPath, {
            msg: "getNodeByKey expected key to be a string.",
            code: 3120
        });
        var childNodeKeys = convertJsonPathStringToArray(keyPath);
        var node = this.getChildNodeByKey(childNodeKeys[0], shouldDie);
        if (node === undefined) return;
        for (var i = 1; i < childNodeKeys.length; i++) {
            if (node === undefined) {
                return node;
            }
            node = node.getChildNodeByKey(childNodeKeys[i], shouldDie);
        }
        return node;
    };
    FormNode.prototype.getProperty = function(prop, searchInParents) {
        var value = this[prop];
        if (value !== undefined || !searchInParents || !this.parentNode) {
            return value;
        }
        return this.parentNode.getProperty(prop, true);
    };
    FormNode.prototype.isReadOnly = function() {
        return this.getProperty("readOnly", true);
    };
    FormNode.prototype.getChildTemplate = function(currIdx) {
        currIdx = currIdx || 1;
        if (!this.childTemplate) {
            if (this.view.array) {
                var key;
                if (this.formElement.items) {
                    key = this.formElement.items[0] || this.formElement.items;
                } else {
                    key = this.formElement.key + "[]";
                }
                if (_.isString(key)) {
                    key = {
                        key: key
                    };
                }
                key.currentCounterArray = _.clone(this.currentCounterArray);
                key.currentCounterArray.push(currIdx);
                var child = this.ownerTree.buildFromLayout(key, this.formElement);
                if (child) {
                    this.setChildTemplate(child);
                }
            }
        }
        return this.childTemplate;
    };
    FormNode.prototype.arrayHasMoreThanOneItemInside = function() {
        return this.formElement.items && this.formElement.items.length > 1;
    };
    FormNode.prototype.setChildTemplate = function(node) {
        this.childTemplate = node;
        node.parentNode = this;
    };
    FormNode.prototype.applyArrayPathToNodeProperties = function() {
        if (this.formElement.id) {
            this.id = escapeSelector(this.ownerTree.formDesc.form.prefix);
            if (this.view.hasOwnProperty("inputfield") && this.view.inputfield) {
                this.id += "-field-id-";
            } else {
                this.id += "-container-id-";
            }
            this.id += jfUtils.escapeId(applyArrayPath(this.formElement.id, this.arrayPath));
        } else if (this.view && this.view.array) {
            this.id = escapeSelector(this.ownerTree.formDesc.form.prefix) + "-elt-counter-" + _.uniqueId();
        } else if (this.parentNode && this.parentNode.view && this.parentNode.view.array) {
            this.id = escapeSelector(this.ownerTree.formDesc.form.prefix) + "-elt-counter-" + _.uniqueId();
        } else if (this.formElement.type === "button" || this.formElement.type === "selectfieldset" || this.formElement.type === "tabobject" || this.formElement.type === "question" || this.formElement.type === "buttonquestion") {
            this.id = escapeSelector(this.ownerTree.formDesc.form.prefix) + "-elt-counter-" + _.uniqueId();
        }
        if (this.formElement.key) {
            this.key = applyArrayPath(this.formElement.key, this.arrayPath);
            this.selectorKey = jfUtils.escapeId(this.key);
        }
        this.name = applyArrayPath(this.formElement.name, this.arrayPath);
        if (this.name) {
            var replacedKey = this.name.replace(/\[(\d+?)\]/g, "/$1");
            this.ownerTree.keyToNode[replacedKey] = this;
        }
    };
    FormNode.prototype.applyTemplateToNodeProperties = function(formData) {
        _.each([ "title", "legend", "description", "append", "prepend", "helpvalue", "value", "disabled", "required", "placeholder", "readOnly" ], function(prop) {
            if (_.isString(this.formElement[prop])) {
                if (this.formElement[prop].indexOf("{{values/") !== -1) {
                    this[prop] = this.formElement[prop].replace(REGEX.MAGIC_REGEX_2, '{{getValue("$1")}}');
                } else {
                    this[prop] = applyArrayPath(this.formElement[prop], this.arrayPath);
                }
                if (this[prop]) {
                    this[prop] = _template(this[prop], _.merge(formData, this.ownerTree.formDesc.value, this.ownerTree.formDesc.currentValue), valueTemplateSettings);
                }
            } else {
                this[prop] = this.formElement[prop];
            }
        }.bind(this));
        if (this.formElement.options) {
            this.options = _.map(this.formElement.options, function(option) {
                var title = null;
                if (_.isObject(option) && option.title) {
                    if (option.title.indexOf("{{values/") !== -1) {
                        title = option.title.replace(REGEX.MAGIC_REGEX_2, '{{getValue("$1")}}');
                    } else {
                        title = applyArrayPath(option.title, self.arrayPath);
                    }
                    return _.extend({}, option, {
                        value: !_.isNil(option.value) ? option.value : "",
                        title: _template(title, formData, valueTemplateSettings)
                    });
                } else {
                    return option;
                }
            });
        }
    };
    FormNode.prototype.appendChildNode = function(node) {
        node.parentNode = this;
        node.childPos = this.children.length;
        this.children.push(node);
        return node;
    };
    FormNode.prototype.removeChild = function() {
        var child = this.children[this.children.length - 1];
        if (!child) {
            return;
        }
        $(child.el).remove();
        child.shouldEnhanceFunc();
        console.info("Calling Render 12: from the FormNode.removeChild method");
        child.render();
        return this.children.pop();
    };
    FormNode.prototype.getNumberOfItems = function(values, arrayPath) {
        var key = null;
        var arrayValue = null;
        var childNumbers = null;
        if (!values) {
            return 0;
        }
        if (this.view.inputfield && this.schemaElement) {
            key = truncateToArrayDepth(this.formElement.key, arrayPath.length);
            key = applyArrayPath(key, arrayPath);
            arrayValue = jfUtils.getObjByKey(values, key);
            if (!arrayValue) {
                return 0;
            }
            childNumbers = _.map(this.children, function(child) {
                return child.getNumberOfItems(values, arrayPath);
            });
            return _.max([ _.max(childNumbers) || 0, arrayValue.length ]);
        } else if (this.schemaElement && jfUtils.contains(this.schemaElement.type, "object") && !this.view.containerField) {
            var object = jfUtils.getObjByKey(values, this.key);
            var numberOfItems = 0;
            for (key in object) {
                if (object.hasOwnProperty(key)) {
                    numberOfItems += 1;
                }
            }
            return numberOfItems;
        } else if (this.view.array) {
            return this.getChildTemplate().getNumberOfItems(values, arrayPath);
        } else {
            childNumbers = _.map(this.children, function(child) {
                return child.getNumberOfItems(values, arrayPath);
            });
            return _.max(childNumbers) || 0;
        }
    };
    var fixChildrenPrefix = function(node) {
        var stack = _.clone(node.children);
        while (stack.length) {
            var currEl = stack.pop();
            for (var k = 0; k < node.currentCounterArray.length; k++) {
                currEl.currentCounterArray[k] = node.currentCounterArray[k];
            }
            if (currEl.children) {
                for (var i = 0; i < currEl.children.length; i++) {
                    stack.push(currEl.children[i]);
                }
            }
            currEl.currentCounterArray.pop();
        }
    };
    FormNode.prototype.insertArrayItem = function(idx, domElement) {
        ASSERT.isNumberOrNil(idx, {
            msg: "insertArrayItem expected array index to be a number",
            code: 3130
        });
        var i = 0;
        if (idx === undefined) {
            idx = this.children.length;
        }
        var childTemplate = this.getChildTemplate();
        childTemplate.currentClone = idx + 1;
        var child = childTemplate.clone();
        if (child.children) {
            fixChildrenPrefix(child);
        }
        this.appendChildNode(child);
        child.resetValues();
        for (i = this.children.length - 2; i >= idx; i--) {
            this.children[i].moveValuesToNode(this.children[i + 1]);
        }
        this.children[idx].resetValues();
        this.children[idx].computeInitialValues(null, {
            ignoreSchemaDefaultValues: true,
            topDefaultArrayLevel: this.children[idx].arrayPath.length
        });
        for (i = idx; i < this.children.length; i++) {
            this.children[i].shouldEnhanceFunc();
            console.info("Calling Render 13: from the FormNode.insertArrayItem method");
            this.children[i].render(domElement);
        }
    };
    FormNode.prototype.deleteArrayItem = function(idx) {
        ASSERT.isNumberOrNil(idx, {
            msg: "insertArrayItem expected array index to be a number",
            code: 3140
        });
        var shouldDelete = confirm("Are you sure?");
        if (shouldDelete !== true) {
            return;
        }
        var lastIndex = this.children.length - 1;
        if (idx === undefined || idx > lastIndex) {
            idx = lastIndex;
        }
        for (var i = idx; i < lastIndex; i++) {
            this.children[i + 1].moveValuesToNode(this.children[i]);
            this.children[i].shouldEnhanceFunc();
            console.info("Calling Render 14: from the FormNode.deleteArrayItem method");
            this.children[i].render();
        }
        this.removeChild();
    };
    FormNode.prototype.getArrayLimits = function() {
        var arrayLimits = {
            minItems: -1,
            maxItems: -1
        };
        if (!this.view || !this.view.array) {
            return arrayLimits;
        }
        var getNodeArrayLimits = function(node, initialNode) {
            var schemaKey = null;
            var arrayKey = null;
            var arrayLimits = {
                minItems: -1,
                maxItems: -1
            };
            initialNode = initialNode || node;
            if (node.view && node.view.array && node !== initialNode) {
                return arrayLimits;
            }
            if (node.key) {
                arrayKey = node.key.replace(REGEX.REMOVE_NUMBERS_FROM_ARRAY_INDEX_IN_INPUT_FIELD, "[]");
                if (node !== initialNode) {
                    arrayKey = arrayKey.replace(REGEX.GET_CLOSEST_ARRAY_PARENT, "");
                }
                schemaKey = tbjsonAjv2Tb.getSchemaByJsonPointer(node.ownerTree.formDesc.schema, arrayKey);
                if (!schemaKey) {
                    return arrayLimits;
                }
                if (schemaKey.minItems >= 0) {
                    arrayLimits.minItems = schemaKey.minItems;
                }
                if (schemaKey.maxItems >= 0) {
                    arrayLimits.maxItems = schemaKey.maxItems;
                }
                if (schemaKey.enableDeletingItems !== undefined) {
                    arrayLimits.enableDeletingItems = schemaKey.enableDeletingItems;
                }
                if (schemaKey.enableAddingItems !== undefined) {
                    arrayLimits.enableAddingItems = schemaKey.enableAddingItems;
                }
                if (schemaKey.enableSorting !== undefined) {
                    arrayLimits.enableSorting = schemaKey.enableSorting;
                }
                return arrayLimits;
            } else {
                _.each(node.children, function(child) {
                    var subArrayLimits = getNodeArrayLimits(child, initialNode);
                    if (subArrayLimits.minItems !== -1) {
                        if (arrayLimits.minItems !== -1) {
                            arrayLimits.minItems = Math.max(arrayLimits.minItems, subArrayLimits.minItems);
                        } else {
                            arrayLimits.minItems = subArrayLimits.minItems;
                        }
                    }
                    if (subArrayLimits.maxItems !== -1) {
                        if (arrayLimits.maxItems !== -1) {
                            arrayLimits.maxItems = Math.min(arrayLimits.maxItems, subArrayLimits.maxItems);
                        } else {
                            arrayLimits.maxItems = subArrayLimits.maxItems;
                        }
                    }
                    if (subArrayLimits.enableDeletingItems !== undefined) {
                        arrayLimits.enableDeletingItems = subArrayLimits.enableDeletingItems;
                    }
                    if (subArrayLimits.enableAddingItems !== undefined) {
                        arrayLimits.enableAddingItems = subArrayLimits.enableAddingItems;
                    }
                    if (subArrayLimits.enableSorting !== undefined) {
                        arrayLimits.enableSorting = subArrayLimits.enableSorting;
                    }
                });
            }
            return arrayLimits;
        };
        return getNodeArrayLimits(this);
    };
    FormNode.prototype.shouldEnhanceFunc = function() {
        this.shouldEnhance = true;
        _.each(this.children, function(child) {
            child.shouldEnhanceFunc();
        });
    };
    FormNode.prototype.enhance = function(shouldFilter) {
        if (_.isUndefined(shouldFilter)) {
            shouldFilter = true;
        }
        if (!this.shouldEnhance) {
            return;
        }
        this.shouldEnhance = false;
        var node = this;
        var handlers = null;
        var insertHandler = null;
        var formData = _.clone(this.ownerTree.formDesc.tpldata) || {};
        function onLegendChildChange(evt) {
            if (node.formElement && node.formElement.legend && node.parentNode) {
                node.legend = applyArrayPath(node.formElement.legend, node.arrayPath);
                formData.idx = node.arrayPath.length > 0 ? node.arrayPath[node.arrayPath.length - 1] + 1 : node.childPos + 1;
                formData.value = $(evt.target).val();
                node.legend = _template(node.legend, _.merge(formData, node.ownerTree.formDesc.value, node.ownerTree.formDesc.currentValue), valueTemplateSettings);
                $(node.parentNode.el).trigger("legendUpdated");
            }
        }
        if (this.formElement) {
            if (this.view.onInsert) {
                this.view.onInsert({
                    target: $(this.el)
                }, this);
            }
            insertHandler = this.onInsert || this.formElement.onInsert;
            if (insertHandler) {
                insertHandler({
                    target: $(this.el)
                }, this);
            }
            if (this.mustUpdateEventHandlers) {
                this.mustUpdateEventHandlers = false;
                for (var i = 0; i < this.children.length; i++) {
                    this.children[i].mustUpdateEventHandlers = true;
                }
                if (typeof this.initializeEventHandlers === "function") {
                    this.initializeEventHandlers();
                }
            }
            handlers = this.handlers || this.formElement.handlers;
            if (handlers) {
                _.each(handlers, function(handler, onevent) {
                    if (onevent === "insert") {
                        handler({
                            target: $(this.el)
                        }, this);
                    }
                }.bind(this));
            }
            if (this.el) {
                node.activateValueHistoryEventHandlers();
                if (this.onChange) {
                    $(this.el).bind("change", function(evt) {
                        node.onChange(evt, node);
                    });
                }
                if (this.view.onChange) {
                    $(this.el).bind("change", function(evt) {
                        node.view.onChange(evt, node);
                    });
                }
                if (this.formElement.onChange) {
                    $(this.el).on("change", "#" + node.id, function(evt) {
                        node.formElement.onChange(evt, node);
                    });
                }
                if (this.onClick) {
                    $(this.el).bind("click", function(evt) {
                        node.onClick(evt, node);
                    });
                }
                if (this.view.onClick) {
                    $(this.el).bind("click", function(evt) {
                        node.view.onClick(evt, node);
                    });
                }
                if (this.formElement.onClick) {
                    if (node.id) {
                        $(document).on("click", "#" + node.id, function(evt) {
                            node.formElement.onClick(evt, node);
                        });
                    } else {
                        $(this.el).bind("click", function(evt) {
                            node.formElement.onClick(evt, node);
                        });
                    }
                }
                if (this.onKeyUp) {
                    $(this.el).bind("keyup", function(evt) {
                        node.onKeyUp(evt, node);
                    });
                }
                if (this.view.onKeyUp) {
                    $(this.el).bind("keyup", function(evt) {
                        node.view.onKeyUp(evt, node);
                    });
                }
                if (this.formElement.onKeyUp) {
                    $(this.el).bind("keyup", function(evt) {
                        node.formElement.onKeyUp(evt, node);
                    });
                }
                if (handlers) {
                    _.each(handlers, function(handler, onevent) {
                        if (onevent !== "insert") {
                            $(this.el).bind(onevent, function(evt) {
                                handler(evt, node);
                            });
                        }
                    }.bind(this));
                }
                if (this.schemaElement) {
                    $(this.el).bind("change", function(evt) {
                        var values = node.getFormValues();
                        var nullableValue = jfUtils.getObjByKey(values, node.key);
                        if (jsonform.elementTypes[node.formElement.type].inputfield === true) {
                            node.updateValueHistory(nullableValue, true);
                        } else {}
                    });
                    $(this.el).bind("jfValChange", function(evt) {
                        var values = node.getFormValues();
                        var nullableValue = jfUtils.getObjByKey(values, node.key);
                        if (jsonform.elementTypes[node.formElement.type].inputfield === true) {
                            node.updateValueHistory(nullableValue, true);
                        } else {}
                    });
                }
            }
            if (this.formElement.legend && this.legendChild && this.legendChild.formElement) {
                $(this.legendChild.el).on("keyup", onLegendChildChange);
                $(this.legendChild.el).on("change", onLegendChildChange);
            }
        }
        _.each(this.children, function(child) {
            child.enhance();
        });
    };
    FormNode.prototype.markChildEventHandlersForUpdate = function() {
        ASSERT.isArray(this.children, {
            msg: "invalid value type",
            code: 3150
        });
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].mustUpdateEventHandlers = true;
        }
    };
    FormNode.prototype.lock = function() {
        if (this.formElement && !this.formElement.readOnly && jsonform.elementTypes[this.formElement.type].lock) {
            this.isLocked = true;
            jsonform.elementTypes[this.formElement.type].lock(this);
        }
        _.each(this.children, function(child) {
            child.lock();
        });
    };
    FormNode.prototype.unlock = function() {
        if (this.formElement && this.isLocked) {
            this.isLocked = false;
            jsonform.elementTypes[this.formElement.type].unlock(this);
        }
        _.each(this.children, function(child) {
            child.unlock();
        });
    };
    FormNode.prototype.checkIfNodeSupportsEnumTemplate = function() {
        return this.formElement.type === "selecttemplate";
    };
    FormNode.prototype.getForeignKeyData = function(shouldGetFilters) {
        var foreignKeyData = {};
        if (shouldGetFilters) {
            var parsedData = [];
            var data = this.filtersTree.root.getFormValues();
            _.each(data, function(el) {
                if (el.operator === "LIKE") {
                    el.value = "%" + el.value + "%";
                }
                parsedData.push(el);
            });
            foreignKeyData.filters = parsedData;
            foreignKeyData.filterSchemaId = _.get(this.filtersTree, "root.ownerTree.formDesc.schema.id", null);
        }
        return _.merge(foreignKeyData, {
            refCol: this.schemaElement.refCol,
            refTable: this.schemaElement.refTable,
            pathToField: this.key
        });
    };
    FormNode.prototype.initExpectingSearchValue = function() {
        this.expectingSearchValue = !!this.expectingSearchValue;
    };
    FormNode.prototype.smartRender = function() {
        this.render();
    };
    FormNode.prototype.setFkeyValues = function(values, err) {
        if (err) {
            if (this.node.ownerTree.formDesc.form.enableFieldLockOnSearch) {
                this.node.unlock();
            }
            this.node.expectingSearchValue = false;
            this.node.filtersTree.unlock();
            removeLoadingAnimation(this.node.filtersTree.root.el);
            return;
        }
        values = values.result || values;
        var node = this.node;
        var $notFoundSpan = $(node.filtersTree.root.el).find("fieldset > div > span");
        if (_.isUndefined(values[0])) {
            if (node.ownerTree.formDesc.form.enableFieldLockOnSearch) {
                node.unlock();
            }
            node.expectingSearchValue = false;
            node.filtersTree.unlock();
            removeLoadingAnimation(node.filtersTree.root.el);
            node.schemaElement.enum = [];
            node.schemaElement.enumTemplate = [];
            node.ownerTree.formDesc.form.templateData && (node.ownerTree.formDesc.form.templateData[node.formElement.key] = []);
            node.options = [];
            node.smartRender();
            $notFoundSpan.show();
            $notFoundSpan.parent().addClass(jsonform.defaultClasses.groupMarkClassPrefix + "error");
            return;
        } else {
            $notFoundSpan.hide();
        }
        var getLabel = function(value) {
            return value === null ? this.formDesc.form.nullValueTitle : value.toString();
        };
        var type = node.schemaElement.type;
        var nodeHasTemplate = node.checkIfNodeSupportsEnumTemplate();
        var refCol = this.data.refCol;
        var refColTitle = node.getRefColTitle(values);
        ASSERT(_.isPlainObject(values[0]), {
            code: 3170,
            msg: "Bad input: Expected String or Integer, got $PARAM$",
            msgParams: {
                PARAM: typeof values[0]
            }
        });
        ASSERT(!_.isUndefined(refColTitle) || !nodeHasTemplate, {
            code: 3175,
            msg: "Unable to find ref column title in input values! Please check you'r schema and data if refColTitle is present and if yes, if refColTitle key has value equal to key in the data object"
        });
        ASSERT((jfUtils.contains(this.node.schemaElement.type, "number") || jfUtils.contains(this.node.schemaElement.type, "integer")) && _.isInteger(values[0][refCol]) || jfUtils.contains(this.node.schemaElement.type, "string") && _.isString(values[0][refCol]), {
            code: 3178,
            msg: "Unable to find ref column title in input values! Please check your schema and data if refColTitle is present and if yes, if refColTitle key has value equal to key in the data object"
        });
        var enumValues = values.map(function(value) {
            return value[refCol];
        });
        var enumTitles = values.map(function(value) {
            return value[refColTitle];
        });
        var keys = values.map(function(value) {
            return {
                value: value[refCol],
                title: value[refColTitle]
            };
        });
        node.schemaElement.enum = enumValues;
        if (nodeHasTemplate) {
            node.ownerTree.formDesc.form.templateData = node.ownerTree.formDesc.form.templateData || {};
            node.ownerTree.formDesc.form.templateData[node.formElement.key] = values;
        } else {
            node.schemaElement.enumNames = enumTitles;
        }
        node.options = keys;
        if (node.ownerTree.formDesc.form.enableFieldLockOnSearch) {
            node.unlock();
        }
        node.expectingSearchValue = false;
        node.filtersTree.unlock();
        removeLoadingAnimation(node.filtersTree.root.el);
        node.smartRender();
        if (nodeHasTemplate) {
            var $element = $(node.el);
            $element.find("select:not([filtertreeselect])")[0].selectize.addItem(enumValues[0]);
        }
        var schema = node.ownerTree.formDesc.schema;
        var validator = node.ownerTree.formDesc.validator;
        validator.removeSchema(schema.id);
        validator.compile(schema, schema.id);
    };
    FormNode.prototype.getRefColTitle = function(values) {
        if (this.schemaElement.refColTitle) {
            var refColTitleKeyCandidate = [ this.schemaElement.refColTitle ];
        } else {
            var refColTitleKeyCandidate = this.formElement.defaultRefColTitleKeys;
        }
        var refColTitleKey = undefined;
        for (var i = refColTitleKeyCandidate.length - 1; i >= 0; i--) {
            if (values[0].hasOwnProperty(refColTitleKeyCandidate[i])) {
                refColTitleKey = refColTitleKeyCandidate[i];
                break;
            }
        }
        return refColTitleKey;
    };
    FormNode.prototype.sendForeignKeyEvent = function() {
        var data = this.getForeignKeyData(false);
        var addForeignKeyEvent = new CustomEvent("jf_addFKey", {
            detail: {
                data: data,
                node: this
            }
        });
        jsonform.formTree.domRoot.dispatchEvent(addForeignKeyEvent);
    };
    var changeForeignKeySearchOptions = function(domElement, node, currentNode) {
        var selectedValue = domElement.value;
        var selectedValueType = node.foreignKeyData.keys[selectedValue];
        var selectedValueTypeDefault = node.foreignKeyData.typeDefaultValues && node.foreignKeyData.typeDefaultValues[selectedValueType];
        var selectedValueTypeDefaultTitle = node.foreignKeyData.typeDefaultValues && node.foreignKeyData.typeDefaultValuesTitles[selectedValueType];
        var permitedOperators = node.foreignKeyData.operators[selectedValueType];
        var permitedOperatorsTitles = node.foreignKeyData.operatorNames[selectedValueType];
        var changedKey = currentNode.key.split("/")[0];
        var schema = node.filtersTree.formDesc.schema;
        var form = node.filtersTree.formDesc.form;
        schema.properties[changedKey] = node.createNewItem(selectedValueType, permitedOperators, permitedOperatorsTitles, selectedValueTypeDefault, selectedValueTypeDefaultTitle);
        var values = node.filtersTree.root.getFormValues();
        _.forEach(values, function(el) {
            if (el.value === "true" || el.value === "false") {
                el.value = "";
            }
        });
        node.filtersTree.createAndAppendNewFiltersTree(schema, form, values, node, true);
    };
    var handleFKeyDelete = function(domElement, node, currentNode) {
        if (node.foreignKeyData.currentNumberOfRows === 1) {
            return;
        }
        var schema = node.filtersTree.formDesc.schema;
        var form = node.filtersTree.formDesc.form;
        var validator = new tbjsonAjv2Tb.getAjv2tbInstance();
        var currentRowKey = currentNode.parent.key;
        var deleteIndex = 0;
        _.each(form.fields[0].items, function(el, idx) {
            if (el.key === currentRowKey) {
                deleteIndex = idx;
            }
        });
        if (deleteIndex === 0) {
            _.each(form.fields[0].items[1].items, function(el) {
                el.notitle = false;
            });
        }
        form.fields[0].items.splice(deleteIndex, 1);
        delete schema.properties[currentRowKey];
        validator.compile(schema);
        var values = node.filtersTree.root.getFormValues();
        node.filtersTree.createAndAppendNewFiltersTree(schema, form, values, node, true);
        node.foreignKeyData.currentNumberOfRows -= 1;
    };
    FormNode.prototype.handleFKeyNewRow = function(shouldAddNewRow) {
        this.foreignKeyData.currentIndex += 1;
        this.foreignKeyData.currentNumberOfRows += 1;
        var values = this.filtersTree.root.getFormValues();
        var newRowIndex = this.foreignKeyData.currentIndex;
        var schema = this.filtersTree.formDesc.schema;
        var form = this.filtersTree.formDesc.form;
        if (_.isUndefined(shouldAddNewRow) || _.isUndefined(shouldAddNewRow) && shouldAddNewRow) {
            schema.properties["filtersArray" + newRowIndex] = this.createNewItem();
            form.fields[0].items.push(this.createNewFormItem());
        }
        this.filtersTree.createAndAppendNewFiltersTree(schema, form, values, this, true);
    };
    FormNode.prototype.handleFkeySearch = function() {
        this.initExpectingSearchValue();
        ASSERT(this.expectingSearchValue === false, {
            msg: "Another foreign key search is in progress.",
            code: 3160
        });
        var result = this.filtersTree.validate({
            values: this.filtersTree.root.getFormValues(),
            clearOldErrors: true
        });
        if (result.errors || _.isEmpty(result.values)) {
            this.expectingSearchValue = false;
            return;
        }
        this.expectingSearchValue = true;
        var data = this.getForeignKeyData(true);
        displayLoadingAnimation(this.filtersTree.root.el);
        this.filtersTree.lock();
        var searchEvent = new CustomEvent("jf_specialSearch", {
            detail: {
                data: data,
                node: this,
                cb: this.setFkeyValues
            }
        });
        if (this.ownerTree.formDesc.form.enableFieldLockOnSearch) {
            this.lock();
        }
        jsonform.formTree.domRoot.dispatchEvent(searchEvent);
    };
    var getNonNullType = function(types) {
        return types.filter(function(el) {
            return el !== "null";
        })[0];
    };
    var createForeignKeySchemaFromSchema = function(rootSchema, schema, elementTitle, node) {
        if (schema.$ref) {
            schema = jfUtils.resolveRefs(rootSchema, schema, true);
        }
        node.foreignKeyData = {
            operators: {
                string: [ "=", "LIKE" ],
                boolean: [ "=" ],
                number: [ "<", ">", "=", ">=", "<=" ]
            },
            operatorNames: {
                string: [ "equals", "contains" ],
                boolean: [ "equals" ],
                number: [ "less than", "more than", "equals", "more than or equals", "less than or equals" ]
            },
            typeDefaultValuesTitles: {
                boolean: [ "YES", "NO" ]
            },
            typeDefaultValues: {
                boolean: [ true, false ]
            },
            currentIndex: 0,
            currentNumberOfRows: 1,
            keys: {}
        };
        var filteredProperties = [];
        var idx = 0;
        _.forOwn(schema.properties, function(val, key) {
            val = tbjsonAjv2Tb.getSchemaByJsonPointer(schema, key);
            if (val.searchBy) {
                filteredProperties[idx] = {
                    key: key,
                    o: val.ordering || Infinity
                };
                node.foreignKeyData.keys[key] = _.isArray(val.type) ? getNonNullType(val.type) : val.type;
                idx += 1;
            }
        });
        var orderedProperties = _.sortBy(filteredProperties, [ "o" ]);
        var orderedPropertiesKeys = _.map(orderedProperties, function(el) {
            return el.key;
        });
        if (!orderedPropertiesKeys.length) {
            return null;
        }
        node.foreignKeyData.filterEnum = orderedPropertiesKeys;
        node.foreignKeyData.title = elementTitle;
        var augmentedSchema = {
            id: schema.id,
            type: "object",
            properties: {}
        };
        augmentedSchema.properties["filtersArray" + node.foreignKeyData.currentIndex] = node.createNewItem();
        return augmentedSchema;
    };
    var createForeignKeyForm = function(schemaId, node, title) {
        var item = node.createNewFormItem(node.foreignKeyData.currentIndex);
        return {
            $schemaId: schemaId,
            gridLayout: true,
            strictNumberTypes: false,
            isStrict: false,
            jsonformVersion: "2.0",
            fields: [ {
                type: "fieldset",
                expandable: false,
                title: "Search For " + title,
                rowWidth: "full",
                items: [ item ]
            } ]
        };
    };
    FormNode.prototype.createNewItem = function(type, operators, operatorTitles, typeDefaultValues, typeDefaultValuesTitles) {
        var returnObject = {
            type: "object",
            title: "filters for " + this.foreignKeyData.title,
            properties: {
                filter: {
                    type: "string",
                    title: "filter",
                    enum: this.foreignKeyData.filterEnum
                },
                operator: {
                    type: "string",
                    title: "operator"
                },
                value: {
                    type: "string",
                    title: "search value"
                }
            }
        };
        if (type) {
            returnObject.properties.value.type = type;
        }
        if (typeDefaultValues) {
            returnObject.properties.value.enum = typeDefaultValues;
            returnObject.properties.value.enumNames = typeDefaultValuesTitles;
        } else {
            delete returnObject.properties.value.enum;
            delete returnObject.properties.value.enumNames;
        }
        if (operators) {
            returnObject.properties.operator.enum = operators;
            returnObject.properties.operator.enumNames = operatorTitles;
        } else {
            returnObject.properties.operator.enum = this.foreignKeyData.operators.string;
            returnObject.properties.operator.enumNames = this.foreignKeyData.operatorNames.string;
        }
        return returnObject;
    };
    FormNode.prototype.createNewFormItem = function() {
        var node = this;
        var idx = this.foreignKeyData.currentIndex;
        var containerParentKey = "filtersArray" + idx;
        var filterKey = containerParentKey + "/filter";
        var operatorKey = containerParentKey + "/operator";
        var valueKey = containerParentKey + "/value";
        var a = {
            key: containerParentKey,
            title: "My inside object",
            type: "section",
            rowWidth: "full",
            items: [ {
                title: "Filter name",
                notitle: idx === 0 || node.foreignKeyData.currentNumberOfRows === 1 ? false : true,
                ordering: 103,
                key: filterKey,
                type: "select",
                rowWidth: "sixth",
                onChange: function(e) {
                    changeForeignKeySearchOptions(e.target, node, this);
                }
            }, {
                title: "Operator",
                key: operatorKey,
                notitle: idx === 0 || node.foreignKeyData.currentNumberOfRows === 1 ? false : true,
                ordering: 102,
                type: "select",
                rowWidth: "sixth"
            }, {
                title: "Search value",
                ordering: 101,
                key: valueKey,
                notitle: idx === 0 || node.foreignKeyData.currentNumberOfRows === 1 ? false : true,
                rowWidth: "quarter"
            }, {
                type: "button",
                title: "Search",
                ordering: 104,
                rowWidth: "sixth",
                onClick: function() {
                    node.handleFkeySearch();
                }
            } ]
        };
        return a;
    };
    var FormTree = function(formDesc, preserveParentSchema) {
        this.eventhandlers = [];
        this.root = null;
        this.formDesc = null;
        this.keyToNode = {};
        this.modifiedSchema = {};
        this.keyToTitle = {};
        this.keyToInitialValue = {};
        this.keyToCurrentValue = {};
        this.keyToTitlePath = {};
        this.initialize(formDesc, preserveParentSchema);
        this.postInitialization();
    };
    FormTree.prototype.initialize = function(formDesc, preserveParentSchema) {
        formDesc = formDesc || {};
        formDesc.currentValue = {};
        if (!preserveParentSchema) {
            jsonform.value = formDesc.value;
            jsonform.schema = formDesc.schema;
        }
        _.each(formDesc.form.fields, function(element, index) {
            if (typeof element === "string" && element !== "*") {
                formDesc.form.fields.splice(index, 1, {
                    key: element
                });
            }
        });
        this.formDesc = _.clone(formDesc);
        this.formDesc.cache = {};
        jsonform.defaultClasses = getDefaultClasses(this.formDesc.form.cssFramework || jsonform.cssFramework);
        this.defaultClasses = _.clone(jsonform.defaultClasses);
        if (this.formDesc.form.defaultClasses) {
            _.extend(this.defaultClasses, this.formDesc.form.defaultClasses);
        }
        this.formDesc.form.prefix = this.formDesc.form.prefix || "tb-jf-" + _.uniqueId();
        if (this.formDesc.schema && !this.formDesc.schema.properties) {
            this.formDesc.schema = formDesc.schema;
        }
        this.formDesc._originalSchema = this.formDesc.schema;
        this.formDesc.schema = _.cloneDeep(this.formDesc.schema);
        this.formDesc.form.fields = this.formDesc.form.fields || [ "*" ];
        ASSERT.isArray(this.formDesc.form.fields, {
            msg: "The form fields property must be an array.",
            code: 3170
        });
        this.formDesc.params = this.formDesc.params || {};
        this.root = new FormNode();
        this.root.ownerTree = this;
        this.root.isRoot = true;
        this.root.view = jsonform.elementTypes["root"];
        this.modifySchema();
        this.buildTree();
        this.initializeValidator();
        this.computeInitialValues();
    };
    FormTree.prototype.modifySchema = function() {};
    FormTree.prototype.postInitialization = function() {
        var keys = Object.keys(this.keyToTitle);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var titlePath = [];
            var keyParts = key.split("/");
            for (var j = 0; j < keyParts.length; j++) {
                var keyPart = keyParts[j];
                titlePath.push(this.keyToTitle[keyPart]);
            }
            this.keyToTitlePath[key] = titlePath.join(" => ");
        }
    };
    FormTree.prototype.buildTree = function() {
        this.formDesc.form.originalLocale = this.formDesc.form.originalLocale || "multilanguage_default";
        this.formDesc = _.merge({
            form: {
                gridLayout: false,
                required: false,
                validate: true,
                liveValidation: false,
                hideErrors: false,
                enableReset: false,
                enableUndo: false,
                enableRedo: false,
                preview: false,
                readOnly: false,
                useTitleAsPlaceholder: false,
                isSearchable: false,
                isMultilanguage: false,
                isTranslatable: false,
                isStrict: true,
                isDebug: false,
                textareaLengthLimit: 1e4,
                maxLength: 1e4,
                minLength: 0,
                minItems: 0,
                maxItems: 1e6,
                searchableLimit: 100,
                minimum: -Number.MAX_VALUE,
                maximum: Number.MAX_VALUE,
                exclusiveMinimum: false,
                exclusiveMaximum: false,
                deprecatedValue: "! ",
                maxDate: "2038-01-19T03:14:07",
                minDate: "1900-01-01T00:00:00",
                minTime: "T00:00:00",
                maxTime: "T23:59:59",
                localeTabs: true,
                enableSorting: false,
                enableAddingItems: true,
                enableDeletingItems: true,
                enableFieldLockOnSearch: true,
                uniqueItems: true,
                displaySystemButtonsLabels: true,
                displayCompressedTables: false,
                filePreviewHeight: 200,
                filePreviewWidth: 200,
                maximumFilePreviewHeight: 2e3,
                maximumFilePreviewWidth: 2e3,
                titleImagePreviewDefault: "imageTitle",
                thumbnailImageDefault: "thumbnail",
                redirectImageDefault: "fullImage",
                oldPasswordTitle: "Old Password",
                newPasswordTitle: "New Password",
                confirmNewPasswordTitle: "Confirm New Password",
                nullValueTitle: "none",
                maxValuesToVisualise: 10,
                defaultRefColTitleKeys: [ "name", "fullDescr" ],
                expectingSearchValue: false
            },
            locales: [ this.formDesc.originalLocale ]
        }, this.formDesc);
        var schema = {
            type: "object",
            id: "http://jschemas.tbpro.com/tblib/metaschema",
            $schemaId: "http://jschemas.tbpro.com/tblib/metaschema",
            definitions: {
                unique: {
                    uniqueItems: true
                },
                array: {
                    type: "array"
                },
                boolean: {
                    type: "boolean",
                    constraintMsg: "Invalid form property: $DATA_PATH$"
                },
                string: {
                    type: "string"
                },
                number: {
                    type: "number"
                },
                positiveNumber: {
                    type: "number",
                    minimum: 0
                },
                object: {
                    type: "object"
                },
                dataRef: {
                    type: "object",
                    properties: {
                        $data: {
                            type: "string"
                        }
                    }
                },
                numberOrDataRef: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    oneOf: [ {
                        $ref: "#/definitions/number"
                    }, {
                        $ref: "#/definitions/dataRef"
                    } ]
                },
                positiveNumOrDataRef: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    oneOf: [ {
                        $ref: "#/definitions/positiveNumber"
                    }, {
                        $ref: "#/definitions/dataRef"
                    } ]
                },
                booleanOrDataRef: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    oneOf: [ {
                        $ref: "#/definitions/boolean"
                    }, {
                        $ref: "#/definitions/dataRef"
                    } ]
                },
                uniqueArray: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    type: "array",
                    uniqueItems: true
                },
                uniqueStringArray: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    type: "array",
                    uniqueItems: true,
                    items: {
                        type: "string"
                    }
                },
                objectArray: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    type: "array",
                    items: {
                        type: "object"
                    }
                },
                ArrayOfStrings: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    type: "array",
                    items: {
                        type: "string"
                    }
                },
                ArrayOfStringsOrStringOrBoolean: {
                    constraintMsg: "Invalid form property: $DATA_PATH$",
                    oneOf: [ {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }, {
                        type: "boolean"
                    }, {
                        type: "string"
                    } ]
                }
            },
            required: [ "jsonformVersion", "$schemaId" ],
            properties: {
                hideErrors: {
                    $ref: "#/definitions/boolean"
                },
                gridLayout: {
                    $ref: "#/definitions/boolean"
                },
                validate: {
                    $ref: "#/definitions/boolean"
                },
                liveValidation: {
                    $ref: "#/definitions/boolean"
                },
                preview: {
                    $ref: "#/definitions/boolean"
                },
                readOnly: {
                    $ref: "#/definitions/boolean"
                },
                isSearchable: {
                    $ref: "#/definitions/boolean"
                },
                isMultilanguage: {
                    $ref: "#/definitions/boolean"
                },
                useTitleAsPlaceholder: {
                    $ref: "#/definitions/boolean"
                },
                isTranslatable: {
                    $ref: "#/definitions/boolean"
                },
                isStrict: {
                    $ref: "#/definitions/boolean"
                },
                isDebug: {
                    $ref: "#/definitions/boolean"
                },
                enableAddingItems: {
                    $ref: "#/definitions/boolean"
                },
                enableDeletingItems: {
                    $ref: "#/definitions/boolean"
                },
                uniqueItems: {
                    $ref: "#/definitions/boolean"
                },
                enableReset: {
                    $ref: "#/definitions/boolean"
                },
                enableUndo: {
                    $ref: "#/definitions/boolean"
                },
                enableRedo: {
                    $ref: "#/definitions/boolean"
                },
                enableFieldLockOnSearch: {
                    $ref: "#/definitions/boolean"
                },
                displaySystemButtonsLabels: {
                    $ref: "#/definitions/boolean"
                },
                displayCompressedTables: {
                    $ref: "#/definitions/boolean"
                },
                localeTabs: {
                    $ref: "#/definitions/boolean"
                },
                enableSorting: {
                    $ref: "#/definitions/boolean"
                },
                inline: {
                    $ref: "#/definitions/boolean"
                },
                deprecatedValue: {
                    $ref: "#/definitions/string"
                },
                maxDate: {
                    $ref: "#/definitions/string"
                },
                minDate: {
                    $ref: "#/definitions/string"
                },
                oldPasswordTitle: {
                    $ref: "#/definitions/string"
                },
                newPasswordTitle: {
                    $ref: "#/definitions/string"
                },
                $schemaId: {
                    $ref: "#/definitions/string"
                },
                confirmPasswordTitle: {
                    $ref: "#/definitions/string"
                },
                key: {
                    $ref: "#/definitions/string"
                },
                jsonformVersion: {
                    $ref: "#/definitions/string"
                },
                content: {
                    $ref: "#/definitions/string"
                },
                description: {
                    $ref: "#/definitions/string"
                },
                inlinetitle: {
                    $ref: "#/definitions/string"
                },
                type: {
                    $ref: "#/definitions/string"
                },
                nullValueTitle: {
                    $ref: "#/definitions/string"
                },
                locales: {
                    $ref: "#/definitions/uniqueArray"
                },
                searchableLimit: {
                    $ref: "#/definitions/positiveNumber"
                },
                minItems: {
                    $ref: "#/definitions/positiveNumOrDataRef"
                },
                maxItems: {
                    $ref: "#/definitions/positiveNumOrDataRef"
                },
                minLength: {
                    $ref: "#/definitions/positiveNumOrDataRef"
                },
                maxLength: {
                    $ref: "#/definitions/numberOrDataRef"
                },
                minimum: {
                    $ref: "#/definitions/numberOrDataRef"
                },
                maximum: {
                    $ref: "#/definitions/numberOrDataRef"
                },
                exclusiveMinimum: {
                    $ref: "#/definitions/booleanOrDataRef"
                },
                exclusiveMaximum: {
                    $ref: "#/definitions/booleanOrDataRef"
                },
                enum: {
                    $ref: "#/definitions/ArrayOfStrings"
                },
                required: {
                    $ref: "#/definitions/ArrayOfStringsOrStringOrBoolean"
                },
                pluginOptions: {
                    $ref: "#/definitions/object"
                },
                toggleNextMap: {
                    $ref: "#/definitions/object"
                },
                titleMap: {
                    $ref: "#/definitions/object"
                },
                options: {
                    $ref: "#/definitions/object"
                },
                templateData: {
                    $ref: "#/definitions/object"
                },
                fields: {
                    $ref: "#/definitions/array",
                    items: {
                        oneOf: [ {
                            $ref: "#/definitions/string"
                        }, {
                            $ref: "#/propertiesNotRoot"
                        } ]
                    }
                }
            },
            propertiesNotRoot: {
                properties: {
                    hideErrors: {
                        $ref: "#/definitions/boolean"
                    },
                    gridLayout: {
                        $ref: "#/definitions/boolean"
                    },
                    validate: {
                        $ref: "#/definitions/boolean"
                    },
                    liveValidation: {
                        $ref: "#/definitions/boolean"
                    },
                    preview: {
                        $ref: "#/definitions/boolean"
                    },
                    readOnly: {
                        $ref: "#/definitions/boolean"
                    },
                    isSearchable: {
                        $ref: "#/definitions/boolean"
                    },
                    isMultilanguage: {
                        $ref: "#/definitions/boolean"
                    },
                    useTitleAsPlaceholder: {
                        $ref: "#/definitions/boolean"
                    },
                    isTranslatable: {
                        $ref: "#/definitions/boolean"
                    },
                    isStrict: {
                        $ref: "#/definitions/boolean"
                    },
                    isDebug: {
                        $ref: "#/definitions/boolean"
                    },
                    enableAddingItems: {
                        $ref: "#/definitions/boolean"
                    },
                    enableDeletingItems: {
                        $ref: "#/definitions/boolean"
                    },
                    uniqueItems: {
                        $ref: "#/definitions/boolean"
                    },
                    enableReset: {
                        $ref: "#/definitions/boolean"
                    },
                    enableUndo: {
                        $ref: "#/definitions/boolean"
                    },
                    enableRedo: {
                        $ref: "#/definitions/boolean"
                    },
                    enableFieldLockOnSearch: {
                        $ref: "#/definitions/boolean"
                    },
                    displaySystemButtonsLabels: {
                        $ref: "#/definitions/boolean"
                    },
                    displayCompressedTables: {
                        $ref: "#/definitions/boolean"
                    },
                    localeTabs: {
                        $ref: "#/definitions/boolean"
                    },
                    enableSorting: {
                        $ref: "#/definitions/boolean"
                    },
                    inline: {
                        $ref: "#/definitions/boolean"
                    },
                    deprecatedValue: {
                        $ref: "#/definitions/string"
                    },
                    maxDate: {
                        $ref: "#/definitions/string"
                    },
                    minDate: {
                        $ref: "#/definitions/string"
                    },
                    oldPasswordTitle: {
                        $ref: "#/definitions/string"
                    },
                    newPasswordTitle: {
                        $ref: "#/definitions/string"
                    },
                    $schemaId: {
                        $ref: "#/definitions/string"
                    },
                    confirmPasswordTitle: {
                        $ref: "#/definitions/string"
                    },
                    key: {
                        $ref: "#/definitions/string"
                    },
                    jsonformVersion: {
                        $ref: "#/definitions/string"
                    },
                    content: {
                        $ref: "#/definitions/string"
                    },
                    description: {
                        $ref: "#/definitions/string"
                    },
                    inlinetitle: {
                        $ref: "#/definitions/string"
                    },
                    type: {
                        $ref: "#/definitions/string"
                    },
                    nullValueTitle: {
                        $ref: "#/definitions/string"
                    },
                    locales: {
                        $ref: "#/definitions/uniqueArray"
                    },
                    searchableLimit: {
                        $ref: "#/definitions/positiveNumber"
                    },
                    minItems: {
                        $ref: "#/definitions/positiveNumOrDataRef"
                    },
                    maxItems: {
                        $ref: "#/definitions/positiveNumOrDataRef"
                    },
                    minLength: {
                        $ref: "#/definitions/positiveNumOrDataRef"
                    },
                    maxLength: {
                        $ref: "#/definitions/numberOrDataRef"
                    },
                    minimum: {
                        $ref: "#/definitions/numberOrDataRef"
                    },
                    maximum: {
                        $ref: "#/definitions/numberOrDataRef"
                    },
                    exclusiveMinimum: {
                        $ref: "#/definitions/booleanOrDataRef"
                    },
                    exclusiveMaximum: {
                        $ref: "#/definitions/booleanOrDataRef"
                    },
                    enum: {
                        $ref: "#/definitions/ArrayOfStrings"
                    },
                    required: {
                        $ref: "#/definitions/ArrayOfStringsOrStringOrBoolean"
                    },
                    pluginOptions: {
                        $ref: "#/definitions/object"
                    },
                    toggleNextMap: {
                        $ref: "#/definitions/object"
                    },
                    titleMap: {
                        $ref: "#/definitions/object"
                    },
                    options: {
                        $ref: "#/definitions/object"
                    },
                    templateData: {
                        $ref: "#/definitions/object"
                    },
                    fields: {
                        $ref: "#/definitions/array",
                        items: {
                            oneOf: [ {
                                $ref: "#/definitions/string"
                            }, {
                                $ref: "#/propertiesNotRoot"
                            } ]
                        }
                    }
                }
            }
        };
        this.formDesc.validator.compile(schema);
        if (!this.formDesc.validator.validate(schema, this.formDesc.form)) {
            var resultString = "\n";
            for (var i = 0; i < this.formDesc.validator.ajv.errors.length; i++) {
                resultString += "problem area->" + (this.formDesc.validator.ajv.errors[i].dataPath ? this.formDesc.validator.ajv.errors[i].dataPath : "/") + " \nReason: " + this.formDesc.validator.ajv.errors[i].message + "\n\n";
            }
            ASSERT_USER(0, {
                msg: resultString,
                code: 3180
            });
        }
        ASSERT(_.isString(this.formDesc.form.nullValueTitle), {
            msg: "Invalid nullValueTitle",
            code: 3535
        });
        var currentCounter = 1;
        _.each(this.formDesc.form.fields, function(formElement) {
            var child = null;
            if (formElement === "*") {
                _.each(getSortedPropertyKeys(this.formDesc.schema.properties), function(key) {
                    if (key === "jsonformVersion" || key === "id" || this.formDesc.form.nonDefaultFormItems && this.formDesc.form.nonDefaultFormItems.indexOf(key) >= 0) {
                        return;
                    }
                    child = this.buildFromLayout({
                        key: key,
                        currentCounterArray: [ currentCounter ]
                    });
                    if (child) {
                        this.root.appendChildNode(child);
                    }
                    currentCounter += 1;
                }.bind(this));
            } else {
                if (_.isString(formElement)) {
                    formElement = {
                        key: formElement
                    };
                }
                formElement.currentCounterArray = [ currentCounter ];
                child = this.buildFromLayout(formElement);
                if (child) {
                    this.root.appendChildNode(child);
                }
                currentCounter += 1;
            }
        }.bind(this));
        if (this.formDesc.form.gridLayout === true && this.root.children.length > 0) {
            this.computeGridLayoutWidth(this.root.children);
        }
    };
    function hasAtleastOneProperty(schemaElement) {
        return schemaElement.properties && Object.keys(schemaElement.properties).length > 1 || schemaElement.additionalProperties && Object.keys(schemaElement.additionalProperties).length > 1;
    }
    function isForeignKeyField(schemaElement) {
        return schemaElement.refCol && schemaElement.refTable || schemaElement.items && isForeignKeyField(schemaElement.items);
    }
    function getForeignKeyFields(self, schemaElement) {
        if (self.formDesc.resources === undefined) {
            return;
        }
        ASSERT(isForeignKeyField(schemaElement), {
            msg: "Key should be fkey..."
        });
        var lookUpInItems = false;
        if (schemaElement.items && !schemaElement.refCol) {
            lookUpInItems = true;
        }
        var foreignData = {};
        var refColTitle;
        var refCol;
        var refTable;
        if (lookUpInItems) {
            refColTitle = schemaElement.items.refColTitle;
            refCol = schemaElement.items.refCol;
            refTable = schemaElement.items.refTable;
        } else {
            refColTitle = schemaElement.refColTitle;
            refCol = schemaElement.refCol;
            refTable = schemaElement.refTable;
        }
        var currentResources = self.formDesc.resources[refTable].records;
        var resource = currentResources[0] || {};
        if (refColTitle === undefined) {
            if (resource.name === undefined) {
                refColTitle = refCol;
            } else {
                refColTitle = "name";
            }
        }
        return {
            refCol: refCol,
            refColTitle: refColTitle,
            refTable: refTable,
            lookUpInItems: lookUpInItems
        };
    }
    function isParentElementMultilanguage(parentSchema, formElementParent) {
        return parentSchema && parentSchema.isMultilanguage === true && formElementParent;
    }
    function isElementMultilanguage(schemaElement) {
        return schemaElement.isMultilanguage === true;
    }
    function checkValidMinMaxDates(formElement) {
        var minDateTimestamp = Date.parse(TB.normalizeDate(formElement.minDate));
        var maxDateTimestamp = Date.parse(TB.normalizeDate(formElement.maxDate));
        if (moment) {
            if (isNaN(minDateTimestamp) && isNaN(maxDateTimestamp)) {
                minDateTimestamp = moment(formElement.minDate);
            }
            if (isNaN(minDateTimestamp)) {
                maxDateTimestamp = moment(formElement.maxDate);
            }
        }
        ASSERT(isNaN(maxDateTimestamp) === false, {
            msg: "Error while building form: maxDate is not a valid date.",
            code: 3740
        });
        ASSERT(isNaN(minDateTimestamp) === false, {
            msg: "Error while building form: minDate is not a valid date.",
            code: 3750
        });
        ASSERT(maxDateTimestamp >= minDateTimestamp, {
            msg: "Error while building form: maxDate cannot be smaller than formElement.minDate.",
            code: 3760
        });
    }
    function getFilterOptionsFromFilterSchema(filterSchema) {
        var result = [];
        tbjsonTraverseSchema(filterSchema, function() {
            var item = arguments[0];
            var id = arguments[6];
            if (item && item.searchBy) {
                result.push({
                    title: item.title,
                    id: id,
                    type: item.type
                });
            }
        });
        if (result.length === 0) {
            result.push({
                title: "Full Description",
                id: "full_descr",
                type: "string"
            });
        }
        return result;
    }
    function setForeignKeyField(node, schemaElement, formElement, formTree) {
        ASSERT.isStringOrNil(schemaElement.refCol, {
            code: 3850,
            msg: "Error while building form: refCol is of unrecognized type for schema key $KEY$",
            msgParams: {
                KEY: formElement.key
            }
        });
        ASSERT.isStringOrNil(schemaElement.refTable, {
            code: 3855,
            msg: "Error while building form: refTable is of unrecognized type for schema key $KEY$",
            msgParams: {
                KEY: formElement.key
            }
        });
        ASSERT.isStringOrNil(schemaElement.refColTitle, {
            code: 3857,
            msg: "Error while building form: refColTitle is of unrecognized type for schema key $KEY$",
            msgParams: {
                KEY: formElement.key
            }
        });
        ASSERT.isNumber(formElement.searchableLimit, {
            code: 3860,
            msg: "Error while building form: searchableLimit is of unrecognized type for schema key $KEY$",
            msgParams: {
                KEY: formElement.key
            }
        });
        ASSERT(jsonform.elementTypes[formElement.type].isSearchableField === true, {
            msg: "Error while building form: foreign key field $KEY$ has an invalid schema type $TYPE$ (only select-like fields are valid)",
            msgParams: {
                KEY: formElement.key,
                TYPE: formElement.type
            },
            code: 3870
        });
        if (!formElement.filterForm) return;
        var resolvedSchema = jfUtils.resolveRefs(formTree.formDesc.schema, schemaElement.filterSchema, true);
        node.filterOptions = getFilterOptionsFromFilterSchema(resolvedSchema);
    }
    function appendNoResultSpan($filtersTreeElem) {
        var $span = $("<span></span>");
        $span.text("No results found!");
        $span.css("color", "#be495f");
        $span.css("display", "none");
        $filtersTreeElem.find("fieldset > div").append($span);
    }
    function setMultilanguageParentField(parentSchema, formElementParent, schemaElement, formElement, formTree) {
        var propertyArray = [ "title", "legend", "description", "append", "prepend", "helpvalue", "placeholder", "required", "readOnly", "preview", "textareaLengthLimit", "minLength", "maxLength", "minDate", "maxDate", "format", "formatMinimum", "formatMaximum", "formatExclusiveMaximum", "formatExclusiveMinimum" ];
        if (jfUtils.contains(schemaElement.type, "number") || jfUtils.contains(schemaElement.type, "integer")) {
            propertyArray.splice(0, 0, "minimum", "maximum", "exclusiveMinimum", "exclusiveMaximum");
        }
        if (formElementParent.additionalProperties && !_.isNil(formElementParent.additionalProperties.type)) {
            propertyArray.splice(0, 0, "type");
        } else {
            formElement.type = formElementParent.parentType;
        }
        _.each(propertyArray, function(property) {
            if (formTree.formDesc && !_.isNil(formTree.formDesc[property])) {
                formElement[property] = formTree.formDesc[property];
            } else if (parentSchema.additionalProperties[property]) {
                formElement[property] = parentSchema.additionalProperties[property];
            } else {
                formElement[property] = undefined;
            }
            if (formElementParent.additionalProperties && !_.isNil(formElementParent.additionalProperties[property])) {
                formElement[property] = formElementParent.additionalProperties[property] || formElement[property];
            }
        });
        formElement.title = (_.isUndefined(formElement.title) ? "" : formElement.title + " ") + schemaElement.legend;
    }
    function setMultilanguageField(schemaElement, formElement, formTree) {
        formElement.localeTabs = !_.isNil(formElement.localeTabs) ? formElement.localeTabs : formTree.formDesc.form.localeTabs;
        ASSERT(!schemaElement.properties, {
            msg: "Multilanguage fields use additionalProperties as template; the properties object must be empty.",
            code: 3770
        });
        ASSERT(schemaElement.type === "object", {
            msg: "Only objects with child templates specified in additionalProperties can become translatable fields.",
            code: 3780
        });
        ASSERT.isBoolean(formElement.localeTabs, {
            msg: "formElement.localeTabs is not valid.",
            code: 3790
        });
        schemaElement.properties = {};
        var localeName;
        for (var i = 0, j = formTree.formDesc.locales.length - 1; i <= j; i++) {
            if (_.isString(formTree.formDesc.locales[i])) {
                localeName = formTree.formDesc.locales[i];
            } else if (_.isPlainObject(formTree.formDesc.locales[i]) && formTree.formDesc.locales[i].hasOwnProperty("locale") && _.isString(formTree.formDesc.locales[i].locale)) {
                localeName = formTree.formDesc.locales[i].locale;
            } else {
                ASSERT(false, {
                    msg: "Invalid locale definition for array element locales[$INDEX$]",
                    msgParams: {
                        INDEX: i
                    },
                    code: 3800
                });
            }
            schemaElement.properties[localeName] = _.clone(schemaElement.additionalProperties, true);
            var legendName = localeName;
            schemaElement.properties[localeName].legend = legendName;
            schemaElement.properties[localeName].title = legendName;
        }
        formElement.parentType = formElement.type;
        if (formElement.localeTabs) {
            formElement.type = "tabobject";
        } else {
            formElement.type = "fieldset";
        }
    }
    function getSchemaElement(schemaElement, formElement, formTree) {
        var schemaEl = schemaElement || tbjsonAjv2Tb.getSchemaByJsonPointer(formTree.formDesc.schema, formElement.key);
        ASSERT(schemaEl, {
            code: 3540,
            msg: "The form element $FORMELEMENT$ references the schema key $KEY$ but that key does not exist in the JSON schema",
            msgParams: {
                FORMELEMENT: formElement,
                KEY: formElement.key
            }
        });
        return schemaEl;
    }
    var getFormElementType = function(formElement, schemaElement) {
        var eltype = formElement.type || guessFormPlugin(schemaElement, formElement);
        ASSERT(jsonform.elementTypes[eltype], {
            msg: "The specified element type is unknown: $type$",
            code: 3920,
            msgParams: {
                type: eltype
            }
        });
        ASSERT(jsonform.elementTypes[formElement.type], {
            msg: "The JSONForm contains an unknown form type $TYPE$ for schema key $KEY$",
            msgParams: {
                TYPE: formElement.type,
                KEY: formElement.key
            },
            code: 3980
        });
        return eltype;
    };
    var hasParentSchema = function(schemaElement) {
        return schemaElement ? true : false;
    };
    var formElementHasInputField = function(type) {
        return jsonform.elementTypes[type].inputfield;
    };
    var addValueHistoryButtons = function(node, formElement) {
        var globalHistoryControls = {
            enableReset: node.formDesc.form.enableReset,
            enableRedo: node.formDesc.form.enableRedo,
            enableUndo: node.formDesc.form.enableUndo
        };
        _.defaults(formElement, globalHistoryControls, formElement);
    };
    var isObjectWithoutItems = function(schemaElement, formElement) {
        return jfUtils.contains(schemaElement.type, "object") && (!formElement.items || formElement.items.length === 0) && schemaElement.type !== "helptext";
    };
    var iterateCreateAndAppendChildrenOfObject = function(schemaElement, formElement, formTree, formNode) {
        var alphaKeys = getSortedPropertyKeys(schemaElement.properties);
        var currentCounter = 1;
        _.each(alphaKeys, function(propName) {
            var key = formElement.key + "/" + propName;
            var childFormElement = {
                key: key,
                currentCounterArray: _.clone(formNode.currentCounterArray)
            };
            childFormElement.currentCounterArray.push(currentCounter);
            if (formTree.formDesc.form.nonDefaultFormItems && formTree.formDesc.form.nonDefaultFormItems.indexOf(key) >= 0) {
                return;
            }
            var childSchema = schemaElement.properties[propName];
            if (Object.keys(childSchema).length === 1 && !childSchema.type) {
                return;
            }
            var child = formTree.buildFromLayout(childFormElement, formElement, childSchema);
            if (child) {
                currentCounter++;
                formNode.appendChildNode(child);
            }
        }.bind(formTree));
    };
    var isMultipleCheckboxes = function(schemaElement, formElement) {
        return (formElement.type === "checkboxes" || formElement.type === "checkboxbuttons") && schemaElement.items;
    };
    var updateRequiredProperties = function(schemaElement, parentSchema, formElement) {
        var propertyKey = formElement.key.split("/").pop();
        if (formElement.required && !schemaElement.readOnly) {
            if (parentSchema.required && _.isArray(parentSchema.required)) {
                if (parentSchema.required.indexOf(propertyKey) === -1) {
                    parentSchema.required.push(propertyKey);
                }
            } else {
                parentSchema.required = [ propertyKey ];
            }
        } else {
            if (parentSchema.required && _.isArray(parentSchema.required)) {
                if (parentSchema.required.indexOf(propertyKey) >= 0) {
                    parentSchema.required.pop(propertyKey);
                    if (parentSchema.required.length === 0) {
                        delete parentSchema.required;
                    }
                }
            }
        }
    };
    var validateEnums = function(enums, schemaElement, formElement, deprecatedValue, formDesc) {
        _.each(enums, function(value) {
            jsonform.util.validateValueType(formElement.key, schemaElement, formElement, deprecatedValue, value, true, formDesc);
        });
    };
    var validateEnumNames = function(schemaElement) {
        ASSERT(schemaElement["enum"].length === schemaElement["enumNames"].length, {
            msg: "Schema enum and enumNames must have the same length for $SCHEMAELEMENT$",
            msgParams: {
                SCHEMAELEMENT: schemaElement
            },
            code: 3950
        });
    };
    var guessFormPlugin = function(schemaElement, formElement) {
        var defaults111 = {
            guessedPlugins: {
                IS_FOREIGN_KEY: "select",
                FORMAT_COLOR: "color",
                FORMAT_PASSWORD: "changepassword",
                FORMAT_DATE: "datepicker",
                FORMAT_DATETIME: "datetimepicker",
                FORMAT_TIME: "timepicker",
                FORMAT_BASE64FILE: "base64file",
                FORMAT_FILE: "file",
                LONG_TEXT: "textarea",
                TEXT: "text",
                NUMBER: "number",
                INTEGER: "number",
                BOOLEAN_VISUALISOR: "select",
                TAB_OBJECT: "tabobject",
                FIELD_SET: "fieldset",
                LONG_TEXT_OBJECT: "textarea",
                MULTIPLE_SELECT: "multipleselect",
                SELECT: "select",
                CONTAINS_ARRAY: "array",
                CONTAINS_TEXT: "text",
                CONTAINS_NUMBER: "number",
                FORMAT_GENERIC_HTML: "genericHTML",
                PREVIEW_IMAGE: "imagepreview",
                FORMAT_HTML: "tinymce"
            }
        };
        var guessFormPluginsRules = {
            IS_FOREIGN_KEY: {
                o: 100,
                check: function(s, f) {
                    return s["refCol"] && s["refTable"];
                }
            },
            PREVIEW_IMAGE: {
                o: 250,
                format: "imagePreview"
            },
            FORMAT_HTML: {
                o: 400,
                format: "html"
            },
            FORMAT_GENERIC_HTML: {
                o: 500,
                format: "genericHTML"
            },
            FORMAT_COLOR: {
                o: 1e3,
                type: "string",
                format: "color"
            },
            FORMAT_PASSWORD: {
                o: 2e3,
                type: "string",
                format: "changepassword"
            },
            FORMAT_DATE: {
                o: 3e3,
                type: "string",
                format: [ "iso8601date", "date" ]
            },
            FORMAT_DATETIME: {
                o: 4e3,
                type: "string",
                format: [ "iso8601datetime", "date-time" ]
            },
            FORMAT_TIME: {
                o: 5e3,
                type: "string",
                format: [ "iso8601time", "time" ]
            },
            FORMAT_BASE64FILE: {
                o: 6e3,
                type: "string",
                format: "base64file"
            },
            FORMAT_FILE: {
                o: 7e3,
                type: "string",
                format: "file"
            },
            LONG_TEXT: {
                o: 8e3,
                type: "string",
                check: function(s, f) {
                    return s.maxLength > s.textareaLengthLimit;
                }
            },
            TEXT: {
                o: 9e3,
                type: "string",
                check: function(s, f) {
                    return !s["enum"];
                }
            },
            NUMBER: {
                o: 1e4,
                type: "number",
                check: function(s, f) {
                    return !s["enum"];
                }
            },
            INTEGER: {
                o: 11e3,
                type: "integer",
                check: function(s, f) {
                    return !s["enum"];
                }
            },
            BOOLEAN_VISUALISOR: {
                o: 12e3,
                type: "boolean"
            },
            TAB_OBJECT: {
                o: 13e3,
                type: "object",
                check: function(s, f) {
                    return hasAtleastOneProperty(s);
                }
            },
            FIELD_SET: {
                o: 14e3,
                type: "object",
                check: function(s, f) {
                    return !hasAtleastOneProperty(s);
                }
            },
            LONG_TEXT_OBJECT: {
                o: 15e3,
                type: "object",
                check: function(s, f) {
                    return !s.properties;
                }
            },
            MULTIPLE_SELECT: {
                o: 16e3,
                type: "array",
                check: function(s, f) {
                    return s.items && !_.isUndefined(s.items["enum"]);
                }
            },
            SELECT: {
                o: 17e3,
                check: function(s, f) {
                    return !_.isUndefined(s["enum"]);
                }
            },
            CONTAINS_ARRAY: {
                o: 18e3,
                check: function(s, f) {
                    return _.isArray(s.type) && jfUtils.contains(s.type, "array");
                }
            },
            CONTAINS_TEXT: {
                o: 19e3,
                check: function(s, f) {
                    return _.isArray(s.type) && jfUtils.contains(s.type, "string");
                }
            },
            CONTAINS_NUMBER: {
                o: 2e4,
                check: function(s, f) {
                    return _.isArray(s.type) && (jfUtils.contains(s.type, "number") || jfUtils.contains(s.type, "integer"));
                }
            }
        };
        if (!formElement.type) {
            var arr = [];
            for (var key in guessFormPluginsRules) {
                arr.push({
                    key: key,
                    order: guessFormPluginsRules[key].o
                });
            }
            arr.sort(function(first, second) {
                return first.order - second.order;
            });
            var i, j;
            for (i = 0, j = arr.length; i < j; i++) {
                var rule = guessFormPluginsRules[arr[i].key];
                if (rule.type && !jfUtils.contains(schemaElement.type, rule.type)) continue;
                if (rule.format && !jfUtils.contains(rule.format, schemaElement.format)) continue;
                if (rule.check && !rule.check(schemaElement, formElement)) continue;
                formElement.type = defaults111.guessedPlugins[arr[i].key];
                break;
            }
        }
        if (!formElement.type) {
            if (_.isString(schemaElement.type)) {
                formElement.type = schemaElement.type;
            } else if (_.isArray(schemaElement.type)) {
                formElement.type = schemaElement.type[0];
            }
        }
        return formElement.type;
    };
    var rules = {
        common: {
            name: {
                alts: [ {
                    src: "f",
                    prop: "key"
                } ],
                escape: true,
                type: "string",
                req: true
            },
            title: {
                alts: [ {
                    src: "s"
                }, {
                    src: "f",
                    prop: "name"
                } ],
                escape: true,
                type: "string"
            },
            description: {
                alts: [ {
                    src: "s"
                } ],
                escape: true,
                type: "string"
            },
            legend: {
                escape: true,
                type: "string"
            },
            placeholder: {
                escape: true,
                type: "string"
            },
            oldPasswordTitle: {
                alts: [ {
                    src: "ff"
                } ],
                escape: true,
                type: "string",
                req: true
            },
            newPasswordTitle: {
                alts: [ {
                    src: "ff"
                } ],
                escape: true,
                type: "string",
                req: true
            },
            confirmNewPasswordTitle: {
                alts: [ {
                    src: "ff"
                } ],
                escape: true,
                type: "string",
                req: true
            },
            isSearchable: {
                alts: [ {
                    src: "ff"
                } ],
                type: "boolean",
                req: true
            },
            searchableLimit: {
                alts: [ {
                    src: "ff"
                } ],
                type: "integer",
                req: true
            },
            displaySystemButtonsLabels: {
                alts: [ {
                    src: "ff"
                } ],
                type: "boolean",
                req: true
            },
            useTitleAsPlaceholder: {
                alts: [ {
                    src: "ff"
                } ],
                type: "boolean",
                req: true
            },
            minDate: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "string",
                req: true
            },
            maxDate: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "string",
                req: true
            },
            minTime: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "string",
                req: true
            },
            maxTime: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "string",
                req: true
            },
            readOnly: {
                alts: [ {
                    src: "s"
                }, {
                    src: "p"
                }, {
                    src: "sp"
                }, {
                    src: "ff"
                }, {
                    src: "f",
                    prop: "preview"
                } ],
                type: "boolean",
                $data: true,
                req: false
            },
            preview: {
                alts: [ {
                    src: "s"
                }, {
                    src: "fp"
                }, {
                    src: "ff"
                } ],
                type: "boolean",
                $data: true,
                req: true
            },
            expectingSearchValue: {
                alts: [ {
                    src: "ff"
                } ],
                type: "boolean",
                req: true
            },
            defaultRefColTitleKeys: {
                alts: [ {
                    src: "ff"
                } ],
                type: "array",
                req: true
            },
            expandedIncludedKeys: {
                alts: [ {
                    src: "p"
                } ],
                type: "boolean"
            }
        },
        string: {
            minLength: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "integer",
                modSchema: true,
                $data: true,
                req: true
            },
            maxLength: {
                alts: [ {
                    src: "s"
                }, {
                    src: "s",
                    prop: "fileMaxSize"
                }, {
                    src: "ff"
                } ],
                type: "integer",
                modSchema: true,
                $data: true,
                req: true
            },
            textareaLengthLimit: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "integer",
                req: true
            }
        },
        number: {
            minimum: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "integer",
                modSchema: true,
                $data: true,
                req: true
            },
            maximum: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "integer",
                modSchema: true,
                $data: true,
                req: true
            },
            exclusiveMinimum: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "boolean",
                modSchema: true,
                $data: true,
                req: true
            },
            exclusiveMaximum: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "boolean",
                modSchema: true,
                $data: true,
                req: true
            }
        },
        array: {
            minItems: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "integer",
                $data: true,
                req: true
            },
            maxItems: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "integer",
                $data: true,
                req: true
            },
            enableAddingItems: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "boolean",
                $data: true,
                req: true
            },
            enableDeletingItems: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "boolean",
                $data: true,
                req: true
            },
            enableSorting: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "boolean",
                $data: true,
                req: true
            },
            uniqueItems: {
                alts: [ {
                    src: "s"
                }, {
                    src: "ff"
                } ],
                type: "boolean",
                $data: true,
                req: true
            }
        }
    };
    var extendFormElementProps = function(rules, s, f, ff, fp, sp) {
        for (var prop in rules) {
            var rule = rules[prop];
            var val = f[prop];
            if (_.isNil(val) && rule.alts) {
                for (var i = 0, l = rule.alts.length; i < l; i++) {
                    var propAlt = rule.alts[i];
                    if (propAlt.src === "f") {
                        val = f[propAlt.prop || prop];
                    } else if (propAlt.src === "p") {
                        var current = f.parent;
                        while (current) {
                            val = current[propAlt.prop || prop];
                            if (!_.isNil(val)) break;
                            current = current.parent;
                        }
                    } else if (propAlt.src === "s") {
                        val = s[propAlt.prop || prop];
                    } else if (propAlt.src === "ff") {
                        val = ff[propAlt.prop || prop];
                    } else if (propAlt.src === "fp") {
                        val = fp[propAlt.prop || prop];
                    } else if (propAlt.src === "sp") {
                        val = sp[propAlt.prop || prop];
                    } else {
                        ASSERT(0, {
                            code: 3600,
                            msg: "Unknown source given $src$ on rule $rule$",
                            msgParams: {
                                src: propAlt.src,
                                rule: rule
                            }
                        });
                    }
                    if (!_.isNil(val)) break;
                }
            }
            if (!_.isNil(val) && rule.escape) {
                val = _.escape(val);
            }
            if (rule.req) {
                ASSERT.isNotNil(val, {
                    code: 3610,
                    msg: "Missing required property $prop$. Check msgParams for additional data.",
                    msgParams: {
                        prop: prop,
                        rule: rule,
                        formElement: f
                    }
                });
            }
            if (!_.isNil(val) && rule.type) {
                var typeRecognizedFromValue = jfUtils.getJsonType(val, true);
                var valid = jfUtils.contains(rule.type, typeRecognizedFromValue);
                if (!valid && rule.$data) {
                    valid = _.isPlainObject(val) && val.$data;
                }
                ASSERT(valid, {
                    code: 3620,
                    msg: "Property $prop$ does not have proper type. Prop definition says $rule$ but $val$ given",
                    msgParams: {
                        prop: prop,
                        val: val,
                        rule: rule,
                        formElement: f
                    }
                });
            }
            f[prop] = val;
            if (rule.modSchema) {
                s[prop] = val;
            }
        }
    };
    FormTree.prototype.buildFromLayout = function(formElement, formElementParent, schemaElement) {
        var node = new FormNode();
        node.currentCounterArray = _.clone(formElement.currentCounterArray);
        formElement.parent = formElementParent;
        if (this.formDesc.form.fieldProperties && this.formDesc.form.fieldProperties[formElement.key]) {
            var tmpObject = {};
            _.merge(tmpObject, this.formDesc.form.fieldProperties[formElement.key], formElement);
            formElement = tmpObject;
        }
        if (!_.isUndefined(formElement.keyContext) && (_.isUndefined(formElement.parent) || !formElement.parent.expandedIncludedKeys)) {
            formElement.expandedIncludedKeys = true;
            var keyContext = formElement.keyContext;
            var foreignFormId = formElement.includeForm;
            var clonedForeignForms = _.cloneDeep(this.formDesc.form.includedForms);
            jfUtils.prependFormKeysWithString(clonedForeignForms[foreignFormId], keyContext + "/", clonedForeignForms);
            formElement.items = clonedForeignForms[foreignFormId].fields;
            formElement.type = "section";
        }
        if (formElementParent) {
            node.parent = formElementParent;
        } else {
            node.parent = this.root;
        }
        if (formElement.key && this.formDesc.form.customFormItems) {
            var formEl = this.formDesc.form.customFormItems[formElement.key];
            if (formEl !== undefined) {
                formEl.key = formElement.key;
                formElement = formEl;
            }
        }
        formElement = _.clone(formElement);
        if (formElement.items) {
            if (_.isArray(formElement.items)) {
                formElement.items = _.map(formElement.items, _.clone);
            } else {
                formElement.items = [ _.clone(formElement.items) ];
            }
        }
        if (formElement.key && formElement.type !== "helptext") {
            this.keyToNode[formElement.key] = node;
            schemaElement = getSchemaElement(schemaElement, formElement, this);
            var parentSchema = getParentSchemaByKey(this.formDesc, formElement.key);
            if (schemaElement && schemaElement.isUIHidden === true) {
                return;
            }
            if (isParentElementMultilanguage(parentSchema, formElementParent)) {
                setMultilanguageParentField(parentSchema, formElementParent, schemaElement, formElement, this);
            }
            var ff = this.formDesc.form;
            formElementParent = formElementParent || {};
            parentSchema = formElementParent || {};
            extendFormElementProps(rules.common, schemaElement, formElement, ff, formElementParent, parentSchema);
            formElement.placeholder = formElement.placeholder || formElement.useTitleAsPlaceholder ? formElement.title : undefined;
            ASSERT(formElement.title.length >= 1, {
                msg: "Every field must have a title, but schema element $KEY$ does not have one.",
                msgParams: {
                    KEY: formElement.key
                },
                code: 3560
            });
            if (jfUtils.contains(schemaElement.type, "string")) {
                if (!jfUtils.contains(schemaElement.type, "null")) {
                    formElement.minLength = 1;
                }
                extendFormElementProps(rules.string, schemaElement, formElement, ff);
            } else if (jfUtils.contains(schemaElement.type, [ "integer", "number" ])) {
                extendFormElementProps(rules.number, schemaElement, formElement, ff);
            } else if (jfUtils.contains(schemaElement.type, "array")) {
                extendFormElementProps(rules.array, schemaElement, formElement, ff);
            }
            checkValidMinMaxDates(formElement);
            if (isElementMultilanguage(schemaElement)) {
                schemaElement = _.cloneDeep(schemaElement);
                setMultilanguageField(schemaElement, formElement, this);
            }
            if (schemaElement.format === "imagePreview") {
                ASSERT(schemaElement.readOnly, {
                    msg: "Image Preview should have readOnly set to true!",
                    code: 3805
                });
            }
            formElement.required = _.isEmpty(_.intersection(_.isArray(schemaElement.type) ? schemaElement.type : [ schemaElement.type ], [ "array", "object", "null" ]));
            if (hasParentSchema(parentSchema)) {
                updateRequiredProperties(schemaElement, parentSchema, formElement);
            }
            if (_.isArray(formElement.required)) {
                ASSERT(!_.isEmpty(formElement.required), {
                    msg: "Error while building form: required must be a non-empty array.",
                    code: 3830
                });
            } else {
                ASSERT.isBoolean(formElement.required, {
                    msg: "Error while building form: required must be a boolean.",
                    code: 3840
                });
            }
            formElement.type = getFormElementType(formElement, schemaElement);
            if (formElement.type === "selectfieldset") {
                this.selectFieldSetData = this.selectFieldSetData || [];
                if (formElement && formElement.key) {
                    this.selectFieldSetData.push(formElement.key);
                }
            }
            if (isForeignKeyField(schemaElement)) {
                setForeignKeyField(node, schemaElement, formElement, this);
            }
            if (formElementHasInputField(formElement.type)) {
                addValueHistoryButtons(this, formElement);
            }
            if (jsonform.elementTypes[formElement.type] && jsonform.elementTypes[formElement.type].requiresEnum && schemaElement && isForeignKeyField(schemaElement)) {
                var foreignKeyData = getForeignKeyFields(this, schemaElement);
                if (foreignKeyData !== undefined) {
                    var currentResources = this.formDesc.resources[foreignKeyData.refTable].records;
                    if (foreignKeyData.lookUpInItems) {
                        schemaElement.items.enum = [];
                        schemaElement.items.enumNames = [];
                        currentResources.map(function(data, idx) {
                            if (jfUtils.contains(schemaElement.items.type, "string")) {
                                schemaElement.items.enum.push(data[foreignKeyData.refCol]);
                            } else {
                                schemaElement.items.enum.push(Number(data[foreignKeyData.refCol]));
                            }
                            schemaElement.items.enumNames.push(data[foreignKeyData.refColTitle]);
                        });
                    } else {
                        schemaElement.enum = [];
                        schemaElement.enumNames = [];
                        currentResources.map(function(data, idx) {
                            if (jfUtils.contains(schemaElement.type, "string")) {
                                schemaElement.enum.push(data[foreignKeyData.refCol]);
                            } else {
                                schemaElement.enum.push(Number(data[foreignKeyData.refCol]));
                            }
                            schemaElement.enumNames.push(data[foreignKeyData.refColTitle]);
                        });
                    }
                }
            }
            formElement.id = formElement.id || formElement.key;
            if (formElement.preview && jsonform.elementTypes[formElement.type].inputfield) {
                formElement.type = "preview";
            }
            if (formElement.options) {
                prepareOptions(schemaElement, formElement, this.formDesc.form.nullValueTitle);
            } else if (schemaElement["enum"] || schemaElement.items && schemaElement.items["enum"] || jfUtils.contains(schemaElement.type, "boolean")) {
                var schemaEnum = null;
                var itemsEnum = null;
                if (schemaElement.enum) {
                    schemaEnum = schemaElement.enum;
                    validateEnums(schemaEnum, schemaElement, formElement, this.formDesc.form.deprecatedValue, this.formDesc);
                    if (schemaElement.enumNames) {
                        validateEnumNames(schemaElement);
                    }
                }
                if (schemaElement.items && schemaElement.items.enum) {
                    itemsEnum = schemaElement.items.enum;
                    validateEnums(itemsEnum, schemaElement.items, formElement, this.formDesc.form.deprecatedValue, this.formDesc);
                    if (schemaElement.items.enumNames) {
                        validateEnumNames(schemaElement.items);
                    }
                }
                ASSERT(Boolean(schemaEnum && itemsEnum) === false, {
                    code: 3970,
                    msg: "Invalid Schema: Schema elements cannot have more than 1 enum. A schema element  with key $KEY$ contains enums in its body and in its items object",
                    msgParams: {
                        KEY: formElement.key
                    }
                });
                var enumValues = schemaEnum || itemsEnum;
                if (!enumValues) {
                    schemaElement.enumNames = [ "YES", "NO" ];
                    schemaElement.enum = [ true, false ];
                    enumValues = [ true, false ];
                }
                prepareOptions(schemaElement, formElement, this.formDesc.form.nullValueTitle, enumValues);
            }
            if (formElement.options && jfUtils.contains(schemaElement.type, "null") && formElement.type !== "orderedselect") {
                appendNullOptionIfNotDefined(schemaElement, formElement, this.formDesc.form.nullValueTitle);
            }
            if (isMultipleCheckboxes(formElement, schemaElement)) {
                var theItem = _.isArray(schemaElement.items) ? schemaElement.items[0] : schemaElement.items;
                if (formElement.options) {
                    prepareOptions(schemaElement, formElement, this.formDesc.form.nullValueTitle);
                    theItem._jsonform_checkboxes_as_array = "value";
                } else {
                    enumValues = theItem["enum"];
                    if (enumValues) {
                        prepareOptions(schemaElement, formElement, this.formDesc.form.nullValueTitle, enumValues);
                        theItem._jsonform_checkboxes_as_array = formElement.type === "checkboxes" ? true : "value";
                    }
                }
            }
            if (formElement.getValue === "tagsinput") {
                schemaElement._jsonform_get_value_by_tagsinput = "tagsinput";
            }
            if (isObjectWithoutItems(schemaElement, formElement)) {
                iterateCreateAndAppendChildrenOfObject(schemaElement, formElement, this, node);
            }
        } else {
            ASSERT(formElement.type, {
                code: 4660,
                msg: "The form element must have key or type, please add one!"
            });
            var props = [ "preview", "enableSorting", "enableAddingItems", "enableDeletingItems", "displaySystemButtonsLabels", "locales", "localeTabs", "gridLayout" ];
            for (var i = 0; i < props.length; i++) {
                formElement[props[i]] = !_.isNil(formElement[props[i]]) ? formElement[props[i]] : this.formDesc.form[props[i]];
            }
            if (formElement.type === "table") {
                formElement.displayCompressedTables = !_.isNil(formElement.displayCompressedTables) ? formElement.displayCompressedTables : this.formDesc.form.displayCompressedTables;
                ASSERT.isBoolean(formElement.displayCompressedTables, {
                    msg: "Invalid value type for displayCompressedTables"
                });
            }
            ASSERT.isArray(this.formDesc.locales, {
                msg: "Invalid value type for form.locales",
                code: 3990
            });
            ASSERT(this.formDesc.locales.length === _.uniq(this.formDesc.locales).length, {
                msg: "All members of locales must be unique.",
                code: 4e3
            });
            ASSERT.isBoolean(this.formDesc.form.localeTabs, {
                msg: "Invalid value type for form.localeTabs",
                code: 4010
            });
            ASSERT.isBoolean(this.formDesc.form.enableSorting, {
                msg: "Invalid valueType for form.enableSorting",
                code: 4020
            });
            ASSERT(jsonform.elementTypes[formElement.type], {
                msg: "The JSONForm contains an element whose type is unknown: $TYPE$",
                msgParams: {
                    TYPE: formElement.type
                },
                code: 4030
            });
            var isInputField = jsonform.elementTypes[formElement.type].inputfield && formElement.type !== "selectfieldset";
            isInputField = isInputField || false;
            ASSERT(isInputField === false, {
                code: 4040,
                msg: 'The JsonForm defines an element of type $TYPE$ but no "key" property to link the input field to the JSON schema.',
                msgParams: {
                    TYPE: formElement.type
                }
            });
        }
        if (!formElement.type) {
            formElement.type = "text";
        }
        var plugDef = jsonform.elementTypes[formElement.type];
        ASSERT(plugDef, {
            code: 4050,
            msg: "Form plugin is set to values that is unknown: $TYPE$",
            msgParams: {
                TYPE: formElement.type
            }
        });
        if (plugDef.compatibleTypes.indexOf("array") === -1 && node.parent && node.parent.items && node.parent.items.length === 1) {
            node.currentCounterArray.pop();
        }
        if (schemaElement) {
            ASSERT(_.intersection(plugDef.compatibleTypes, _.flatten([ schemaElement.type ])), {
                code: 4060,
                msg: "no compatibleTypes for form: $TYPE$ with key $KEY$",
                msgParams: {
                    TYPE: formElement.type,
                    KEY: formElement.key
                }
            });
        }
        formElement.iddot = escapeSelector(formElement.id || "");
        node.formElement = formElement;
        node.schemaElement = schemaElement;
        node.view = plugDef;
        node.ownerTree = this;
        if (!formElement.handlers) {
            formElement.handlers = {};
        }
        if (node.view.array) {} else if (formElement.items) {
            var currentCounter = 1;
            _.each(formElement.items, function(item) {
                if (_.isString(item)) {
                    item = {
                        key: item
                    };
                }
                item.currentCounterArray = _.clone(node.currentCounterArray);
                if (node.type === "section" && node.parent && node.parent.type === "tabobject") {} else {
                    item.currentCounterArray.push(currentCounter);
                }
                var child = this.buildFromLayout(item, formElement);
                if (child) {
                    node.appendChildNode(child);
                }
                currentCounter++;
            }.bind(this));
        } else if (formElement.otherField) {
            var item = formElement.otherField;
            if (_.isString(item)) {
                item = formElement.otherField = {
                    key: item,
                    notitle: true
                };
            } else if (item.notitle === undefined) {
                item.notitle = true;
            }
            if (item.inline === undefined) {
                item.inline = formElement.inline;
            }
            var child = this.buildFromLayout(item, formElement);
            if (child) {
                node.appendChildNode(child);
            }
        }
        if (this.shouldComputeGridLayout(node)) {
            this.computeGridLayoutWidth(node.children);
        }
        node.ownerTree.keyToTitle[node.key || node.formElement.key] = node.formElement.title || node.title || node.name || node.formElement.name;
        return node;
    };
    var appendNullOptionIfNotDefined = function(schemaElement, formElement, nullLabel) {
        if (jsonform.elementTypes[formElement.type].appendNull === false) {
            return;
        }
        var hasNullOption = false;
        _.each(formElement.options, function(option) {
            if (option.value === null || _.trim(option.value) === "") {
                hasNullOption = true;
            }
        });
        if (!hasNullOption) {
            formElement.options.push({
                title: nullLabel,
                value: null
            });
        }
    };
    var prepareOptions = function(schemaElement, formElement, nullLabel, enumValues) {
        var getLabel = function(value) {
            return value === null ? nullLabel : value.toString();
        };
        if (formElement.options) {
            if (_.isArray(formElement.options)) {
                formElement.options = formElement.options.map(function(value) {
                    return _.has(value, "value") ? value : {
                        value: value,
                        title: getLabel(value)
                    };
                });
            } else if (typeof formElement.options === "object") {
                formElement.options = Object.keys(formElement.options).map(function(value) {
                    return {
                        value: value,
                        title: getLabel(formElement.options[value])
                    };
                });
            }
        } else if (formElement.titleMap) {
            formElement.options = _.map(enumValues, function(value) {
                return {
                    value: value,
                    title: value !== null && _.has(formElement.titleMap, value) ? formElement.titleMap[value] : getLabel(value)
                };
            });
        } else if (schemaElement.enumNames || schemaElement.items && schemaElement.items.enumNames) {
            var enumNames = schemaElement.enumNames || schemaElement.items && schemaElement.items.enumNames;
            ASSERT(enumNames.length === enumValues.length, {
                msg: "Schema enum and enumNames must have the same length for $SCHEMAELEMENT$",
                msgParams: {
                    SCHEMAELEMENT: schemaElement
                },
                code: 3930
            });
            formElement.options = _.map(enumValues, function(value, index) {
                var title = enumNames[index];
                if (_.isNumber(title)) {
                    title = title.toString();
                }
                ASSERT.isString(title, {
                    msg: "Invalid enumNames $TITLE$",
                    msgParams: {
                        TITLE: title
                    },
                    code: 3940
                });
                return {
                    value: value,
                    title: title
                };
            });
        } else {
            formElement.options = enumValues.map(function(value) {
                return {
                    value: value,
                    title: getLabel(value)
                };
            });
        }
        if (formElement.type === "select" && !jfUtils.contains(schemaElement.type, "null")) {
            formElement.options.unshift({
                value: "",
                title: "Select your option",
                disabled: true
            });
        }
    };
    FormTree.prototype.initializeValidator = function() {
        this.formDesc.validator.compile(this.formDesc.schema);
    };
    FormTree.prototype.validate = function(settings) {
        var values = settings.values;
        var files = settings.files;
        var clearOldErrors = settings.clearOldErrors || false;
        var hideErrors = settings.hideErrors || false;
        var options = this.formDesc;
        var errors = false;
        if (options.form.validate !== false) {
            var validator = options.validator;
            $(this.domRoot).jsonFormErrors(null, {
                clearOldErrors: clearOldErrors
            });
            var valid = validator.validate(this.formDesc.schema.id || values.schemaId || values.$schemaId || this.formDesc.schema, values, files);
            if (valid !== true) {
                errors = valid.tbData.validationErrors;
            }
        }
        if (errors && !hideErrors) {
            if (options.displayErrors) {
                options.displayErrors(errors, this.domRoot);
            } else {
                $(this.domRoot).jsonFormErrors(errors, {
                    clearOldErrors: clearOldErrors
                });
            }
        }
        return {
            errors: errors,
            values: values
        };
    };
    FormTree.prototype.computeInitialValues = function() {
        this.root.computeInitialValues(this.formDesc.value);
    };
    FormTree.prototype.shouldComputeGridLayout = function(node) {
        return node.formElement && this.formDesc.form.gridLayout === true && node.children && node.children.length > 0;
    };
    FormTree.prototype.computeGridLayoutWidth = function(children) {
        var rowWidth = {
            full: 12,
            half: 6,
            third: 4,
            quarter: 3,
            sixth: 2
        };
        function computeChildWidth(children, totalWidth, widthProperty) {
            var childrenLength = children.length;
            var widthPadding = [];
            for (var i = 0, j = childrenLength; i < j; i++) {
                widthPadding[i] = 0;
            }
            var computeWidthPadding = function() {
                if (totalWidth < rowWidth.full) {
                    var availableWidth = rowWidth.full - totalWidth;
                    for (var i = 0; availableWidth > 0; i++) {
                        widthPadding[i]++;
                        availableWidth--;
                        if (availableWidth) {
                            widthPadding[childrenLength - 1 - i]++;
                            availableWidth--;
                        }
                    }
                }
            };
            var applyRowWidth = function() {
                for (var i = 0, j = children.length; i < j; i++) {
                    var nodeWidth;
                    if (children[i].formElement.rowWidth) {
                        nodeWidth = children[i].formElement.rowWidth;
                    } else {
                        nodeWidth = children[i].view[widthProperty];
                    }
                    children[i].rowWidth = rowWidth[nodeWidth] + widthPadding[i];
                }
            };
            computeWidthPadding();
            applyRowWidth();
        }
        function computeTotalRowWidth(children) {
            var totalMaxRowWidth = 0;
            var totalMinRowWidth = 0;
            var minNodeWidth = [];
            for (var i = 0, j = children.length; i < j; i++) {
                if (children[i].formElement.rowWidth) {
                    var formElementWidth = rowWidth[children[i].formElement.rowWidth];
                    ASSERT.isNumber(formElementWidth, {
                        msg: "Invalid gridLayout value type for formElementWidth",
                        code: 4110
                    });
                    ASSERT(formElementWidth >= rowWidth.sixth, {
                        msg: "Width of element should be atleast 1/6 of the full width of the row",
                        code: 4120
                    });
                    ASSERT(formElementWidth <= rowWidth.full, {
                        msg: "Width of element should be less than the full width of the row",
                        code: 4130
                    });
                    totalMaxRowWidth += formElementWidth;
                    totalMinRowWidth += formElementWidth;
                    minNodeWidth.push(formElementWidth);
                } else {
                    ASSERT.isNumber(rowWidth[children[i].view.minRowWidth], {
                        msg: "Invalid gridLayout value type for minRowWidth",
                        code: 4140
                    });
                    ASSERT.isNumber(rowWidth[children[i].view.maxRowWidth], {
                        msg: "Invalid gridLayout value type for maxRowWidth",
                        code: 4150
                    });
                    totalMaxRowWidth += rowWidth[children[i].view.maxRowWidth];
                    totalMinRowWidth += rowWidth[children[i].view.minRowWidth];
                    minNodeWidth.push(rowWidth[children[i].view.minRowWidth]);
                }
            }
            if (totalMaxRowWidth <= rowWidth.full) {
                computeChildWidth(children, totalMaxRowWidth, "maxRowWidth");
            } else if (totalMinRowWidth <= rowWidth.full) {
                computeChildWidth(children, totalMinRowWidth, "minRowWidth");
            } else {
                splitRow(children, minNodeWidth);
            }
        }
        function splitRow(children, minNodeWidth) {
            ASSERT(children.length === minNodeWidth.length, {
                msg: "invalid gridLayout child array length",
                code: 4160
            });
            var subrow = [];
            var totalSubrowWidth = 0;
            if (children.length === 1) {
                computeTotalRowWidth(children);
            } else {
                for (var i = 0, j = minNodeWidth.length; i <= j; i++) {
                    if (totalSubrowWidth === rowWidth.full) {
                        computeTotalRowWidth(subrow);
                        subrow = [];
                        totalSubrowWidth = 0;
                        i--;
                        continue;
                    }
                    if (totalSubrowWidth + minNodeWidth[i] > rowWidth.full || i === j) {
                        computeTotalRowWidth(subrow);
                        subrow = [];
                        totalSubrowWidth = 0;
                    } else {
                        subrow.push(children[i]);
                        totalSubrowWidth += minNodeWidth[i];
                    }
                }
            }
        }
        computeTotalRowWidth(children);
    };
    FormTree.prototype.render = function(domRoot) {
        if (!domRoot) {
            return;
        }
        this.domRoot = domRoot;
        console.info("Calling Render 1: from the FormTree render");
        this.root.render();
        if (this.hasRequiredField()) {
            $(domRoot).addClass("tb-jf-hasrequired");
        }
        $(domRoot).addClass("tb-jf-root");
        if (this.formDesc.form.isDebug) {
            var debugSchema = {
                locales: this.formDesc.locales,
                schema: this.formDesc.schema,
                form: this.formDesc.form,
                content: this.formDesc.value
            };
            $(domRoot).find("> div ").prepend('<fieldset class="tb-jf-fieldset-header expandable">' + '<legend class="tb-jf-legend">' + "view source" + "</legend>" + '<div class="tb-jf-plain-fieldset row tb-jf-hide" hidden="hidden">' + '<textarea rows="30" class="tb-jf-debug-container">' + JSON.stringify(debugSchema, null, 2) + "</textarea>" + "</div>" + "</fieldset>");
        }
    };
    FormTree.prototype.lock = function() {
        _.each(this.root.children, function(child) {
            child.lock();
        });
    };
    FormTree.prototype.unlock = function() {
        _.each(this.root.children, function(child) {
            child.unlock();
        });
    };
    FormTree.prototype.submit = function(evt) {
        this.lock();
        var self = this;
        var values = jsonform.getFormValue(this.domRoot, this);
        var files = jsonform.getFormFiles(this.domRoot);
        jfUtils.escapeContentKeys(values);
        var options = this.formDesc;
        var shouldBreak = false;
        var domRoot = $(this.domRoot);
        var overlay = createOverlay(domRoot);
        $("body").append(overlay);
        var stopEvent = function(evt) {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            self.unlock();
            overlay.remove();
            return false;
        };
        this.forEachElement(function(elt) {
            if (shouldBreak) {
                return;
            }
            if (elt.view.onSubmit) {
                shouldBreak = !elt.view.onSubmit(evt, elt);
            }
        });
        if (shouldBreak) {
            return stopEvent(evt);
        }
        var selectFieldSetData = this.selectFieldSetData;
        if (selectFieldSetData) {
            for (var i = 0; i < selectFieldSetData.length; i++) {
                var key = selectFieldSetData[i];
                removeFromContent(jsonform.value, key);
            }
        }
        var merged = mergeContentAndFormValues(this.formDesc.content, values, this.formDesc.schema);
        var validated = {};
        try {
            validated = this.validate({
                values: merged,
                files: files,
                hideErrors: this.formDesc.form.hideErrors,
                clearOldErrors: true
            });
        } catch (e) {
            stopEvent(evt);
            throw e;
        }
        if (options.onSubmit && !options.onSubmit(validated.errors, merged)) {
            return stopEvent(evt);
        }
        if (validated.errors) {
            return stopEvent(evt);
        }
        if (options.onSubmitValid && !options.onSubmitValid(merged)) {
            return stopEvent(evt);
        }
        self.unlock();
        overlay.remove();
        return false;
    };
    FormTree.prototype.hasRequiredField = function() {
        return $(this.domRoot).find(".tb-jf-required").length > 0;
    };
    FormTree.prototype.forEachElement = function(callback) {
        var f = function(root) {
            for (var i = 0; i < root.children.length; i++) {
                callback(root.children[i]);
                f(root.children[i]);
            }
        };
        f(this.root);
    };
    FormTree.prototype.getFullFormDescriptor = function() {
        var data = {};
        data.content = this.formDesc.content;
        data.form = this.formDesc.form;
        data.schema = this.formDesc.schema;
        return data;
    };
    FormTree.prototype.createFiltersTree = function(schema, formElementTitle, node) {
        var augmentedSchema = createForeignKeySchemaFromSchema(this.formDesc.schema, schema, formElementTitle, node);
        if (!augmentedSchema) {
            return;
        }
        var customFiltersForm = createForeignKeyForm(augmentedSchema, node, formElementTitle);
        return this.createAndAppendNewFiltersTree(augmentedSchema, customFiltersForm);
    };
    FormTree.prototype.createAndAppendNewFiltersTree = function(newSchema, newForm, values, node, isUpdateOnFiltersTree) {
        var validator = new tbjsonAjv2Tb.getAjv2tbInstance({
            dropTheKeywords: true
        });
        validator.compile(newSchema);
        var filterFormTree = new FormTree({
            schema: newSchema,
            form: newForm,
            validator: validator,
            value: values
        }, true);
        var newTree = $('<div class="filterTree"></div>');
        if (isUpdateOnFiltersTree) {
            var oldTree = $(node.filtersTree.root.el);
            var outsideSelect = oldTree.find('select:not("[filterTreeSelect]")').clone();
            node.filtersTree = filterFormTree;
            node.filtersTree.render(newTree);
            newTree.find("select").attr("filterTreeSelect", true);
            newTree.children().first().addClass("tb-jf-filters");
            var firstRowLastColumnOfTable = newTree.find("fieldset > div > div").first().children().last();
            outsideSelect.insertAfter(firstRowLastColumnOfTable);
            appendNoResultSpan(newTree);
            newTree.find("fieldset > div").children().first().find("button").css("margin-top", "19px");
            newTree.find("fieldset > div > div").not(newTree.find("fieldset > div > div").eq(0)).each(function(idx, el) {
                $(el).children().first().css("visibility", "hidden");
                $(el).children().last().css("visibility", "hidden");
            });
            oldTree.replaceWith(newTree.children()[0]);
        } else {
            filterFormTree.render(newTree);
            var $filterFormTreeEl = $(filterFormTree.root.el);
            $filterFormTreeEl.addClass("tb-jf-filters");
            appendNoResultSpan($filterFormTreeEl);
            $filterFormTreeEl.find("fieldset > div").children().first().find("button").css("margin-top", "19px");
            return filterFormTree;
        }
    };
    jsonform.cssFramework = "bootstrap3";
    jsonform.generateSchema = function(descriptor) {
        var appendSchemaElement = function(parentSchema, elementKey, schemaElement) {
            var keyPath = elementKey.split("/");
            var parentObject = parentSchema;
            for (var i = 0, j = keyPath.length - 1; i <= j; i++) {
                if (keyPath[i].slice(-2) === "[]") {
                    keyPath[i] = keyPath[i].slice(0, -2);
                }
                if (i === j) {
                    parentObject[keyPath[i]] = schemaElement;
                } else {
                    parentObject = jfUtils.getObjByKey(parentObject, keyPath[i]);
                    if (parentObject.type === "object") {
                        parentObject = jfUtils.getObjByKey(parentObject, "properties");
                    } else if (parentObject.type === "array") {
                        parentObject = jfUtils.getObjByKey(parentObject, "items");
                        if (parentObject.properties) {
                            parentObject = jfUtils.getObjByKey(parentObject, "properties");
                        }
                    }
                }
                ASSERT(parentObject, {
                    msg: "The specified path for key $KEY$ does not exist.",
                    msgParams: {
                        KEY: elementKey
                    },
                    code: 4170
                });
            }
        };
        var generateSchemaFromForm = function(form) {
            ASSERT(form.$schemaId, {
                msg: "To generate a schema $schemaId must be defined in the form object.",
                code: 4180
            });
            ASSERT(form.jsonformVersion, {
                msg: "To generate a schema jsonformVersion must be defined in the form object.",
                code: 4190
            });
            var schema = {
                id: form.$schemaId,
                type: "object",
                properties: {}
            };
            function generateScalar(parentSchema, formElement, elementType, schemaElement) {
                ASSERT.isString(formElement.key, {
                    msg: "Every element in the form must have a key.",
                    code: 4200
                });
                ASSERT.isArray(elementType.compatibleTypes, {
                    msg: "The form element does not specify the types it supports.",
                    code: 4210
                });
                schemaElement.type = elementType.compatibleTypes[0];
                if (elementType.requiresEnum === true || elementType.acceptsEnum === true) {
                    if (elementType.requiresEnum === true) {
                        ASSERT.isPlainObject(formElement.titleMap, {
                            msg: "To auto-generate a schema for a field requiring an enum a titleMap object is required.",
                            code: 4220
                        });
                    }
                    if (schemaElement.type === "array") {
                        schemaElement.items = {
                            type: elementType.compatibleItemTypes[0]
                        };
                        if (formElement.titleMap) {
                            schemaElement.items.enum = Object.keys(formElement.titleMap);
                        }
                    } else {
                        if (formElement.titleMap) {
                            schemaElement.enum = Object.keys(formElement.titleMap);
                        }
                    }
                }
                return schemaElement;
            }
            function generateObject(parentSchema, formElement, elementType, schemaElement) {
                if (elementType.fieldtemplate) {
                    ASSERT.isString(formElement.key, {
                        msg: "Every element in the form must have a key. No key given for the following formElement: $FORMELEMENT$",
                        msgParams: {
                            FORMELEMENT: formElement
                        },
                        code: 4230
                    });
                    schemaElement.properties = {};
                    appendSchemaElement(parentSchema, formElement.key, schemaElement);
                }
                for (var i = 0, j = formElement.items.length; i < j; i++) {
                    generateSchemaElement(parentSchema, formElement.items[i]);
                }
            }
            function generateArray(parentSchema, formElement, elementType, schemaElement) {
                var i, j;
                if (elementType.fieldtemplate) {
                    ASSERT(formElement.items.items.length >= 0, {
                        msg: "Arrays must have at least one element.",
                        code: 4240
                    });
                    schemaElement.items = {};
                    if (formElement.items.items.length === 1) {
                        var childSchemaElement = {};
                        var childFormElement = formElement.items.items[0];
                        elementType = jsonform.elementTypes[childFormElement.type];
                        ASSERT.isString(childFormElement.key, {
                            msg: "Every element in the form must have a key.",
                            code: 4250
                        });
                        ASSERT.isArray(elementType.compatibleTypes, {
                            msg: "The form element does not specify the types it supports.",
                            code: 4260
                        });
                        schemaElement.items = generateScalar(parentSchema, childFormElement, elementType, childSchemaElement);
                        appendSchemaElement(parentSchema, formElement.items.items[0].key, schemaElement);
                    } else {
                        ASSERT.isString(formElement.key, {
                            msg: "Every element in the form must have a key. No key given for the following formElement: $FORMELEMENT$",
                            msgParams: {
                                FORMELEMENT: formElement
                            },
                            code: 4270
                        });
                        schemaElement.items.type = "object";
                        schemaElement.items.properties = {};
                        appendSchemaElement(parentSchema, formElement.key, schemaElement);
                        for (i = 0, j = formElement.items.items.length; i < j; i++) {
                            generateSchemaElement(parentSchema, formElement.items.items[i]);
                        }
                    }
                } else {
                    for (i = 0, j = formElement.items.length; i < j; i++) {
                        generateSchemaElement(parentSchema, formElement.items[i]);
                    }
                }
            }
            function generateSchemaElement(parentSchema, formElement) {
                ASSERT(formElement.type, {
                    msg: "Every form element must have a type",
                    code: 4280
                });
                ASSERT(jsonform.elementTypes[formElement.type], {
                    msg: "JsonForm does not support this element type.",
                    code: 4290
                });
                var schemaElement = {};
                var elementType = jsonform.elementTypes[formElement.type];
                if (elementType.inputfield) {
                    schemaElement = generateScalar(parentSchema, formElement, elementType, schemaElement);
                    appendSchemaElement(parentSchema, formElement.key, schemaElement);
                } else if (elementType.containerField) {
                    ASSERT.isArray(elementType.compatibleTypes, {
                        msg: "The form element does not specify the types it supports.",
                        code: 4300
                    });
                    schemaElement.type = elementType.compatibleTypes[0];
                    if (schemaElement.type === "array") {
                        generateArray(parentSchema, formElement, elementType, schemaElement);
                    } else if (schemaElement.type === "object") {
                        generateObject(parentSchema, formElement, elementType, schemaElement);
                    }
                }
            }
            for (var i = 0; i < form.fields.length; i++) {
                if (typeof form.fields[i] === "string") {
                    form.fields[i] = {
                        key: form.fields[i],
                        title: form.fields[i],
                        type: "text"
                    };
                }
                generateSchemaElement(schema.properties, form.fields[i]);
            }
            return schema;
        };
        var generateSchemaFromContent = function(descriptor) {
            var content = descriptor.content;
            ASSERT(descriptor.form.$schemaId, {
                msg: "To generate a schema $schemaId must be defined in the form object.",
                codE: 4310
            });
            var schema = {
                id: descriptor.form.$schemaId,
                type: "object",
                properties: {}
            };
            function generateScalar(parentSchema, value, schemaElement) {
                if (jfUtils.getJsonType(value) === "number") {
                    schemaElement.type = "number";
                } else if (value === null) {
                    schemaElement.type = "string";
                } else {
                    schemaElement.type = jfUtils.getJsonType(value);
                }
                ASSERT([ "string", "number", "boolean", "null" ].indexOf(schemaElement.type) >= 0, {
                    msg: "Invalid value type while generating schemaElement from content",
                    code: 4320
                });
                ASSERT([ "object", "array" ].indexOf(schemaElement.type) < 0, {
                    msg: "Error while generating schema from content: scalar type expected, given $TYPE$",
                    msgParams: {
                        TYPE: schemaElement.type
                    },
                    code: 4330
                });
                return schemaElement;
            }
            function generateObject(parentSchema, key, value, schemaElement) {
                var objectKeys = Object.keys(value);
                schemaElement.properties = {};
                appendSchemaElement(parentSchema, key, schemaElement);
                for (var i = 0, j = objectKeys.length; i < j; i++) {
                    generateSchemaElement(parentSchema, objectKeys[i], value[objectKeys[i]], key);
                }
            }
            function generateArray(parentSchema, key, value, schemaElement) {
                ASSERT(value.length >= 0, {
                    msg: "Error while generating schema from content: Arrays must have at least one element.",
                    code: 4340
                });
                schemaElement.items = {};
                if (typeof value[0] !== "object") {
                    var childSchemaElement = {};
                    schemaElement.items = generateScalar(parentSchema, value[0], childSchemaElement);
                    if (!schemaElement.items.title && !schemaElement.items.enum) {
                        schemaElement.items.title = schemaElement.items.type;
                    }
                    appendSchemaElement(parentSchema, key, schemaElement);
                } else {
                    schemaElement.items.type = "object";
                    schemaElement.items.properties = {};
                    appendSchemaElement(parentSchema, key, schemaElement);
                    generateObject(parentSchema, key, value[0], schemaElement);
                }
            }
            function generateSchemaElement(parentSchema, key, value, parentKey) {
                ASSERT(key, {
                    msg: "Error while generating schema from content: Every content element must have a key.",
                    code: 4350
                });
                ASSERT(value !== undefined, {
                    msg: "Error while generating schema from content: Every content element must have a value.",
                    code: 4360
                });
                if (parentKey) {
                    key = parentKey + "/" + key;
                }
                var schemaElement = {
                    title: key.split("/").pop()
                };
                if (!_.isArray(value) && !_.isObject(value)) {
                    schemaElement = generateScalar(parentSchema, value, schemaElement);
                    appendSchemaElement(parentSchema, key, schemaElement);
                } else {
                    if (_.isArray(value)) {
                        schemaElement.type = "array";
                        generateArray(parentSchema, key, value, schemaElement);
                    } else if (_.isObject(value)) {
                        schemaElement.type = "object";
                        generateObject(parentSchema, key, value, schemaElement);
                    }
                }
            }
            var contentKeys = Object.keys(content);
            for (var i = 0; i < contentKeys.length; i++) {
                if ([ "$schemaId", "jsonformVersion" ].indexOf(contentKeys[i]) < 0) {
                    generateSchemaElement(schema.properties, contentKeys[i], content[contentKeys[i]]);
                }
            }
            return schema;
        };
        if (!descriptor.form.isStrict) {
            if (descriptor.form && descriptor.form.fields) {
                descriptor.schema = generateSchemaFromForm(descriptor.form);
            } else if (descriptor.content) {
                descriptor.schema = generateSchemaFromContent(descriptor);
            }
        } else {
            ASSERT(descriptor.form.isStrict === false, {
                msg: "Invalid schema. Auto-generating schemas is supported only in unstrict mode.",
                code: 4370
            });
        }
        return descriptor.schema;
    };
    jsonform.generateForm = function(descriptor) {
        if (!descriptor.form.isStrict) {
            descriptor.form.fields = [];
            var alphaKeys = getSortedPropertyKeys(descriptor.schema.properties);
            _.each(alphaKeys, function(key) {
                descriptor.form.fields.push({
                    key: jfUtils.escapeKey(key)
                });
            });
        } else {
            ASSERT(descriptor.form.isStrict === false, {
                msg: "Invalid schema. Auto-generating forms is supported only in unstrict mode.",
                code: 4380
            });
        }
        return descriptor.form;
    };
    jsonform.getFormFiles = function(formelt) {
        var $rootEl = $(formelt);
        var $allFileInputs = $rootEl.find('input[data-tb-jf-type="file"]');
        var resultValue = {};
        $allFileInputs.each(function(idx, el) {
            if (el.files.length > 0) {
                resultValue[el.name] = {
                    name: [],
                    file: []
                };
                for (var i = 0; i < el.files.length; i++) {
                    resultValue[el.name]["name"][i] = el.files[i].name;
                    resultValue[el.name]["file"][i] = el.files[i];
                }
            }
        });
        return resultValue;
    };
    jsonform.getFormValue = function(formelt, tree) {
        var form = null;
        if (formelt) {
            form = $(formelt).data("tb-jf-tree");
        } else {
            form = $(jsonform.formTree.domRoot).data("tb-jf-tree");
        }
        if (!form) {
            return null;
        }
        var value = form.root.getFormValues(undefined, tree);
        return value;
    };
    jsonform.getFullFormDescriptor = function() {
        return this.formTree.getFullFormDescriptor();
    };
    $ = $ || window.jQuery;
    $.fn.jsonForm = function(options) {
        var start_time = Date.now();
        displayLoadingAnimation(this);
        ASSERT.isPlainObject(options, {
            msg: "JsonForm did not receive any json descriptors.",
            code: 4390
        });
        ASSERT.isPlainObject(options.form, {
            msg: "JsonSchema requires a form.",
            code: 4400
        });
        ASSERT.isString(options.form.jsonformVersion, {
            msg: "The form must specify its jsonformVersion.",
            code: 4410
        });
        ASSERT.isString(options.form.$schemaId, {
            msg: "Every form must have a $schemaId.",
            code: 4420
        });
        if (options.schema) {
            tbjsonTraverseSchema(options.schema, function() {
                if (!arguments[0].id) {}
            });
        }
        var start_time1 = Date.now();
        console.info("Traversed the schema! Time taken: " + (start_time1 - start_time) + "ms");
        removeCustomSchemaFromSchemaDefinitions(options.schema);
        if (options.form.hasOwnProperty("isStrict") && options.form.isStrict === false && (!options.schema || !options.schema.properties || Object.keys(options.schema.properties).length === 0)) {
            options.schema = jsonform.generateSchema(options);
        }
        if (!options.form || !options.form.fields || options.form.fields === null || options.form.fields.length === 0) {
            options.form = jsonform.generateForm(options);
        }
        options.form.$schemaId = options.form.$schemaId || options.form.schemaId;
        ASSERT.isPlainObject(options.schema, {
            msg: "JsonForm requires a schema.",
            code: 4430
        });
        options.schema.type = options.schema.type || "object";
        ASSERT(jfUtils.contains(options.schema.type, "object"), {
            msg: "The schema must be of type object.",
            code: 4440
        });
        ASSERT(!_.isEmpty(options.schema.properties), {
            msg: "Schema properties cannot be empty.",
            code: 4450
        });
        options.schema.id = options.schema.id || options.schema.$id;
        ASSERT.isString(options.schema.id, {
            msg: "Every schema must have an id.",
            code: 4460
        });
        ASSERT(options.schema.id === options.form.$schemaId, {
            msg: "The id of the schema and the $schemaId from the form must match",
            code: 4470
        });
        if (!options.validator) {
            options.validator = tbjsonAjv2Tb.getAjv2tbInstance();
        }
        var validSchema = false;
        try {
            options.validator.compile(options.schema);
            validSchema = true;
        } catch (e) {
            console.log("Sorry mr programmer, but your schema is invalid, there is a list of your errors: ", options.validator.ajv, " and the error itself", e);
            ASSERT(validSchema === true, {
                msg: "The json schema is invalid.",
                code: 4480
            });
        }
        var start_time2 = Date.now();
        console.info("Compile and shit the schema! Time taken: " + (start_time2 - start_time1) + "ms");
        if (options.content) {
            var validContent = false;
            try {
                options.validator.validate(options.schema, options.content);
                validContent = true;
            } catch (e) {
                console.log("Form content is INVALID!\nList of errors: ", options.validator.ajv, " and the error itself", e);
                ASSERT(validContent === true, {
                    msg: "The form content is invalid.",
                    code: 4485
                });
            }
        }
        var start_time3 = Date.now();
        console.info("Validated the schema! Time taken: " + (start_time3 - start_time2) + "ms");
        if (!_.isNil(options.content)) {
            if (options.form.isStrict) {
                ASSERT(options.schema.id === options.content.$schemaId, {
                    msg: "The id of the schema and the $schemaId from the content must match",
                    code: 4490
                });
            }
            if (_.isNil(options.value)) {
                options.value = options.content;
            } else {
                ASSERT(!options.value, {
                    msg: "JsonForm cannot have content and value hash at the same time. Use only content instead.",
                    code: 4500
                });
            }
        }
        if (!options.hasOwnProperty("value")) {
            options.value = {};
            options.value.$schemaId = options.schema.id;
        } else {
            if (options.form.isStrict) {
                ASSERT.isString(options.value.$schemaId, {
                    msg: "Every content must have a $schemaId.",
                    code: 4510
                });
            }
        }
        var formElt = this;
        options = _.defaults({}, options, {
            submitEvent: "submit"
        });
        var start_time4 = Date.now();
        console.info("Misc stuff. Shouldnt be too slow! Time taken: " + (start_time4 - start_time3) + "ms");
        var formTree = new FormTree(options);
        jsonform.formTree = formTree;
        var start_time5 = Date.now();
        console.info("Creating the new form tree! Time taken: " + (start_time5 - start_time4) + "ms");
        formElt.data("jfFormTree", formTree);
        formElt.data("tb-jf-tree", formTree);
        formElt.data("tbJfTree", formTree);
        jsonform.value = options.value;
        formTree.render(formElt.get(0));
        var start_time6 = Date.now();
        console.info("Rendering the new form tree! Time taken: " + (start_time6 - start_time5) + "ms");
        removeLoadingAnimation(this);
        jsonform.value = options.value;
        if (options.submitEvent) {
            formElt.unbind(options.submitEvent + ".tb-jf");
            formElt.bind(options.submitEvent + ".tb-jf", function(evt) {
                formTree.submit(evt);
            });
        }
        initializeTabs(formElt);
        var start_time7 = Date.now();
        console.info("Initialized all the tabs! Time taken: " + (start_time7 - start_time6) + "ms");
        $(".expandable > div, .expandable > fieldset", formElt).hide();
        formElt.on("click", ".expandable > legend", function() {
            var parent = $(this).parent();
            parent.toggleClass("expanded");
            $("> div", parent).slideToggle(100);
        });
        var start_time8 = Date.now();
        console.info("intialized all the expandable sections! Time taken: " + (start_time8 - start_time7) + "ms");
        $(this).trigger("jfload");
        return $(this);
    };
    $.fn.jsonFormClearErrors = function(errors) {
        var settings = {
            clearSelectedErrors: true
        };
        if (errors === "*") {
            settings.clearOldErrors = true;
        }
        this.jsonFormErrors(errors, settings);
    };
    $.fn.jsonFormTinyGenerateForm = function() {
        var $cont = $("<div></div>");
        var extractHtml = function(el) {
            var $el = $(el);
            var elId = el.id || "";
            var name = "tb-jft-" + el.name || "";
            var msgId = elId.replace(/tb-jf-(\d+)-field-(.*)/, "tb-jft-$1-msg-$2");
            var reqId = elId.replace(/tb-jf-(\d+)-field-(.*)/, "tb-jft-$1-req-$2");
            var inputId = elId.replace(/tb-jf-(\d+)-field-(.*)/, "tb-jft-$1-field-$2");
            var labelId = elId.replace(/tb-jf-(\d+)-field-(.*)/, "tb-jft-$1-label-$2");
            var descrId = elId.replace(/tb-jf-(\d+)-field-(.*)/, "tb-jft-$1-descr-$2");
            var msgHtml = '<div class="tb-jft-msg" id="' + msgId + '" data-tb-jft-name="' + name + '"></div>';
            var reqHtml = '<label class="tb-jft-req" id="' + reqId + '" for="' + inputId + '" data-tb-jft-name="' + name + '"></label>';
            var labelHtml = '<label class="tb-jft-label" id="' + labelId + '" for="' + inputId + '" data-tb-jft-name="' + name + '"></label>';
            var descrHtml = '<label class="tb-jft-descr" id="' + descrId + '" for="' + inputId + '" data-tb-jft-name="' + name + '"></label>';
            var readonlyHtml = '<div class="tb-jft-content tb-jft-field" id="' + inputId + '" data-tb-jft-name="' + name + '"></div>';
            var $wrapper = $("<div></div>");
            $el = $el.clone();
            $wrapper.append(msgHtml + labelHtml + descrHtml + reqHtml);
            if (el.readOnly) {
                $wrapper.append(readonlyHtml);
            } else {
                if (el.type !== "checkbox" && el.type !== "radio" && el.type !== "file") {
                    $el.attr("value", "");
                }
                if (el.type !== "select-one") {
                    $el.attr("type", el.type);
                }
                if ($(el).next().is(".input-file")) {
                    $el.attr("type", "file");
                }
                $el.attr("id", inputId).addClass("tb-jft-field").appendTo($wrapper);
                if ($el.is("select")) {
                    $el.html("");
                }
            }
            $el.removeClass("form-control input-file tb-jf-password-field");
            return $wrapper;
        };
        $(this).find(":input").filter("[name]").each(function(i, el) {
            var $res = $(el).map(function(i, el) {
                var $el = $(el);
                if ($el.is(".tb-jf-password-field")) {
                    var $inputs = $el.closest(".tb-jf-password-container").find("input");
                    var a = $inputs.map(function(k, el) {
                        return extractHtml(el);
                    }).get();
                    return a;
                }
                return extractHtml(el);
            }).get();
            $cont.append($res);
        });
        return $cont.wrapInner('<form class="tb-jft-form"></form>').html();
    };
    $.fn.jsonFormGetDistanceFromTop = function() {
        var offsetFromTop = 50;
        var distanceToTop = this.offset().top;
        return distanceToTop - offsetFromTop;
    };
    $.fn.jsonFormErrors = function(errors, settings) {
        var clearOldErrors;
        var clearSelectedErrors;
        settings = settings || {};
        var scrollIntoView = settings.scrollIntoView;
        if (scrollIntoView === undefined) {
            scrollIntoView = true;
        }
        var self = this;
        this.domRoot = this.domRoot || this;
        if (settings && settings.clearOldErrors) {
            clearOldErrors = settings.clearOldErrors;
        } else {
            clearOldErrors = false;
        }
        if (settings && settings.clearSelectedErrors) {
            clearSelectedErrors = settings.clearSelectedErrors;
        } else {
            clearSelectedErrors = false;
        }
        if (clearOldErrors) {
            $("." + jsonform.defaultClasses.groupMarkClassPrefix + "error", this.domRoot).removeClass(jsonform.defaultClasses.groupMarkClassPrefix + "error");
            $("." + jsonform.defaultClasses.groupMarkClassPrefix + "warning", this.domRoot).removeClass(jsonform.defaultClasses.groupMarkClassPrefix + "warning");
            $(".tb-jf-errortext", this.domRoot).hide();
        }
        if (!errors) {
            return;
        } else if (!_.isArray(errors) && typeof errors === "object") {
            errors = [ errors ];
        }
        var errorSelectors = [];
        for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            var limitConstraintErrorPath = error.dataPath || error.tbData.details.dataPath;
            var requiredConstraintErrorPath;
            if (error.tbData && error.tbData.debug && error.tbData.debug.ajvErr && error.tbData.debug.ajvErr.params && error.tbData.debug.ajvErr.params.missingProperty) {
                requiredConstraintErrorPath = error.tbData.debug.ajvErr.params.missingProperty;
            } else {
                requiredConstraintErrorPath = false;
            }
            if (!clearSelectedErrors) {
                ASSERT(error.msg, {
                    code: 4530,
                    msg: "Every error must declare an error message that will be shown."
                });
            }
            var key;
            if (limitConstraintErrorPath && limitConstraintErrorPath.trim() !== "") {
                key = limitConstraintErrorPath.replace("/", ".");
            } else if (requiredConstraintErrorPath && requiredConstraintErrorPath.trim() !== "") {
                key = requiredConstraintErrorPath.replace("/", ".");
            }
            var keyPath = key.split(/\[\'(.*?)\'\]|\./).filter(function(el) {
                return el !== undefined && el !== "";
            });
            var newKeyPath = [];
            if (keyPath.length > 1) {
                for (var j = keyPath.length - 1; j >= 0; j--) {
                    if (keyPath[j].match(/^\[\d*?\]$/)) {
                        newKeyPath[j - 1] = keyPath[j - 1] + keyPath[j];
                        j -= 1;
                    } else {
                        newKeyPath[j] = keyPath[j];
                    }
                }
            } else {
                newKeyPath = [ keyPath[0] ];
            }
            keyPath = newKeyPath.filter(function(el) {
                return el !== undefined;
            });
            if (keyPath[keyPath.length - 1] === "") {
                keyPath.pop();
            }
            if (keyPath[0] === "") {
                keyPath.shift();
            }
            ASSERT.isString(key, {
                code: 4540,
                msg: "An error occured but its location is unknown"
            });
            var escapedKey = jfUtils.escapeId(keyPath.join("/"));
            var errorClass = ".tb-jf-error-" + escapedKey;
            var $node = $(errorClass, self.domRoot);
            if (!$node.length) {
                if (keyPath.length === 1) {
                    var parentNodeKey = keyPath[0].split(/\[(\d+?)\]/)[0];
                } else {
                    var parentNodeKey = keyPath.slice(0, -1).join("/");
                }
                var escapedParentKey = jfUtils.escapeId(parentNodeKey);
                $node = $(".tb-jf-error-" + escapedParentKey, self.domRoot);
            }
            errorSelectors.push(errorClass);
            $node.addClass(jsonform.defaultClasses.groupMarkClassPrefix + "error");
            var node = $node.find("> div > .tb-jf-errortext, > .tb-jf-errortext");
            var fieldSetParent = $node.parents("fieldset");
            if (fieldSetParent && !fieldSetParent.hasClass("expanded")) {
                fieldSetParent.find("> legend").click();
            }
            if (!clearSelectedErrors) {
                node.text(error.msg).show();
            } else {
                var parent = node.closest("[data-tb-jf-type]");
                node.text("").hide();
                parent.removeClass(jsonform.defaultClasses.groupMarkClassPrefix + "error");
                parent.removeClass(jsonform.defaultClasses.groupMarkClassPrefix + "warning");
            }
        }
        errorSelectors = errorSelectors.join(",");
        var $errorSelectors = $(errorSelectors, this);
        var errorPanelsPath = [];
        var errorTabsPath = [];
        for (var m = 0, j = $errorSelectors.length; m < j; m++) {
            errorPanelsPath[m] = $($errorSelectors[m]).parents(".tab-pane");
            errorTabsPath[m] = [];
            for (var k = 0, l = errorPanelsPath[m].length; k < l; k++) {
                errorTabsPath[m].unshift($(errorPanelsPath[m][k]).closest(".tabbable").find("> .nav > li").eq($(errorPanelsPath[m][k]).index()).addClass(jsonform.defaultClasses.groupMarkClassPrefix + "error")[0]);
            }
            if (errorTabsPath[m].length === 0) {
                errorTabsPath.splice(m, 1);
            }
        }
        errorPanelsPath = errorPanelsPath.filter(function(array) {
            var newArray = array.filter(function(item) {
                return !_.isUndefined(item);
            });
            if (newArray.length) {
                return newArray;
            }
        });
        errorTabsPath = errorTabsPath.filter(function(item) {
            return !_.isUndefined(item);
        });
        var firstVisibleError = $errorSelectors.filter(":visible").get(0);
        if (scrollIntoView) {
            if (firstVisibleError) {
                $("html,body").animate({
                    scrollTop: $(firstVisibleError).jsonFormGetDistanceFromTop()
                }, 500);
            } else {
                var activateNestedTabs = function(errorTabs, index) {
                    if (index === undefined) {
                        index = 0;
                    }
                    ASSERT.isNotNil(errorTabs[index], {
                        msg: "no error tab path specified",
                        code: 4550
                    });
                    ASSERT(!_.isUndefined(errorTabs[index]), {
                        msg: "no error tab path specified",
                        code: 4555
                    });
                    for (var k = 0, j = errorTabs[index].length; k < j; k++) {
                        if (errorTabs[index][k]) {
                            errorTabs[index][k].click();
                        }
                    }
                    var firstVisibleError = $errorSelectors.filter(":visible").get(0);
                    if (!firstVisibleError) {
                        activateNestedTabs(errorTabs, index + 1);
                    } else {
                        $("html,body").animate({
                            scrollTop: $(firstVisibleError).jsonFormGetDistanceFromTop()
                        }, 500);
                    }
                };
                if (errorTabsPath.length > 0) {
                    activateNestedTabs(errorTabsPath, 0);
                }
            }
        }
    };
    $.fn.jsonFormValue = function(enforceNonValidationVisualization) {
        if (enforceNonValidationVisualization === undefined) {
            enforceNonValidationVisualization = false;
        }
        var formTree = this.data("tbJfTree") || this.data("tb-jf-tree") || this.data("jfFormTree");
        var values = jsonform.getFormValue(this);
        var files = jsonform.getFormFiles(this);
        var selectFieldSetData = formTree.selectFieldSetData;
        if (selectFieldSetData) {
            for (var i = 0; i < selectFieldSetData.length; i++) {
                var key = selectFieldSetData[i];
                removeFromContent(formTree.formDesc.content, key);
            }
        }
        var merged = mergeContentAndFormValues(formTree.formDesc.content, values, formTree.formDesc.schema);
        delete merged["full_descr"];
        var validated = {};
        if (formTree.formDesc.form.validate) {
            validated = formTree.validate({
                values: merged,
                files: files,
                clearOldErrors: !enforceNonValidationVisualization,
                hideErrors: enforceNonValidationVisualization
            });
        }
        validated.values = merged;
        validated.files = files;
        return validated;
    };
    $.fn.getFullFormDescriptor = function() {
        return jsonform.getFullFormDescriptor();
    };
    $.fn.jsonFormSetValue = function(path, value, shouldDie) {
        ASSERT.isString(path, {
            msg: "jsonFormSetValue: the first argument must be a valid json path string.",
            code: 4560
        });
        ASSERT(path !== undefined, {
            msg: "jsonFormSetValue: the second argument must be defined.",
            code: 4570
        });
        var node = jsonform.formTree.keyToNode[path];
        if (node === undefined) return;
        node.setValue(value);
    };
    $.fn.jsonFormSetOptions = function(path, options) {
        ASSERT.isString(path, {
            msg: "jsonFormSetValue: the first argument must be a valid json path string.",
            code: 4560
        });
        ASSERT(path !== undefined, {
            msg: "jsonFormSetValue: the second argument must be defined.",
            code: 4570
        });
        ASSERT(_.isArray(options), {
            msg: "Options must be an array!",
            code: 5100
        });
        var node = jsonform.formTree.root.getChildNodeByKeyPath(path);
        node.setSelectOptions(options);
    };
    $.fn.jsonFormAddSelectOptions = function(path, options) {
        ASSERT.isString(path, {
            msg: "jsonFormSetValue: the first argument must be a valid json path string.",
            code: 4560
        });
        ASSERT(path !== undefined, {
            msg: "jsonFormSetValue: the second argument must be defined.",
            code: 4570
        });
        ASSERT(_.isArray(options), {
            msg: "Options must be an array!",
            code: 5100
        });
        var node = jsonform.formTree.root.getChildNodeByKeyPath(path);
        node.addSelectOptions(options);
    };
    $.fn.jsonFormSetTemplateData = function(path, options, templateData) {
        ASSERT.isString(path, {
            msg: "jsonFormSetValue: the first argument must be a valid json path string.",
            code: 4560
        });
        ASSERT(path !== undefined, {
            msg: "jsonFormSetValue: the second argument must be defined.",
            code: 4570
        });
        ASSERT(_.isArray(options), {
            msg: "Options must be an array!",
            code: 5100
        });
        var node = jsonform.formTree.root.getChildNodeByKeyPath(path);
        node.setTemplateOptions(options, templateData);
    };
    $.fn.jsonFormAddTemplateData = function(path, options, templateData) {
        ASSERT.isString(path, {
            msg: "jsonFormAddTemplateData: the json path to the value must be a string!",
            code: 4560
        });
        ASSERT.isArray(options, {
            msg: "jsonFormAddTemplateData: the second argument must be an array of title and value.",
            code: 4570
        });
        ASSERT(_.isArray(options), {
            msg: "Options must be an array!",
            code: 5100
        });
        var node = jsonform.formTree.root.getChildNodeByKeyPath(path);
        node.addTemplateOptions(options, templateData);
    };
    $.fn.jsonFormPlugin = function(options) {
        return this.each(function() {
            var $this = $(this);
            if (!$this.is(":input:hidden")) {
                return $this.jsonForm(options);
            } else {
                var $form = $('<div id="tb-jf-form-hidden"></div>');
                var inlineOpts = $this.data("jsonform-inline");
                console.log(inlineOpts);
                $this.data("tb-jf-has-error", 0);
                $this.after($form);
                $form.on("jsonformsChange", function(e, options) {
                    var jsonformValue = $form.jsonFormValue(true);
                    if ($form && jsonformValue.errors instanceof Array && jsonformValue.errors.length > 0) {
                        $this.data("tb-jf-has-error", 1);
                        console.info("JF2 validation errors: ", jsonformValue.errors);
                        if (inlineOpts.form.liveValidation || options && options.from_submit) {
                            $form.jsonFormErrors(jsonformValue.errors, {
                                clearOldErrors: true,
                                scrollIntoView: true
                            });
                        } else {
                            $form.jsonFormErrors(jsonformValue.errors, {
                                clearOldErrors: true,
                                scrollIntoView: false
                            });
                        }
                        return;
                    }
                    $form.jsonFormErrors([], {
                        clearOldErrors: true,
                        scrollIntoView: true
                    });
                    $this.data("tb-jf-has-error", 0);
                    $this.val(JSON.stringify({
                        sp: inlineOpts.sp,
                        content: jsonformValue.values,
                        files: jsonformValue.files
                    }));
                });
                $.extend(true, inlineOpts, options);
                if (inlineOpts.content.$schemaId === undefined && inlineOpts.form.$schemaId === inlineOpts.schema.id) {
                    inlineOpts.content.$schemaId = inlineOpts.form.$schemaId;
                    $this.val(JSON.stringify(inlineOpts.content));
                }
                if ($form) {
                    console.log("Initialized JF2 by input hidden", inlineOpts);
                    $form.jsonForm(inlineOpts);
                }
            }
        });
    };
    function addPlugin(pluginName, pluginDef) {
        ASSERT.isNil(this.plugins[pluginName], {
            msg: "Plugin $pluginName$ already defined, please use another name or extend current plugin",
            msgParams: {
                pluginName: pluginName
            }
        });
        this.plugins[pluginName] = pluginDef;
    }
    return jsonform;
});