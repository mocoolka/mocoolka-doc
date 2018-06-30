"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("mocoolka-fp/lib/Array");
var Ord_1 = require("mocoolka-fp/lib/Ord");
exports.isPropertyinterface = function (e) { return e.kind === 'Propertyinterface'; };
exports.isModule = function (e) { return e.kind === 'Module'; };
exports.modules = [
    { name: 'Alt', docs: true },
    { name: 'Alternative', docs: true },
];
var sortByName = function () { return Array_1.sort(Ord_1.contramap(function (x) { return x.name; }, Ord_1.ordString)); };
exports.sortProps = sortByName();
//# sourceMappingURL=domain.js.map