(function(global, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory(require("tb.xerrors"));
    } else if (typeof define === "function" && define.amd) {
        define([ "tb.xerrors" ], function() {
            return factory.apply(factory, arguments);
        });
    } else {
        global.TB = global.TB || {};
        global.TB.File = factory(global.TB);
    }
})(this, function(TB) {
    "use strict";
    function File(settings, data) {
        ASSERT.isPlainObject(settings);
        ASSERT.isString(data);
        var defaultSettings = {
            type: "text/plain",
            charset: "utf-8",
            filename: new Date().toString()
        };
        settings = TB.merge(TB.merge({}, defaultSettings), settings);
        ASSERT.isString(settings.type);
        ASSERT.isString(settings.charset);
        ASSERT.isString(settings.filename);
        this.s = settings;
        this.data = data;
    }
    File.prototype = {
        _prepareData: function() {
            return encodeURIComponent(this.data);
        },
        download: function() {
            var element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8," + this._prepareData());
            element.setAttribute("download", this.s.filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };
    File.loadFiles = function(files, readAs) {
        if (!(files instanceof Array)) {
            files = [ files ];
        }
        readAs = readAs || "Text";
        var promises = [];
        for (var i = 0, l = files.length; i < l; i++) {
            promises.push(File.loadFile(files[0], readAs));
        }
        return Promise.all(promises);
    };
    File.loadFile = function(file, readAs) {
        if (!(file instanceof Blob)) {
            throw new TypeError("Must be a File or Blob");
        }
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.onerror = function(e) {
                reject("Error reading" + file.name + ": " + e.target.result);
            };
            reader["readAs" + readAs](file);
        });
    };
    TB.File = File;
    return File;
});