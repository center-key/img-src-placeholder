// img-src-placeholder ~~ MIT License

// Imports
import { cliArgvUtil } from 'cli-argv-util';
import { replacer, Results } from 'replacer-util';
import chalk from 'chalk';
import fs    from 'fs';
import log   from 'fancy-log';
import path  from 'path';

// Types
export type Settings = {
   cd:         string | null,  //change working directory before starting search
   extensions: string[],       //filter files by file extensions, example: ['.html']
   filename:   string | null,  //single file in the source folder to be processed
   };
export type ReporterSettings = {
   summaryOnly: boolean,  //only print out the single line summary message
   };

const imgSrcPlaceholder = {

   htmlExts: ['.html', '.htm', '.php', '.aspx', '.asp', '.jsp'],

   assert(ok: unknown, message: string | null) {
      if (!ok)
         throw new Error(`[img-src-placeholder] ${message}`);
      },

   cli() {
      const validFlags = ['cd', 'ext', 'note', 'quiet', 'summary'];
      const cli =        cliArgvUtil.parse(validFlags);
      const source =     cli.params[0];  //origin file or folder
      const target =     cli.params[1];  //destination folder
      const error =
         cli.invalidFlag ?    cli.invalidFlagMsg :
         !source ?            'Missing source folder.' :
         !target ?            'Missing target folder.' :
         cli.paramCount > 2 ? 'Extraneous parameter: ' + cli.params[2]! :
         null;
      imgSrcPlaceholder.assert(!error, error);
      const sourceFile =   path.join(cli.flagMap.cd ?? '', source!);
      const isFile =       fs.existsSync(sourceFile) && fs.statSync(sourceFile).isFile();
      const sourceFolder = isFile ? path.dirname(source!) : source;
      const options: Settings = {
         cd:         cli.flagMap.cd ?? null,
         extensions: cli.flagMap.ext?.split(',') ?? [],
         filename:   isFile ? path.basename(source!) : null,
         };
      const results = imgSrcPlaceholder.transform(sourceFolder!, target!, options);
      if (!cli.flagOn.quiet)
         imgSrcPlaceholder.reporter(results, { summaryOnly: cli.flagOn.summary! });
      },

   transform(sourceFolder: string, targetFolder: string, options?: Partial<Settings>): Results {
      const defaults: Settings = {
         cd:         null,
         extensions: [],
         filename:   null,
         };
      const settings = { ...defaults, ...options };
      const onePixelSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>';
      const dataImage =   'data:image/svg+xml;base64,' + Buffer.from(onePixelSvg).toString('base64');
      const replacerSettings = {
         cd:          settings.cd!,
         extensions:  settings.extensions.length ? settings.extensions : imgSrcPlaceholder.htmlExts,
         regex:       /src=["']?#["']?/gm,
         replacement: `src="${dataImage}"`,
         };
      return replacer.transform(sourceFolder, targetFolder, replacerSettings);
      },

   reporter(results: Results, options?: Partial<ReporterSettings>): Results {
      const defaults: ReporterSettings = {
         summaryOnly: false,
         };
      const settings = { ...defaults, ...options };
      const name =      chalk.gray('img-src-placeholder');
      const source =    chalk.blue.bold(results.source);
      const target =    chalk.magenta(results.target);
      const arrow =     { big: chalk.gray.bold(' ⟹  '), little: chalk.gray.bold('→') };
      const infoColor = results.count ? chalk.white : chalk.red.bold;
      const info =      infoColor(`(files: ${results.count}, ${results.duration}ms)`);
      log(name, source, arrow.big, target, info);
      const logFile = (file: Results['files'][0]) =>
         log(name, chalk.white(file.origin), arrow.little, chalk.green(file.dest));
      if (!settings.summaryOnly)
         results.files.forEach(logFile);
      return results;
      },

   };

export { imgSrcPlaceholder };
