import { IO } from 'mocoolka-fp/lib/IO';
import { filesSync, readFileAsPlainStringSync, writeFileWithStringSync, pathResolve } from 'mocoolka-fs';
import * as _path from 'path';
import { FileName } from './type'

export const getModuleName = (root: string) => (path: string) => {
  const paths = _path.relative(root, path);
  return _path.parse(paths).dir.split(_path.sep).join('.') + '.' + _path.parse(paths).name
};
export const readModules = (path: string): IO<string[]> =>
  filesSync(path)('**/*.ts').map(paths => paths.map(pathResolve(path)));
export const readModule = (name: string): IO<string> => {
  return readFileAsPlainStringSync(name);
};
export const writeModule = (path: string) => (name: string, markdown: string): IO<void> =>
  writeFileWithStringSync(name, markdown)(path);
export const removeExtendName=(name:String,extendName:string)=>name.substring(0,name.lastIndexOf('.'+extendName))
export const readTss = (root: string, path: string, outpath: string): IO<FileName[]> =>
  filesSync(_path.resolve(root, path))('**/*.tsx').map(paths =>
    paths.map(p => ({
      path: _path.relative(root, _path.resolve(root, path, p)),
      name: getModuleName(_path.resolve(root, path))(_path.resolve(root, path, p)),
      relativePath: removeExtendName(_path.relative(_path.parse(_path.resolve(root, outpath,p)).dir, _path.resolve(root, path, p)),'tsx'),
      realpath: _path.resolve(root, path, p),
      fileName: _path.parse(p).name,
    }))
  );
export const readMds = (root: string, path: string, outpath: string): IO<FileName[]> =>
  filesSync(_path.resolve(root, path))('**/*.md').map(paths =>
    paths.map(p => ({
      path: _path.relative(root, _path.resolve(root, path, p)),
      name: getModuleName(_path.resolve(root, path))(_path.resolve(root, path, p)),
      relativePath: _path.relative(_path.resolve(root, outpath), _path.resolve(root, path, p)),
      realpath: _path.resolve(root, path, p),
      fileName: _path.parse(p).name,

    }))
  );