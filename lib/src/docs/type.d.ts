export declare const isDocDemo: (e: Export) => e is DocSpec;
export interface FileName {
    name: string;
    path: string;
    realpath: string;
    fileName: string;
    relativePath: string;
}
export interface DocSpec extends FileName {
    kind: 'DocSpec';
}
export interface DocMd extends FileName {
    kind: 'DocMd';
    title: string;
    items: Export[];
}
export declare const isDocContent: (e: Export) => e is DocContent;
export interface DocContent {
    kind: 'DocContent';
    name: string;
}
export declare type Export = DocSpec | DocContent;
export interface Env extends FileName {
    content: string;
}
