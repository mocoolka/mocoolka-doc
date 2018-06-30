import { sort } from 'mocoolka-fp/lib/Array';
import { contramap, ordString } from 'mocoolka-fp/lib/Ord';
import { fromNullable } from 'fp-ts/lib/Option';
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
export const isPropertyinterface = (e: Export): e is Propertyinterface => e.kind === 'Propertyinterface';

export interface Propertyinterface extends IProp {
  kind: 'Propertyinterface';
  signature: string;
  items: Property[];
}
export const isModule = (e: Export): e is DocModule => e.kind === 'Module';
export interface DocModule extends IProp {
  kind: 'Module';
  signature: string;
  properties?: Propertyinterface[];
}
export type Export = DocModule | Propertyinterface;

export interface DocModuleMap {
  name: string;
  value: DocModule;
}

export const modules: Nav[] = [
  { name: 'gloableProp', title: 'global properties' },
  { name: 'gloableAbbr', title: 'global abbrs' },
];
const sortByName = <T extends { name: string }>(): ((xs: T[]) => T[]) => sort(contramap((x: T) => x.name, ordString));

export const sortProps = sortByName<Propertyinterface>();
export const getTitle = (a: IProp) => fromNullable(a.title).getOrElse(a.name);
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
export type Page = DocModule;
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
