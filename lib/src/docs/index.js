"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var IO_1 = require("mocoolka-fp/lib/IO");
var Console_1 = require("mocoolka-fp/lib/Console");
var parser_1 = require("./parser");
var fs_1 = require("./fs");
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var _path = tslib_1.__importStar(require("path"));
var mocoolka_fs_1 = require("mocoolka-fs");
var react_1 = require("./react");
var printError = function (error) {
    switch (error._tag) {
        case 'DemoMissingName':
            return chalk_1.default.red.bold("Missing demo name \"" + error.name + "\" in module \"" + error.module + "\"");
        case 'SpecInvalidConent':
            return chalk_1.default.red.bold("Invalid content \"" + error.content + "\" in module \"" + error.module + "\",It must is object");
        case 'CommonPropsInvalidPropType':
            return chalk_1.default.red.bold("Invalid property type on name \"" + error.propertyName + "\" in module \"" + error.module + "\"");
        case 'NotFound':
            return 'not found';
    }
};
exports.fail = new IO_1.IO(function () { return process.exit(1); });
var getPathName = function (path) { return path.split('.').slice(0, path.split('.').length - 1).join(_path.sep); };
exports.processModules = function (root) { return function (inputPath, outPath) {
    var demos = fs_1.readTss(root, inputPath, outPath).run();
    var getDemo = function (name) { return demos.find(function (a) { return a.name === name; }); };
    var processModule = function (a) {
        var e = tslib_1.__assign({}, a, { content: mocoolka_fs_1.readFileAsPlainStringSync(a.realpath).run() });
        var processModule = function (module) {
            return fs_1.writeModule(_path.resolve(_path.resolve(root, outPath, getPathName(module.name))))(module.fileName + '.tsx', react_1.write(module));
        };
        return parser_1.parseDocMd(getDemo).run(e).fold(function (errors) {
            return Console_1.log(errors.filter(function (a) { return a._tag !== 'NotFound'; }).map(function (err) { return printError(err); }).join('\n'));
        }, function (v) { return processModule(v); });
    };
    return fs_1.readMds(root, inputPath, outPath).map(function (a) { console.log(a); return a; }).map(function (items) { return items.map(function (item) { return processModule(item).run(); }); });
}; };
var main = function (root) { return function (inputPath, outPath) { return Console_1.log('- DOCUMENTATION -')
    .chain(function (_) { return Console_1.log('generating docs...'); })
    .chain(function (_) { return (exports.processModules(root)(inputPath, outPath)); })
    .chain(function (_) { return Console_1.log('generating index...'); }); }; };
exports.default = main;
//# sourceMappingURL=index.js.map