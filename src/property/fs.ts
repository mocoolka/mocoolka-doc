// import * as fs from 'fs';
// import * as pathF from 'path';
import { IO } from 'mocoolka-fp/lib/IO';
import { filesSync, readFileAsPlainStringSync, writeFileWithStringSync, pathResolve } from 'mocoolka-fs';
/* export const read = (path: string): IO<string> => {
  return new IO(() => fs.readFileSync(path).toString('utf8'));
}; */
// sequence_(io, array)(readModules(path)).map(processModule))
export const readModules = (path: string): IO<string[]> =>
  filesSync(path)('**/*.ts').map(paths => paths.map(pathResolve(path)));
export const readModule = (name: string): IO<string> => {
  return readFileAsPlainStringSync(name);
};
export const writeModule = (path: string) => (name: string, markdown: string): IO<void> =>
  writeFileWithStringSync(name, markdown)(path);
export const readMds = (path: string): IO<string[]> =>
  filesSync(path)('**/*.md').map(paths => paths.map(pathResolve(path)));
export const readTss = (path: string): IO<string[]> =>
  filesSync(path)('**/*.ts').map(paths => paths.map(pathResolve(path)));