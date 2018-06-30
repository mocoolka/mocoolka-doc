"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var mocoolka_fs_1 = require("mocoolka-fs");
var _path = tslib_1.__importStar(require("path"));
exports.getModuleName = function (root) { return function (path) {
    var paths = _path.relative(root, path);
    return _path.parse(paths).dir.split(_path.sep).join('.') + '.' + _path.parse(paths).name;
}; };
exports.readModules = function (path) {
    return mocoolka_fs_1.filesSync(path)('**/*.ts').map(function (paths) { return paths.map(mocoolka_fs_1.pathResolve(path)); });
};
exports.readModule = function (name) {
    return mocoolka_fs_1.readFileAsPlainStringSync(name);
};
exports.writeModule = function (path) { return function (name, markdown) {
    return mocoolka_fs_1.writeFileWithStringSync(name, markdown)(path);
}; };
exports.removeExtendName = function (name, extendName) { return name.substring(0, name.lastIndexOf('.' + extendName)); };
exports.readTss = function (root, path, outpath) {
    return mocoolka_fs_1.filesSync(_path.resolve(root, path))('**/*.tsx').map(function (paths) {
        return paths.map(function (p) { return ({
            path: _path.relative(root, _path.resolve(root, path, p)),
            name: exports.getModuleName(_path.resolve(root, path))(_path.resolve(root, path, p)),
            relativePath: exports.removeExtendName(_path.relative(_path.parse(_path.resolve(root, outpath, p)).dir, _path.resolve(root, path, p)), 'tsx'),
            realpath: _path.resolve(root, path, p),
            fileName: _path.parse(p).name,
        }); });
    });
};
exports.readMds = function (root, path, outpath) {
    return mocoolka_fs_1.filesSync(_path.resolve(root, path))('**/*.md').map(function (paths) {
        return paths.map(function (p) { return ({
            path: _path.relative(root, _path.resolve(root, path, p)),
            name: exports.getModuleName(_path.resolve(root, path))(_path.resolve(root, path, p)),
            relativePath: _path.relative(_path.resolve(root, outpath), _path.resolve(root, path, p)),
            realpath: _path.resolve(root, path, p),
            fileName: _path.parse(p).name,
        }); });
    });
};
//# sourceMappingURL=fs.js.map