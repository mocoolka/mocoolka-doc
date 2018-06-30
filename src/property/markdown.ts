import * as m from './domain';

import { fromNullable } from 'mocoolka-fp/lib/Option';
import * as prettier from 'prettier';
import { isEmpty } from 'mocoolka-fp/lib/predicate';
export const CRLF = '\n';
export const h1 = (title: string) => `# ${title}`;
export const h2 = (title: string) => `## ${title}`;
export const h3 = (title: string) => `### ${title}`;
export const fence = (language: string) => (a: string): string => `\`\`\`${language}${CRLF}${a}${CRLF}\`\`\``;
export const code = (a: string) => `'${a}'`;
export const link = (text: string, href: string) => `[${text}](${href})`;
export const ts = fence('ts');
export const italic = (a: string) => `*${a}*`;

const printDescription = (description?: string): string => fromNullable(description).
  filter(isEmpty).fold('', d => CRLF + d);

const printModule = (tc: m.DocModule): string => {
  let s = `\n${h1(tc.name)}`;
  s += CRLF + italic('module');
  s += CRLF + ts(tc.signature);
  s += printDescription(tc.description);
  return s;
};
const printPropertyinterface = (tc: m.Propertyinterface): string => {
  let s = `\n${h1(tc.name)}`;
  s += CRLF + italic('common props');
  s += CRLF + ts(tc.signature);
  s += printDescription(tc.description);
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
