"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Either_1 = require("mocoolka-fp/lib/Either");
var Array_1 = require("mocoolka-fp/lib/Array");
var ReaderEither_1 = require("mocoolka-fp/lib/ReaderEither");
var predicate_1 = require("mocoolka-fp/lib/predicate");
var headerRegExp = /---[\r\n]([\s\S]*)[\r\n]---/;
var titleRegExp = /# (.*)[\r\n]/;
var headerKeyValueRegExp = /(.*): (.*)/g;
var emptyRegExp = /^\s*$/;
var demoRegExp = /^{|}$/;
function getHeaders(markdown) {
    var header = markdown.match(headerRegExp);
    if (!header) {
        return {
            components: [],
        };
    }
    var header1 = header[1];
    var regexMatchs;
    var headers = {};
    while ((regexMatchs = headerKeyValueRegExp.exec(header1)) !== null) {
        headers[regexMatchs[1]] = regexMatchs[2];
    }
    if (headers.components) {
        headers.components = headers.components.split(', ').sort();
    }
    else {
        headers.components = [];
    }
    return headers;
}
exports.getHeaders = getHeaders;
function getContents(markdown) {
    return markdown
        .replace(headerRegExp, '')
        .split(/^{{|}}$/gm)
        .filter(function (content) { return !emptyRegExp.test(content); });
}
exports.getContents = getContents;
function getTitle(markdown) {
    var matches = markdown.match(titleRegExp);
    return matches ? matches[1] : 'Mocoolka-UI';
}
exports.getTitle = getTitle;
exports.isNotFound = function (x) {
    return x._tag === 'NotFound';
};
var NotFound = (function () {
    function NotFound() {
        this._tag = 'NotFound';
    }
    return NotFound;
}());
exports.NotFound = NotFound;
var DemoMissingName = (function () {
    function DemoMissingName(module, name) {
        this.module = module;
        this.name = name;
        this._tag = 'DemoMissingName';
    }
    return DemoMissingName;
}());
exports.DemoMissingName = DemoMissingName;
var CommonPropsInvalidPropType = (function () {
    function CommonPropsInvalidPropType(module, propertyName) {
        this.module = module;
        this.propertyName = propertyName;
        this._tag = 'CommonPropsInvalidPropType';
    }
    return CommonPropsInvalidPropType;
}());
exports.CommonPropsInvalidPropType = CommonPropsInvalidPropType;
var SpecInvalidConent = (function () {
    function SpecInvalidConent(module, content) {
        this.module = module;
        this.content = content;
        this._tag = 'SpecInvalidConent';
    }
    return SpecInvalidConent;
}());
exports.SpecInvalidConent = SpecInvalidConent;
var ok = function (a) {
    return Either_1.right(a);
};
var kos = function (errors) {
    return Either_1.left(errors);
};
var ko = function (error) {
    return kos([error]);
};
exports.notFound = ko(new NotFound());
exports.parseDocMd = function (getDemo) { return new ReaderEither_1.ReaderEither(function (e) {
    var parseDoc = function (name, content) {
        return new ReaderEither_1.ReaderEither(function () {
            try {
                var content1 = content.match(demoRegExp);
                if (content1) {
                    var value = JSON.parse(content);
                    if (predicate_1.isPlainObject(value) && Object.keys(value).length === 1 && predicate_1.isString(value.demo)) {
                        var demo = getDemo(value.demo);
                        if (demo) {
                            var result = tslib_1.__assign({}, demo, { kind: 'DocSpec' });
                            return ok(result);
                        }
                        else {
                            return ko(new DemoMissingName(name, value.demo));
                        }
                    }
                    else {
                        return ko(new SpecInvalidConent(name, content));
                    }
                }
                else {
                    return ok({ kind: 'DocContent', name: content });
                }
            }
            catch (_a) {
                return ko(new SpecInvalidConent(name, content));
            }
        });
    };
    var items = getContents(e.content).map(function (b) { return parseDoc(e.name, b).run(e); });
    var errors = Array_1.flatten(Array_1.lefts(items)).filter(function (x) { return !exports.isNotFound(x); });
    if (errors.length > 0) {
        return kos(errors);
    }
    var modules = Array_1.rights(items);
    return ok(tslib_1.__assign({}, e, { title: getTitle(e.content), kind: 'DocMd', items: modules }));
}); };
//# sourceMappingURL=parser.js.map