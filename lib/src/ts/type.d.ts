export interface IProp {
    name: string;
    title?: string;
    header?: string;
    description?: string;
}
export interface Type {
    kind: 'Type';
    name: string;
    items?: (string | number)[];
}
export interface Property extends IProp {
    kind: 'Property';
    signature: string;
    type: Type;
}
export declare const isPropertyinterface: (e: Export) => e is Propertyinterface;
export interface Propertyinterface extends IProp {
    kind: 'Propertyinterface';
    signature: string;
    items: Property[];
}
export declare const isModule: (e: Export) => e is DocModule;
export interface DocModule extends IProp {
    kind: 'Module';
    signature: string;
    properties?: Propertyinterface[];
}
export declare type Export = DocModule | Propertyinterface;
export interface DocModuleMap {
    name: string;
    value: DocModule;
}
export declare const modules: Nav[];
export declare const sortProps: (xs: Propertyinterface[]) => Propertyinterface[];
export declare const getTitle: (a: IProp) => string;
export interface IProp {
    name: string;
    title?: string;
    description?: string;
}
export interface IElement extends IProp {
    element: any;
    type?: string;
    items?: string;
}
export interface CPage extends IProp {
    type?: string;
    layout?: string;
    items: IElement[];
}
export declare type Page = DocModule;
export interface Nav extends IProp {
    href?: string;
    items?: Nav[];
}
export interface App extends IProp {
    orgName: string;
    navs: Nav[];
    pages: Page[];
}
export interface Application extends IProp {
    orgName: string;
    apps: App[];
}
export declare const typeToString: (a: Type) => string;
