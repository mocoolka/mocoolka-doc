"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Array_1 = require("mocoolka-fp/lib/Array");
var Ord_1 = require("mocoolka-fp/lib/Ord");
var Option_1 = require("fp-ts/lib/Option");
var Option_2 = require("mocoolka-fp/lib/Option");
var predicate_1 = require("mocoolka-fp/lib/predicate");
exports.isPropertyinterface = function (e) { return e.kind === 'Propertyinterface'; };
exports.isModule = function (e) { return e.kind === 'Module'; };
exports.modules = [
    { name: 'gloableProp', title: 'global properties' },
    { name: 'gloableAbbr', title: 'global abbrs' },
];
var sortByName = function () { return Array_1.sort(Ord_1.contramap(function (x) { return x.name; }, Ord_1.ordString)); };
exports.sortProps = sortByName();
exports.getTitle = function (a) { return Option_1.fromNullable(a.title).getOrElse(a.name); };
exports.typeToString = function (a) { return Option_2.fromPredicate(function (b) { return b.name === 'union' && !predicate_1.isEmpty(b.items); })(a)
    .map(function (c) { return c.items.map(function (d) { return "'" + d + "'"; }).join(','); }).getOrElse(a.name); };
//# sourceMappingURL=type.js.map