"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var m = tslib_1.__importStar(require("./type"));
var Option_1 = require("mocoolka-fp/lib/Option");
var prettier = tslib_1.__importStar(require("prettier"));
var predicate_1 = require("mocoolka-fp/lib/predicate");
var function_1 = require("mocoolka-fp/lib/function");
var string_1 = require("mocoolka-fp/lib/string");
var isNotEmpty = function_1.not(predicate_1.isEmpty);
exports.CRLF = '\n';
exports.h1 = function (title) { return "# " + title; };
exports.h2 = function (title) { return "## " + title; };
exports.h3 = function (title) { return "### " + title; };
exports.h = function (level) { return function (title) { return string_1.repeat('#', level) + " " + title; }; };
exports.fence = function (language) { return function (a) { return "```" + language + exports.CRLF + a + exports.CRLF + "```"; }; };
exports.code = function (a) { return "'" + a + "'"; };
exports.link = function (text, href) { return "[" + text + "](" + href + ")"; };
exports.ts = exports.fence('ts');
exports.italic = function (a) { return "*" + a + "*"; };
var printDescription = function (prop) { return Option_1.fromNullable(prop.description).
    filter(isNotEmpty).fold('', function (d) { return exports.CRLF + d; }); };
var printHeader = function (level) { return function (prop) { return Option_1.fromNullable(prop.header).
    filter(isNotEmpty).fold('', function (d) { return exports.CRLF + exports.h(level)(d) + exports.CRLF; }); }; };
var printTitle = function (level) { return function (prop) { return Option_1.fromNullable(prop.title).
    filter(isNotEmpty).fold(printName(level)(prop), function (d) { return exports.CRLF + exports.h(level)(d) + exports.CRLF; }); }; };
var printName = function (level) { return function (prop) { return Option_1.fromNullable(prop.name).
    filter(isNotEmpty).fold('1234', function (d) { return exports.CRLF + exports.h(level)(d); }); }; };
var printProp = function (level) { return function (prop) {
    var s = printTitle(level)(prop);
    s += printHeader(level + 1)(prop);
    s += printDescription(prop);
    return s;
}; };
var printModule = function (module) {
    return printProp(1)(module);
};
var printPropertyinterface = function (properties) {
    var s = printProp(2)(properties);
    ;
    s += "" + exports.CRLF + exports.CRLF + "|Name|Type|Description|";
    s += exports.CRLF + "|:-----|:-----|:--------|";
    s += properties.items.map(function (item) { return "" + exports.CRLF + item.name + "|" + m.typeToString(item.type) + "|" + item.description + "|"; });
    return s;
};
var prettierOptions = {
    parser: 'markdown',
    semi: false,
    singleQuote: true,
    printWidth: 120,
};
var formatMarkdown = function (markdown) { return prettier.format(markdown, prettierOptions); };
exports.printDocModule = function (docModule) {
    var s = 'MODULE ' + exports.link(docModule.name, "https://github.com/mocoolka/mocoolka-ts/blob/master/src/" + docModule.name + ".ts");
    var module = docModule.value;
    s += printModule(module) + exports.CRLF;
    s += Option_1.fromNullable(module.properties).map(function (ps) { return ps.map(function (d) { return printPropertyinterface(d); }).join('\n'); }).getOrElse('');
    return formatMarkdown(s);
};
exports.printIndex = function (modules) {
    var s = '# API\n\n';
    s += modules.map(function (_m) { return "- " + exports.link(m.getTitle(_m), "./" + _m.name + ".md"); }).join(exports.CRLF);
    return formatMarkdown(s);
};
//# sourceMappingURL=markdown.js.map