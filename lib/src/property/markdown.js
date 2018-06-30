"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var m = tslib_1.__importStar(require("./domain"));
var Option_1 = require("mocoolka-fp/lib/Option");
var prettier = tslib_1.__importStar(require("prettier"));
var predicate_1 = require("mocoolka-fp/lib/predicate");
exports.CRLF = '\n';
exports.h1 = function (title) { return "# " + title; };
exports.h2 = function (title) { return "## " + title; };
exports.h3 = function (title) { return "### " + title; };
exports.fence = function (language) { return function (a) { return "```" + language + exports.CRLF + a + exports.CRLF + "```"; }; };
exports.code = function (a) { return "'" + a + "'"; };
exports.link = function (text, href) { return "[" + text + "](" + href + ")"; };
exports.ts = exports.fence('ts');
exports.italic = function (a) { return "*" + a + "*"; };
var printDescription = function (description) { return Option_1.fromNullable(description).
    filter(predicate_1.isEmpty).fold('', function (d) { return exports.CRLF + d; }); };
var printModule = function (tc) {
    var s = "\n" + exports.h1(tc.name);
    s += exports.CRLF + exports.italic('module');
    s += exports.CRLF + exports.ts(tc.signature);
    s += printDescription(tc.description);
    return s;
};
var printPropertyinterface = function (tc) {
    var s = "\n" + exports.h1(tc.name);
    s += exports.CRLF + exports.italic('common props');
    s += exports.CRLF + exports.ts(tc.signature);
    s += printDescription(tc.description);
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