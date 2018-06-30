import * as m from './domain';

const formatJson = (json: object): string => JSON.stringify(json);

export const printModule = (docModule: m.DocModuleMap): string => {
    const module = docModule.value;
    const s = {
        source: `https://github.com/gcanti/fp-ts/blob/master/src/${docModule.name}.ts`,
        module,
    };
    return formatJson(s);
};

export const printIndex = (modules: m.Nav[]): string => {
    return formatJson(modules);
};
