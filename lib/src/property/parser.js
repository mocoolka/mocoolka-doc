"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var m = tslib_1.__importStar(require("./domain"));
var Option_1 = require("mocoolka-fp/lib/Option");
var Either_1 = require("mocoolka-fp/lib/Either");
var Array_1 = require("mocoolka-fp/lib/Array");
var doctrine_1 = require("doctrine");
var ReaderEither_1 = require("mocoolka-fp/lib/ReaderEither");
var isNotFound = function (x) {
    return x._tag === 'NotFound';
};
var NotFound = (function () {
    function NotFound() {
        this._tag = 'NotFound';
    }
    return NotFound;
}());
exports.NotFound = NotFound;
var DataMissingConstructorName = (function () {
    function DataMissingConstructorName(module, name) {
        this.module = module;
        this.name = name;
        this._tag = 'MissingConstructorName';
    }
    return DataMissingConstructorName;
}());
exports.DataMissingConstructorName = DataMissingConstructorName;
var CommonPropsInvalidPropType = (function () {
    function CommonPropsInvalidPropType(module, propertyName) {
        this.module = module;
        this.propertyName = propertyName;
        this._tag = 'CommonPropsInvalidPropType';
    }
    return CommonPropsInvalidPropType;
}());
exports.CommonPropsInvalidPropType = CommonPropsInvalidPropType;
var DataInvalidConstructorName = (function () {
    function DataInvalidConstructorName(module, name) {
        this.module = module;
        this.name = name;
        this._tag = 'DataInvalidConstructorName';
    }
    return DataInvalidConstructorName;
}());
exports.DataInvalidConstructorName = DataInvalidConstructorName;
var ok = function (a) {
    return Either_1.right(a);
};
var kos = function (errors) {
    return Either_1.left(errors);
};
var ko = function (error) {
    return kos([error]);
};
var notFound = ko(new NotFound());
var parseJSDoc = function (source) {
    return doctrine_1.parse(source, { unwrap: true });
};
var notEmpty = function (s) {
    return s !== '';
};
var fromJSDocDescription = function (description) {
    return Option_1.fromNullable(description).filter(notEmpty).toUndefined();
};
var getDescription = function (a) {
    return a.length > 0 ? a[0].getComment() : undefined;
};
var getAnnotation = function (jsdocs) {
    return parseJSDoc(jsdocs.map(function (doc) { return doc.getText(); }).join('\n'));
};
var getType = function (a) {
    if (a.isUnion()) {
        var items = [];
        for (var _i = 0, _a = a.getUnionTypes(); _i < _a.length; _i++) {
            var g = _a[_i];
            if (g.isStringLiteral()) {
                items.push(g.getText().trim().substring(1, g.getText().trim().length - 1));
            }
            else if (g.isNumberLiteral) {
                items.push(g.getText().trim());
            }
        }
        return {
            kind: 'Type',
            name: 'union',
            items: items,
        };
    }
    return {
        kind: 'Type',
        name: 'other',
    };
};
var getInterfaceProperty = function (a) {
    var name = a.getName();
    var text = a.getText();
    var start = a.getName().length;
    var end = text.indexOf('{');
    var signature = text.substring(start, end);
    var description = getDescription(a.getJsDocs());
    var type = getType(a.getType());
    return ({
        kind: 'Property', name: name, description: description, type: type, signature: signature,
    });
};
var getInterfaceProperties = function (a) {
    return a.getProperties().map(function (b) { return getInterfaceProperty(b); });
};
var hasTag = function (title) { return function (annotation) {
    return annotation.tags.some(function (tag) { return tag.title === title; });
}; };
var getTag = function (title) { return function (annotation) {
    var result = annotation.tags.filter(function (tag) { return tag.title === title; });
    return result.length === 1 ? result[0] : undefined;
}; };
var getHeader = function (annotation) {
    return Option_1.fromNullable(getTag('header')(annotation)).map(function (a) { return fromJSDocDescription(a.description); }).toUndefined();
};
var isModule = hasTag('module');
var isPropertyinterface = hasTag('propertyinterface');
var parsePropertyinterface = function (i) {
    return new ReaderEither_1.ReaderEither(function (e) {
        var annotation = getAnnotation(i.getJsDocs());
        if (isPropertyinterface(annotation)) {
            var name_1 = i.getName();
            var signature = i.getText().substring('export '.length);
            var description = fromJSDocDescription(annotation.description);
            var header = getHeader(annotation);
            var items = getInterfaceProperties(i);
            var result = { kind: 'Propertyinterface', name: name_1, signature: signature, header: header, description: description, items: items };
            return ok(result);
        }
        return notFound;
    });
};
var parseModuleInterface = function (i) {
    return new ReaderEither_1.ReaderEither(function () {
        var annotation = getAnnotation(i.getJsDocs());
        if (isModule(annotation)) {
            var name_2 = i.getName();
            var signature = i.getText().substring('export '.length);
            var description = fromJSDocDescription(annotation.description);
            var header = getHeader(annotation);
            var result = { kind: 'Module', name: name_2, signature: signature, header: header, description: description };
            return ok(result);
        }
        return notFound;
    });
};
exports.parseModule = new ReaderEither_1.ReaderEither(function (e) {
    var sf = e.currentSourceFile;
    var eitherModuleExports = sf.getInterfaces().map(function (tad) { return parseModuleInterface(tad).run(e); });
    var eitherPropertyinterfaceExports = sf.getInterfaces().map(function (tad) { return parsePropertyinterface(tad).run(e); });
    var eitherExports = eitherModuleExports
        .concat(eitherPropertyinterfaceExports);
    var errors = Array_1.flatten(Array_1.lefts(eitherExports)).filter(function (x) { return !isNotFound(x); });
    if (errors.length > 0) {
        return kos(errors);
    }
    var modules = Array_1.rights(eitherModuleExports);
    if (modules.length === 1) {
        var module_1 = modules[0];
        var properties = Array_1.rights(eitherPropertyinterfaceExports);
        if (properties.length > 0) {
            module_1.properties = m.sortProps(properties);
        }
        return ok({ name: e.currentModuleName, value: module_1 });
    }
    return notFound;
});
//# sourceMappingURL=parser.js.map