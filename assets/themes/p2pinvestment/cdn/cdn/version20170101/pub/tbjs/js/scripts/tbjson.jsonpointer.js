(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.TB = root.TB || {};
        root.TB.tbjson = root.TB.tbjson || {};
        root.TB.tbjson.jsonpointer = factory();
    }
})(this, function() {
    var JsonPointer, JsonPointerError, extend = function(child, parent) {
        for (var key in parent) {
            if (hasProp1.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, hasProp1 = {}.hasOwnProperty;
    JsonPointerError = function(superClass) {
        extend(JsonPointerError, superClass);
        function JsonPointerError(message) {
            var base;
            base = JsonPointerError.__super__.constructor.call(this, message);
            this.message = base.message;
            this.stack = base.stack;
            this.name = this.constructor.name;
        }
        return JsonPointerError;
    }(Error);
    JsonPointer = function() {
        JsonPointer.JsonPointerError = JsonPointerError;
        function JsonPointer(object, pointer, value) {
            switch (arguments.length) {
              case 3:
                return JsonPointer.set(object, pointer, value);

              case 2:
                return JsonPointer.get(object, pointer);

              case 1:
                return JsonPointer.smartBind({
                    object: object
                });

              default:
                return null;
            }
        }
        JsonPointer.smartBind = function(arg) {
            var api, frag, hasObj, hasOpt, hasPtr, key, mergeOptions, obj, opt, ptr, val;
            obj = arg.object, ptr = arg.pointer, frag = arg.fragment, opt = arg.options;
            ptr = frag != null ? frag : ptr;
            hasObj = obj !== void 0;
            hasPtr = ptr != null;
            hasOpt = opt != null;
            if (typeof ptr === "string") {
                ptr = this.parse(ptr);
            }
            mergeOptions = function(override) {
                var o, ref, ref1, ref2, ref3, ref4, ref5;
                if (override == null) {
                    override = {};
                }
                o = {};
                o.hasOwnProp = (ref = override.hasOwnProp) != null ? ref : opt.hasOwnProp;
                o.getProp = (ref1 = override.getProp) != null ? ref1 : opt.getProp;
                o.setProp = (ref2 = override.setProp) != null ? ref2 : opt.setProp;
                o.getNotFound = (ref3 = override.getNotFound) != null ? ref3 : opt.getNotFound;
                o.setNotFound = (ref4 = override.setNotFound) != null ? ref4 : opt.setNotFound;
                o.delNotFound = (ref5 = override.delNotFound) != null ? ref5 : opt.delNotFound;
                return o;
            };
            api = void 0;
            if (hasObj && hasPtr && hasOpt) {
                api = function(value) {
                    switch (arguments.length) {
                      case 1:
                        return JsonPointer.set(obj, ptr, value, opt);

                      case 0:
                        return JsonPointer.get(obj, ptr, opt);

                      default:
                        return null;
                    }
                };
                api.set = function(value, override) {
                    return obj = JsonPointer.set(obj, ptr, value, mergeOptions(override));
                };
                api.get = function(override) {
                    return JsonPointer.get(obj, ptr, mergeOptions(override));
                };
                api.has = function(override) {
                    return JsonPointer.has(obj, ptr, mergeOptions(override));
                };
                api.del = function(override) {
                    return obj = JsonPointer.del(obj, ptr, mergeOptions(override));
                };
            } else if (hasObj && hasPtr) {
                api = function(value) {
                    switch (arguments.length) {
                      case 1:
                        return JsonPointer.set(obj, ptr, value);

                      case 0:
                        return JsonPointer.get(obj, ptr);

                      default:
                        return null;
                    }
                };
                api.set = function(value, override) {
                    return obj = JsonPointer.set(obj, ptr, value, override);
                };
                api.get = function(override) {
                    return JsonPointer.get(obj, ptr, override);
                };
                api.has = function(override) {
                    return JsonPointer.has(obj, ptr, override);
                };
                api.del = function(override) {
                    return obj = JsonPointer.del(obj, ptr, override);
                };
            } else if (hasObj && hasOpt) {
                api = function(ptr, value) {
                    switch (arguments.length) {
                      case 2:
                        return JsonPointer.set(obj, ptr, value, opt);

                      case 1:
                        return JsonPointer.get(obj, ptr, opt);

                      default:
                        return null;
                    }
                };
                api.set = function(ptr, value, override) {
                    return obj = JsonPointer.set(obj, ptr, value, mergeOptions(override));
                };
                api.get = function(ptr, override) {
                    return JsonPointer.get(obj, ptr, mergeOptions(override));
                };
                api.has = function(ptr, override) {
                    return JsonPointer.has(obj, ptr, mergeOptions(override));
                };
                api.del = function(ptr, override) {
                    return obj = JsonPointer.del(obj, ptr, mergeOptions(override));
                };
            } else if (hasPtr && hasOpt) {
                api = function(obj, value) {
                    switch (arguments.length) {
                      case 2:
                        return JsonPointer.set(obj, ptr, value, opt);

                      case 1:
                        return JsonPointer.get(obj, ptr, opt);

                      default:
                        return null;
                    }
                };
                api.set = function(obj, value, override) {
                    return JsonPointer.set(obj, ptr, value, mergeOptions(override));
                };
                api.get = function(obj, override) {
                    return JsonPointer.get(obj, ptr, mergeOptions(override));
                };
                api.has = function(obj, override) {
                    return JsonPointer.has(obj, ptr, mergeOptions(override));
                };
                api.del = function(obj, override) {
                    return JsonPointer.del(obj, ptr, mergeOptions(override));
                };
            } else if (hasOpt) {
                api = function(obj, ptr, value) {
                    switch (arguments.length) {
                      case 3:
                        return JsonPointer.set(obj, ptr, value, opt);

                      case 2:
                        return JsonPointer.get(obj, ptr, opt);

                      case 1:
                        return api.smartBind({
                            object: obj
                        });

                      default:
                        return null;
                    }
                };
                api.set = function(obj, ptr, value, override) {
                    return JsonPointer.set(obj, ptr, value, mergeOptions(override));
                };
                api.get = function(obj, ptr, override) {
                    return JsonPointer.get(obj, ptr, mergeOptions(override));
                };
                api.has = function(obj, ptr, override) {
                    return JsonPointer.has(obj, ptr, mergeOptions(override));
                };
                api.del = function(obj, ptr, override) {
                    return JsonPointer.del(obj, ptr, mergeOptions(override));
                };
            } else if (hasObj) {
                api = function(ptr, value) {
                    switch (arguments.length) {
                      case 2:
                        return JsonPointer.set(obj, ptr, value);

                      case 1:
                        return JsonPointer.get(obj, ptr);

                      default:
                        return null;
                    }
                };
                api.set = function(ptr, value, override) {
                    return obj = JsonPointer.set(obj, ptr, value, override);
                };
                api.get = function(ptr, override) {
                    return JsonPointer.get(obj, ptr, override);
                };
                api.has = function(ptr, override) {
                    return JsonPointer.has(obj, ptr, override);
                };
                api.del = function(ptr, override) {
                    return obj = JsonPointer.del(obj, ptr, override);
                };
            } else if (hasPtr) {
                api = function(obj, value) {
                    switch (arguments.length) {
                      case 2:
                        return JsonPointer.set(obj, ptr, value);

                      case 1:
                        return JsonPointer.get(obj, ptr);

                      default:
                        return null;
                    }
                };
                api.set = function(obj, value, override) {
                    return JsonPointer.set(obj, ptr, value, override);
                };
                api.get = function(obj, override) {
                    return JsonPointer.get(obj, ptr, override);
                };
                api.has = function(obj, override) {
                    return JsonPointer.has(obj, ptr, override);
                };
                api.del = function(obj, override) {
                    return JsonPointer.del(obj, ptr, override);
                };
            } else {
                return this;
            }
            api.smartBind = function(override) {
                var o;
                o = {};
                if ({}.hasOwnProperty.call(override, "object")) {
                    o.object = override.object;
                } else if (hasObj) {
                    o.object = obj;
                }
                if ({}.hasOwnProperty.call(override, "pointer")) {
                    o.pointer = override.pointer;
                } else if (hasPtr) {
                    o.pointer = ptr;
                }
                if ({}.hasOwnProperty.call(override, "options")) {
                    o.options = mergeOptions(override.options);
                } else if (hasObj) {
                    o.options = opt;
                }
                return JsonPointer.smartBind(o);
            };
            if (hasPtr) {
                api.pointer = function(value) {
                    if (arguments.length === 0) {
                        return JsonPointer.compilePointer(ptr);
                    } else {
                        return ptr = JsonPointer.parsePointer(value);
                    }
                };
                api.fragment = function(value) {
                    if (arguments.length === 0) {
                        return JsonPointer.compileFragment(ptr);
                    } else {
                        return ptr = JsonPointer.parseFragment(value);
                    }
                };
            }
            if (hasObj) {
                api.object = function(value) {
                    if (arguments.length === 0) {
                        return obj;
                    } else {
                        return obj = value;
                    }
                };
            }
            if (hasOpt) {
                api.options = function(value) {
                    if (arguments.length === 0) {
                        return opt;
                    } else {
                        return opt = value;
                    }
                };
            }
            for (key in JsonPointer) {
                if (!hasProp1.call(JsonPointer, key)) continue;
                val = JsonPointer[key];
                if (!{}.hasOwnProperty.call(api, key)) {
                    api[key] = val;
                }
            }
            return api;
        };
        JsonPointer.escape = function(segment) {
            return segment.replace(/~/g, "~0").replace(/\//g, "~1");
        };
        JsonPointer.escapeFragment = function(segment) {
            return encodeURIComponent(JsonPointer.escape(segment));
        };
        JsonPointer.unescape = function(segment) {
            return segment.replace(/~1/g, "/").replace(/~0/g, "~");
        };
        JsonPointer.unescapeFragment = function(segment) {
            return JsonPointer.unescape(decodeURIComponent(segment));
        };
        JsonPointer.isPointer = function(str) {
            switch (str.charAt(0)) {
              case "":
                return true;

              case "/":
                return true;

              default:
                return false;
            }
        };
        JsonPointer.isFragment = function(str) {
            switch (str.substring(0, 2)) {
              case "#":
                return true;

              case "#/":
                return true;

              default:
                return false;
            }
        };
        JsonPointer.parse = function(str) {
            switch (str.charAt(0)) {
              case "":
                return [];

              case "/":
                return str.substring(1).split("/").map(JsonPointer.unescape);

              case "#":
                switch (str.charAt(1)) {
                  case "":
                    return [];

                  case "/":
                    return str.substring(2).split("/").map(JsonPointer.unescapeFragment);

                  default:
                    throw new JsonPointerError("Invalid JSON fragment pointer: " + str);
                }
                break;

              default:
                throw new JsonPointerError("Invalid JSON pointer: " + str);
            }
        };
        JsonPointer.parsePointer = function(str) {
            switch (str.charAt(0)) {
              case "":
                return [];

              case "/":
                return str.substring(1).split("/").map(JsonPointer.unescape);

              default:
                throw new JsonPointerError("Invalid JSON pointer: " + str);
            }
        };
        JsonPointer.parseFragment = function(str) {
            switch (str.substring(0, 2)) {
              case "#":
                return [];

              case "#/":
                return str.substring(2).split("/").map(JsonPointer.unescapeFragment);

              default:
                throw new JsonPointerError("Invalid JSON fragment pointer: " + str);
            }
        };
        JsonPointer.compile = function(segments) {
            return segments.map(function(segment) {
                return "/" + JsonPointer.escape(segment);
            }).join("");
        };
        JsonPointer.compilePointer = function(segments) {
            return segments.map(function(segment) {
                return "/" + JsonPointer.escape(segment);
            }).join("");
        };
        JsonPointer.compileFragment = function(segments) {
            return "#" + segments.map(function(segment) {
                return "/" + JsonPointer.escapeFragment(segment);
            }).join("");
        };
        JsonPointer.hasJsonProp = function(obj, key) {
            if (Array.isArray(obj)) {
                return typeof key === "number" && key < obj.length;
            } else if (typeof obj === "object") {
                return {}.hasOwnProperty.call(obj, key);
            } else {
                return false;
            }
        };
        JsonPointer.hasOwnProp = function(obj, key) {
            return {}.hasOwnProperty.call(obj, key);
        };
        JsonPointer.hasProp = function(obj, key) {
            return key in obj;
        };
        JsonPointer.getProp = function(obj, key) {
            return obj[key];
        };
        JsonPointer.setProp = function(obj, key, value) {
            return obj[key] = value;
        };
        JsonPointer.getNotFound = function(obj, segment, root, segments, iSegment) {
            return void 0;
        };
        JsonPointer.setNotFound = function(obj, segment, root, segments, iSegment) {
            if (segments[iSegment + 1].match(/^(?:0|[1-9]\d*|-)$/)) {
                return obj[segment] = [];
            } else {
                return obj[segment] = {};
            }
        };
        JsonPointer.delNotFound = function(obj, segment, root, segments, iSegment) {
            return void 0;
        };
        JsonPointer.errorNotFound = function(obj, segment, root, segments, iSegment) {
            throw new JsonPointerError("Unable to find json path: " + JsonPointer.compile(segments.slice(0, iSegment + 1)));
        };
        JsonPointer.set = function(obj, pointer, value, options) {
            var getProp, hasProp, iSegment, len, ref, ref1, ref2, ref3, root, segment, setNotFound, setProp;
            if (typeof pointer === "string") {
                pointer = JsonPointer.parse(pointer);
            }
            if (pointer.length === 0) {
                return value;
            }
            hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
            getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
            setProp = (ref2 = options != null ? options.setProp : void 0) != null ? ref2 : JsonPointer.setProp;
            setNotFound = (ref3 = options != null ? options.setNotFound : void 0) != null ? ref3 : JsonPointer.setNotFound;
            root = obj;
            iSegment = 0;
            len = pointer.length;
            while (iSegment !== len) {
                segment = pointer[iSegment];
                ++iSegment;
                if (segment === "-" && Array.isArray(obj)) {
                    segment = obj.length;
                } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
                    segment = parseInt(segment, 10);
                }
                if (iSegment === len) {
                    setProp(obj, segment, value);
                    break;
                } else if (!hasProp(obj, segment)) {
                    obj = setNotFound(obj, segment, root, pointer, iSegment - 1);
                } else {
                    obj = getProp(obj, segment);
                }
            }
            return root;
        };
        JsonPointer.get = function(obj, pointer, options) {
            var getNotFound, getProp, hasProp, iSegment, len, ref, ref1, ref2, root, segment;
            if (typeof pointer === "string") {
                pointer = JsonPointer.parse(pointer);
            }
            hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
            getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
            getNotFound = (ref2 = options != null ? options.getNotFound : void 0) != null ? ref2 : JsonPointer.getNotFound;
            root = obj;
            iSegment = 0;
            len = pointer.length;
            while (iSegment !== len) {
                segment = pointer[iSegment];
                ++iSegment;
                if (segment === "-" && Array.isArray(obj)) {
                    segment = obj.length;
                } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
                    segment = parseInt(segment, 10);
                }
                if (!hasProp(obj, segment)) {
                    return getNotFound(obj, segment, root, pointer, iSegment - 1);
                } else {
                    obj = getProp(obj, segment);
                }
            }
            return obj;
        };
        JsonPointer.del = function(obj, pointer, options) {
            var delNotFound, getProp, hasProp, iSegment, len, ref, ref1, ref2, root, segment;
            if (typeof pointer === "string") {
                pointer = JsonPointer.parse(pointer);
            }
            if (pointer.length === 0) {
                return void 0;
            }
            hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
            getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
            delNotFound = (ref2 = options != null ? options.delNotFound : void 0) != null ? ref2 : JsonPointer.delNotFound;
            root = obj;
            iSegment = 0;
            len = pointer.length;
            while (iSegment !== len) {
                segment = pointer[iSegment];
                ++iSegment;
                if (segment === "-" && Array.isArray(obj)) {
                    segment = obj.length;
                } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
                    segment = parseInt(segment, 10);
                }
                if (!hasProp(obj, segment)) {
                    delNotFound(obj, segment, root, pointer, iSegment - 1);
                    break;
                } else if (iSegment === len) {
                    delete obj[segment];
                    break;
                } else {
                    obj = getProp(obj, segment);
                }
            }
            return root;
        };
        JsonPointer.has = function(obj, pointer, options) {
            var getProp, hasProp, iSegment, len, ref, ref1, segment;
            if (typeof pointer === "string") {
                pointer = JsonPointer.parse(pointer);
            }
            hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
            getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
            iSegment = 0;
            len = pointer.length;
            while (iSegment !== len) {
                segment = pointer[iSegment];
                ++iSegment;
                if (segment === "-" && Array.isArray(obj)) {
                    segment = obj.length;
                } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
                    segment = parseInt(segment, 10);
                }
                if (!hasProp(obj, segment)) {
                    return false;
                }
                obj = getProp(obj, segment);
            }
            return true;
        };
        return JsonPointer;
    }();
    return JsonPointer;
});