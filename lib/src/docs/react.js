"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var m = tslib_1.__importStar(require("./type"));
var mocoolka_fs_1 = require("mocoolka-fs");
var string_1 = require("mocoolka-fp/lib/string");
var formatJSX = function (markdown) { return markdown; };
exports.write = function (a) { return formatJSX("\nimport * as React from 'react';\nimport { Markdown } from 'mocoolka-ui-components';\nimport {Demo} from 'mocoolka-ui-components/lib/Demo'\nimport {App,Content} from 'mocoolka-ui-components/lib/App';\n" + importDemos(a) + "\nexport const Page =()=> {\n    return (\n      <App title={'" + a.title + "'}>\n        <Content>\n\n            " + demos(a) + "\n        </Content>\n      </App>\n    );\n  }\n"); };
var getVaraibleName = function (name) { return string_1.slugify(name, '.'); };
var importDemos = function (a) { return (a.items.filter(m.isDocDemo).map(function (b) {
    return " import " + getVaraibleName(b.name) + " from  '" + b.relativePath + "'";
}).join('\n')); };
var SOURCE_CODE_ROOT_URL = 'mocoolka-ui-compontents';
var demos = function (a) { return (a.items.map(function (b, index) {
    if (m.isDocDemo(b)) {
        return "\n            <Demo\n            key={" + index + "}\n            js={" + getVaraibleName(b.name) + "}\n            raw={`" + mocoolka_fs_1.readFileAsPlainStringSync(b.realpath).run() + "`}\n            githubLocation={`" + SOURCE_CODE_ROOT_URL + "/docs/src/" + b.path + "`}\n          />\n            ";
    }
    else {
        return "\n            <Markdown\n            key={" + index + "}\n            text={`" + b.name + "`}\n          />\n            ";
    }
}).join('\n')); };
//# sourceMappingURL=react.js.map