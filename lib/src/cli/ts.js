"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var commander_1 = tslib_1.__importDefault(require("commander"));
var package_json_1 = tslib_1.__importDefault(require("../../package.json"));
var ts_1 = tslib_1.__importDefault(require("../ts"));
var path = tslib_1.__importStar(require("path"));
commander_1.default
    .version(package_json_1.default.version)
    .usage('[options] <inputPath> ')
    .option('-o, --output <s>', 'save <path>`', process.cwd())
    .parse(process.argv);
var inputPath = commander_1.default.args.length === 0 ? path.resolve(process.cwd(), 'src') : path.resolve(process.cwd(), commander_1.default.args[0]);
var outputPath = commander_1.default.output ? path.resolve(process.cwd(), commander_1.default.output) : path.resolve(process.cwd(), 'docs');
ts_1.default(inputPath, outputPath).run();
//# sourceMappingURL=ts.js.map