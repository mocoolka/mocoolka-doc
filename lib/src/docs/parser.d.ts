import * as m from './type';
import { Either } from 'mocoolka-fp/lib/Either';
import { ReaderEither } from 'mocoolka-fp/lib/ReaderEither';
export declare function getHeaders(markdown: string): any;
export declare function getContents(markdown: string): string[];
export declare function getTitle(markdown: string): string;
export declare const isNotFound: (x: ParseError) => x is NotFound;
export declare class NotFound {
    _tag: 'NotFound';
}
export declare class DemoMissingName {
    readonly module: string;
    readonly name: string;
    _tag: 'DemoMissingName';
    constructor(module: string, name: string);
}
export declare class CommonPropsInvalidPropType {
    readonly module: string;
    readonly propertyName: string;
    _tag: 'CommonPropsInvalidPropType';
    constructor(module: string, propertyName: string);
}
export declare class SpecInvalidConent {
    readonly module: string;
    readonly content: string;
    _tag: 'SpecInvalidConent';
    constructor(module: string, content: string);
}
export declare type ParseError = DemoMissingName | SpecInvalidConent | CommonPropsInvalidPropType | NotFound;
export declare type ParseErrors = ParseError[];
export declare type ParseResult<A> = ReaderEither<m.Env, ParseErrors, A>;
export declare const notFound: Either<ParseErrors, never>;
export declare const parseDocMd: (getDemo: (name: string) => m.FileName | null | undefined) => ReaderEither<m.Env, ParseError[], m.DocMd>;
