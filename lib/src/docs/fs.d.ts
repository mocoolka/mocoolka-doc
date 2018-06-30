import { IO } from 'mocoolka-fp/lib/IO';
import { FileName } from './type';
export declare const getModuleName: (root: string) => (path: string) => string;
export declare const readModules: (path: string) => IO<string[]>;
export declare const readModule: (name: string) => IO<string>;
export declare const writeModule: (path: string) => (name: string, markdown: string) => IO<void>;
export declare const removeExtendName: (name: String, extendName: string) => string;
export declare const readTss: (root: string, path: string, outpath: string) => IO<FileName[]>;
export declare const readMds: (root: string, path: string, outpath: string) => IO<FileName[]>;
