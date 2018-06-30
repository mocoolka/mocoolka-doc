import { IO } from 'mocoolka-fp/lib/IO';
import { log } from 'mocoolka-fp/lib/Console';
import * as t from './type';
import { parseDocMd, ParseError } from './parser';
import { readTss, writeModule, readMds } from './fs';
import chalk from 'chalk';
import * as _path from 'path';
import {  readFileAsPlainStringSync,  } from 'mocoolka-fs';
import {write} from './react';
const printError = (error: ParseError): string => {
  switch (error._tag) {
    case 'DemoMissingName':
      return chalk.red.bold(`Missing demo name "${error.name}" in module "${error.module}"`);
    case 'SpecInvalidConent':
      return chalk.red.bold(`Invalid content "${error.content}" in module "${error.module}",It must is object`);
    case 'CommonPropsInvalidPropType':
      return chalk.red.bold(`Invalid property type on name "${error.propertyName}" in module "${error.module}"`);
    case 'NotFound':
      return 'not found';
  }
};

export const fail = new IO(() => process.exit(1));


/* export const getModuleName = (root: string) => (path: string) => {
  const paths = _path.relative(root, path);
  return _path.parse(paths).dir.split(_path.sep).join('.') + '.' + _path.parse(paths).name
}; */
const getPathName =  (path: string) => path.split('.').slice(0,path.split('.').length-1).join(_path.sep);


export const processModules = (root: string) => (inputPath: string, outPath: string) => {
  const demos = readTss(root, inputPath,outPath).run();
  const getDemo = (name: string): t.FileName | undefined | null => demos.find(a => a.name === name);
  const processModule = (a: t.FileName): IO<void> => {
    const e: t.Env = {
      ...a,
      content: readFileAsPlainStringSync(a.realpath).run(),
    };
    const processModule = (module: t.DocMd): IO<void> => {
      return writeModule(_path.resolve(_path.resolve(root,outPath,getPathName(module.name))))
        (module.fileName + '.tsx', write(module));
    };

    return parseDocMd(getDemo).run(e).fold(
      errors => {
        return log(errors.filter(a => a._tag !== 'NotFound').map(err => printError(err)).join('\n'));
      },
      v => processModule(v)
    );
  };

  return readMds(root, inputPath,outPath).map(a=>{console.log(a);return a}).map(items=>items.map(item=>processModule(item).run()));


};

const main = (root: string) => (inputPath: string, outPath: string) => log('- DOCUMENTATION -')
  .chain(_ => log('generating docs...'))
  .chain(_ => (processModules(root)(inputPath,outPath)))
  .chain(_ => log('generating index...'))
/*   .chain(_ => procssIndexModule)
  .chain(_ => log('generation ok')); */
export default main;

