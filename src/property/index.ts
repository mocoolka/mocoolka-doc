import { IO, getMonoid } from 'mocoolka-fp/lib/IO';
import { log } from 'mocoolka-fp/lib/Console';
import { monoidVoid } from 'mocoolka-fp/lib/Monoid';
import * as markdown from './markdown';
import * as json from './json';
import { modules, DocModuleMap } from './domain';
import { Env, parseModule, ParseError } from './parser';
import { readModules, writeModule } from './fs';
import chalk from 'chalk';
import Ast from 'ts-simple-ast';
import { SourceFile } from 'ts-simple-ast';
import * as _path from 'path';

const printError = (error: ParseError): string => {
  switch (error._tag) {
    case 'MissingConstructorName':
      return chalk.red.bold(`Missing constructor name "${error.name}" in module "${error.module}"`);
    case 'DataInvalidConstructorName':
      return chalk.red.bold(`Invalid constructor name "${error.name}" in module "${error.module}"`);
    case 'CommonPropsInvalidPropType':
      return chalk.red.bold(`Invalid property type on name "${error.propertyName}" in module "${error.module}"`);
    case 'NotFound':
      return 'not found';
  }
};

export const fail = new IO(() => process.exit(1));

const getSourceFile = (name: string): SourceFile => {
  return new Ast().addExistingSourceFile(name);
};

const processModule = (path: string): IO<void> => {
  const e: Env = {
    currentSourceFile: getSourceFile(path),
    currentModuleName: _path.parse(path).name,
  };
  const processModuleJson = (module: DocModuleMap): IO<void> => {
    return writeModule(_path.resolve(__dirname, 'json'))
      (e.currentModuleName + '.json', json.printModule(module));
  };
  const procssModule = (module: DocModuleMap) =>
    getMonoid(monoidVoid).concat(processDocModule(module), processModuleJson(module));
  const processDocModule = (module: DocModuleMap): IO<void> => writeModule(_path.resolve(__dirname, 'md'))
    (e.currentModuleName + '.md', markdown.printDocModule(module));
  return parseModule.run(e).fold(
    errors => {
      return log(errors.filter(a => a._tag !== 'NotFound').map(err => printError(err)).join('\n'));
    },
    v => procssModule(v)
  );
};

const processMarkdownIndex: IO<void> =
  writeModule(_path.resolve(__dirname, 'md'))('index.md', markdown.printIndex(modules));
const processIndexJson: IO<void> = writeModule(_path.resolve(__dirname, 'json'))
  ('index.json', json.printIndex(modules));
const procssIndexModule = getMonoid(monoidVoid).concat(processMarkdownIndex, processIndexJson);
const main = (path: string) => log('- DOCUMENTATION -')
  .chain(_ => log('generating modules...'))
  .chain(_ => (readModules(path)).map(paths => paths.map(processModule))).map(fs => fs.map(f => f.run()))
  .chain(_ => log('generating index...'))
  .chain(_ => procssIndexModule)
  .chain(_ => log('generation ok'));

main(_path.resolve(__dirname, 'examples')).run();
