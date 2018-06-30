import { IO } from 'mocoolka-fp/lib/IO';
export declare const readModules: (path: string) => IO<string[]>;
export declare const readModule: (name: string) => IO<string>;
export declare const writeModule: (path: string) => (name: string, markdown: string) => IO<void>;
export declare const readMds: (path: string) => IO<string[]>;
export declare const readTss: (path: string) => IO<string[]>;
