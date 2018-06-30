import { sort } from 'mocoolka-fp/lib/Array';
import { contramap, ordString } from 'mocoolka-fp/lib/Ord';
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
export const isModule = (e: Export): e is Module => e.kind === 'Module';
export interface Module extends IProp {
  kind: 'Module';
  signature: string;
  properties?: Propertyinterface[];
}
export type Export = Module | Propertyinterface;

export interface DocModuleMap {
  name: string;
  value: Module;
}

export type DocModuleEntry = {
  name: string
  docs: boolean
};

export const modules: DocModuleEntry[] = [
  { name: 'Alt', docs: true },
  { name: 'Alternative', docs: true },
];
const sortByName = <T extends { name: string }>(): ((xs: T[]) => T[]) => sort(contramap((x: T) => x.name, ordString));

export const sortProps = sortByName<Propertyinterface>();

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
export type Content = CommonProps;
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
/* export const a: Application = {
  name: 'mocoolka-ui',
  orgName: 'mocoolka',
  apps: [{
    name: 'mocoolka-css',
    orgName: 'mocoolka',
    navs: [{
      name: 'commonProps',
      title: 'common properties',
    }],
  },
    pages: [{

    }

  ]
  ],
}],
};
 */
