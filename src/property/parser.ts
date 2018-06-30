import * as m from './domain';
import * as ts from 'ts-simple-ast';
import { fromNullable } from 'mocoolka-fp/lib/Option';
import { Either, left, right } from 'mocoolka-fp/lib/Either';
import { rights, lefts, flatten } from 'mocoolka-fp/lib/Array';
import { parse, Annotation, Tag } from 'doctrine';
import { ReaderEither } from 'mocoolka-fp/lib/ReaderEither';

// TODO: avoid comment duplication in overloaded function declarations

const isNotFound = (x: ParseError): x is NotFound => {
  return x._tag === 'NotFound';
};

export class NotFound {
  _tag: 'NotFound' = 'NotFound';
}

export class DataMissingConstructorName {
  _tag: 'MissingConstructorName' = 'MissingConstructorName';
  constructor(readonly module: string, readonly name: string) { }
}
export class CommonPropsInvalidPropType {
  _tag: 'CommonPropsInvalidPropType' = 'CommonPropsInvalidPropType';
  constructor(readonly module: string, readonly propertyName: string) { }
}
export class DataInvalidConstructorName {
  _tag: 'DataInvalidConstructorName' = 'DataInvalidConstructorName';
  constructor(readonly module: string, readonly name: string) { }
}

export type ParseError = DataMissingConstructorName | DataInvalidConstructorName |
  CommonPropsInvalidPropType | NotFound;

export type ParseErrors = ParseError[];

export type ParseResult<A> = ReaderEither<Env, ParseErrors, A>;

export type Env = {
  currentSourceFile: ts.SourceFile
  currentModuleName: string
};

const ok = <A>(a: A): Either<ParseErrors, A> => {
  return right(a);
};

const kos = (errors: ParseErrors): Either<ParseErrors, never> => {
  return left(errors);
};

const ko = (error: ParseError): Either<ParseErrors, never> => {
  return kos([error]);
};

const notFound: Either<ParseErrors, never> = ko(new NotFound());

const parseJSDoc = (source: string): Annotation => {
  return parse(source, { unwrap: true });
};

const notEmpty = (s: string): boolean => {
  return s !== '';
};

const fromJSDocDescription = (description?: string | null): string | undefined => {
  return fromNullable(description).filter(notEmpty).toUndefined();
};

const getDescription = (a: ts.JSDoc[]) =>
  a.length > 0 ? a[0].getComment() : undefined;
const getAnnotation = (jsdocs: ts.JSDoc[]): Annotation => {
  return parseJSDoc(jsdocs.map(doc => doc.getText()).join('\n'));
};
const getType = (a: ts.Type): m.Type => {

  if (a.isUnion()) {
    const items: (string | number)[] = [];
    for (const g of a.getUnionTypes()) {
      if (g.isStringLiteral()) {
        items.push(g.getText().trim().substring(1, g.getText().trim().length - 1));
      } else if (g.isNumberLiteral) {
        items.push(g.getText().trim());
      }
    }
    return {
      kind: 'Type',
      name: 'union',
      items,
    };
  }
  return {
    kind: 'Type',
    name: 'other',
  };
};
const getInterfaceProperty = (a: ts.PropertySignature): m.Property => {
  const name = a.getName();
  const text = a.getText();
  const start = a.getName().length;
  const end = text.indexOf('{');
  const signature = text.substring(start, end);
  const description = getDescription(a.getJsDocs());
  const type = getType(a.getType());
  return ({
    kind: 'Property', name, description, type, signature,
  });
};

const getInterfaceProperties = (a: ts.InterfaceDeclaration): m.Property[] => {
  return a.getProperties().map(b => getInterfaceProperty(b));
};

const hasTag = (title: string) => (annotation: Annotation): boolean => {
  return annotation.tags.some(tag => tag.title === title);
};
const getTag = (title: string) => (annotation: Annotation): Tag | undefined => {
  const result = annotation.tags.filter(tag => tag.title === title);
  return result.length === 1 ? result[0] : undefined;
};
const getHeader = (annotation: Annotation): string | undefined =>
  fromNullable(getTag('header')(annotation)).map(a => fromJSDocDescription(a.description)).toUndefined();

const isModule = hasTag('module');

const isPropertyinterface = hasTag('propertyinterface');
const parsePropertyinterface = (i: ts.InterfaceDeclaration): ParseResult<m.Export> => {
  return new ReaderEither(e => {
    const annotation = getAnnotation(i.getJsDocs());
    if (isPropertyinterface(annotation)) {
      // const properties: Property[] = [];
      /*       for (const a of i.getProperties()) {
              const propertyName = a.getName();
              const propertyType = a.getType();
              if (!propertyType.isUnion()) {
                return ko(new CommonPropsInvalidPropType(e.currentModuleName, propertyName));
              }
              const propertyValues: string[] = [];
              for (const g of propertyType.getUnionTypes()) {
                if (!g.isStringLiteral()) {
                  return ko(new CommonPropsInvalidPropType(e.currentModuleName, propertyName));
                }
                propertyValues.push(g.getText().trim().substring(1, g.getText().trim().length - 1));
              }
              const propertyDesc = a.getJsDocs().length > 0 ? a.getJsDocs()[0].getComment() : undefined;
              properties.push({ kind: 'Property', name: propertyName,
               description: propertyDesc, value: propertyValues });
            } */
      const name = i.getName();
      const signature = i.getText().substring('export '.length);
      const description = fromJSDocDescription(annotation.description);
      const header = getHeader(annotation);
      const items = getInterfaceProperties(i);
      const result: m.Propertyinterface = { kind: 'Propertyinterface', name, signature, header, description, items };
      return ok(result);
    }
    return notFound;
  });
};

const parseModuleInterface = (i: ts.InterfaceDeclaration): ParseResult<m.Export> => {
  return new ReaderEither(() => {
    const annotation = getAnnotation(i.getJsDocs());
    if (isModule(annotation)) {
      const name = i.getName();
      const signature = i.getText().substring('export '.length);
      const description = fromJSDocDescription(annotation.description);
      const header = getHeader(annotation);
      const result: m.DocModule = { kind: 'Module', name, signature, header, description };
      return ok(result);
    }
    return notFound;
  });
};

export const parseModule: ParseResult<m.DocModuleMap> = new ReaderEither(e => {
  const sf = e.currentSourceFile;
  const eitherModuleExports = sf.getInterfaces().map(tad => parseModuleInterface(tad).run(e));
  const eitherPropertyinterfaceExports = sf.getInterfaces().map(tad => parsePropertyinterface(tad).run(e));
  const eitherExports = eitherModuleExports
    .concat(eitherPropertyinterfaceExports);

  const errors = flatten(lefts(eitherExports)).filter(x => !isNotFound(x));

  if (errors.length > 0) {
    return kos(errors);
  }

  const modules = rights(eitherModuleExports);
  if (modules.length === 1) {
    const module: m.DocModule = modules[0] as m.DocModule;
    const properties = rights(eitherPropertyinterfaceExports) as m.Propertyinterface[];
    if (properties.length > 0) {
      module.properties = m.sortProps(properties);
    }
    return ok({ name: e.currentModuleName, value: module });
  }
  return notFound;
});
