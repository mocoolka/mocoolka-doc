import * as m from './type';
// import * as prettier from 'prettier';
import {readFileAsPlainStringSync} from 'mocoolka-fs'
import {slugify} from 'mocoolka-fp/lib/string';

/* const prettierOptions: prettier.Options = {
    parser: 'typescript',
    semi: false,
    singleQuote: true,
    printWidth: 120
  } */
  
const formatJSX = (markdown: string): string => markdown;// prettier.format(markdown, prettierOptions);

export const write = (a: m.DocMd) => formatJSX(`
import * as React from 'react';
import { Markdown } from 'mocoolka-ui-components';
import {Demo} from 'mocoolka-ui-components/lib/Demo'
import {App,Content} from 'mocoolka-ui-components/lib/App';
${importDemos(a)}
export const Page =()=> {
    return (
      <App title={'${a.title}'}>
        <Content>

            ${demos(a)}
        </Content>
      </App>
    );
  }
`);
const getVaraibleName=(name:string)=>slugify(name,'.');
const importDemos=(a: m.DocMd)=>(
    a.items.filter(m.isDocDemo).map((b) => {
        return ` import ${getVaraibleName(b.name)} from  '${b.relativePath}'`
    }).join('\n')
);


const SOURCE_CODE_ROOT_URL='mocoolka-ui-compontents'
const demos = (a: m.DocMd) => (
    a.items.map((b,index) => {
        if(m.isDocDemo(b)){
            return `
            <Demo
            key={${index}}
            js={${getVaraibleName(b.name)}}
            raw={\`${readFileAsPlainStringSync(b.realpath).run()}\`}
            githubLocation={\`${SOURCE_CODE_ROOT_URL}/docs/src/${b.path}\`}
          />
            `
        }else{
            return `
            <Markdown
            key={${index}}
            text={\`${b.name}\`}
          />
            `            
        }
    }).join('\n')
);
/* const demos1 = (a: m.DocMd) => (
    a.items.filter(m.isDocDemo).map(b => (
        {
            name: b.name,
            js: `require('${b.path}').default`,
            raw: `readFileAsPlainStringSync('${b.path}').run()`,
        })
    ).map(c=>`{name:\`${c.name}\`,\njs:${c.js},\nraw:${c.raw}\n}`).join(',\n')
); */
