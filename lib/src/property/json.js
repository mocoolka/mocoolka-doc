"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var formatJson = function (json) { return JSON.stringify(json); };
exports.printModule = function (docModule) {
    var module = docModule.value;
    var s = {
        source: "https://github.com/gcanti/fp-ts/blob/master/src/" + docModule.name + ".ts",
        module: module,
    };
    return formatJson(s);
};
exports.printIndex = function (modules) {
    return formatJson(modules);
};
//# sourceMappingURL=json.js.map