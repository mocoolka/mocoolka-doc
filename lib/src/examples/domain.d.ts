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
export declare const isModule: (e: Export) => e is Module;
export interface Module extends IProp {
    kind: 'Module';
    signature: string;
    properties?: Propertyinterface[];
}
export declare type Export = Module | Propertyinterface;
export interface DocModuleMap {
    name: string;
    value: Module;
}
export declare type DocModuleEntry = {
    name: string;
    docs: boolean;
};
export declare const modules: DocModuleEntry[];
export declare const sortProps: (xs: Propertyinterface[]) => Propertyinterface[];
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
export interface Page extends IProp {
    type?: string;
    layout?: string;
    items: IElement[];
}
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
export interface ITreeProp extends IProp {
    items?: ITreeProp[];
}
export declare type Content = CommonProps;
export interface CommonProps {
    type: 'CommonProps';
    name: string;
    description?: string;
    signature: string;
    properties: CommonProp[];
}
export interface CommonProp {
    type: 'CommonProp';
    name: string;
    description?: string;
    value: string[];
}
