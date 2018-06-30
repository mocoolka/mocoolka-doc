import * as m from './domain';
import * as ts from 'ts-simple-ast';
import { ReaderEither } from 'mocoolka-fp/lib/ReaderEither';
export declare class NotFound {
    _tag: 'NotFound';
}
export declare class DataMissingConstructorName {
    readonly module: string;
    readonly name: string;
    _tag: 'MissingConstructorName';
    constructor(module: string, name: string);
}
export declare class CommonPropsInvalidPropType {
    readonly module: string;
    readonly propertyName: string;
    _tag: 'CommonPropsInvalidPropType';
    constructor(module: string, propertyName: string);
}
export declare class DataInvalidConstructorName {
    readonly module: string;
    readonly name: string;
    _tag: 'DataInvalidConstructorName';
    constructor(module: string, name: string);
}
export declare type ParseError = DataMissingConstructorName | DataInvalidConstructorName | CommonPropsInvalidPropType | NotFound;
export declare type ParseErrors = ParseError[];
export declare type ParseResult<A> = ReaderEither<Env, ParseErrors, A>;
export declare type Env = {
    currentSourceFile: ts.SourceFile;
    currentModuleName: string;
};
export declare const parseModule: ParseResult<m.DocModuleMap>;
