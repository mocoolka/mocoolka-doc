"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var docs_1 = tslib_1.__importDefault(require("../docs"));
var path = tslib_1.__importStar(require("path"));
commander_1.default
    .version(package_json_1.default.version)
    .usage('[options] <rootPath> ')
    .option('-i, --input <s>', 'input <path>`', process.cwd())
    .option('-o, --output <s>', 'output <path>`', process.cwd())
    .parse(process.argv);
var rootPath = commander_1.default.args.length === 0 ? path.resolve(process.cwd(), 'src') : path.resolve(process.cwd(), commander_1.default.args[0]);
var inputPath = commander_1.default.input ? commander_1.default.input : 'input';
var outputPath = commander_1.default.output ? commander_1.default.output : 'output';
docs_1.default(rootPath)(inputPath, outputPath).run();
//# sourceMappingURL=docs.js.map