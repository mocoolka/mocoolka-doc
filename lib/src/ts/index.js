"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var IO_1 = require("mocoolka-fp/lib/IO");
var Console_1 = require("mocoolka-fp/lib/Console");
var Monoid_1 = require("mocoolka-fp/lib/Monoid");
var markdown = tslib_1.__importStar(require("./markdown"));
var json = tslib_1.__importStar(require("./json"));
var type_1 = require("./type");
var parser_1 = require("./parser");
var fs_1 = require("./fs");
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var ts_simple_ast_1 = tslib_1.__importDefault(require("ts-simple-ast"));
var _path = tslib_1.__importStar(require("path"));
var printError = function (error) {
    switch (error._tag) {
        case 'MissingConstructorName':
            return chalk_1.default.red.bold("Missing constructor name \"" + error.name + "\" in module \"" + error.module + "\"");
        case 'DataInvalidConstructorName':
            return chalk_1.default.red.bold("Invalid constructor name \"" + error.name + "\" in module \"" + error.module + "\"");
        case 'CommonPropsInvalidPropType':
            return chalk_1.default.red.bold("Invalid property type on name \"" + error.propertyName + "\" in module \"" + error.module + "\"");
        case 'NotFound':
            return chalk_1.default.red.bold("Not Found on \"" + error.path + "\"");
    }
};
exports.fail = new IO_1.IO(function () { return process.exit(1); });
var getSourceFile = function (name) {
    return new ts_simple_ast_1.default().addExistingSourceFile(name);
};
var processModule = function (outputPath) { return function (inputPath) {
    var e = {
        currentSourceFile: getSourceFile(inputPath),
        currentModuleName: _path.parse(inputPath).name,
        path: inputPath,
    };
    var processModuleJson = function (module) {
        return fs_1.writeModule(_path.resolve(outputPath, 'json'))(e.currentModuleName + '.json', json.printModule(module));
    };
    var procssModule = function (module) {
        return IO_1.getMonoid(Monoid_1.monoidVoid).concat(processDocModule(module), processModuleJson(module));
    };
    var processDocModule = function (module) { return fs_1.writeModule(_path.resolve(outputPath, 'md'))(e.currentModuleName + '.md', markdown.printDocModule(module)); };
    return parser_1.parseModule.run(e).fold(function (errors) {
        return Console_1.log(errors.map(function (err) { return printError(err); }).join('\n'));
    }, function (v) { Console_1.log(inputPath).run(); return procssModule(v); });
}; };
var processMarkdownIndex = fs_1.writeModule(_path.resolve(__dirname, 'md'))('index.md', markdown.printIndex(type_1.modules));
var processIndexJson = fs_1.writeModule(_path.resolve(__dirname, 'json'))('index.json', json.printIndex(type_1.modules));
var procssIndexModule = IO_1.getMonoid(Monoid_1.monoidVoid).concat(processMarkdownIndex, processIndexJson);
var main = function (inputPath, outputPath) { return Console_1.log('- DOCUMENTATION -')
    .chain(function (_) { return Console_1.log("generating docs from " + inputPath + " to " + outputPath); })
    .chain(function (_) { return (fs_1.readModules(inputPath)).map(function (paths) { return paths.map(processModule(outputPath)); }); })
    .map(function (fs) { return fs.map(function (f) { return f.run(); }); })
    .chain(function (_) { return Console_1.log('generating index...'); })
    .chain(function (_) { return procssIndexModule; })
    .chain(function (_) { return Console_1.log('generation ok'); }); };
exports.default = main;
//# sourceMappingURL=index.js.map