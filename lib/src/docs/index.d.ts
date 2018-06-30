import { IO } from 'mocoolka-fp/lib/IO';
export declare const fail: IO<never>;
export declare const processModules: (root: string) => (inputPath: string, outPath: string) => IO<void[]>;
declare const main: (root: string) => (inputPath: string, outPath: string) => IO<void>;
export default main;
