import * as m from './type';
import { Either, left, right } from 'mocoolka-fp/lib/Either';
import { rights, lefts, flatten } from 'mocoolka-fp/lib/Array';
import { ReaderEither } from 'mocoolka-fp/lib/ReaderEither';
import { isPlainObject, isString } from 'mocoolka-fp/lib/predicate';
/**
 * header RegExp.
 * It will used for logic and no oupout to reslt
 */
const headerRegExp = /---[\r\n]([\s\S]*)[\r\n]---/;
/**
 * title RegExp.
 * Title about the file.Only a title on every file
 */
const titleRegExp = /# (.*)[\r\n]/;
/**
 * Header RegExp.
 * 
 */
const headerKeyValueRegExp = /(.*): (.*)/g;
const emptyRegExp = /^\s*$/;
/**
 * Demo will parse with demo react ts
 */
const demoRegExp = /^{|}$/;

export function getHeaders(markdown: string) {
  let header = markdown.match(headerRegExp);

  if (!header) {
    return {
      components: [],
    };
  }

  const header1 = header[1];

  let regexMatchs;
  const headers: any = {};

  while ((regexMatchs = headerKeyValueRegExp.exec(header1)) !== null) {
    headers[regexMatchs[1]] = regexMatchs[2];
  }

  if (headers.components) {
    headers.components = headers.components.split(', ').sort();
  } else {
    headers.components = [];
  }

  return headers;
}

export function getContents(markdown: string): string[] {
  return markdown
    .replace(headerRegExp, '') // Remove header information
    .split(/^{{|}}$/gm) // Split markdown into an array, separating demos
    .filter(content => !emptyRegExp.test(content)); // Remove empty lines
}

export function getTitle(markdown: string) {
  const matches = markdown.match(titleRegExp);

  return matches ? matches[1] : 'Mocoolka-UI';
}


export const isNotFound = (x: ParseError): x is NotFound => {
  return x._tag === 'NotFound';
};

export class NotFound {
  _tag: 'NotFound' = 'NotFound';
}

export class DemoMissingName {
  _tag: 'DemoMissingName' = 'DemoMissingName';
  constructor(readonly module: string, readonly name: string) { }
}
export class CommonPropsInvalidPropType {
  _tag: 'CommonPropsInvalidPropType' = 'CommonPropsInvalidPropType';
  constructor(readonly module: string, readonly propertyName: string) { }
}
export class SpecInvalidConent {
  _tag: 'SpecInvalidConent' = 'SpecInvalidConent';
  constructor(readonly module: string, readonly content: string) { }
}

export type ParseError = DemoMissingName | SpecInvalidConent |
  CommonPropsInvalidPropType | NotFound;

export type ParseErrors = ParseError[];

export type ParseResult<A> = ReaderEither<m.Env, ParseErrors, A>;


const ok = <A>(a: A): Either<ParseErrors, A> => {
  return right(a);
};

const kos = (errors: ParseErrors): Either<ParseErrors, never> => {
  return left(errors);
};

const ko = (error: ParseError): Either<ParseErrors, never> => {
  return kos([error]);
};

export const notFound: Either<ParseErrors, never> = ko(new NotFound());

export const parseDocMd = (getDemo: ((name: string) => m.FileName | undefined | null)): ParseResult<m.DocMd> => new ReaderEither(e => {
  const parseDoc = (name: string, content: string): ParseResult<m.Export> => {
    return new ReaderEither(() => {
      try {
        const content1 = content.match(demoRegExp);
        if (content1) {
          const value = JSON.parse(content);
          if (isPlainObject(value) && Object.keys(value).length === 1 && isString(value.demo)) {
            const demo = getDemo(value.demo);
            if (demo) {
              const result = { ...demo, kind: 'DocSpec' } as m.Export;
              return ok(result);
            } else {
              return ko(new DemoMissingName(name, value.demo))
            }

          }
          else {
            return ko(new SpecInvalidConent(name, content))
          }
        }
        else {
          return ok({ kind: 'DocContent', name: content } as m.DocContent)
        }
      } catch{
        return ko(new SpecInvalidConent(name, content))
      }
    });
  };
  const items = getContents(e.content).map(b => parseDoc(e.name, b).run(e));

  const errors = flatten(lefts(items)).filter(x => !isNotFound(x));

  if (errors.length > 0) {
    return kos(errors);
  }

  const modules = rights(items);
  return ok({
    ...e,
    
    title:getTitle(e.content),
    kind: 'DocMd',
    items: modules,
  } as m.DocMd)
});


