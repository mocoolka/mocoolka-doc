export const isDocDemo = (e: Export): e is DocSpec => e.kind === 'DocSpec';
export interface FileName { name: string, path: string, realpath: string, fileName: string,relativePath:string };
export interface DocSpec extends FileName {
  kind: 'DocSpec';
}
export interface DocMd extends FileName {
  kind: 'DocMd';
  title: string;
  items: Export[];
}
export const isDocContent = (e: Export): e is DocContent => e.kind === 'DocContent';
export interface DocContent {
  kind: 'DocContent';
  name: string;
}
export type Export = DocSpec | DocContent;

export interface Env extends FileName {
  content: string
};


