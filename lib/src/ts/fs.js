"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mocoolka_fs_1 = require("mocoolka-fs");
exports.readModules = function (path) {
    return mocoolka_fs_1.filesSync(path)('**/*.ts').map(function (paths) { return paths.map(mocoolka_fs_1.pathResolve(path)); });
};
exports.readModule = function (name) {
    return mocoolka_fs_1.readFileAsPlainStringSync(name);
};
exports.writeModule = function (path) { return function (name, markdown) {
    return mocoolka_fs_1.writeFileWithStringSync(name, markdown)(path);
}; };
//# sourceMappingURL=fs.js.map