import program from 'commander';
import pj from '../../package.json';
import ts from '../ts'
import * as path from 'path';
program
.version(pj.version)
.usage('[options] <inputPath> ', )
.option('-o, --output <s>', 'save <path>`', process.cwd())
.parse(process.argv);


/* const options = {
dev: Boolean(program.dev),
outputPath: String(program.output),
yarn: Boolean(program.yarn)
} */
const inputPath = program.args.length === 0 ? path.resolve(process.cwd(), 'src') : path.resolve(process.cwd(), program.args[0]);
const outputPath = program.output ? path.resolve(process.cwd(), program.output) : path.resolve(process.cwd(), 'docs');
ts(inputPath, outputPath).run();

