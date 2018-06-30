import * as m from './type';

import { fromNullable } from 'mocoolka-fp/lib/Option';
import * as prettier from 'prettier';
import { isEmpty } from 'mocoolka-fp/lib/predicate';
import { not } from 'mocoolka-fp/lib/function';
import { repeat } from 'mocoolka-fp/lib/string';
const isNotEmpty=not(isEmpty);
export const CRLF = '\n';
export const h1 = (title: string) => `# ${title}`;
export const h2 = (title: string) => `## ${title}`;
export const h3 = (title: string) => `### ${title}`;
export const h = (level: number) => (title: string) => {return `${repeat('#', level)} ${title}`};
export const fence = (language: string) => (a: string): string => `\`\`\`${language}${CRLF}${a}${CRLF}\`\`\``;
export const code = (a: string) => `'${a}'`;
export const link = (text: string, href: string) => `[${text}](${href})`;
export const ts = fence('ts');
export const italic = (a: string) => `*${a}*`;
const printDescription = (prop: m.IProp): string => fromNullable(prop.description).
  filter(isNotEmpty).fold('', d => CRLF + d);
const printHeader =(level: number) => (prop: m.IProp): string => fromNullable(prop.header).
  filter(isNotEmpty).fold('', d => CRLF + h(level)(d) +CRLF);
const printTitle =(level: number) => (prop: m.IProp): string => fromNullable(prop.title).
  filter(isNotEmpty).fold(printName(level)(prop), d => CRLF + h(level)(d) +CRLF );
const printName =(level: number) => (prop: m.IProp): string => fromNullable(prop.name).
  filter(isNotEmpty).fold('1234', d => CRLF + h(level)(d));
const printProp = (level: number) => (prop: m.IProp): string => {
  let s = printTitle(level)(prop);
  s += printHeader(level+1)(prop);
  s += printDescription(prop);
  return s;
}
const printModule = (module: m.DocModule): string => {
  return printProp(1)(module);

};
const printPropertyinterface = (properties: m.Propertyinterface): string => {
  let s = printProp(2)(properties);;
 // s += CRLF + italic('common props');
  s += `${CRLF}${CRLF}|Name|Type|Description|`
  s += `${CRLF}|:-----|:-----|:--------|`
  s += properties.items.map(item => `${CRLF}${item.name}|${m.typeToString(item.type)}|${item.description}|`)

  // s += CRLF + ts(tc.signature);
  // s += printDescription(tc.description);
  return s;
};
const prettierOptions: prettier.Options = {
  parser: 'markdown',
  semi: false,
  singleQuote: true,
  printWidth: 120,
};

const formatMarkdown = (markdown: string): string => prettier.format(markdown, prettierOptions);

export const printDocModule = (docModule: m.DocModuleMap): string => {
  let s = 'MODULE ' + link(docModule.name,
    `https://github.com/mocoolka/mocoolka-ts/blob/master/src/${docModule.name}.ts`);
  const module = docModule.value;
  s += printModule(module) + CRLF;
  s += fromNullable(module.properties).map(ps => ps.map(d => printPropertyinterface(d)).join('\n')).getOrElse('');
  return formatMarkdown(s);
};

export const printIndex = (modules: m.Nav[]): string => {
  let s = '# API\n\n';
  s += modules.map(_m => `- ${link(m.getTitle(_m), `./${_m.name}.md`)}`).join(CRLF);
  return formatMarkdown(s);
};
